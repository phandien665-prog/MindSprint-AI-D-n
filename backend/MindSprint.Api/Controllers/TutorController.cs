using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using MindSprint.Api.Data;
using MindSprint.Api.Services;

namespace MindSprint.Api.Controllers;

[Authorize, Route("api/notebooks")]
public class TutorController(AppDbContext db, TutorService tutor) : ApiBase
{
    [HttpPost("{id:int}/tutor")]
    public async Task<IActionResult> Solve(int id, TutorRequest request)
        => await SolveOwned(id, request);

    [HttpPost("{id:int}/tutor/file"), RequestSizeLimit(TutorFileReader.MaxFileBytes + 256 * 1024)]
    public async Task<IActionResult> SolveFile(int id, IFormFile? file, [FromForm] string? request)
    {
        if (!await db.Notebooks.AnyAsync(n => n.Id == id && n.UserId == UserId)) return NotFound();
        TutorRequest? parsed;
        if (string.IsNullOrWhiteSpace(request) || request.Length > 160_000) return BadRequest(new { message = "Câu hỏi hoặc ngữ cảnh không hợp lệ." });
        try { parsed = JsonSerializer.Deserialize<TutorRequest>(request, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        catch (JsonException) { return BadRequest(new { message = "Câu hỏi hoặc ngữ cảnh không hợp lệ." }); }
        if (parsed is null) return BadRequest(new { message = "Hãy nhập câu hỏi về tệp đính kèm." });
        return await SolveOwned(id, parsed, file, hasFile: true);
    }

    private async Task<IActionResult> SolveOwned(int id, TutorRequest request, IFormFile? file = null, bool hasFile = false)
    {
        if (!await db.Notebooks.AnyAsync(n => n.Id == id && n.UserId == UserId, HttpContext.RequestAborted)) return NotFound();
        try
        {
            TutorService.Validate(request);
            var attachment = hasFile ? await TutorFileReader.ReadAsync(file, HttpContext.RequestAborted, allowText: true) : null;
            // Load sources only after verifying ownership; the client never supplies their contents.
            var sources = await db.NotebookSources.AsNoTracking()
                .Where(s => s.NotebookId == id).OrderBy(s => s.Id).ToListAsync(HttpContext.RequestAborted);
            return Ok(await tutor.SolveAsync(request, sources, attachment));
        }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (GeminiUnavailableException ex)
        {
            return StatusCode(ex.StatusCode, new { message = ex.Message, code = ex.Code, retryAfterSeconds = ex.RetryAfterSeconds });
        }
        catch (OperationCanceledException) when (HttpContext.RequestAborted.IsCancellationRequested) { throw; }
        catch (Exception) { return StatusCode(502, new { message = "Gia sư chưa xử lý được bài này. Vui lòng thử lại.", code = "ai_invalid_response" }); }
    }
}
