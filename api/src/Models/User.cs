namespace api.src.Models {
    public class User {
        public Guid UserId { get; set; } = default!;
        public string UserName { get; set; } = default!;
        public string Password { get; set; } = default!;
        public Guid? BookingId { get; set; }
        public bool IsTimedOut { get; set; } = default!;
        public DateTime? TimeOutAt { get; set; }
        public DateTime CreatedAt { get; set; } = default!;

    }
}