namespace api.src.Models {
    public class Manager {
        public long ManagerId { get; set; } = default!;
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = default!;
    }
}
