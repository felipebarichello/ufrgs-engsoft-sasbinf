namespace api.src.Models {
    public class Booking {
        public long BookingId { get; set; }
        public long UserId { get; set; }
        public long RoomId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = default!;
        public Member User { get; set; } = null!;
        public Room Room { get; set; } = null!;
    }
}
