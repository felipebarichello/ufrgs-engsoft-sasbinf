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
[Route("api")]
public class ApiController : ControllerBase {
    private const string STUB_USERNAME = "qualquercoisa"; // Stub username for testing
    private const string STUB_PASSWORD = "vazia"; // Stub password for testing
    private const string STUB_UID = "stub-user-id-123"; // Stub user ID for testing
    private const double TOKEN_EXPIRATION_HOURS = 1; // Token expiration time in hours
    private const string STUB_LOGIN_KEY = "stub-login-key"; // Stub login key for testing
    private readonly IConfiguration configuration;
    private readonly string jwtSecret;

    private readonly AppDbContext _dbContext;

    public ApiController(IConfiguration configuration, AppDbContext dbContext) {
        this.configuration = configuration;
        jwtSecret = this.configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret not found in configuration");
        _dbContext = dbContext;
    }

    [HttpGet("health")]
    public IActionResult HealthCheck() {
        return Ok(new { message = "api funcionando" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginPost([FromBody] LoginDTO login) {

        var user = await _dbContext.Users
            .Where(u => u.UserName == login.user && u.Password == login.password)
            .FirstOrDefaultAsync();

        if (user == null) {
            return Unauthorized(new { message = "user not found" });
        }

        System.Console.WriteLine("user: " + user);

        var authClaims = new List<Claim>
        {
            // Standard claim types:
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique Token ID
            new(ClaimTypes.Name, STUB_USERNAME), // TODO: Username
            new(ClaimTypes.NameIdentifier, STUB_UID), // TODO: In a real app with Identity, we'd use user.Id from the database

            // You can add custom claims or a stub user ID if needed:
            new("login_key", STUB_LOGIN_KEY), // TODO: Should be stored in the database
        };

        // Get Secret Key: Read from configuration and encode
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

        // Create Token Object: Define token parameters
        var token = new JwtSecurityToken(
            issuer: configuration["JWT:ValidIssuer"],
            audience: configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(TOKEN_EXPIRATION_HOURS),
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

    [HttpPost("checkauth")] // Define the route and HTTP method
    [Authorize]             // Require a valid JWT (triggers authentication middleware)
    public IActionResult CheckAuthStatus() {
        // If the execution reaches this point, the [Authorize] attribute
        // has confirmed that the JWT presented by the client is valid
        // (signature, expiration, issuer, audience all checked by the middleware). 
        // You can optionally retrieve claims from the validated token
        var username = User.FindFirstValue(ClaimTypes.Name);
        var userId = User.FindFirstValue("uid"); // Your custom claim   
        // Return a success response, optionally including some user info
        return Ok(new {
            user = username,
            uid = userId
        });
    }
    // ----------------------------------------------------
}
