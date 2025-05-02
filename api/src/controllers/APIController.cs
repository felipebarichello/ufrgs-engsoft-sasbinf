using DTO;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class ApiController : ControllerBase
{
    public readonly IConfiguration _configuration;

    public ApiController(IConfiguration configuration) {
        _configuration = configuration;
    }

    [HttpGet("api/health")]
    public IActionResult HealthCheck()
    {
        return Ok(new { message = "api funcionando" });
    }
    
    [Route("api/login")]
    [HttpPost]
    public async Task<ActionResult> LoginPost([FromBody] LoginDTO login)
    {
        await Task.Delay(100); // Simulate some delay for the login process
        
        if (login != null && login.user == "qualquercoisa" && login.password == "vazia")
        {
            return Ok(new { message = "Login approved" });
        }
        else
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }
    }
}
