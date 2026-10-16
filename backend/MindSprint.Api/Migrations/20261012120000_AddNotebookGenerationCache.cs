using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using MindSprint.Api.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MindSprint.Api.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20261012120000_AddNotebookGenerationCache")]
public partial class AddNotebookGenerationCache : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "NotebookGenerationCaches",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                NotebookId = table.Column<int>(type: "integer", nullable: false),
                Type = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                RequestHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                SourcesHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                IsJson = table.Column<bool>(type: "boolean", nullable: false),
                ContentJson = table.Column<string>(type: "text", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_NotebookGenerationCaches", x => x.Id);
                table.ForeignKey(
                    name: "FK_NotebookGenerationCaches_Notebooks_NotebookId",
                    column: x => x.NotebookId,
                    principalTable: "Notebooks",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_NotebookGenerationCaches_NotebookId_Type_RequestHash_SourcesHash",
            table: "NotebookGenerationCaches",
            columns: new[] { "NotebookId", "Type", "RequestHash", "SourcesHash" },
            unique: true);

    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "NotebookGenerationCaches");
    }
}
