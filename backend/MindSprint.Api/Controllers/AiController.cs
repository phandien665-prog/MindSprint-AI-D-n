using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindSprint.Api.Services;
using UglyToad.PdfPig;

namespace MindSprint.Api.Controllers;

public record GenerateDto(string Text, int Count = 10);

/// <summary>Sinh Flashcard / trắc nghiệm từ văn bản người dùng gửi lên bằng Gemini.</summary>
[Authorize, Route("api/ai")]
public class AiController(GeminiService gemini) : ApiBase
{
    private const int MaxChars = 60_000;
    private const long MaxFileBytes = 10 * 1024 * 1024;

    [HttpPost("extract-file"), RequestSizeLimit(MaxFileBytes)]
    public async Task<IActionResult> ExtractFile(IFormFile file)
    {
        if (file is null || file.Length == 0) return BadRequest(new { message = "File trống." });
        if (file.Length > MaxFileBytes) return BadRequest(new { message = "File tối đa 10MB." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        string text;
        try
        {
            if (ext == ".pdf")
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                ms.Position = 0;
                using var pdf = PdfDocument.Open(ms);
                text = string.Join("\n\n", pdf.GetPages().Select(p => p.Text));
            }
            else if (ext is ".txt" or ".md" or ".csv" or ".json")
            {
                using var r = new StreamReader(file.OpenReadStream(), Encoding.UTF8);
                text = await r.ReadToEndAsync();
            }
            else
            {
                return BadRequest(new { message = "Chỉ hỗ trợ file PDF, TXT, MD, CSV, JSON." });
            }
        }
        catch (Exception)
        {
            return BadRequest(new { message = "Không đọc được file này." });
        }

        if (string.IsNullOrWhiteSpace(text))
            return BadRequest(new { message = "Không trích xuất được chữ từ file (có thể là file scan hoặc rỗng)." });

        text = CleanExtractedText(text);

        return Ok(new { text, fileName = file.FileName, charCount = text.Length });
    }

    private static string CleanExtractedText(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;
        var s = text;
        s = s.Replace("£", " ≤ ");
        s = s.Replace("¥", " ∞ ");
        s = s.Replace("!\"#", "_{i-1}");
        s = s.Replace("x!\"#", "x_{i-1}");
        s = s.Replace("x!", "x_i");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\bDx\s*=", "Δx = ");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\bDx\b", "Δx");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"([a-zÀ-ỹ0-9])\.([A-ZÀ-Ỹ])", "$1. $2");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\s+,\s*", ", ");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"[ \t]+", " ");
        return s.Trim();
    }

    [HttpPost("flashcards")]
    public async Task<IActionResult> Flashcards(GenerateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Text)) return BadRequest(new { message = "Nội dung trống." });
        var clean = CleanExtractedText(Trim(dto.Text));
        try { return Ok(await gemini.GenerateFlashcardsAsync(clean, Math.Clamp(dto.Count, 1, 100))); }
        catch (GeminiUnavailableException ex) { return AiError(ex); }
        catch (Exception ex) { return StatusCode(502, new { message = "Gemini lỗi: " + ex.Message }); }
    }

    [HttpPost("quiz")]
    public async Task<IActionResult> Quiz(GenerateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Text)) return BadRequest(new { message = "Nội dung trống." });
        var clean = CleanExtractedText(Trim(dto.Text));
        try { return Ok(await gemini.GenerateQuizAsync(clean, Math.Clamp(dto.Count, 1, 100))); }
        catch (GeminiUnavailableException ex) { return AiError(ex); }
        catch (Exception ex) { return StatusCode(502, new { message = "Gemini lỗi: " + ex.Message }); }
    }

    private IActionResult AiError(GeminiUnavailableException ex) => StatusCode(ex.StatusCode,
        new { message = ex.Message, code = ex.Code, retryAfterSeconds = ex.RetryAfterSeconds });
    private static string Trim(string s) => s.Length > MaxChars ? s[..MaxChars] : s;
}
