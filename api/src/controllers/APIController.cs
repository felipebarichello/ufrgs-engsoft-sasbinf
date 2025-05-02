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

    //after implementing entity framework we change this function to async
    [Route("api/login")]
    [HttpPost]
    public ActionResult LoginPost([FromBody] LoginDTO login)
    {
        // implement the logic after the entity framework; returns ok now
        return Ok(new { message = "login approved" });
    }
}
