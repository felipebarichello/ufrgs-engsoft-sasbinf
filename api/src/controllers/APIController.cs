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
    public ActionResult LoginPost([FromBody] LoginDTO login)
    {
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
