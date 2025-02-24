using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBooking.Migrations
{
    /// <inheritdoc />
    public partial class Booking4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_booking_MovieId",
                table: "booking",
                column: "MovieId");

            migrationBuilder.AddForeignKey(
                name: "FK_booking_Movies_MovieId",
                table: "booking",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_booking_Movies_MovieId",
                table: "booking");

            migrationBuilder.DropIndex(
                name: "IX_booking_MovieId",
                table: "booking");
        }
    }
}
