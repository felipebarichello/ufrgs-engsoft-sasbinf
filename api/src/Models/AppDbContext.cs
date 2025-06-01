using Microsoft.EntityFrameworkCore;

namespace api.src.Models {
    public class AppDbContext : DbContext {
        public DbSet<Member> Members { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            // Configuração da tabela Users (members)
            modelBuilder.Entity<Member>(model => {
                model.ToTable("members");
                model.HasKey(u => u.MemberId);

                model.Property(u => u.MemberId)
                    .HasColumnName("member_id")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(u => u.Username)
                    .HasColumnName("username")
                    .HasColumnType("nvarchar(16)")
                    .HasMaxLength(50)
                    .IsRequired();

                model.Property(u => u.Password)
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
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(b => b.StartDate)
                    .HasColumnName("start_date")
                    .HasColumnType("timestamp")
                    .IsRequired();

                model.Property(b => b.EndDate)
                    .HasColumnName("end_date")
                    .HasColumnType("timestamp")
                    .IsRequired();

                model.Property(b => b.Status)
                    .HasColumnName("status")
                    .HasColumnType("nvarchar(20)")
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
                    .HasColumnType("bigint")
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
                model.HasKey(m => m.ManagerId);

                model.Property(m => m.ManagerId)
                    .HasColumnName("manager_id")
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

            modelBuilder.Entity<Notification>(model => {
                model.ToTable("notifications");
                model.HasKey(m => m.NotificationId);

                model.Property(m => m.NotificationId)
                    .HasColumnName("notification_id")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(m => m.UserId)
                    .HasColumnName("user_id")
                    .HasColumnType("bigint")
                    .IsRequired();

                model.Property(m => m.Description)
                    .HasColumnName("description")
                    .HasColumnType("nvarchar(512)")
                    .IsRequired(true);

                model.HasOne(m => m.User)
                    .WithMany(u => u.Notifications)
                    .HasForeignKey(m => m.UserId);
            });
        }
    }
}
