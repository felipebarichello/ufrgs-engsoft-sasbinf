namespace api.src.Models {
    public class Member {
        public int UId { get; set; } = default!;
        public string Username { get; set; } = null!;
        public string PasswdHash { get; set; } = null!;
        public List<Booking>? Bookings { get; set; }
        public DateTime? TimedOutUntil { get; set; }
        public DateTime CreatedAt { get; set; } = default!;

    }
}
