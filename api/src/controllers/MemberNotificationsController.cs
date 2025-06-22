using System.Globalization;
using System.Security.Claims;
using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api")] // TODO: Use a more specific route prefix
[Authorize(Roles = Roles.Member)]
public class MemberNotificationsController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public MemberNotificationsController(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications() {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("ID do usuário não está em formato válido");
        }

        var notifications = _dbContext.Notifications
            .Where(n => n.MemberId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToList();

        var notificationsDTO = new List<Notification>();
        foreach (var notification in notifications) {
            string newBody = notification.Body;
            IActionResult result = Ok();
            switch (notification.Kind) {
                case NotificationKind.BookingTransfer:
                    (result, newBody) = await NewBodyTransfers(notification);
                    if (newBody == "") { // Go goes brrrrrr
                        return result;
                    }

                    break;

                case NotificationKind.TimedOut:
                    (_, newBody) = NewBodyTimedOut(notification);
                    break;

                case NotificationKind.UntimedOut:
                    (_, newBody) = NewBodyUntimedOut();
                    break;

                case NotificationKind.RoomMaintenance:
                    (result, newBody) = await NewBodyRoomMaintenance(notification);
                    if (newBody == "") { // Go goes brrrrrr
                        return result;
                    }

                    break;

                default: break;
            }

            notificationsDTO.Add(
                Notification.Create(
                    notificationId: notification.NotificationId,
                    memberId: notification.MemberId,
                    kind: notification.Kind,
                    body: newBody,
                    createdAt: notification.CreatedAt
                )
            );
        }

        return Ok(notificationsDTO);
    }

    [HttpDelete("delete-notification/{notificationIdString}")]
    public async Task<IActionResult> Delete([FromRoute] string notificationIdString) {
        if (!long.TryParse(notificationIdString, out var notificationId)) {
            return UnprocessableEntity("O ID de notificação não está no formato correto. Tente novamente");
        }

        var (hasFailed, deletedRows) = await DeleteNotification(notificationId);

        if (hasFailed) {
            return UnprocessableEntity($"Too many notifications ({deletedRows}) match given Id ({notificationId})");
        }

        return Ok(new { message = "Notification successfully deleted" });
    }

    // TODO: Use fkn constants or enums
    [HttpPost("update-transfer/{notificationIdString}")]
    public async Task<IActionResult> ProcessTransfer([FromRoute] string notificationIdString, [FromBody] UpdateTransferStatusDTO statusDTO) {
        string status = statusDTO.status;
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("ID do usuário não está em formato válido");
        }

        if (!long.TryParse(notificationIdString, out var notificationId)) {
            return UnprocessableEntity("O ID de notificação não está no formato correto. Tente novamente");
        }

        var allowedStatuses = new string[] { "ACCEPTED", "REJECTED" };
        if (!allowedStatuses.Contains(status)) {
            return UnprocessableEntity($"Cannot process transfer with status {status}");
        }

        // Body is the bookingId to be transferred, with the original user's id
        string? notificationBody = await _dbContext.Notifications
            .Where(n => n.NotificationId == notificationId && n.Kind == NotificationKind.BookingTransfer)
            .Select(n => n.Body)
            .FirstOrDefaultAsync();

        if (notificationBody == null) {
            return NotFound($"Could not find transfer with Id {notificationId}");
        }

        string bookingIdString = notificationBody.Split(",")[0];
        string originalUserIdString = notificationBody.Split(",")[1];

        if (!long.TryParse(bookingIdString, out var bookingId)) {
            return UnprocessableEntity("O ID de locação não está no formato correto. Tente novamente");
        }

        if (!long.TryParse(originalUserIdString, out var originalUserId)) {
            return UnprocessableEntity("O ID do membro original não está no formato correto. Tente novamente");
        }

        // Update notification to point to new userId (the user who just accepted)
        var booking = await _dbContext.Bookings
            .Where(b => b.BookingId == bookingId)
            .FirstOrDefaultAsync();

        if (booking == null) {
            return NotFound($"Could not find booking with Id {bookingId}");
        }

        booking.Status = BookingStatus.Booked;
        string? oldUsername = await _dbContext.Members.Where(m => m.MemberId == originalUserId).Select(m => m.Username).FirstOrDefaultAsync();

        if (status == "REJECTED") { // TODO: Use a constant for this
            // Notify original user of the rejection
            var notification = Notification.Create(
                memberId: originalUserId,
                kind: NotificationKind.TransferRejected,
                body: $"Sua transferência da reserva das {booking.StartDate.ToShortTimeString()} às {booking.EndDate.ToShortTimeString()} do dia {booking.StartDate.ToShortDateString()} foi recusada pelo usuário '{oldUsername}'" // TODO: Should only have bookingId; the complete text is the client's responsibility
            );

            await _dbContext.Notifications.AddAsync(notification);

            // Delete notification
            if ((await DeleteNotification(notificationId)).Item1) {
                throw new Exception("Delete transaction failed. Returning Internal Server Error");
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Transferência recusada com sucesso!" });
        }

        if (status == "ACCEPTED") { // TODO: Use a constant for this

            booking.UserId = userId;

            if (await IsUserPunished(userId)) {
                return UnprocessableEntity("Você está banido temporariamente, e não pode aceitar transferências nem alugar salas enquato estiver banido");
            }

            var notification = Notification.Create(
                memberId: originalUserId,
                kind: NotificationKind.TransferAccepted,
                body: $"Sua transferência da reserva das {booking.StartDate.ToShortTimeString()} às {booking.EndDate.ToShortTimeString()} do dia {booking.StartDate.ToShortDateString()} foi aceita pelo usuário '{oldUsername}'"
            );

            await _dbContext.Notifications.AddAsync(notification);

            // Delete notification
            await DeleteNotification(notificationId);

            await _dbContext.SaveChangesAsync();
        }

        return Ok(new { message = "Transferência aceita com sucesso!" });
    }

    [HttpPost("cancel-transfer/{bookingId}")]
    public async Task<IActionResult> CancelTransfer([FromRoute] long bookingId) {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("ID do usuário não está em formato válido");
        }

        var notificationId = await _dbContext.Notifications
            .Where(n => n.Body == $"{bookingId},{userId}")
            .Select(n => n.NotificationId)
            .FirstOrDefaultAsync();

        var booking = await _dbContext.Bookings.Where(b => b.BookingId == bookingId).FirstOrDefaultAsync();
        if (booking == null) {
            return UnprocessableEntity("Não foi possível encontrar uma reserva com este id. Tente novamente após atualizar a página");
        }

        booking.Status = BookingStatus.Booked;
        await _dbContext.SaveChangesAsync();

        var (hasFailed, deleted) = await DeleteNotification(notificationId);
        if (hasFailed || deleted != 1) {
            return UnprocessableEntity("Falha ao cancelar transferência");
        }

        return Ok(new { message = "Transferência cancelada com sucesso" });
    }

    private async Task<(bool, int)> DeleteNotification(long notificationId) {
        var executionStrategy = _dbContext.Database.CreateExecutionStrategy();
        bool hasFailed = false;
        int deletedRows = 0;

        await executionStrategy.Execute(
            async () => {
                await using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try {
                    deletedRows = _dbContext.Notifications
                        .Where(n => n.NotificationId == notificationId)
                        .ExecuteDelete();

                    if (deletedRows > 1) {
                        throw new Exception($"Too many rows deleted! Cancelling transaction...");
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception) {
                    await transaction.DisposeAsync();
                    hasFailed = true;
                }
            }
        );

        return (hasFailed, deletedRows);
    }

    // TODO: This isn't NotificationController's responsibility
    internal async Task<bool> IsUserPunished(long userId) {
        var member = await _dbContext.Members
            .Where(m => m.MemberId == userId)
            .FirstOrDefaultAsync() ?? throw new Exception("Could not check for user's punishments because userId was not found");

        if (member.IsTimedOut()) {
            return true;
        }

        return false;
    }

    internal async Task<(IActionResult, string)> NewBodyTransfers(Notification notification) {
        string bookingIdString = notification.Body.Split(",")[0];
        string originalUserIdString = notification.Body.Split(",")[1];

        if (!long.TryParse(bookingIdString, out var bookingId)) {
            return (Unauthorized("ID do usuário não está em formato válido"), "");
        }

        if (!long.TryParse(originalUserIdString, out var originalUserId)) {
            return (Unauthorized("ID do usuário não está em formato válido"), "");
        }

        string? oldUserName = _dbContext.Members.Where(m => m.MemberId == originalUserId).Select(m => m.Username).FirstOrDefault();
        if (oldUserName == null) {
            return (NotFound($"Usuário com ID {originalUserId} não encontrado."), "");
        }

        Booking? booking = await _dbContext.Bookings.Where(b => b.BookingId == bookingId).FirstOrDefaultAsync();
        if (booking == null) {
            return (NotFound($"Reserva com ID {bookingId} não encontrada."), "");
        }

        return (Ok(), $"O usuário '{oldUserName}' deseja transferir a sala {booking.Room} das {booking.StartDate.ToLongTimeString()} às {booking.EndDate.ToLongTimeString()} do dia {booking.StartDate.ToShortDateString()}. Você deseja aceitar?");
    }

    internal (IActionResult, string) NewBodyTimedOut(Notification notification) {
        // The notification body is a timestamp (or timestring?) of the timeout expiry

        // This is a bit less evil. Just be aware of this locale, which may not match your local db's
        DateTime timeoutExpiry = DateTime.Parse(notification.Body, System.Globalization.CultureInfo.CurrentCulture);

        return (Ok(), $"Você foi banido por um administrador. Seu banimento expira em {timeoutExpiry.ToShortDateString()}, às {timeoutExpiry.ToLongTimeString()}");
    }
    private (IActionResult, string) NewBodyUntimedOut() {
        return (Ok(), "Seu banimento foi removido por um administrador do sistema. Você já pode alugar salas e aceitar transferências novamente");
    }

    private async Task<(IActionResult, string)> NewBodyRoomMaintenance(Notification notification) {
        var bookingIdStr = notification.Body;
        if (!long.TryParse(bookingIdStr, out var bookingId)) {
            return (UnprocessableEntity("O bookingId informado no campo de notificação não estava no formato correto"), "");
        }

        var cancelledBooking = await _dbContext.Bookings.Where(b => b.BookingId == bookingId).FirstOrDefaultAsync();
        if (cancelledBooking != null) {
            var room = await _dbContext.Rooms.Where(r => r.RoomId == cancelledBooking.RoomId).FirstOrDefaultAsync();
            if (room != null) {
                return (Ok(), $"Sua reserva da sala '{room.Name}' no dia {cancelledBooking.StartDate.ToShortDateString()}, das {cancelledBooking.StartDate.ToShortTimeString()} às {cancelledBooking.EndDate.ToShortTimeString()}, foi cancelada devido à manutenção da sala");
            }
        }

        return (NotFound("Could not find a booking with the booking id notified as cancelled"), "");

    }
    public record UpdateTransferStatusDTO(string status);
}