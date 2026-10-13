using System.Net;
using System.Text.Json;
using MindSprint.Api.Services;
using Microsoft.Extensions.Logging.Abstractions;

static void Check(bool value, string message) { if (!value) throw new Exception(message); }
static HttpResponseMessage Reply(int status, string text = "OK") => new((HttpStatusCode)status)
{
    Content = new StringContent(status == 200 ? JsonSerializer.Serialize(new
    { candidates = new[] { new { content = new { parts = new[] { new { text } } } } } }) : "{}")
};
static (GeminiService Service, FakeHandler Handler, GeminiAvailability State) Client(
    Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> send,
    IDictionary<string, string?>? overrides = null, GeminiAvailability? state = null, DefaultHttpContext? context = null)
{
    var values = new Dictionary<string, string?>
    {
        ["Gemini:ApiKey"] = "test-key", ["Gemini:Model"] = "primary",
        ["Gemini:FallbackModels:0"] = "backup", ["Gemini:RetryDelayMilliseconds"] = "1"
    };
    foreach (var entry in overrides ?? new Dictionary<string, string?>()) values[entry.Key] = entry.Value;
    var cfg = new ConfigurationBuilder().AddInMemoryCollection(values).Build();
    var handler = new FakeHandler(send);
    state ??= new GeminiAvailability(cfg);
    return (new GeminiService(new HttpClient(handler) { Timeout = Timeout.InfiniteTimeSpan }, cfg, state,
        NullLogger<GeminiService>.Instance, new HttpContextAccessor { HttpContext = context }), handler, state);
}
static async Task<GeminiUnavailableException> Error(Func<Task<string>> request, string code)
{
    try { await request(); throw new Exception("Expected " + code); }
    catch (GeminiUnavailableException error) { Check(error.Code == code, error.Code); return error; }
}

var count = 0;
async Task Case(string name, Func<Task> run) { await run(); count++; Console.WriteLine("PASS: " + name); }

await Case("503 retries the same model and recovers", async () =>
{
    var calls = 0;
    var (service, handler, _) = Client((_, _) => Task.FromResult(Reply(++calls < 3 ? 503 : 200)));
    Check(await service.TextAsync("hi") == "OK", "Recovery failed");
    Check(handler.Models.SequenceEqual(new[] { "primary", "primary", "primary" }), "Unexpected fallback");
});
await Case("daily quota falls back immediately and shared cooldown skips exhausted model", async () =>
{
    var (service, handler, state) = Client((request, _) =>
    {
        if (!request.RequestUri!.AbsolutePath.Contains("primary")) return Task.FromResult(Reply(200));
        var response = Reply(429);
        response.Content = new StringContent("{\"error\":{\"details\":[{\"retryDelay\":\"66464.2s\"}]}}");
        return Task.FromResult(response);
    });
    Check(await service.TextAsync("hi") == "OK", "Fallback failed");
    var (second, secondHandler, _) = Client((_, _) => Task.FromResult(Reply(200)), state: state);
    await second.TextAsync("next");
    Check(handler.Models.SequenceEqual(new[] { "primary", "backup" }), "Quota was retried");
    Check(secondHandler.Models.SequenceEqual(new[] { "backup" }), "Cooldown not shared");
});
await Case("all models out of quota return an accurate error and wait time", async () =>
{
    var (service, _, _) = Client((_, _) =>
    {
        var response = Reply(429); response.Headers.RetryAfter = new(TimeSpan.FromSeconds(90));
        return Task.FromResult(response);
    });
    var error = await Error(() => service.TextAsync("hi"), "ai_rate_limited");
    Check(error.StatusCode == 429 && error.RetryAfterSeconds == 90, "Lost quota details");
});
await Case("invalid credentials are not retried or sent to more models", async () =>
{
    var (service, handler, _) = Client((_, _) => Task.FromResult(Reply(403)));
    await Error(() => service.TextAsync("hi"), "ai_configuration");
    Check(handler.Models.Count == 1, "Invalid credentials retried");
});
await Case("unavailable model moves to fallback without retries", async () =>
{
    var (service, handler, _) = Client((request, _) => Task.FromResult(Reply(request.RequestUri!.AbsolutePath.Contains("primary") ? 404 : 200)));
    await service.TextAsync("hi"); Check(handler.Models.Count == 2, "404 retried");
});
await Case("network errors recover with bounded retries", async () =>
{
    var calls = 0;
    var (service, _, _) = Client((_, _) => ++calls == 1 ? Task.FromException<HttpResponseMessage>(new HttpRequestException()) : Task.FromResult(Reply(200)));
    Check(await service.TextAsync("hi") == "OK" && calls == 2, "Network recovery failed");
});
await Case("slow primary times out and leaves time for backup", async () =>
{
    var (service, _, _) = Client(async (request, cancellation) =>
    {
        if (request.RequestUri!.AbsolutePath.Contains("primary")) await Task.Delay(5000, cancellation);
        return Reply(200);
    }, new Dictionary<string, string?> { ["Gemini:AttemptTimeoutSeconds"] = "1" });
    Check(await service.TextAsync("hi") == "OK", "Timeout fallback failed");
});
await Case("all failed models report busy without exposing provider details", async () =>
{
    var (service, handler, _) = Client((_, _) => Task.FromResult(Reply(503)));
    var error = await Error(() => service.TextAsync("private document"), "ai_busy");
    Check(handler.Models.Count == 6 && error.StatusCode == 503, "Retry bound failed");
    Check(!error.Message.Contains("test-key") && !error.Message.Contains("private document"), "Sensitive error");
});
await Case("multipart answers join text and omit thinking parts", async () =>
{
    var (service, _, _) = Client((_, _) => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
    { Content = new StringContent("{\"candidates\":[{\"content\":{\"parts\":[{\"thought\":true,\"text\":\"private reasoning\"},{\"text\":\"Hello \"},{\"text\":\"world\"}]}}]}") }));
    Check(await service.TextAsync("hi") == "Hello world", "Multipart text lost");
});
await Case("invalid JSON gives a safe actionable error", async () =>
{
    var (service, _, _) = Client((_, _) => Task.FromResult(Reply(200, "not json")));
    try { await service.JsonAsync<JsonElement>("hi"); throw new Exception("Expected bad JSON"); }
    catch (GeminiUnavailableException error) { Check(error.Code == "ai_invalid_response", "Wrong JSON error"); }
});
await Case("request concurrency is limited across service instances", async () =>
{
    var active = 0; var peak = 0;
    async Task<HttpResponseMessage> Send(HttpRequestMessage request, CancellationToken token)
    {
        var current = Interlocked.Increment(ref active); peak = Math.Max(peak, current);
        await Task.Delay(25, token); Interlocked.Decrement(ref active); return Reply(200);
    }
    var (service, _, state) = Client(Send);
    var (second, _, _) = Client(Send, state: state);
    await Task.WhenAll(Enumerable.Range(0, 6).Select(index => (index % 2 == 0 ? service : second).TextAsync("hi")));
    Check(peak <= 2, "Concurrency limit exceeded");
});
await Case("client cancellation stops retries and releases the request slot", async () =>
{
    using var cancellation = new CancellationTokenSource(25);
    var context = new DefaultHttpContext { RequestAborted = cancellation.Token };
    var (service, handler, state) = Client(async (_, token) => { await Task.Delay(5000, token); return Reply(200); }, context: context);
    try { await service.TextAsync("hi"); throw new Exception("Expected cancellation"); }
    catch (OperationCanceledException) { }
    Check(handler.Models.Count == 1 && state.Slots.CurrentCount == 2, "Cancelled request kept running");
});
Console.WriteLine($"All {count} Gemini reliability checks passed.");

sealed class FakeHandler(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> send) : HttpMessageHandler
{
    public List<string> Models { get; } = [];
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        lock (Models) Models.Add(request.RequestUri!.AbsolutePath.Split('/').Last().Split(':')[0]);
        return send(request, cancellationToken);
    }
}
