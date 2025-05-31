using Microsoft.AspNetCore.Mvc;
using api.src.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase {
    private const string STUB_UID = "stub-user-id-123";
    private const double TOKEN_EXPIRATION_HOURS = 1;
    private const string STUB_LOGIN_KEY = "stub-login-key";

    private readonly IConfiguration configuration;
    private readonly string jwtSecret;
    private readonly AppDbContext _dbContext;

    public AuthController(IConfiguration configuration, AppDbContext dbContext) {
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
            return Unauthorized(new { message = "User Not Found" });
        }

        var authClaims = new List<Claim> {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, login.user),
            new(ClaimTypes.NameIdentifier, STUB_UID),
            new("login_key", STUB_LOGIN_KEY),
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

    [HttpPost("check")]
    [Authorize]
    public IActionResult CheckAuthStatus() {
        var username = User.FindFirstValue(ClaimTypes.Name);
        var userId = User.FindFirstValue("uid");

        return Ok(new {
            user = username,
            uid = userId
        });
    }
}
