namespace api.src.Models {
    public class Notification {
        public long NotificationId { get; set; }
        public long UserId { get; set; }
        public string Description { get; set; } = null!;
        public Member User { get; set; } = default!;
    }
}
