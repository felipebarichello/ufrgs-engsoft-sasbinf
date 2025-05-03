using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

[ApiController]
public class ApiController : ControllerBase
{
    public readonly IConfiguration _configuration;
    public readonly string jwtSecret;

    public ApiController(IConfiguration configuration) {
        _configuration = configuration;
        jwtSecret = _configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret not found in configuration");
    }

    [HttpGet("api/health")]
    public IActionResult HealthCheck()
    {
        return Ok(new { message = "api funcionando" });
    }
    
    [Route("api/login")]
    [HttpPost]
    public IActionResult LoginPost([FromBody] LoginDTO login)
    {
        const string stubUsername = "qualquercoisa"; // Stub username for testing
        const string stubPassword = "vazia"; // Stub password for testing
        const string stubUid = "stub-user-id-123"; // Stub user ID for testing
        const double tokenExpirationHours = 1; // Token expiration time in hours

        if (login == null || login.user != stubUsername || login.password != stubPassword)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var authClaims = new List<Claim>
        {
            // Standard claim types:
            new Claim(ClaimTypes.Name, stubUsername), // Username
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique Token ID

            // You can add custom claims or a stub user ID if needed:
            new Claim("uid", stubUid) // Example custom claim for user ID
            // In a real app with Identity, we'd use user.Id from the database:
            // new Claim(ClaimTypes.NameIdentifier, user.Id),
        };

        // Get Secret Key: Read from configuration and encode
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

        // Create Token Object: Define token parameters
        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(tokenExpirationHours),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256) // Use HMAC SHA256 algorithm
        );

        // Serialize Token: Convert the token object to a string
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        // Return Token: Send the token string and its expiration back to the client
        return Ok(new
        {
            token = tokenString,
            expiration = token.ValidTo
            // You could also include some non-sensitive user info here if desired
            // user = new { username = stubUsername }
        });
    }
}
