using System.Security.Claims;
using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class NotificationsController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public NotificationsController(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    [HttpGet("/my-notifications")]
    [Authorize]
    public async Task<IActionResult> GetNotifications() {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("ID do usuário não está em formato válido");
        }

        // We need some form of notification status in order to accept or reject rooms transfers. 
        // If we don't, some method somewhere will have to do a LOT database updates, inserts and deletes - and the failure of any will imply an invalid state in the system

        // SELECT desription, type, status FROM sasbinf.notifications n
        // WHERE n.user_id = @userIdString AND status = 'PENDING'

        return Ok(new { message = "ok" });
    }
}