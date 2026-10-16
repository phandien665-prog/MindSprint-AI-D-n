using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindSprint.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFlashcardVersioning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Flashcards",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Flashcards",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Flashcards");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Flashcards");
        }
    }
}
