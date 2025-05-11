using Microsoft.AspNetCore.Mvc;
using api.src.Models;
using DTO;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/rooms")]
public class AvailableRoomsSearchController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public AvailableRoomsSearchController(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    [HttpPost("available-rooms-search")]
    public async Task<IActionResult> AvailableRoomsSearchPost([FromBody] AvailableRoomsSearchDTO search) {
        // Validate the search parameters
        if (search == null || search.capacity < 1) {
            return BadRequest(new { message = "Invalid search parameters." });
        }

        // Parse the start and end date/time from the input
        if (!DateTime.TryParse($"{search.day} {search.startTime}", out var startDateTime) ||
            !DateTime.TryParse($"{search.day} {search.endTime}", out var endDateTime)) {
            return BadRequest(new { message = "Invalid date/time format." });
        }

        var now = DateTime.Now;
        if (startDateTime < now || endDateTime < now) {
            return BadRequest(new { message = "Start and end time must be in the future." });
        }

        if (endDateTime <= startDateTime) {
            return BadRequest(new { message = "End time must be after start time." });
        }

        var earliestStart = DateTime.Parse($"{search.day} 08:30");
        var latestEnd = DateTime.Parse($"{search.day} 17:10");

        if (startDateTime < earliestStart) {
            return BadRequest(new { message = "Bookings must start at 08:30 or later." });
        }     

        if (endDateTime > latestEnd) {
            return BadRequest(new { message = "Bookings must end by 17:10." });
        }

        var maxDuration = TimeSpan.FromHours(2);
        if (endDateTime - startDateTime > maxDuration) {
            return BadRequest(new { message = "Booking cannot exceed 2 hours." });
        }

        // Find bookings that conflict with the requested time range
        var conflictingBookings = await _dbContext.Bookings
            .Where(b => b.StartDate < endDateTime && b.EndDate > startDateTime)
            .ToListAsync();

        // Extract the IDs of rooms that are already booked
        var conflictingRoomIds = conflictingBookings.Select(b => b.RoomId).ToList();

        // Find rooms that are not booked during the requested time and meet the capacity requirement
        var availableRooms = await _dbContext.Rooms
            .Where(r => !conflictingRoomIds.Contains(r.RoomId) && r.Capacity >= search.capacity)
            .ToListAsync();

        return Ok(new AvailableRoomsResponseDTO(
            availableRooms.Select(r => r.RoomId).ToList()
        ));
    }
}