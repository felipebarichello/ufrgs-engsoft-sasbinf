using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DTO;

[ApiController]
[Route("api/manager")]
[Authorize(Roles = Roles.Manager)]
public class ManagerBookingsController : ControllerBase {
    private readonly IConfiguration configuration;
    private readonly string jwtSecret;
    private readonly AppDbContext _dbContext;

    public ManagerBookingsController(IConfiguration configuration, AppDbContext dbContext) {
        this.configuration = configuration;
        jwtSecret = configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret");
        _dbContext = dbContext;
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetBooking([FromRoute] long bookingId) {

        var booking = await _dbContext.Bookings
            .Where(b => b.BookingId == bookingId)
            .Select(b => new BookingDto {
                BookingId = b.BookingId,
                UserId = b.UserId,
                UserName = b.User.Username,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                Status = b.Status,
                RoomId = b.RoomId,
                RoomName = b.Room.Name,
            }).FirstOrDefaultAsync();
        if (booking == null) {
            return BadRequest(new { message = $"booking {bookingId} não existe" });
        }

        return Ok(booking);
    }

    [HttpPost("bookings/change-status/{bookingId}/{status}")]
    public async Task<IActionResult> ChangeBookingStatus([FromRoute] long bookingId, [FromRoute] string status) {
        var validStatuses = new[] { BookingStatus.Booked, BookingStatus.Claimed, BookingStatus.Missed, BookingStatus.Withdrawn, BookingStatus.Cancelled };

        if (!validStatuses.Contains(status)) {
            string validStatusesString = string.Join(", ", validStatuses); // Create a comma separated string of valid statuses
            return BadRequest(new { message = $"estado inválido; valores possíveis: {validStatusesString}" });
        }

        var booking = await _dbContext.Bookings.Where(r => r.BookingId == bookingId).FirstOrDefaultAsync();
        if (booking == null) {
            return BadRequest(new { message = $"booking não existe" });
        }

        booking.Status = status;
        await _dbContext.SaveChangesAsync();

        return Ok();
    }
}
