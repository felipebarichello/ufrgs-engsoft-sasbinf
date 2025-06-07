using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.src.Models;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api/manager")]
public class ManagerController : ControllerBase {
    private const double TOKEN_EXPIRATION_HOURS = 1;
    private readonly IConfiguration configuration;
    private readonly string jwtSecret;
    private readonly AppDbContext _dbContext;

    public ManagerController(IConfiguration configuration, AppDbContext dbContext) {
        this.configuration = configuration;
        jwtSecret = configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret");
        _dbContext = dbContext;
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginPost([FromBody] LoginDTO login) {
        var user = await _dbContext.Managers
            .Where(m => m.Username == login.user && m.Password == login.password)
            .FirstOrDefaultAsync();

        if (user == null) {
            return Unauthorized(new { message = "Manager Not Found" });
        }

        var authClaims = new List<Claim> {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, login.user),
            new(ClaimTypes.NameIdentifier, user.ManagerId.ToString()),
            new(ClaimTypes.Role, Roles.Manager)
        };

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var token = new JwtSecurityToken(
            issuer: configuration["JWT:ValidIssuer"],
            audience: configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(TOKEN_EXPIRATION_HOURS),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return Ok(new {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo
        });
    }

    [HttpPost("create-room")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> CreateRoomPost([FromBody] CreateRoomDto roomDto) {
        var roolAlreadyExists = await _dbContext.Rooms.Where(r => r.Name == roomDto.name).AnyAsync();
        if (roolAlreadyExists) {
            return BadRequest(new { message = $"Uma sala de nome {roomDto.name} já existe. Por favor escolha outro nome" });
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
    [Authorize(Roles = Roles.Manager)]
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
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> ChangeAvailabilityRoom([FromRoute] long roomId, [FromRoute] bool isActive) { // TODO: Rename to ChangeRoomAvailability
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

                    var bookingsToNotify = await _dbContext.Bookings
                        .Where(b => b.StartDate >= DateTime.UtcNow && b.RoomId == roomId)
                        .ToListAsync();

                    if (bookingsToNotify.Any()) {
                        var notifications = bookingsToNotify.Select(b => new Notification {
                            UserId = b.UserId,
                            Description = $"Sua reserva da sala {room.Name} do horário {b.StartDate:dd/MM/yyyy HH:mm} foi removida pois a sala entrou em manutenção."
                        }).ToList();

                        bookingsToNotify.ForEach(b => b.Status = "CANCELLED");
                        if (notifications != null) {
                            await NotifyMembers(notifications);
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new {
                        name = room.Name,
                        isActive = room.IsActive,
                        cancelledBookings = bookingsToNotify.Count
                    });
                }
                catch (Exception ex) {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Erro ao atualizar a sala.", error = ex.Message });
                }
            }
        });
    }

    [HttpGet("member-history/{memberId}/{numberOfBooks}")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> GetMemberHistory([FromRoute] long memberId, [FromRoute] int numberOfBooks) {

        var room = await _dbContext.Members.Where(r => r.MemberId == memberId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"membro não existe" });
        }

        var books = _dbContext.Bookings.Where(b => b.RoomId == memberId).Select(b => new BookingDto { BookingId = b.BookingId, UserId = b.UserId, StartDate = b.StartDate, EndDate = b.EndDate, Status = b.Status }).OrderBy(b => b.StartDate).Reverse().Take(numberOfBooks);

        await _dbContext.SaveChangesAsync();

        return Ok(new { history = books });
    }

    [HttpGet("room-history/{roomId}/{numberOfBooks}")]
    [Authorize(Roles = Roles.Manager)]
    public async Task<IActionResult> GetRoomHistory([FromRoute] long roomId, [FromRoute] int numberOfBooks) {

        var room = await _dbContext.Rooms.Where(r => r.RoomId == roomId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"Não é possível consultar o histórico de uma sala inexistente - {roomId}" });
        }

        var books = _dbContext.Bookings.Where(b => b.RoomId == roomId).Select(b => new BookingDto { BookingId = b.BookingId, UserId = b.UserId, StartDate = b.StartDate, EndDate = b.EndDate, Status = b.Status }).OrderBy(b => b.StartDate).Reverse().Take(numberOfBooks);

        await _dbContext.SaveChangesAsync();

        return Ok(books);

    }

    [HttpPost("bookings/change-status/{bookingId}/{status}")]
    [Authorize(Roles = "manager")]
    public async Task<IActionResult> ChangeBookingSatus([FromRoute] long bookingId, [FromRoute] string status) {
        var validStatuses = new[] { "pending", "confirmed", "cancelled", "absent" };

        if (!validStatuses.Contains(status)) {
            return BadRequest(new { message = $"estado inválido. Valores possíveis: pending, confirmed, cancelled, completed" });
        }

        var booking = await _dbContext.Bookings.Where(r => r.BookingId == bookingId).FirstOrDefaultAsync();
        if (booking == null) {
            return BadRequest(new { message = $"booking não existe" });
        }

        booking.Status = status;
        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("ban-member/{memberId}/{shouldBan}")]
    [Authorize(Roles = "manager")]
    public async Task<IActionResult> BanMember([FromRoute] long memberId, [FromRoute] bool shouldBan) {
        Notification notification;
        var member = await _dbContext.Members.Where(r => r.MemberId == memberId).FirstOrDefaultAsync();
        if (member == null) {
            return BadRequest(new { message = $"membro não existe" });
        }

        if (shouldBan) {
            notification = new Notification { UserId = memberId, Description = $"Você está banido até {member.TimedOutUntil}" };
            member.TimedOutUntil = DateTime.UtcNow.AddMonths(1).Date;
        }
        else {
            member.TimedOutUntil = null;
            notification = new Notification { UserId = memberId, Description = $"Você não está mais banido das salas do inf" };
        }

        await NotifyMembers(notification);

        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("students")]
    [Authorize(Roles = Roles.Manager)]
    public IActionResult
     GetStudents([FromBody] Search search) {

        List<MemberDto> members;
        if (search.name == null) {
            members = _dbContext.Members.Select(m => new MemberDto { Username = m.Username, MemberId = m.MemberId, TimedOutUntil = m.TimedOutUntil }).ToList();
        }
        else {
            members = _dbContext.Members.Where(m => m.Username.Contains(search.name)).Select(m => new MemberDto { Username = m.Username, MemberId = m.MemberId, TimedOutUntil = m.TimedOutUntil }).ToList();
        }

        return Ok(members);
    }

    [HttpPost("rooms")]
    [Authorize(Roles = Roles.Manager)]
    public IActionResult

    GetRooms([FromBody] Search search) {
        var capacity = search.capacity ?? 1;
        List<RoomDto>? rooms;
        if (search.name == null) {
            rooms = _dbContext.Rooms.Where(r => r.Capacity >= capacity).Select(m => new RoomDto { Name = m.Name, RoomId = m.RoomId, IsActive = m.IsActive, Capacity = m.Capacity }).ToList();
        }
        else {
            rooms = _dbContext.Rooms.Where(m => m.Name.Contains(search.name) && m.Capacity >= capacity).Select(m => new RoomDto { Name = m.Name, RoomId = m.RoomId, IsActive = m.IsActive, Capacity = m.Capacity }).ToList();
        }

        return Ok(rooms);
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
    }
}
