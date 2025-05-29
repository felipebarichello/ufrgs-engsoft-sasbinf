using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RenameTableManagerToManagers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_manager",
                table: "manager");

            migrationBuilder.RenameTable(
                name: "manager",
                newName: "managers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_managers",
                table: "managers",
                column: "uid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_managers",
                table: "managers");

            migrationBuilder.RenameTable(
                name: "managers",
                newName: "manager");

            migrationBuilder.AddPrimaryKey(
                name: "PK_manager",
                table: "manager",
                column: "uid");
        }
    }
}
