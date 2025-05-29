namespace api.src.Models {
    public class Member {
        public int UId { get; set; } = default!;
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public Booking? Booking { get; set; }
        public DateTime? TimedOutUntil { get; set; }
        public DateTime CreatedAt { get; set; } = default!;

    }
}
