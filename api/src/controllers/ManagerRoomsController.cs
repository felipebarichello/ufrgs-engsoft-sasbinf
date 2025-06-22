using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/manager")]
[Authorize(Roles = Roles.Manager)]
public class ManagerRoomsController : ControllerBase {
    private readonly IConfiguration configuration;
    private readonly string jwtSecret;
    private readonly AppDbContext _dbContext;

    public async Task NotifyMembers(IList<Notification> notifications) {
        await _dbContext.Notifications.AddRangeAsync(notifications);
    }

    public ManagerRoomsController(IConfiguration configuration, AppDbContext dbContext) {
        this.configuration = configuration;
        jwtSecret = configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret");
        _dbContext = dbContext;
    }

    [HttpPost("create-room")]
    public async Task<IActionResult> PostCreateRoom([FromBody] CreateRoomDto roomDto) {
        var roomAlreadyExists = await _dbContext.Rooms.Where(r => r.Name == roomDto.name).AnyAsync();

        if (roomAlreadyExists) {
            return BadRequest(new { message = $"Uma sala de nome {roomDto.name} já existe. Por favor escolha outro nome." });
        }

        Room room = new Room {
            Capacity = roomDto.capacity,
            Name = roomDto.name,
            IsActive = true,
        };

        await _dbContext.Rooms.AddAsync(room);
        await _dbContext.SaveChangesAsync();

        var roomId = await _dbContext.Rooms.Where(r => r.Name == roomDto.name).Select(r => r.RoomId).FirstOrDefaultAsync();

        return Ok(new { roomId = roomId });

    }

    [HttpDelete("delete-room/{roomId}")]
    public async Task<IActionResult> Delete([FromRoute] long roomId) {
        var room = await _dbContext.Rooms.Where(r => r.RoomId == roomId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"Não é possível deletar uma sala inexistente - {roomId}" });
        }

        _dbContext.Rooms.Remove(room);
        await _dbContext.SaveChangesAsync();

        return Ok(new { roomName = room.Name });

    }

    [HttpPost("activation-room/{roomId}/{isActive}")]
    public async Task<IActionResult> ChangeRoomAvailability([FromRoute] long roomId, [FromRoute] bool isActive) { // TODO: Rename to ChangeRoomAvailability
        var executionStrategy = _dbContext.Database.CreateExecutionStrategy();

        return await executionStrategy.ExecuteAsync(async () => {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync()) {
                try {

                    var room = await _dbContext.Rooms
                        .FirstOrDefaultAsync(r => r.RoomId == roomId);

                    if (room == null) {
                        return BadRequest(new { message = "Sala não existe." });
                    }

                    room.IsActive = isActive;
                    if (!isActive) {
                        var bookingsToNotify = await _dbContext.Bookings
                            .Where(b => b.StartDate >= DateTime.UtcNow && b.RoomId == roomId && (b.Status == BookingStatus.Booked || b.Status == BookingStatus.Transferring))
                            .ToListAsync();

                        if (bookingsToNotify.Any()) {
                            var notifications = bookingsToNotify.Select(b => Notification.Create(
                                memberId: b.UserId,
                                kind: NotificationKind.RoomMaintenance,
                                body: b.BookingId.ToString()
                            )).ToList();

                            bookingsToNotify.ForEach(b => b.Status = BookingStatus.Cancelled);
                            if (notifications != null) {
                                await NotifyMembers(notifications);
                            }
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new {
                        name = room.Name,
                        isActive = room.IsActive,
                    });
                }
                catch (Exception ex) {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Erro ao atualizar a sala.", error = ex.Message });
                }
            }
        });
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

    public record CreateRoomDto {
        public int capacity { get; set; }
        public string name { get; set; } = null!;
    }

    public record RoomDto {
        public long RoomId { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
        public string Name { get; set; } = null!;
    }

    public record Search {
        public string? name { get; set; }
        public int? capacity { get; set; }
    }
}
