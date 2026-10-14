using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;

namespace MindSprint.Api.Services;

public class WeakAreaService(AppDbContext db)
{
    public async Task<List<WeakAreaDto>> GetWeakAreasAsync(int userId)
    {
        return await db.WeakAreas
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.AccuracyRate)
            .ThenByDescending(w => w.WrongCount)
            .Select(w => new WeakAreaDto
            {
                Id = w.Id,
                Category = w.Category,
                SubCategory = w.SubCategory,
                Topic = w.Topic,
                Reason = w.Reason,
                WrongCount = w.WrongCount,
                TotalAttempts = w.TotalAttempts,
                AccuracyRate = w.AccuracyRate,
                SuggestedAction = w.SuggestedAction,
                AnalyzedAt = w.AnalyzedAt,
                LastUpdatedAt = w.LastUpdatedAt
            })
            .ToListAsync();
    }

    public async Task<AnalyzeResultDto> AnalyzeAndUpdateWeakAreasAsync(int userId)
    {
        var cardProgress = await db.CardProgresses
            .Where(cp => cp.UserId == userId)
            .Include(cp => cp.Flashcard)
            .ToListAsync();

        if (cardProgress.Count == 0)
        {
            return new AnalyzeResultDto
            {
                HasEnoughData = false,
                Message = "Chưa có dữ liệu học tập. Hãy học vài thẻ để hệ thống phân tích điểm yếu.",
                WeakAreas = []
            };
        }

        var weakAreasDict = new Dictionary<string, WeakAreaAnalysis>();

        foreach (var cp in cardProgress)
        {
            var fc = cp.Flashcard;
            if (fc == null) continue;

            var key = $"{fc.Category}|{fc.SubCategory ?? ""}|{ExtractTopic(fc.Question, fc.Answer)}";
            if (!weakAreasDict.TryGetValue(key, out var analysis))
            {
                analysis = new WeakAreaAnalysis
                {
                    Category = fc.Category,
                    SubCategory = fc.SubCategory,
                    Topic = ExtractTopic(fc.Question, fc.Answer)
                };
                weakAreasDict[key] = analysis;
            }

            if (cp.Status == "known")
            {
                analysis.CorrectCount++;
            }
            else if (cp.Status == "review" && cp.Repetition > 1)
            {
                analysis.WrongCount++;
            }
            analysis.TotalAttempts++;
        }

        var now = DateTime.UtcNow;
        var results = new List<WeakAreaDto>();

        foreach (var analysis in weakAreasDict.Values)
        {
            if (analysis.TotalAttempts < 3) continue;

            analysis.AccuracyRate = analysis.TotalAttempts > 0
                ? (double)analysis.CorrectCount / analysis.TotalAttempts
                : 1.0;

            if (analysis.AccuracyRate >= 0.7) continue;

            var reason = BuildReason(analysis);
            var suggestedAction = BuildSuggestedAction(analysis);

            var existing = await db.WeakAreas
                .FirstOrDefaultAsync(w => w.UserId == userId
                    && w.Category == analysis.Category
                    && w.Topic == analysis.Topic);

            if (existing != null)
            {
                existing.SubCategory = analysis.SubCategory;
                existing.WrongCount = analysis.WrongCount;
                existing.TotalAttempts = analysis.TotalAttempts;
                existing.AccuracyRate = analysis.AccuracyRate;
                existing.Reason = reason;
                existing.SuggestedAction = suggestedAction;
                existing.LastUpdatedAt = now;
            }
            else
            {
                db.WeakAreas.Add(new WeakArea
                {
                    UserId = userId,
                    Category = analysis.Category,
                    SubCategory = analysis.SubCategory,
                    Topic = analysis.Topic,
                    Reason = reason,
                    WrongCount = analysis.WrongCount,
                    TotalAttempts = analysis.TotalAttempts,
                    AccuracyRate = analysis.AccuracyRate,
                    SuggestedAction = suggestedAction,
                    AnalyzedAt = now
                });
            }

            results.Add(new WeakAreaDto
            {
                Category = analysis.Category,
                SubCategory = analysis.SubCategory,
                Topic = analysis.Topic,
                Reason = reason,
                WrongCount = analysis.WrongCount,
                TotalAttempts = analysis.TotalAttempts,
                AccuracyRate = analysis.AccuracyRate,
                SuggestedAction = suggestedAction,
                AnalyzedAt = now
            });
        }

        await db.SaveChangesAsync();

        return new AnalyzeResultDto
        {
            HasEnoughData = results.Count > 0,
            Message = results.Count > 0
                ? $"Tìm thấy {results.Count} điểm yếu cần củng cố."
                : "Chưa có điểm yếu rõ rệt (độ chính xác ≥ 70% hoặc ít hơn 3 lần thử).",
            WeakAreas = results.OrderByDescending(w => w.WrongCount).ToList()
        };
    }

    private static string ExtractTopic(string question, string answer)
    {
        var words = question.Split([' ', '-', '_', '/', '(', ')', '[', ']', '.', ',', '?', '!'], StringSplitOptions.RemoveEmptyEntries);
        var candidates = words.Where(w => w.Length > 2).OrderByDescending(w => w.Length).Take(3).ToList();
        return candidates.Count > 0 ? string.Join(" ", candidates) : question.Length > 50 ? question[..50] : question;
    }

    private static string BuildReason(WeakAreaAnalysis a)
    {
        var pct = (1 - a.AccuracyRate) * 100;
        return $"{a.WrongCount}/{a.TotalAttempts} lần sai ({pct:F0}% lỡ) – chủ đề: {a.Topic}";
    }

    private static string BuildSuggestedAction(WeakAreaAnalysis a)
    {
        if (a.Category == "english")
            return $"Ôn lại từ vựng chủ đề '{a.Topic}' qua flashcard + quiz";
        if (a.Category == "programming")
            return $"Xem lại khái niệm '{a.Topic}' trong Sổ tay AI, làm bài tập liên quan";
        return $"Ôn tập kiến thức '{a.Topic}' qua thẻ hệ thống và tạo thẻ cá nhân";
    }

    private class WeakAreaAnalysis
    {
        public string Category { get; set; } = "";
        public string? SubCategory { get; set; }
        public string Topic { get; set; } = "";
        public int CorrectCount { get; set; }
        public int WrongCount { get; set; }
        public int TotalAttempts { get; set; }
        public double AccuracyRate { get; set; }
    }
}

public record WeakAreaDto(
    int Id = 0,
    string Category = "",
    string? SubCategory = null,
    string Topic = "",
    string Reason = "",
    int WrongCount = 0,
    int TotalAttempts = 0,
    double AccuracyRate = 0,
    string SuggestedAction = "",
    DateTime AnalyzedAt = default,
    DateTime? LastUpdatedAt = null
);

public record AnalyzeResultDto(
    bool HasEnoughData = false,
    string Message = "",
    List<WeakAreaDto> WeakAreas = null!
);