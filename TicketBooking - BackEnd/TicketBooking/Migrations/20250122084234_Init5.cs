using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketBooking.Migrations
{
    /// <inheritdoc />
    public partial class Init5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShowDateRange",
                table: "shows",
                newName: "startDate");

            migrationBuilder.AddColumn<DateOnly>(
                name: "endDate",
                table: "shows",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "endDate",
                table: "shows");

            migrationBuilder.RenameColumn(
                name: "startDate",
                table: "shows",
                newName: "ShowDateRange");
        }
    }
}
