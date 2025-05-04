using Microsoft.EntityFrameworkCore;

namespace api.src.Models {

    public class AppDbContext : DbContext {
        public DbSet<User> Users { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(model => {
                model.ToTable("users");
                model.HasKey(u => u.UserId);

                // Configuração das colunas
                model.Property(u => u.UserId)
                    .HasColumnName("uid")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(u => u.UserName)
                    .HasColumnName("username")
                    .HasMaxLength(50)
                    .IsRequired();

                model.Property(u => u.Password)
                    .HasColumnName("passwd_hash")
                    .HasMaxLength(255)
                    .IsRequired();

                model.Property(u => u.BookingId)
                    .HasColumnName("booking_id")
                    .HasColumnType("bigint");

                model.Property(u => u.IsTimedOut)
                    .HasColumnName("is_timedout")
                    .HasDefaultValue(false);

                model.Property(u => u.TimeOutAt)
                    .HasColumnName("timedout_at")
                    .HasColumnType("datetime");

                model.Property(u => u.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}