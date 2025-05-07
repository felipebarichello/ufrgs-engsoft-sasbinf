namespace DTO {
    //change the password to a hash
    public record LoginDTO(string user, string password);
    public record LoginResponseDTO(string token, string expiration);

    public record AvailableRoomsSearchDTO(string day, string startTime, string endTime, int capacity); // search available rooms
    public record AvailableRoomsResponseDTO(List<int> availableRoomsIDs); // available rooms id list
}
