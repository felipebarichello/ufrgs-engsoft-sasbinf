using Microsoft.EntityFrameworkCore;

namespace api.src.Models {

    public class AppDbContext : DbContext {
        public DbSet<User> Users { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(model => {
                model.ToTable("members");
                model.HasKey(u => u.UserId);

                // Configuração das colunas
                model.Property(u => u.UserId)
                    .HasColumnName("uid")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(u => u.UserName)
                    .HasColumnName("username")
                    .HasColumnType("nvarchar(16)")
                    .HasMaxLength(50)
                    .IsRequired();

                model.Property(u => u.Password)
                    .HasColumnName("passwd_hash")
                    .HasColumnType("nvarchar(256)")
                    .HasMaxLength(256)
                    .IsRequired();

                model.Property(u => u.BookingId)
                    .HasColumnName("booking_id")
                    .HasColumnType("bigint");

                model.Property(u => u.TimeOutAt)
                    .HasColumnName("timeout_until")
                    .HasColumnType("timestamp");

                model.Property(u => u.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("timestamp")
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}