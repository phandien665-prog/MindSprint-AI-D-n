using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;

var path = Path.Combine(AppContext.BaseDirectory, "Data", "vocab_seed.json");
using var seed = JsonDocument.Parse(await File.ReadAllTextAsync(path));
var ids = seed.RootElement.EnumerateArray()
    .Select(card => card.GetProperty("externalId").GetString()).ToArray();
var expected = ids.Distinct().Count();

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options;
await using var db = new AppDbContext(options);
await db.Database.EnsureCreatedAsync();
var hasher = new PasswordHasher<User>();
var user = new User { Email = "seed-check@example.test", DisplayName = "Seed check", PasswordHash = "synthetic-only" };
db.Users.Add(user);
await db.SaveChangesAsync();
var personal = new Flashcard { ExternalId = "seed-check-personal", OwnerId = user.Id,
    Category = "general", Question = "Personal question", Answer = "Keep this answer" };
db.Flashcards.Add(personal);
await db.SaveChangesAsync();

await DataSeeder.SeedAsync(db, hasher, includeDemoUser: false);
Check(await db.Flashcards.CountAsync(card => card.OwnerId == null) == expected,
    "Fresh database contains exactly one system card per seed ExternalId");
Check(await db.Flashcards.CountAsync(card => card.Id == personal.Id) == 1,
    "Seeding preserves personal cards");
Check(await db.Users.CountAsync() == 1, "Seeding with demo disabled adds no shared account");

db.ChangeTracker.Clear();
await DataSeeder.SeedAsync(db, hasher, includeDemoUser: false);
Check(await db.Flashcards.CountAsync(card => card.OwnerId == null) == expected,
    "Repeated seeding does not duplicate system cards");
Check((await db.Flashcards.SingleAsync(card => card.Id == personal.Id)).Answer == "Keep this answer",
    "Repeated seeding leaves personal content intact");
Console.WriteLine($"PASS 5 seed checks; {ids.Length} input rows, {expected} unique system cards");

static void Check(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
    Console.WriteLine($"PASS {message}");
}
