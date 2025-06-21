using System.Security.Claims;
using api.src.Models;
using DotNext.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api")] // TODO: Use a more specific route prefix
[Authorize(Roles = Roles.Member)]
public class NotificationsController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public NotificationsController(AppDbContext dbContext) {
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
            .ToList();

        var notificationsDTO = new List<Notification>();
        foreach (var notification in notifications) {
            string newBody = notification.Body;
            if (notification.Kind == NotificationKind.BookingTransfer) {
                string bookingIdString = notification.Body.Split(",")[0];
                string originalUserIdString = notification.Body.Split(",")[1];

                if (!long.TryParse(bookingIdString, out var bookingId)) {
                    return Unauthorized("ID do usuário não está em formato válido");
                }

                if (!long.TryParse(originalUserIdString, out var originalUserId)) {
                    return Unauthorized("ID do usuário não está em formato válido");
                }

                string oldUserName = _dbContext.Members.Where(m => m.MemberId == originalUserId).Select(m => m.Username).First();
                Booking booking = _dbContext.Bookings.Where(b => b.BookingId == bookingId).First();

                newBody = $"O usuário '{oldUserName}' deseja transferir a sala {booking.Room} das {booking.StartDate.ToLongTimeString()} às {booking.EndDate.ToLongTimeString()} do dia {booking.StartDate.ToShortDateString()}. Você deseja aceitar?";
            }

            notificationsDTO =
            [
                .. notificationsDTO,
                Notification.Create(
                    notificationId: notification.NotificationId,
                    memberId: notification.MemberId,
                    kind: notification.Kind,
                    body: newBody,
                    createdAt: notification.CreatedAt
                ),
            ];
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

        // Body is the bookingId to be transfered, with the original user's id
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

        booking.Status = "BOOKED";

        if (status == "REJECTED") {
            // Notify original user of the rejection
            var notification = Notification.Create(
                memberId: originalUserId,
                kind: NotificationKind.TransferRejected,
                body: $"Sua transferência da reserva {bookingId} foi rejeitada"
            );

            await _dbContext.Notifications.AddAsync(notification);

            // Delete notification
            if ((await DeleteNotification(notificationId)).Item1) {
                throw new Exception("Delete transaction failed. Returning Internal Server Error");
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Transferência recusada com sucesso!" });
        }

        if (status == "ACCEPTED") {

            booking.UserId = userId;

            // Notify original user of the rejection
            var notification = Notification.Create(
                memberId: originalUserId,
                kind: NotificationKind.TransferAccepted,
                body: $"Sua transferência da reserva {bookingId} foi aceita"
            );

            await _dbContext.Notifications.AddAsync(notification);

            // Delete notification
            await DeleteNotification(notificationId);
            await _dbContext.SaveChangesAsync();
        }

        return Ok(new { message = "Transferência aceita com sucesso!" });
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

    public record UpdateTransferStatusDTO(string status);
}