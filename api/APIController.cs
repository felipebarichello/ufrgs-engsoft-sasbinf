using Microsoft.AspNetCore.Mvc;

[ApiController]
public class ApiController : ControllerBase
{
    [HttpGet("api/health")]  // A rota completa será /health
    public IActionResult HealthCheck()
    {
        return Ok(new { message = "api funcionando" });

    }
}
