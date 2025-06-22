using Microsoft.AspNetCore.Mvc;
using api.src.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("api/rooms")]
[Authorize(Roles = Roles.Member)]
public class MemberBookingsController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public MemberBookingsController(AppDbContext dbContext) {
        _dbContext = dbContext;
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
}
