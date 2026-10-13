using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata; // for PostgreSQL functions

namespace MindSprint.Api.Controllers;

public record CardDto(string? ExternalId, string Category, string? SubCategory, string Question, string Answer, string? Example, int? Version);
public class CardResponse
{
    public string Id { get; set; } = "";
    public string Category { get; set; } = "";
    public string? SubCategory { get; set; }
    public string Question { get; set; } = "";
    public string Answer { get; set; } = "";
    public string? Example { get; set; }
    public string Status { get; set; } = "";
    public int Repetition { get; set; }
    public int Interval { get; set; }
    public double EFactor { get; set; }
    public long NextReviewDate { get; set; }
    public int Version { get; set; }
    public DateTime UpdatedAt { get; set; }
}

[Authorize, Route("api/flashcards")]
public class FlashcardsController(AppDbContext db) : ApiBase
{
    // Thẻ hệ thống + thẻ của tôi, kèm trạng thái SRS (nếu đã học). Định dạng khớp frontend hiện tại.
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? subCategory)
    {
        var uid = UserId;
        var q = db.Flashcards.AsNoTracking().Where(f => f.OwnerId == null || f.OwnerId == uid);
        if (!string.IsNullOrEmpty(category) && category != "all") q = q.Where(f => f.Category == category);
        if (!string.IsNullOrEmpty(subCategory) && subCategory != "all") q = q.Where(f => f.SubCategory == subCategory);

        var rows = await q.GroupJoin(db.CardProgresses.Where(p => p.UserId == uid), f => f.Id, p => p.FlashcardId,
                (f, ps) => new { f, p = ps.FirstOrDefault() })
            .Select(x => new CardResponse
            {
                Id = x.f.ExternalId,
                Category = x.f.Category,
                SubCategory = x.f.SubCategory,
                Question = x.f.Question,
                Answer = x.f.Answer,
                Example = x.f.Example,
                Status = x.p != null ? x.p.Status : "new",
                Repetition = x.p != null ? x.p.Repetition : 0,
                Interval = x.p != null ? x.p.IntervalDays : 1,
                EFactor = x.p != null ? x.p.EFactor : 2.5,
                // PostgreSQL: EXTRACT(EPOCH FROM timestamp) * 1000 for milliseconds
                NextReviewDate = x.p != null && x.p.NextReviewDate != null
                    ? (long)(x.p.NextReviewDate.Value - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds : 0L,
                Version = x.f.Version,
                UpdatedAt = x.f.UpdatedAt
            }).ToListAsync();
        return Ok(rows);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CardDto dto)
    {
        var card = new Flashcard
        {
            Category = dto.Category, SubCategory = dto.SubCategory, Question = dto.Question,
            Answer = dto.Answer, Example = dto.Example, OwnerId = UserId,
            UpdatedAt = DateTime.UtcNow,
            Version = 1
        };
        if (!string.IsNullOrWhiteSpace(dto.ExternalId)) card.ExternalId = dto.ExternalId;
        db.Flashcards.Add(card);
        await db.SaveChangesAsync();
        return Ok(new { id = card.ExternalId, version = card.Version, updatedAt = card.UpdatedAt });
    }

    [HttpPut("{externalId}")]
    public async Task<IActionResult> Update(string externalId, CardDto dto)
    {
        var card = await db.Flashcards.FirstOrDefaultAsync(f => f.ExternalId == externalId && f.OwnerId == UserId);
        if (card is null) return NotFound();

        // #9 – Optimistic locking: check version
        if (dto.Version.HasValue && dto.Version.Value != card.Version)
        {
            return Conflict(new { message = "Thẻ đã được sửa bởi thiết bị khác. Vui lòng tải lại.", serverVersion = card.Version, serverCard = new CardResponse
            {
                Id = card.ExternalId,
                Category = card.Category,
                SubCategory = card.SubCategory,
                Question = card.Question,
                Answer = card.Answer,
                Example = card.Example,
                Status = "new",
                Repetition = 0,
                Interval = 1,
                EFactor = 2.5,
                NextReviewDate = 0,
                Version = card.Version,
                UpdatedAt = card.UpdatedAt
            }});
        }

        card.Category = dto.Category;
        card.SubCategory = dto.SubCategory;
        card.Question = dto.Question;
        card.Answer = dto.Answer;
        card.Example = dto.Example;
        card.UpdatedAt = DateTime.UtcNow;
        card.Version++;

        await db.SaveChangesAsync();
        return Ok(new { version = card.Version, updatedAt = card.UpdatedAt });
    }

    [HttpDelete("{externalId}")]
    public async Task<IActionResult> Delete(string externalId, [FromQuery] int? version)
    {
        var card = await db.Flashcards.FirstOrDefaultAsync(f => f.ExternalId == externalId && f.OwnerId == UserId);
        if (card is null) return NotFound();

        // #9 – Optional version check on delete
        if (version.HasValue && version.Value != card.Version)
        {
            return Conflict(new { message = "Thẻ đã thay đổi. Vui lòng tải lại.", serverVersion = card.Version });
        }

        db.Flashcards.Remove(card);
        await db.SaveChangesAsync();
        return NoContent();
    }
}