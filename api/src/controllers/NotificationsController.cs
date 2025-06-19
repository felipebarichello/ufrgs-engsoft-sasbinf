using System.Security.Claims;
using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api")]
[Authorize(Roles = Roles.Member)]
public class NotificationsController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public NotificationsController(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    [HttpGet("notifications")]
    [Authorize]
    public async Task<IActionResult> GetNotifications() {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!long.TryParse(userIdString, out var userId)) {
            return Unauthorized("ID do usuário não está em formato válido");
        }

        var notifications = await _dbContext.Notifications
            .Where(n => n.MemberId == userId)
            .ToListAsync();

        var builder = WebApplication.CreateBuilder();
        var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>(); // Get logger
        logger.LogInformation("Example: {Var}", notifications.Count);

        return Ok(notifications);
    }

    [HttpDelete("delete-notification/{notificationIdString}")]
    public async Task<IActionResult> Delete([FromRoute] string notificationIdString) {
        if (!long.TryParse(notificationIdString, out var notificationId)) {
            return UnprocessableEntity("O ID de notificação não está no formato correto. Tente novamente");
        }

        var executionStrategy = _dbContext.Database.CreateExecutionStrategy();
        bool hasFailed = false;
        int deletedRows = 0;

        await executionStrategy.Execute(
            async () => {
                await using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try {
                    deletedRows = _dbContext.Notifications
                        .Where(n => n.NotificationId == notificationId)
                        .ExecuteDelete();

                    if (deletedRows > 1) {
                        throw new Exception($"Too many rows deleted! Cancelling transaction...");
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception) {
                    await transaction.DisposeAsync();
                    hasFailed = true;
                }
            }
        );

        if (hasFailed) {
            return UnprocessableEntity($"Too many notifications ({deletedRows}) match given Id ({notificationId})");
        }

        return Ok(new { message = "Notification successfully deleted" });
    }
}