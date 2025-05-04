namespace api.src.Models {
    public class User {
        public int UserId { get; set; } = default!;
        public string UserName { get; set; } = default!;
        public string Password { get; set; } = default!;
        public int? BookingId { get; set; }
        public DateTime? TimeOutAt { get; set; }
        public DateTime CreatedAt { get; set; } = default!;

    }
}