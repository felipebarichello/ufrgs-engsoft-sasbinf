using System.Security.Cryptography;
using System.Text;

namespace Sasbinf.Auth {
    public static class PasswordHash {
        // Hashes a password using SHA256 and returns the hash as a hex string
        public static string Hash(string password) {
            using (var sha256 = SHA256.Create()) {
                byte[] bytes = Encoding.UTF8.GetBytes(password);
                byte[] hash = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
            }
        }
    }
}
