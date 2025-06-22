using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/manager")]
[Authorize(Roles = Roles.Manager)]
public class ManagerMembersController : ControllerBase {
    private readonly IConfiguration configuration;
    private readonly string jwtSecret;
    private readonly AppDbContext _dbContext;

    public ManagerMembersController(IConfiguration configuration, AppDbContext dbContext) {
        this.configuration = configuration;
        jwtSecret = configuration["JWT:Secret"] ?? throw new ArgumentNullException("JWT:Secret");
        _dbContext = dbContext;
    }

    // TODO: Paginate
    [HttpGet("member-history/{memberId}/{numberOfBooks}")]
    public async Task<IActionResult> GetMemberHistory([FromRoute] long memberId, [FromRoute] int numberOfBooks) {

        var room = await _dbContext.Members.Where(r => r.MemberId == memberId).FirstOrDefaultAsync();
        if (room == null) {
            return BadRequest(new { message = $"membro não existe" });
        }

        var books = _dbContext.Bookings.Where(b => b.UserId == memberId).OrderBy(b => b.StartDate).Reverse().Select(b => b.BookingId).Take(numberOfBooks);

        await _dbContext.SaveChangesAsync();

        return Ok(books);
    }

    // TODO: The parameters could be a DTO in the body
    [HttpPost("ban-member/{memberId}/{shouldBan}")]
    public async Task<IActionResult> BanMember([FromRoute] long memberId, [FromRoute] bool shouldBan) {
        Notification notification;

        var member = await _dbContext.Members.Where(r => r.MemberId == memberId).FirstOrDefaultAsync();
        if (member == null) {
            return BadRequest(new { message = $"membro não existe" });
        }

        if (shouldBan) {
            // Banir
            var timedOutUntil = DateTime.UtcNow.AddMonths(1).Date;
            member.TimedOutUntil = timedOutUntil;

            notification = Notification.Create(
                memberId: memberId,
                kind: NotificationKind.TimedOut,
                body: timedOutUntil.ToString()
            );
        }
        else {
            // Desbanir
            member.TimedOutUntil = null;
            notification = Notification.Create(
                memberId: memberId,
                kind: NotificationKind.UntimedOut
            );
        }

        await NotifyMembers(notification);
        await _dbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("members")]
    public IActionResult GetMembers([FromBody] Search search) {

        List<MemberDto> members;
        if (search.name == null) {
            members = _dbContext.Members.Select(m => new MemberDto { Username = m.Username, MemberId = m.MemberId, TimedOutUntil = m.TimedOutUntil }).ToList();
        }
        else {
            members = _dbContext.Members.Where(m => m.Username.Contains(search.name)).Select(m => new MemberDto {
                Username = m.Username,
                MemberId = m.MemberId,
                TimedOutUntil = m.TimedOutUntil
            }).ToList();
        }

        return Ok(members);
    }

    [HttpGet("member/{memberId}")]
    public async Task<IActionResult> GetMember([FromRoute] long memberId) {

        var member = await _dbContext.Members.Where(m => m.MemberId == memberId).Select(m => new MemberDto {
            Username = m.Username,
            MemberId = m.MemberId,
            TimedOutUntil = m.TimedOutUntil
        }).FirstOrDefaultAsync();

        return Ok(member);
    }

    public async Task NotifyMembers(IList<Notification> notifications) {
        await _dbContext.Notifications.AddRangeAsync(notifications);
    }

    public async Task NotifyMembers(Notification notification) {
        await _dbContext.Notifications.AddAsync(notification);
    }

    public record Search {
        public string? name { get; set; }
        public int? capacity { get; set; }
    }
    public record MemberDto {
        public string Username { get; set; } = default!;
        public long MemberId { get; set; } = default!;
        public DateTime? TimedOutUntil { get; set; }
    }
}
