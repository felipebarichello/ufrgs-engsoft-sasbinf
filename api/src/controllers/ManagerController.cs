using api.src.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/manager")]
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
    public async Task<IActionResult> CreateRoomPost([FromBody] int capacity) {
        Room room = new Room {
            Capacity = capacity
        };

        await _dbContext.Rooms.AddAsync(room);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "deu certo" });

    }
}
