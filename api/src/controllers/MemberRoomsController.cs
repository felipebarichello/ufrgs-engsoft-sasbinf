using Microsoft.AspNetCore.Mvc;
using api.src.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("api/rooms")]
[Authorize(Roles = Roles.Member)]
public class MemberRoomsController : ControllerBase {
    private readonly AppDbContext _dbContext;

    public MemberRoomsController(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    [HttpPost("available-rooms-search")]
    public async Task<IActionResult> AvailableRoomsSearchPost([FromBody] AvailableRoomsSearchDTO search) {
        try {
            return Ok(new AvailableRoomsResponseDTO(await GetAvailableRooms(search)));
        }
        catch (InvalidSearchParamsException e) {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpPost("book")]
    public async Task<IActionResult> BookRoomPost([FromBody] BookRequestDTO request) {
        var username = User.FindFirstValue(ClaimTypes.Name);

        if (username == null) {
            return Unauthorized($"Failed to find user for provided bearer token");
        }
        
        var userId = await _dbContext.Members
            .Where(m => m.Username == username)
            .Select(m => m.MemberId)
            .FirstOrDefaultAsync();

        var availableRoomIds = await GetAvailableRooms(new AvailableRoomsSearchDTO(request.day.ToString(), request.startTime.ToString(), request.endTime.ToString(), 6));
        if (!availableRoomIds.Contains(request.roomId)) {
            return BadRequest("Room is not available at requested time frame");
        }

        var bookingInsertion = await _dbContext.Bookings.AddAsync(new Booking {
            UserId = userId,
            RoomId = request.roomId,
            StartDate = request.day.ToDateTime(request.startTime),
            EndDate = request.day.ToDateTime(request.endTime),
            Status = BookingStatus.Booked,
        });
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = $"Room (RoomId: {request.roomId}) successfully booked!" });
    }

    private async Task<List<long>> GetAvailableRooms(AvailableRoomsSearchDTO search) {
        // Validate the search parameters
        if (search == null || search.capacity < 1) {
            throw new InvalidSearchParamsException("Parâmetros de busca inválidos.");
        }

        // Parse the start and end date/time from the input
        if (!DateTime.TryParse($"{search.day} {search.startTime}", out var startDateTime) ||
            !DateTime.TryParse($"{search.day} {search.endTime}", out var endDateTime)) {
            throw new InvalidSearchParamsException("Formato de data/hora inválido.");
        }

        var now = DateTime.Now;
        if (startDateTime < now || endDateTime < now) {
            throw new InvalidSearchParamsException("Os horários de entrada e saída devem estar no futuro.");
        }

        if (endDateTime <= startDateTime) {
            throw new InvalidSearchParamsException("O horário de saída deve ser após o horário de entrada.");
        }

        var earliestStart = DateTime.Parse($"{search.day} 08:30");
        var latestEnd = DateTime.Parse($"{search.day} 17:10");

        if (startDateTime < earliestStart) {
            throw new InvalidSearchParamsException("As reservas devem começar às 08:30 ou mais tarde.");
        }

        if (endDateTime > latestEnd) {
            throw new InvalidSearchParamsException("As reservas devem terminar até às 17:10.");
        }

        var maxDuration = TimeSpan.FromHours(2);
        if (endDateTime - startDateTime > maxDuration) {
            throw new InvalidSearchParamsException("A reserva não pode exceder 2 horas.");
        }

        // Find bookings that conflict with the requested time range
        // (StartA <= EndB) && (EndA >= StartB)
        // A: b
        // B: unnamed
        var conflictingBookings = await _dbContext.Bookings
            .Where(b => b.StartDate <= endDateTime && b.EndDate >= startDateTime)
            .ToListAsync();

        // Extract the IDs of rooms that are already booked
        var conflictingRoomIds = conflictingBookings.Select(b => b.RoomId).ToList();

        // Find rooms that are not booked during the requested time and meet the capacity requirement
        var availableRooms = await _dbContext.Rooms
            .Where(r => !conflictingRoomIds.Contains(r.RoomId) && r.Capacity >= search.capacity)
            .ToListAsync();

        return availableRooms.Select(r => r.RoomId).ToList();
    }
}

[Serializable]
internal class InvalidSearchParamsException : Exception {
    public InvalidSearchParamsException() {
    }

    public InvalidSearchParamsException(string? message) : base(message) {
    }

    public InvalidSearchParamsException(string? message, Exception? innerException) : base(message, innerException) {
    }
}