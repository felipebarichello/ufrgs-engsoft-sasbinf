namespace api.src.Models {
    public class Room {

        public int RoomId { get; set; }
        public int Capacity { get; set; }
        public bool IsBooked { get; set; }
        public string Name { get; set; } = default!;
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
