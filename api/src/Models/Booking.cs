namespace api.src.Models {
    public class Booking {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public Member User { get; set; } = null!;
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}