namespace api.src.Models {
    public class Member {
        public int UId { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string Password { get; set; } = default!;
        public Booking? Booking { get; set; }
        public DateTime? TimedOutUntil { get; set; }
        public DateTime CreatedAt { get; set; } = default!;

    }
}