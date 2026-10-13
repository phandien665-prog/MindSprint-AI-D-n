using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Models;

namespace MindSprint.Api.Data;

public static class DataSeeder
{
    private record SeedCard(string ExternalId, string Category, string? SubCategory, string Question, string Answer, string? Example);

    public static async Task SeedAsync(AppDbContext db, IPasswordHasher<User> hasher, bool includeDemoUser = true)
    {
        const string demoEmail = "notebookai@demo.local";
        const string demoPassword = "MindSprint123!";
        const string demoDisplayName = "Notebook AI Demo";

        if (includeDemoUser && !await db.Users.AnyAsync(u => u.Email == demoEmail))
        {
            var demoUser = new User
            {
                Email = demoEmail,
                DisplayName = demoDisplayName,
            };
            demoUser.PasswordHash = hasher.HashPassword(demoUser, demoPassword);
            db.Users.Add(demoUser);
            await db.SaveChangesAsync();
        }

        if (await db.Flashcards.AnyAsync(f => f.OwnerId == null)) return;
        var path = Path.Combine(AppContext.BaseDirectory, "Data", "vocab_seed.json");
        if (!File.Exists(path)) return;

        var cards = JsonSerializer.Deserialize<List<SeedCard>>(await File.ReadAllTextAsync(path),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];

        db.Flashcards.AddRange(cards.Select(c => new Flashcard
        {
            ExternalId = c.ExternalId, Category = c.Category, SubCategory = c.SubCategory,
            Question = c.Question, Answer = c.Answer, Example = c.Example
        }));
        await db.SaveChangesAsync();
    }
}
