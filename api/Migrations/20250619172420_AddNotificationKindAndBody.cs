using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationKindAndBody : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_notifications_members_user_id",
                table: "notifications");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "notifications",
                newName: "member_id");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "notifications",
                newName: "body");

            migrationBuilder.RenameIndex(
                name: "IX_notifications_user_id",
                table: "notifications",
                newName: "IX_notifications_member_id");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "notifications",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "notification_kind",
                table: "notifications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_notifications_members_member_id",
                table: "notifications",
                column: "member_id",
                principalTable: "members",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_notifications_members_member_id",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "notification_kind",
                table: "notifications");

            migrationBuilder.RenameColumn(
                name: "member_id",
                table: "notifications",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "body",
                table: "notifications",
                newName: "description");

            migrationBuilder.RenameIndex(
                name: "IX_notifications_member_id",
                table: "notifications",
                newName: "IX_notifications_user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_notifications_members_user_id",
                table: "notifications",
                column: "user_id",
                principalTable: "members",
                principalColumn: "member_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
