namespace DTO {
    //change the password to a hash
    public record LoginDTO(string user, string password);
    public record LoginResponseDTO(string token, string expiration);

    public record AvailableRoomsSearchDTO(string day, string startTime, string endTime, int capacity); // search available rooms
    public record AvailableRoomsResponseDTO(List<long> availableRoomsIDs); // available rooms id list
    public record BookRequestDTO(int roomId, DateOnly day, TimeOnly startTime, TimeOnly endTime);
}
