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
[Route("api-manager")]
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
        var user = await _dbContext.Members
            .Where(u => u.Username == login.user && u.Password == login.password)
            .FirstOrDefaultAsync();

        if (user == null) {
            return Unauthorized(new { message = "user not found" });
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
    public async Task<IActionResult> CreateRoomPost([FromBody] RoomDto roomDto) {
        var alreadyExists = await _dbContext.Rooms.Where(r => r.Name == roomDto.name).AnyAsync();
        if (alreadyExists) {
            return BadRequest(new { message = "nome já existe" });
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

    public class RoomDto {
        public int capacity { get; set; }
        public string name { get; set; } = default!;
    }
}
