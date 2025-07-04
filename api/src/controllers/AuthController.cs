using Microsoft.AspNetCore.Mvc;
using api.src.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Sasbinf.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase {
    private const double TOKEN_EXPIRATION_HOURS = 1;

    private readonly IConfiguration configuration;
    private readonly string jwtSecret;
    private readonly AppDbContext _dbContext;

    public AuthController(IConfiguration configuration, AppDbContext dbContext) {
        this.configuration = configuration;
        jwtSecret = configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret");
        _dbContext = dbContext;
    }

    [HttpPost("login")]
    public async Task<IActionResult> PostMemberLogin([FromBody] LoginDTO login) {
        var user = await _dbContext.Members
            .Where(u => u.Username == login.user && u.Password == PasswordHash.Hash(login.password))
            .FirstOrDefaultAsync();

        if (user == null) {
            return Unauthorized(new { message = "User Not Found" });
        }

        var authClaims = new List<Claim> {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, login.user), // TODO: Remove this claim
            new(ClaimTypes.NameIdentifier, user.MemberId.ToString()),
            new(ClaimTypes.Role, Roles.Member)
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

    [HttpPost("login/manager")]
    public async Task<IActionResult> PostManagerLogin([FromBody] LoginDTO login) {
        var user = await _dbContext.Managers
            .Where(m => m.Username == login.user && m.Password == PasswordHash.Hash(login.password))
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
