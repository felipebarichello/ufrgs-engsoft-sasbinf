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

        var user = await _dbContext.Members
        .Where(u => u.Username == login.user && u.Password == login.password).FirstOrDefaultAsync();

        if (user == null) {
            return Unauthorized(new { message = "user not found" });
        }

        var authClaims = new List<Claim>
        {
            // Standard claim types:
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique Token ID
            new(ClaimTypes.Name, login.user), // TODO: Username
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

    [HttpPost("availableRooms")]
    public async Task<IActionResult> AvailableRoomsSearchPost([FromBody] AvailableRoomsSearchDTO search) {
        // Validate the search parameters
        if (search == null || search.capacity < 1) {
            return BadRequest(new { message = "Invalid search parameters." });
        }

        // Parse the start and end date/time from the input
        if (!DateTime.TryParse($"{search.day} {search.startTime}", out var startDateTime) ||
            !DateTime.TryParse($"{search.day} {search.endTime}", out var endDateTime)) {
            return BadRequest(new { message = "Invalid date/time format." });
        }

        var now = DateTime.Now;
        if (startDateTime < now || endDateTime < now) {
            return BadRequest(new { message = "Start and end time must be in the future." });
        }

        if (endDateTime <= startDateTime) {
            return BadRequest(new { message = "End time must be after start time." });
        }

        var earliestStart = DateTime.Parse($"{search.day} 08:30");
        var latestEnd = DateTime.Parse($"{search.day} 17:10");

        if (startDateTime < earliestStart) {
            return BadRequest(new { message = "Bookings must start at 08:30 or later." });
        }     

        if (endDateTime > latestEnd) {
            return BadRequest(new { message = "Bookings must end by 17:10." });
        }

        var maxDuration = TimeSpan.FromHours(2);
        if (endDateTime - startDateTime > maxDuration) {
            return BadRequest(new { message = "Booking cannot exceed 2 hours." });
        }

        // Find bookings that conflict with the requested time range
        var conflictingBookings = await _dbContext.Bookings
            .Where(b => b.StartDate < endDateTime && b.EndDate > startDateTime)
            .ToListAsync();

        // Extract the IDs of rooms that are already booked
        var conflictingRoomIds = conflictingBookings.Select(b => b.RoomId).ToList();

        // Find rooms that are not booked during the requested time and meet the capacity requirement
        var availableRooms = await _dbContext.Rooms
            .Where(r => !conflictingRoomIds.Contains(r.RoomId) && r.Capacity >= search.capacity)
            .ToListAsync();

        return Ok(new AvailableRoomsResponseDTO(
            availableRooms.Select(r => r.RoomId).ToList()
        ));
    }
}
