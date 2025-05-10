namespace DTO {
    //change the password to a hash
    public record LoginDTO(string user, string password);
    public record LoginResponseDTO(string token, string expiration);
}
