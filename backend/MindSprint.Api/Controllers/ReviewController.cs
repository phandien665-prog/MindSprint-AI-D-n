using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;

namespace MindSprint.Api.Controllers;

public record ReviewDto(string CardId, bool Remembered);

[Authorize, Route("api/review")]
public class ReviewController(AppDbContext db, SpacedRepetitionService srs) : ApiBase
{
    // Ghi kết quả ôn 1 thẻ -> tính lại NextReviewDate
    [HttpPost]
    public async Task<IActionResult> Submit(ReviewDto dto)
    {
        var uid = UserId;
        // Exclude retired system cards (OwnerId == -1)
        var card = await db.Flashcards.FirstOrDefaultAsync(f => f.ExternalId == dto.CardId && (f.OwnerId == null || f.OwnerId == uid) && f.OwnerId != -1);
        if (card is null) return NotFound(new { message = "Không tìm thấy thẻ." });

        var p = await db.CardProgresses.FirstOrDefaultAsync(x => x.UserId == uid && x.FlashcardId == card.Id);
        if (p is null) db.CardProgresses.Add(p = new CardProgress { UserId = uid, FlashcardId = card.Id });

        srs.Apply(p, dto.Remembered);
        await db.SaveChangesAsync();
        return Ok(new { p.Repetition, p.IntervalDays, p.EFactor, p.NextReviewDate, p.Status });
    }

    // Danh sách thẻ đến hạn ôn hôm nay (+ tối đa `newLimit` thẻ mới)
    [HttpGet("due")]
    public async Task<IActionResult> Due([FromQuery] int newLimit = 20)
    {
        var uid = UserId;
        var now = DateTime.UtcNow;
        var due = await db.CardProgresses.Where(p => p.UserId == uid && p.NextReviewDate <= now)
            .Select(p => p.Flashcard!.ExternalId).ToListAsync();

        var seen = db.CardProgresses.Where(p => p.UserId == uid).Select(p => p.FlashcardId);
        // Exclude retired system cards (OwnerId == -1)
        var fresh = await db.Flashcards.Where(f => (f.OwnerId == null || f.OwnerId == uid) && f.OwnerId != -1 && !seen.Contains(f.Id))
            .OrderBy(f => f.Id).Take(newLimit).Select(f => f.ExternalId).ToListAsync();

        return Ok(new { due, fresh });
    }
}
