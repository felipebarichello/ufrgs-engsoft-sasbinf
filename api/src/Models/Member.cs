namespace api.src.Models {
    public class Member {
        public long MemberId { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string Password { get; set; } = default!;
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public DateTime? TimedOutUntil { get; set; }
        public DateTime CreatedAt { get; set; } = default!;
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    }
}
