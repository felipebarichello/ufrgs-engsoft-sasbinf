using Microsoft.AspNetCore.Mvc;
using api.src.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("api/rooms")]
[Authorize(Roles = Roles.Member)]
public class MemberRoomsController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public MemberRoomsController(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    [HttpPost("available-rooms-search")]
    public async Task<IActionResult> SearchAvailableRooms([FromBody] AvailableRoomsSearchDTO search) {
        try {
            return Ok(new AvailableRoomsResponseDTO(await GetAvailableRooms(search)));
        }
        catch (InvalidSearchParamsException e) {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpPost("book")]
    public async Task<IActionResult> BookRoom([FromBody] BookRequestDTO request) {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("ID do usuário não está em formato válido");
        }

        var member = await _dbContext.Members.FirstOrDefaultAsync(m => m.MemberId == userId);
        if (member == null) {
            return Unauthorized("Token de autorização inválido");
        }

        if (member.IsTimedOut()) {
            return UnprocessableEntity("Você está em timeout e portanto temporariamente impedido de reservar salas.");
        }

        var availableRoomIds = await GetAvailableRooms(new AvailableRoomsSearchDTO(request.day.ToString(), request.startTime.ToString(), request.endTime.ToString(), 6));
        if (!availableRoomIds.Select(a => a.id).Contains(request.roomId)) {
            return BadRequest("Sala não está disponível no horário solicitado");
        }

        var bookingInsertion = await _dbContext.Bookings.AddAsync(new Booking {
            UserId = userId,
            RoomId = request.roomId,
            StartDate = request.day.ToDateTime(request.startTime),
            EndDate = request.day.ToDateTime(request.endTime),
            Status = BookingStatus.Booked,
        });

        await _dbContext.SaveChangesAsync();

        return Ok(new { message = $"Sala de ID #{request.roomId} reservada com sucesso!" });
    }

    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings() {
        var username = User.FindFirstValue(ClaimTypes.Name);

        if (username == null) {
            return Unauthorized("Failed to find user for provided bearer token");
        }

        var userId = await _dbContext.Members
            .Where(m => m.Username == username)
            .Select(m => m.MemberId)
            .FirstOrDefaultAsync();

        if (userId == 0) { // TODO: Is this correct? If so, can we do better?
            return UnprocessableEntity("Usuário não encontrado");
        }

        var bookings = await _dbContext.Bookings
            .Where(b => b.UserId == userId)
            .Where(b => b.Status == BookingStatus.Booked || b.Status == BookingStatus.Transferring)
            .Include(b => b.Room)
            .OrderByDescending(b => b.StartDate)
            .ToListAsync();

        var bookingDtos = bookings.Select(b => new {
            bookingId = b.BookingId,
            roomName = b.Room?.Name ?? "",
            startTime = b.StartDate.ToString("o"),
            endTime = b.EndDate.ToString("o"),
            status = b.Status
        }).ToList();

        return Ok(bookingDtos);
    }

    [HttpPost("cancel-booking")]
    public async Task<IActionResult> CancelBooking([FromBody] CancelBookingDTO request) {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("Não foi possível encontrar o usuário para o token fornecido: ID do usuário inválido");
        }

        var booking = await _dbContext.Bookings
            .Where(b => b.BookingId == request.bookingId && b.UserId == userId && (b.Status == BookingStatus.Booked || b.Status == BookingStatus.Transferring))
            .OrderByDescending(b => b.StartDate)
            .FirstOrDefaultAsync();

        if (booking == null) {
            return UnprocessableEntity("Você não pode cancelar essa reserva ou ela não existe");
        }

        if (booking.Status == BookingStatus.Transferring) {
            await _dbContext.Notifications
                .Where(n => n.Body == $"{booking.BookingId},{userId}")
                .ExecuteDeleteAsync();
            await _dbContext.SaveChangesAsync();

        }

        booking.Status = BookingStatus.Withdrawn;
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Reserva cancelada com sucesso" });
    }

    [HttpPost("transfer-booking")]
    public async Task<IActionResult> TransferBooking([FromBody] TransferBookingDTO request) {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("Não foi possível encontrar o usuário para o token fornecido: ID do usuário inválido");
        }

        var booking = await _dbContext.Bookings
            .Where(b => b.BookingId == request.bookingId && b.UserId == userId && b.Status == BookingStatus.Booked)
            .OrderByDescending(b => b.StartDate)
            .FirstOrDefaultAsync();

        if (booking == null) {
            return UnprocessableEntity("Você não pode transferir essa reserva ou ela não existe");
        }

        booking.Status = BookingStatus.Transferring;
        var newUserId = await _dbContext.Members
            .Where(m => m.Username == request.newUser)
            .Select(m => m.MemberId)
            .FirstOrDefaultAsync();

        var notification = Notification.Create(
            memberId: newUserId,
            kind: NotificationKind.BookingTransfer,
            body: booking.BookingId.ToString() + "," + userId
        );

        await _dbContext.Notifications.AddAsync(notification);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Reserva transferida com sucesso; pendente aceitação do outro membro" });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory() {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("Não foi possível encontrar o usuário para o token fornecido: ID do usuário inválido");
        }

        var history = await _dbContext.Bookings
            .Where(b => b.UserId == userId)
            .Select(b => new {
                bookingId = b.BookingId,
                roomName = b.Room.Name,
                startTime = b.StartDate,
                endTime = b.EndDate,
                status = b.Status,
            })
            .ToListAsync();

        if (history.Count < 1) {
            return UnprocessableEntity("WHAT");
        }

        history?.Sort((a, b) => DateTime.Compare(b.startTime, a.startTime));

        return Ok(history);
    }

    private async Task<List<AvailableRoomDTO>> GetAvailableRooms(AvailableRoomsSearchDTO search) {
        // Validate the search parameters
        if (search == null || search.capacity < 1) {
            throw new InvalidSearchParamsException("Parâmetros de busca inválidos.");
        }

        // Parse the start and end date/time from the input
        if (!DateTime.TryParse($"{search.day} {search.startTime}", out var startDateTime) ||
            !DateTime.TryParse($"{search.day} {search.endTime}", out var endDateTime)) {
            throw new InvalidSearchParamsException("Formato de data/hora inválido.");
        }

        var now = DateTime.Now;
        if (startDateTime < now || endDateTime < now) {
            throw new InvalidSearchParamsException("Os horários de entrada e saída devem estar no futuro.");
        }

        if (endDateTime <= startDateTime) {
            throw new InvalidSearchParamsException("O horário de saída deve ser após o horário de entrada.");
        }

        var earliestStart = DateTime.Parse($"{search.day} 08:30");
        var latestEnd = DateTime.Parse($"{search.day} 17:10");

        if (startDateTime < earliestStart) {
            throw new InvalidSearchParamsException("As reservas devem começar às 08:30 ou mais tarde.");
        }

        if (endDateTime > latestEnd) {
            throw new InvalidSearchParamsException("As reservas devem terminar até às 17:10.");
        }

        var maxDuration = TimeSpan.FromHours(2);
        if (endDateTime - startDateTime > maxDuration) {
            throw new InvalidSearchParamsException("A reserva não pode exceder 2 horas.");
        }

        // Find bookings that conflict with the requested time range
        // (StartA <= EndB) && (EndA >= StartB)
        // A: b
        // B: unnamed
        var conflictingBookings = _dbContext.Bookings
            .Where(b => (
                b.StartDate <= endDateTime
                && b.EndDate >= startDateTime
                && (b.Status == BookingStatus.Booked || b.Status == BookingStatus.Transferring)
            ));

        // Extract the IDs of rooms that are already booked
        var conflictingRoomIds = await conflictingBookings.Select(b => b.RoomId).ToListAsync();

        // Find rooms that are not booked during the requested time and meet the capacity requirement
        var availableRooms = await _dbContext.Rooms
            .Where(
                r => (
                    !conflictingRoomIds.Contains(r.RoomId)
                    && r.Capacity >= search.capacity
                    && r.IsActive
                )
            ).ToListAsync();

        return availableRooms.Select(r => new AvailableRoomDTO(r.RoomId, r.Name)).ToList();
    }
}

[Serializable]
internal class InvalidSearchParamsException : Exception {
    public InvalidSearchParamsException() {
    }

    public InvalidSearchParamsException(string? message) : base(message) {
    }

    public InvalidSearchParamsException(string? message, Exception? innerException) : base(message, innerException) {
    }
}
