using DotNext;

internal class Booking {
    private readonly int UserId;
    private readonly Room Room;
    private readonly DateTime StartDate;
    private readonly DateTime EndDate;
    private const int MAX_BOOKING_HOURS = 2;

    private Booking(int userId, Room room, DateTime startDate, DateTime endDate) {
        UserId = userId;
        Room = room;
        StartDate = startDate;
        EndDate = endDate;
    }
    public static Optional<Booking> CreateBooking(int userId, Room room, DateTime startDate, DateTime endDate) {
        if (startDate >= endDate) {
            return Optional<Booking>.None;
        }

        if (endDate <= DateTime.Now) {
            return Optional<Booking>.None;
        }

        if (startDate <= DateTime.Now) {
            return Optional<Booking>.None;
        }

        if ((endDate - startDate).TotalHours > MAX_BOOKING_HOURS) {
            return Optional<Booking>.None;
        }

        if (room == null) {
            return Optional<Booking>.None;
        }

        return new Booking(userId, room, startDate, endDate);
    }

    public int GetUserId() {
        return UserId;
    }

    public Room GetRoom() {
        return Room;
    }

    public DateTime GetStartDate() {
        return StartDate;
    }

    public DateTime GetEndDate() {
        return EndDate;
    }
}
