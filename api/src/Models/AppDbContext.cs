using Microsoft.EntityFrameworkCore;

namespace api.src.Models {
    public class AppDbContext : DbContext {
        public DbSet<Member> Members { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Manager> Managers { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            // Configuração da tabela `members`
            modelBuilder.Entity<Member>(model => {
                model.ToTable("members");
                model.HasKey(u => u.UId);

                model.Property(u => u.UId)
                    .HasColumnName("uid")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(u => u.Username)
                    .HasColumnName("username")
                    .HasColumnType("nvarchar(16)")
                    .HasMaxLength(50)
                    .IsRequired();

                model.Property(u => u.PasswdHash)
                    .HasColumnName("passwd_hash")
                    .HasColumnType("nvarchar(256)")
                    .HasMaxLength(256)
                    .IsRequired();

                model.Property(u => u.TimedOutUntil)
                    .HasColumnName("timedout_until")
                    .HasColumnType("timestamp");

                model.Property(u => u.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("timestamp")
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<Booking>(model => {
                model.ToTable("bookings");
                model.HasKey(b => b.BookingId);

                model.Property(b => b.BookingId)
                    .HasColumnName("booking_id")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(b => b.UserId)
                    .HasColumnName("user_id")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(b => b.RoomId)
                    .HasColumnName("room_id")
                    .HasColumnType("int")
                    .IsRequired();

                model.Property(b => b.StartDate)
                    .HasColumnName("start_date")
                    .HasColumnType("timestamp")
                    .IsRequired();

                model.Property(b => b.EndDate)
                    .HasColumnName("end_date")
                    .HasColumnType("timestamp")
                    .IsRequired();

                model.HasOne(b => b.User)
                    .WithMany(u => u.Bookings)
                    .HasForeignKey(b => b.UserId);

                model.HasOne(b => b.Room)
                    .WithMany(r => r.Bookings)
                    .HasForeignKey(b => b.RoomId);

            });

            modelBuilder.Entity<Room>(model => {
                model.ToTable("rooms");
                model.HasKey(r => r.RoomId);

                model.Property(r => r.RoomId)
                    .HasColumnName("room_id")
                    .HasColumnType("int")
                    .IsRequired()
                    .ValueGeneratedOnAdd();

                model.Property(r => r.Name)
                    .HasColumnName("name");

                model.Property(r => r.Capacity)
                    .HasColumnName("capacity")
                    .HasColumnType("int")
                    .IsRequired();

                model.Property(r => r.IsActive)
                    .HasColumnName("is_active")
                    .HasColumnType("bit")
                    .IsRequired(true);

            });

            modelBuilder.Entity<Manager>(model => {
                model.ToTable("managers");
                model.HasKey(m => m.UId);

                model.Property(m => m.UId)
                    .HasColumnName("uid")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(m => m.Username)
                    .HasColumnName("username")
                    .HasColumnType("nvarchar(16)")
                    .HasMaxLength(50)
                    .IsRequired();

                model.Property(m => m.Password)
                    .HasColumnName("passwd_hash")
                    .HasColumnType("nvarchar(256)")
                    .HasMaxLength(256)
                    .IsRequired();

                model.Property(m => m.CreatedAt)
                    .HasColumnName("created_at")
                    .HasColumnType("timestamp")
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

            });
        }
    }
}
