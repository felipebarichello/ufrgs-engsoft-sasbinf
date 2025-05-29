namespace api.src.Models {
    public class Manager {
        public int UId { get; set; } = default!;
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = default!;
    }
}
