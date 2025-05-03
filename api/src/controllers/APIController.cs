using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api")]
public class ApiController : ControllerBase {
    public readonly IConfiguration Configuration;
    public readonly string JwtSecret;

    public ApiController(IConfiguration configuration) {
        Configuration = configuration;
        JwtSecret = Configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret not found in configuration");
    }

    [HttpGet("health")]
    public IActionResult HealthCheck() {
        return Ok(new { message = "api funcionando" });
    }

    [HttpPost("login")]
    public IActionResult LoginPost([FromBody] LoginDTO login) {
        const string StubUsername = "qualquercoisa"; // Stub username for testing
        const string StubPassword = "vazia"; // Stub password for testing
        const string StubUid = "stub-user-id-123"; // Stub user ID for testing
        const double TokenExpirationHours = 1; // Token expiration time in hours

        if (login == null || login.user != StubUsername || login.password != StubPassword) {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var authClaims = new List<Claim>
        {
            // Standard claim types:
            new(ClaimTypes.Name, StubUsername), // Username
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique Token ID

            // You can add custom claims or a stub user ID if needed:
            new("uid", StubUid) // Example custom claim for user ID
            // In a real app with Identity, we'd use user.Id from the database:
            // new Claim(ClaimTypes.NameIdentifier, user.Id),
        };

        // Get Secret Key: Read from configuration and encode
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecret));

        // Create Token Object: Define token parameters
        var token = new JwtSecurityToken(
            issuer: Configuration["JWT:ValidIssuer"],
            audience: Configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(TokenExpirationHours),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256) // Use HMAC SHA256 algorithm
        );

        // Serialize Token: Convert the token object to a string
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        // Return Token: Send the token string and its expiration back to the client
        return Ok(new {
            token = tokenString,
            expiration = token.ValidTo
            // You could also include some non-sensitive user info here if desired
            // user = new { username = stubUsername }
        });
    }
}
