namespace api.src.Models {
    public class Notification {
        public long NotificationId { get; set; }
        public long MemberId { get; set; }
        public NotificationKind Kind { get; set; }
        public string Body { get; set; } = null!;
        public Member User { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public static Notification Create(long notificationId, long memberId, NotificationKind kind, string body, DateTime createdAt) {
            return new Notification {
                NotificationId = notificationId,
                MemberId = memberId,
                Kind = kind,
                Body = body,
                CreatedAt = createdAt
            };
        }

        public static Notification Create(long memberId, NotificationKind kind, string body) {
            return new Notification {
                MemberId = memberId,
                Kind = kind,
                Body = body,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static Notification Create(long memberId, NotificationKind kind) {
            return Create(memberId, kind, string.Empty);
        }
    }
}
