class Scheduler {

    private List<Booking> bookings = new List<Booking>();
    private List<Room> rooms = Rooms.GetRooms();
    
    private bool isRoomAvailable(Room room, DateTime startDate, DateTime endDate, int capacity) {
        if (room.GetCapacity() < capacity) {
            return false;
        }
        foreach (var booking in bookings) {
            if (booking.GetRoom().GetId() == room.GetId()) {
                if (startDate < booking.GetEndDate() && endDate > booking.GetStartDate()) {
                    return false;
                }
            }
        }
        return true;
    }
    public List<Room> GetAvailableRooms(DateTime startDate, DateTime endDate, int capacity) {
        List<Room> availableRooms = new List<Room>();
        foreach (var room in rooms) {
            if (isRoomAvailable(room, startDate, endDate, capacity)) {
                availableRooms.Add(room);
            }
        }
        return availableRooms;
    }

    public void BookRoom(int userId, Room room, DateTime startDate, DateTime endDate) {
        if (!isRoomAvailable(room, startDate, endDate, room.GetCapacity())) {
            throw new InvalidOperationException("Room is not available for the selected time.");
        }
        bookings.Add(Booking.CreateBooking(userId, room, startDate, endDate).Value);
    }

    public List<Room> GetRooms() {
        return rooms;
    }
}