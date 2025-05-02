using DTO;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class ApiController : ControllerBase
{
    [HttpGet("api/health")]
    public IActionResult HealthCheck()
    {
        return Ok(new { message = "api funcionando" });
    }

    [Route("api/login")]
    [HttpPost]
    //after implementing entity framework we change this function to async
    public ActionResult LoginPost([FromBody] LoginDTO login)
    {
        // implement the logic after the entity framework; returns ok now
        return Ok(new { message = "login approved" });
    }
}
