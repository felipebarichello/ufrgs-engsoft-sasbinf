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
    private const string STUB_UID = "stub-user-id-123";
    private const double TOKEN_EXPIRATION_HOURS = 1;
    private const string STUB_LOGIN_KEY = "stub-login-manager-key";
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
            return Unauthorized(new { message = "manager not found" });
        }

        var authClaims = new List<Claim> {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, login.user),
            new(ClaimTypes.NameIdentifier, STUB_UID),
            new("login_key", STUB_LOGIN_KEY),
            new(ClaimTypes.Role, "manager")
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
    [Authorize(Roles = "manager")]
    public async Task<IActionResult> CreateRoomPost([FromBody] CreateRoomDto roomDto) {
        var roolAlreadyExists = await _dbContext.Rooms.Where(r => r.Name == roomDto.name).AnyAsync();
        if (roolAlreadyExists) {
            return BadRequest(new { message = $"já existe uma sala com o nome {roomDto.name}" });
        }

        Room room = new Room {
            Capacity = roomDto.capacity,
            Name = roomDto.name
        };

        await _dbContext.Rooms.AddAsync(room);
        await _dbContext.SaveChangesAsync();

        var roomId = await _dbContext.Rooms.Where(r => r.Name == roomDto.name).Select(r => r.RoomId).FirstOrDefaultAsync();

        return Ok(new { roomId = roomId });

    }

    [HttpDelete("delete-room/{roomId}")]
    [Authorize(Roles = "manager")]
    public async Task<IActionResult> Delete([FromRoute] int roomId) {
        var room = await _dbContext.Rooms.Where(r => r.RoomId == roomId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = "sala não existente" });
        }

        _dbContext.Rooms.Remove(room);
        await _dbContext.SaveChangesAsync();

        return Ok(new { roomName = room.Name });

    }

    [HttpPost("activation-room/{roomId}/{isActive}")]
    [Authorize(Roles = "manager")]
    public async Task<IActionResult> ChangeAvailabilityRoom([FromRoute] int roomId, [FromRoute] bool isActive) {
        var room = await _dbContext.Rooms.Where(r => r.RoomId == roomId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"sala não existe" });
        }

        room.IsActive = isActive;

        await _dbContext.SaveChangesAsync();

        return Ok(new { name = room.Name, isCative = room.IsActive });

    }

    [HttpGet("room-history/{roomId}/{numberOfBooks}")]
    [Authorize(Roles = "manager")]
    public async Task<IActionResult> GetRoomHistory([FromRoute] int roomId, [FromRoute] int numberOfBooks) {

        var room = await _dbContext.Rooms.Where(r => r.RoomId == roomId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"sala não existe" });
        }

        var books = _dbContext.Bookings.Where(b => b.RoomId == roomId).Select(b => new BookingDto { bookingId = b.BookingId, userId = b.UserId, startDate = b.StartDate, endDate = b.EndDate }).OrderBy(b => b.startDate).Reverse().Take(numberOfBooks);

        await _dbContext.SaveChangesAsync();

        return Ok(new { history = books });

    }

    public class CreateRoomDto {
        public int capacity { get; set; }
        public string name { get; set; } = default!;
    }

    public class BookingDto {
        public int bookingId { get; set; }
        public int userId { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
    }
}
