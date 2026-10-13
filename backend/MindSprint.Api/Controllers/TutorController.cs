using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Services;

namespace MindSprint.Api.Controllers;

[Authorize, Route("api/notebooks")]
public class TutorController(AppDbContext db, TutorService tutor) : ApiBase
{
    [HttpPost("{id:int}/tutor")]
    public async Task<IActionResult> Solve(int id, TutorRequest request)
    {
        if (!await db.Notebooks.AnyAsync(n => n.Id == id && n.UserId == UserId)) return NotFound();
        try
        {
            TutorService.Validate(request);
            // Load sources only after verifying ownership; the client never supplies their contents.
            var sources = await db.NotebookSources.AsNoTracking()
                .Where(s => s.NotebookId == id).OrderBy(s => s.Id).ToListAsync(HttpContext.RequestAborted);
            return Ok(await tutor.SolveAsync(request, sources));
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
