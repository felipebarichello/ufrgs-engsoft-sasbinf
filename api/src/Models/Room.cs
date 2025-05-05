namespace api.src.Models {
    public class Room {
        public int RoomId { get; set; }
        public Booking? Booking { get; set; }
        public int Capacity { get; set; }
    }
}