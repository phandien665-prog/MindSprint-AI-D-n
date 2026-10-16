using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Services;

namespace MindSprint.Api.Controllers;

[Authorize, Route("api/notebooks")]
public class TutorOcrController(AppDbContext db, TutorOcrService ocr) : ApiBase
{
    // Multipart overhead is allowed; the service separately enforces a 10 MB file limit.
    [HttpPost("{id:int}/tutor/ocr"), RequestSizeLimit(TutorOcrService.MaxFileBytes + 64 * 1024)]
    public async Task<IActionResult> Read(int id, IFormFile? file)
    {
        if (!await db.Notebooks.AnyAsync(n => n.Id == id && n.UserId == UserId, HttpContext.RequestAborted)) return NotFound();
        try { return Ok(await ocr.ReadAsync(file, HttpContext.RequestAborted)); }
        catch (ArgumentException error) { return BadRequest(new { message = error.Message, code = "ocr_invalid_file" }); }
        catch (GeminiUnavailableException error) {
            // OCR is transient, so do not claim the uploaded exercise was saved.
            var message = error.Message.Replace("; tài liệu của bạn vẫn được lưu.", ".").Replace("; tài liệu vẫn được lưu.", ".");
            return StatusCode(error.StatusCode, new { message, code = error.Code, retryAfterSeconds = error.RetryAfterSeconds });
        }
        catch (OperationCanceledException) when (HttpContext.RequestAborted.IsCancellationRequested) { throw; }
        catch (Exception) { return StatusCode(502, new { message = "Chưa đọc được đề. Hãy thử lại, thay ảnh hoặc nhập đề thủ công.", code = "ocr_failed" }); }
    }
}
