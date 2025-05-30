using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class BookingUserNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bookings_members_user_id",
                table: "bookings");

            migrationBuilder.DropIndex(
                name: "IX_bookings_user_id",
                table: "bookings");

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "bookings",
                type: "nvarchar(20)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_user_id",
                table: "bookings",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_bookings_members_user_id",
                table: "bookings",
                column: "user_id",
                principalTable: "members",
                principalColumn: "uid",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bookings_members_user_id",
                table: "bookings");

            migrationBuilder.DropIndex(
                name: "IX_bookings_user_id",
                table: "bookings");

            migrationBuilder.DropColumn(
                name: "status",
                table: "bookings");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_user_id",
                table: "bookings",
                column: "user_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_bookings_members_user_id",
                table: "bookings",
                column: "user_id",
                principalTable: "members",
                principalColumn: "uid");
        }
    }
}
