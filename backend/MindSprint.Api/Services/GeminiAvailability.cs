using System.Collections.Concurrent;

namespace MindSprint.Api.Services;

public sealed class GeminiUnavailableException(string code, string message, int statusCode, int? retryAfterSeconds = null)
    : InvalidOperationException(message)
{
    public string Code { get; } = code;
    public int StatusCode { get; } = statusCode;
    public int? RetryAfterSeconds { get; } = retryAfterSeconds;
}

// Shared across requests: avoid repeatedly calling a model that is exhausted or unavailable.
public sealed class GeminiAvailability(IConfiguration cfg)
{
    private readonly ConcurrentDictionary<string, (DateTimeOffset Until, string Code)> pauses = new();
    public SemaphoreSlim Slots { get; } = new(Math.Clamp(cfg.GetValue("Gemini:MaxConcurrentRequests", 2), 1, 10));

    public (DateTimeOffset Until, string Code)? GetPause(string key)
    {
        if (!pauses.TryGetValue(key, out var pause)) return null;
        if (pause.Until > DateTimeOffset.UtcNow) return pause;
        pauses.TryRemove(key, out _);
        return null;
    }

    public void Pause(string key, string code, TimeSpan delay)
    {
        var requested = (Until: DateTimeOffset.UtcNow.Add(delay), Code: code);
        // Concurrent transient failures must not shorten an existing quota pause.
        pauses.AddOrUpdate(key, requested, (_, current) => current.Until >= requested.Until ? current : requested);
    }
}
