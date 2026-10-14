using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindSprint.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNotebookSourceFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "FileBytes",
                table: "NotebookSources",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileMediaType",
                table: "NotebookSources",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileBytes",
                table: "NotebookSources");

            migrationBuilder.DropColumn(
                name: "FileMediaType",
                table: "NotebookSources");
        }
    }
}
