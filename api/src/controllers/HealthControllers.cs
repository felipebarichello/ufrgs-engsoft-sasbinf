using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase {
    [HttpGet]
    public IActionResult HealthCheck() {
        return Ok(new { message = "api funcionando" });
    }
}