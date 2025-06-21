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
}
