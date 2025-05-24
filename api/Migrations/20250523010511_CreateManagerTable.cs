using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class CreateManagerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bookings_rooms_room_id",
                table: "bookings");

            migrationBuilder.DropIndex(
                name: "IX_bookings_room_id",
                table: "bookings");

            migrationBuilder.AddColumn<ulong>(
                name: "is_booked",
                table: "rooms",
                type: "bit",
                nullable: false,
                defaultValue: 0ul);

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "rooms",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "manager",
                columns: table => new
                {
                    uid = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    username = table.Column<string>(type: "nvarchar(16)", maxLength: 50, nullable: false),
                    passwd_hash = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_manager", x => x.uid);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_room_id",
                table: "bookings",
                column: "room_id");

            migrationBuilder.AddForeignKey(
                name: "FK_bookings_rooms_room_id",
                table: "bookings",
                column: "room_id",
                principalTable: "rooms",
                principalColumn: "room_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bookings_rooms_room_id",
                table: "bookings");

            migrationBuilder.DropTable(
                name: "manager");

            migrationBuilder.DropIndex(
                name: "IX_bookings_room_id",
                table: "bookings");

            migrationBuilder.DropColumn(
                name: "is_booked",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "name",
                table: "rooms");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_room_id",
                table: "bookings",
                column: "room_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_bookings_rooms_room_id",
                table: "bookings",
                column: "room_id",
                principalTable: "rooms",
                principalColumn: "room_id");
        }
    }
}
