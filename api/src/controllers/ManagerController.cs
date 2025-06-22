using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/manager")]
[Authorize(Roles = Roles.Manager)]
public class ManagerController : ControllerBase {
    private readonly IConfiguration configuration;
    private readonly string jwtSecret;
    private readonly AppDbContext _dbContext;

    public ManagerController(IConfiguration configuration, AppDbContext dbContext) {
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

    // TODO: Unused `numberOfBooks`
    [HttpGet("member-history/{memberId}/{numberOfBooks}")]
    public async Task<IActionResult> GetMemberHistory([FromRoute] long memberId, [FromRoute] int numberOfBooks) {

        var room = await _dbContext.Members.Where(r => r.MemberId == memberId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"membro não existe" });
        }

        var books = _dbContext.Bookings.Where(b => b.UserId == memberId).Select(b => new BookingDto {
            BookingId = b.BookingId,
            UserId = b.UserId,
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            Status = b.Status,
            RoomId = b.RoomId
        }).OrderBy(b => b.StartDate).Reverse();

        await _dbContext.SaveChangesAsync();

        return Ok(books);
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetBooking([FromRoute] long bookingId) {

        var booking = await _dbContext.Bookings.Where(b => b.BookingId == bookingId).FirstOrDefaultAsync();
        if (booking == null) {
            return BadRequest(new { message = $"booking {bookingId} não existe" });
        }

        return Ok(booking);
    }

    // TODO: Unused `numberOfBooks`
    [HttpGet("room-history/{roomId}/{numberOfBooks}")]
    public async Task<IActionResult> GetRoomHistory([FromRoute] long roomId, [FromRoute] int numberOfBooks) {

        var room = await _dbContext.Rooms.Where(r => r.RoomId == roomId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"Não é possível consultar o histórico de uma sala inexistente - {roomId}" });
        }

        var books = _dbContext.Bookings.Where(b => b.RoomId == roomId).Select(b => new BookingDto {
            BookingId = b.BookingId,
            UserId = b.UserId,
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            Status = b.Status,
            RoomId = b.RoomId
        }).OrderBy(b => b.StartDate).Reverse();

        await _dbContext.SaveChangesAsync();

        return Ok(books);

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

    // TODO: The parameters could be a DTO in the body
    [HttpPost("ban-member/{memberId}/{shouldBan}")]
    public async Task<IActionResult> BanMember([FromRoute] long memberId, [FromRoute] bool shouldBan) {
        Notification notification;

        var member = await _dbContext.Members.Where(r => r.MemberId == memberId).FirstOrDefaultAsync();
        if (member == null) {
            return BadRequest(new { message = $"membro não existe" });
        }

        if (shouldBan) {
            // Banir
            var timedOutUntil = DateTime.UtcNow.AddMonths(1).Date;
            member.TimedOutUntil = timedOutUntil;

            notification = Notification.Create(
                memberId: memberId,
                kind: NotificationKind.TimedOut,
                body: timedOutUntil.ToString()
            );
        }
        else {
            // Desbanir
            member.TimedOutUntil = null;
            notification = Notification.Create(
                memberId: memberId,
                kind: NotificationKind.UntimedOut
            );
        }

        await NotifyMembers(notification);
        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("members")]
    public IActionResult GetMembers([FromBody] Search search) {

        List<MemberDto> members;
        if (search.name == null) {
            members = _dbContext.Members.Select(m => new MemberDto { Username = m.Username, MemberId = m.MemberId, TimedOutUntil = m.TimedOutUntil }).ToList();
        }
        else {
            members = _dbContext.Members.Where(m => m.Username.Contains(search.name)).Select(m => new MemberDto {
                Username = m.Username,
                MemberId = m.MemberId,
                TimedOutUntil = m.TimedOutUntil
            }).ToList();
        }

        return Ok(members);
    }

    [HttpGet("member/{memberId}")]
    public async Task<IActionResult> GetMember([FromRoute] long memberId) {

        var member = await _dbContext.Members.Where(m => m.MemberId == memberId).Select(m => new MemberDto {
            Username = m.Username,
            MemberId = m.MemberId,
            TimedOutUntil = m.TimedOutUntil
        }).FirstOrDefaultAsync();

        return Ok(member);
    }

    [HttpPost("rooms")]
    public IActionResult GetRooms([FromBody] Search search) {
        var capacity = search.capacity ?? 1;
        List<RoomDto>? rooms;
        if (search.name == null) {
            rooms = _dbContext.Rooms.Where(r => r.Capacity >= capacity).Select(m => new RoomDto {
                Name = m.Name,
                RoomId = m.RoomId,
                IsActive = m.IsActive,
                Capacity = m.Capacity
            }).ToList();
        }
        else {
            rooms = _dbContext.Rooms.Where(m => m.Name.Contains(search.name) && m.Capacity >= capacity).Select(m => new RoomDto {
                Name = m.Name,
                RoomId = m.RoomId,
                IsActive = m.IsActive,
                Capacity = m.Capacity
            }).ToList();
        }

        return Ok(rooms);
    }

    [HttpGet("room/{roomId}")]
    public async Task<IActionResult> GetRoom([FromRoute] long roomId) {

        var room = await _dbContext.Rooms.Where(m => m.RoomId == roomId).Select(m => new RoomDto {
            Name = m.Name,
            RoomId = m.RoomId,
            IsActive = m.IsActive,
            Capacity = m.Capacity
        }).FirstOrDefaultAsync();

        return Ok(room);
    }

    public async Task NotifyMembers(IList<Notification> notifications) {
        await _dbContext.Notifications.AddRangeAsync(notifications);
    }

    public async Task NotifyMembers(Notification notification) {
        await _dbContext.Notifications.AddAsync(notification);
    }

    public record Search {
        public string? name { get; set; }
        public int? capacity { get; set; }
    }

    public record CreateRoomDto {
        public int capacity { get; set; }
        public string name { get; set; } = null!;
    }

    public record MemberDto {
        public string Username { get; set; } = default!;
        public long MemberId { get; set; } = default!;
        public DateTime? TimedOutUntil { get; set; }
    }

    public record RoomDto {
        public long RoomId { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
        public string Name { get; set; } = null!;
    }

    public record BookingDto {
        public long BookingId { get; set; }
        public long UserId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = default!;
        public long RoomId { get; set; }
    }
}
