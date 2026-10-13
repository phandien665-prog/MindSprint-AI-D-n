using System.Text;
using System.Text.Json;
using System.Net;
using System.Security.Cryptography;
using System.Globalization;

namespace MindSprint.Api.Services;

public record GeneratedCard(string Question, string Answer, string? Example);
public record GeneratedQuiz(string Question, List<string> Options, int CorrectIndex, string? Explanation);

/// <summary>Gọi Google Gemini: chế độ JSON thuần (responseMimeType) hoặc văn bản tự do.</summary>
public class GeminiService(HttpClient http, IConfiguration cfg, GeminiAvailability availability,
    ILogger<GeminiService> logger, IHttpContextAccessor context)
{
    private static readonly JsonSerializerOptions J = new() { PropertyNameCaseInsensitive = true };

    public Task<List<GeneratedCard>> GenerateFlashcardsAsync(string text, int count) => JsonAsync<List<GeneratedCard>>(
        $$"""
        Bạn là trợ lý học tập. Từ tài liệu dưới đây, tạo đúng {{count}} flashcard bằng tiếng Việt.
        Chỉ trả về JSON hợp lệ, KHÔNG kèm giải thích hay markdown, theo dạng:
        [{"question":"...","answer":"...","example":"..."}]

        TÀI LIỆU:
        {{text}}
        """);

    public Task<List<GeneratedQuiz>> GenerateQuizAsync(string text, int count) => JsonAsync<List<GeneratedQuiz>>(
        $$"""
        Bạn là trợ lý học tập. Từ tài liệu dưới đây, tạo đúng {{count}} câu hỏi trắc nghiệm 4 đáp án bằng tiếng Việt.
        Chỉ trả về JSON hợp lệ, KHÔNG kèm giải thích hay markdown, theo dạng:
        [{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]

        TÀI LIỆU:
        {{text}}
        """);

    public async Task<T> JsonAsync<T>(string prompt)
    {
        var raw = (await CallAsync(prompt, json: true)).Trim();
        if (raw.StartsWith("```")) raw = raw.Trim('`').Replace("json", "", StringComparison.OrdinalIgnoreCase).Trim();
        try
        {
            return JsonSerializer.Deserialize<T>(raw, J) ?? throw new JsonException();
        }
        catch (JsonException)
        {
            throw new GeminiUnavailableException("ai_invalid_response", "AI chưa tạo được kết quả hợp lệ. Bạn có thể thử lại.", 502);
        }
    }

    public Task<string> TextAsync(string prompt) => CallAsync(prompt, json: false);

    private async Task<string> CallAsync(string prompt, bool json)
    {
        var key = cfg["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(key)) throw ConfigurationError();

        var models = new List<string>();
        var primary = cfg["Gemini:Model"];
        if (!string.IsNullOrWhiteSpace(primary)) models.Add(primary.Trim());
        if (models.Count == 0) models.Add("gemini-flash-latest");

        var fallback = cfg.GetSection("Gemini:FallbackModels").Get<string[]>() ?? [];
        foreach (var item in fallback)
        {
            var value = item?.Trim();
            if (!string.IsNullOrWhiteSpace(value) && !models.Contains(value, StringComparer.OrdinalIgnoreCase))
                models.Add(value);
        }

        var callerCancellation = context.HttpContext?.RequestAborted ?? CancellationToken.None;
        using var budget = CancellationTokenSource.CreateLinkedTokenSource(callerCancellation);
        budget.CancelAfter(TimeSpan.FromSeconds(Math.Clamp(cfg.GetValue("Gemini:TotalTimeoutSeconds", 150), 10, 300)));
        var acquired = false;
        var failures = new List<GeminiUnavailableException>();
        var fingerprint = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(key)));
        try
        {
            await availability.Slots.WaitAsync(budget.Token);
            acquired = true;
            foreach (var model in models)
            {
                var modelKey = fingerprint + ":" + model;
                if (availability.GetPause(modelKey) is { } pause)
                {
                    failures.Add(pause.Code == "ai_rate_limited"
                        ? RateLimitError((int)Math.Ceiling((pause.Until - DateTimeOffset.UtcNow).TotalSeconds))
                        : ConfigurationError());
                    continue;
                }
                var retries = Math.Clamp(cfg.GetValue("Gemini:MaxRetries", 2), 0, 3);
                for (var attempt = 0; attempt <= retries; attempt++)
                {
                    int? providerDelay = null;
                    try
                    {
                        using var attemptTimeout = CancellationTokenSource.CreateLinkedTokenSource(budget.Token);
                        attemptTimeout.CancelAfter(TimeSpan.FromSeconds(Math.Clamp(cfg.GetValue("Gemini:AttemptTimeoutSeconds", 60), 1, 120)));
                        return await TrySingleModelAsync(prompt, model, key, json, attemptTimeout.Token);
                    }
                    catch (OperationCanceledException) when (!budget.IsCancellationRequested)
                    {
                        // A slow model should not consume the whole fallback budget.
                        failures.Add(TimeoutError());
                        break;
                    }
                    catch (HttpRequestException)
                    {
                        failures.Add(BusyError());
                        if (attempt == retries) break;
                    }
                    catch (ModelFailure failure)
                    {
                        logger.LogWarning("Gemini model {Model} returned {Status}; attempt {Attempt}", model, (int)failure.Status, attempt + 1);
                        if (failure.Status is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
                            throw ConfigurationError();
                        if (failure.Status == HttpStatusCode.NotFound)
                        {
                            availability.Pause(modelKey, "ai_configuration", TimeSpan.FromMinutes(5));
                            failures.Add(ConfigurationError());
                            break;
                        }
                        if (failure.Status == HttpStatusCode.TooManyRequests)
                        {
                            var delay = Math.Clamp(failure.RetryAfterSeconds ?? 60, 1, 86400);
                            availability.Pause(modelKey, "ai_rate_limited", TimeSpan.FromSeconds(delay));
                            failures.Add(RateLimitError(delay));
                            // Switch models immediately instead of waiting hours for daily quota.
                            break;
                        }
                        if (!IsTransient(failure.Status))
                            throw new GeminiUnavailableException("ai_request_rejected", "AI chưa xử lý được tài liệu này. Hãy thử nội dung ngắn hơn hoặc đổi trọng tâm.", 422);
                        failures.Add(BusyError());
                        if (attempt == retries) break;
                        providerDelay = failure.RetryAfterSeconds;
                        if (providerDelay > 15) break;
                    }
                    var baseDelay = Math.Clamp(cfg.GetValue("Gemini:RetryDelayMilliseconds", 1000), 1, 5000);
                    var delayMilliseconds = Math.Max(providerDelay.GetValueOrDefault() * 1000d,
                        baseDelay * Math.Pow(2, attempt) + Random.Shared.Next(baseDelay / 4 + 1));
                    await Task.Delay(TimeSpan.FromMilliseconds(delayMilliseconds), budget.Token);
                }
            }
            if (failures.Any(failure => failure.Code == "ai_rate_limited") && failures.All(failure => failure.Code is "ai_rate_limited" or "ai_configuration"))
                throw RateLimitError(failures.Where(failure => failure.Code == "ai_rate_limited").Min(failure => failure.RetryAfterSeconds ?? 60));
            if (failures.Count > 0 && failures.All(failure => failure.Code == "ai_configuration")) throw ConfigurationError();
            throw failures.Any(failure => failure.Code == "ai_timeout") ? TimeoutError() : BusyError();
        }
        catch (OperationCanceledException) when (!callerCancellation.IsCancellationRequested) { throw TimeoutError(); }
        finally { if (acquired) availability.Slots.Release(); }
    }

    private async Task<string> TrySingleModelAsync(string prompt, string model, string key, bool json, CancellationToken cancellation)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";

        object gen = json ? new { responseMimeType = "application/json", temperature = 0.3 } : new { temperature = 0.5 };
        var body = new { contents = new[] { new { parts = new[] { new { text = prompt } } } }, generationConfig = gen };

        using var req = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
        };
        req.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        req.Headers.Add("x-goog-api-key", key);

        using var res = await http.SendAsync(req, cancellation);
        var raw = await res.Content.ReadAsStringAsync(cancellation);
        if (!res.IsSuccessStatusCode)
            throw new ModelFailure(res.StatusCode, RetryAfter(res, raw));

        try
        {
            using var doc = JsonDocument.Parse(raw);
            if (doc.RootElement.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0 &&
                candidates[0].TryGetProperty("content", out var content) && content.TryGetProperty("parts", out var parts))
            {
                var text = string.Concat(parts.EnumerateArray()
                    .Where(part => (!part.TryGetProperty("thought", out var thought) || thought.ValueKind != JsonValueKind.True) && part.TryGetProperty("text", out _))
                    .Select(part => part.GetProperty("text").GetString()));
                if (!string.IsNullOrWhiteSpace(text)) return text;
            }
        }
        catch (JsonException) { }
        throw new GeminiUnavailableException("ai_empty_response", "AI chưa trả về nội dung. Hãy đổi cách hỏi hoặc kiểm tra tài liệu nguồn.", 422);
    }

    private sealed class ModelFailure(HttpStatusCode status, int? retryAfterSeconds) : Exception
    {
        public HttpStatusCode Status { get; } = status;
        public int? RetryAfterSeconds { get; } = retryAfterSeconds;
    }
    private static bool IsTransient(HttpStatusCode status) => (int)status >= 500 || status == HttpStatusCode.RequestTimeout;
    private static GeminiUnavailableException ConfigurationError() => new("ai_configuration", "Dịch vụ AI chưa sẵn sàng. Quản trị viên cần kiểm tra cấu hình và quyền truy cập AI.", 503);
    private static GeminiUnavailableException BusyError() => new("ai_busy", "AI đang bận. Vui lòng thử lại sau ít phút; tài liệu của bạn vẫn được lưu.", 503, 15);
    private static GeminiUnavailableException TimeoutError() => new("ai_timeout", "AI đang xử lý chậm. Bạn có thể thử lại với trọng tâm cụ thể hơn; tài liệu vẫn được lưu.", 504);
    private static GeminiUnavailableException RateLimitError(int seconds) => new("ai_rate_limited", "AI đã đạt hạn mức sử dụng tạm thời. Vui lòng thử lại sau; tài liệu của bạn vẫn được lưu.", 429, seconds);

    private static int? RetryAfter(HttpResponseMessage response, string raw)
    {
        if (response.Headers.RetryAfter?.Delta is { } delta) return (int)Math.Ceiling(delta.TotalSeconds);
        if (response.Headers.RetryAfter?.Date is { } date) return (int)Math.Max(1, Math.Ceiling((date - DateTimeOffset.UtcNow).TotalSeconds));
        try
        {
            using var doc = JsonDocument.Parse(raw);
            if (doc.RootElement.TryGetProperty("error", out var error) && error.TryGetProperty("details", out var details))
            {
                foreach (var detail in details.EnumerateArray())
                    if (detail.TryGetProperty("retryDelay", out var retry) && retry.GetString() is { } value && value.EndsWith('s') &&
                        double.TryParse(value[..^1], NumberStyles.Float, CultureInfo.InvariantCulture, out var seconds) && double.IsFinite(seconds))
                        return (int)Math.Clamp(Math.Ceiling(seconds), 1, 86400);
            }
        }
        catch (JsonException) { }
        return null;
    }
}
