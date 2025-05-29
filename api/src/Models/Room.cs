namespace api.src.Models {
    public class Room {

        public int RoomId { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
        public string Name { get; set; } = null!;
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
