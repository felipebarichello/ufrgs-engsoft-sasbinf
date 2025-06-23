namespace DTO {
    //change the password to a hash
    public record LoginDTO(string user, string password);
    public record LoginResponseDTO(string token, string expiration);

    public record AvailableRoomsSearchDTO(string day, string startTime, string endTime, int capacity); // search available rooms
    public record AvailableRoomDTO(long id, string name);
    public record AvailableRoomsResponseDTO(List<AvailableRoomDTO> availableRooms); // available rooms id list
    public record BookRequestDTO(int roomId, DateOnly day, TimeOnly startTime, TimeOnly endTime);
    public record CancelBookingDTO(long bookingId);
    public record TransferBookingDTO(long bookingId, string newUser);

    public record Search {
        public string? name { get; set; }
        public int? capacity { get; set; }
    }
    
    public record MemberDto {
        public string Username { get; set; } = default!;
        public long MemberId { get; set; } = default!;
        public DateTime? TimedOutUntil { get; set; }
    }

    public record BookingDto {
        public long BookingId { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; } = default!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = default!;
        public long RoomId { get; set; }
        public string RoomName { get; set; } = default!;
    }
}
