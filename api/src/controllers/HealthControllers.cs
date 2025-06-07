using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase {
    [HttpGet]
    public IActionResult CheckHealth() {
        return Ok(new { message = "API is up and running!" });
    }
}