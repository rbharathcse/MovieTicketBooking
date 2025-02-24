using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBooking.Migrations
{
    /// <inheritdoc />
    public partial class Init6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Screen",
                table: "shows");

            migrationBuilder.RenameColumn(
                name: "TicketPrice",
                table: "shows",
                newName: "ticketPrice");

            migrationBuilder.RenameColumn(
                name: "ShowTime",
                table: "shows",
                newName: "showTime");

            migrationBuilder.RenameColumn(
                name: "AvailableSeats",
                table: "shows",
                newName: "totalSeats");

            migrationBuilder.AddColumn<int>(
                name: "screenNumber",
                table: "shows",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "screenNumber",
                table: "shows");

            migrationBuilder.RenameColumn(
                name: "ticketPrice",
                table: "shows",
                newName: "TicketPrice");

            migrationBuilder.RenameColumn(
                name: "showTime",
                table: "shows",
                newName: "ShowTime");

            migrationBuilder.RenameColumn(
                name: "totalSeats",
                table: "shows",
                newName: "AvailableSeats");

            migrationBuilder.AddColumn<string>(
                name: "Screen",
                table: "shows",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
