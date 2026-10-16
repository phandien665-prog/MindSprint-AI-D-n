using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using MindSprint.Api.Controllers;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;

internal static class ProgrammingChecks
{
    public static async Task Live(string? selectedCase = null)
    {
        var apiDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../MindSprint.Api"));
        var cfg = new ConfigurationBuilder().AddJsonFile(Path.Combine(apiDir, "appsettings.json"))
            .AddJsonFile(Path.Combine(apiDir, "appsettings.Development.json"), optional: true).AddEnvironmentVariables()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["Gemini:MaxRetries"] = "0", ["Gemini:AttemptTimeoutSeconds"] = "30", ["Gemini:TotalTimeoutSeconds"] = "90" }).Build();
        var tutor = new TutorService(new GeminiService(new HttpClient { Timeout = Timeout.InfiniteTimeSpan }, cfg,
            new GeminiAvailability(cfg), NullLogger<GeminiService>.Instance, new HttpContextAccessor()));
        var output = Path.GetFullPath("artifacts/issue-34/live-programming.json");
        Directory.CreateDirectory(Path.GetDirectoryName(output)!);
        var results = new List<object>();
        var samples = new (string Name, string Language, string Question, string Code, string Error)[] {
            ("python-syntax", "python", "Hàm add trả tổng hai số nguyên.", "def add(a, b)\n    return a + b", "SyntaxError: expected ':'"),
            ("python-type", "python", "Nhập tuổi 21, in tuổi năm sau là 22.", "age = input('Age: ')\nprint(age + 1)", "TypeError: can only concatenate str (not int) to str"),
            ("python-logic", "python", "Tính tổng số chẵn trong danh sách số nguyên. [1, 2, 4] phải trả 6.", "def total_even(numbers):\n    return sum(n for n in numbers if n % 2 != 0)", "Đang trả 1 thay vì 6"),
            ("python-missing", "python", "Vì sao code này sai?", "def transform(data):\n    return helper(data)", ""),
            ("javascript-syntax", "javascript", "Hàm add trả tổng hai số nguyên.", "function add(a, b) {\n  return a + b;\n", "SyntaxError: Unexpected end of input"),
            ("javascript-type", "javascript", "Tính tuổi năm sau, tuổi hiện tại là chuỗi 21. Mong muốn in số 22.", "const age = '21';\nconsole.log(age + 1);", "Đang in 211 thay vì 22"),
            ("javascript-logic", "javascript", "Tính tổng số chẵn trong danh sách số nguyên. [1, 2, 4] phải trả 6.", "function totalEven(numbers) {\n  return numbers.filter(n => n % 2 !== 0).reduce((sum, n) => sum + n, 0);\n}", "Đang trả 1 thay vì 6"),
            ("javascript-missing", "javascript", "Vì sao code này sai?", "function transform(data) {\n  return helper(data);\n}", "")
        };
        foreach (var sample in samples.Where(s => selectedCase is null || s.Name.Contains(selectedCase, StringComparison.OrdinalIgnoreCase))) {
            try {
                var request = new TutorRequest(sample.Question, Action: "code", Language: sample.Language, Code: sample.Code, Error: sample.Error);
                var reply = await tutor.SolveAsync(request);
                var accepted = reply.ExecutionStatus == "not_run" && (sample.Name.EndsWith("-missing")
                    ? reply.NeedsClarification && reply.Programming?.FixedCode is null && reply.Programming?.Tests.Count == 0
                    : !reply.NeedsClarification);
                results.Add(new { sample.Name, Request = request, Reply = reply, Accepted = accepted });
                Console.WriteLine($"LIVE {(accepted ? "PASS" : "FAIL")} {sample.Name}: needsClarification={reply.NeedsClarification}, executionStatus={reply.ExecutionStatus}");
                if (!accepted && Environment.ExitCode == 0) Environment.ExitCode = 1;
                if (sample.Name == "python-syntax") {
                    var followup = request with { Question = "Vì sao dòng 1 cần dấu hai chấm?", History = [new("user", sample.Question), new("assistant", JsonSerializer.Serialize(reply))] };
                    var next = await tutor.SolveAsync(followup);
                    results.Add(new { Name = "python-followup", Request = followup, Reply = next });
                    Console.WriteLine("LIVE python-followup: response saved");
                }
            } catch (GeminiUnavailableException ex) {
                results.Add(new { sample.Name, Error = ex.Code });
                Console.WriteLine($"LIVE unavailable {sample.Name}: {ex.Code}"); Environment.ExitCode = 2;
            }
            await File.WriteAllTextAsync(output, JsonSerializer.Serialize(results, new JsonSerializerOptions { WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping }));
        }
        Console.WriteLine("Live responses saved to " + output + "; inspect proposed code before manually running it in a development environment.");
    }

    public static async Task Run()
    {
        var passed = 0;
        void Check(bool ok, string name) { if (!ok) throw new Exception("FAIL " + name); passed++; Console.WriteLine("PASS " + name); }
        var cfg = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> {
            ["Gemini:ApiKey"] = "test-only", ["Gemini:Model"] = "test", ["Gemini:MaxRetries"] = "0"
        }).Build();
        var provider = new CodeProvider();
        TutorService Tutor() => new(new GeminiService(new HttpClient(provider), cfg, new GeminiAvailability(cfg), NullLogger<GeminiService>.Instance, new HttpContextAccessor()));
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
        await db.Database.EnsureCreatedAsync();
        db.Users.Add(new User { Id = 1, Email = "code@example.test", DisplayName = "Code", PasswordHash = "test" });
        db.Notebooks.Add(new Notebook { Id = 10, UserId = 1, Title = "Code" });
        await db.SaveChangesAsync();
        async Task<(int Status, JsonElement Body)> Send(object payload, int id = 10)
        {
            var request = JsonSerializer.Deserialize<TutorRequest>(JsonSerializer.Serialize(payload), new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
            var controller = new TutorController(db, Tutor()) { ControllerContext = new() { HttpContext = new DefaultHttpContext {
                User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "1")], "test"))
            } } };
            var result = await controller.Solve(id, request);
            return result is ObjectResult o ? (o.StatusCode ?? 200, JsonSerializer.SerializeToElement(o.Value, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase })) : (((StatusCodeResult)result).StatusCode, default);
        }
        var code = "\n\tprint('<script>&`$[1]</script>')\n  ";
        var input = new { question = "", action = "code", language = "python", code, error = "SyntaxError: invalid syntax" };
        var result = await Send(input);
        Check(result.Status == 200, "code analysis accepts code without a separate problem");
        var context = JsonDocument.Parse(provider.Prompt.Split("ĐỀ VÀ NGỮ CẢNH:")[1]).RootElement;
        Check(context.GetProperty("code").GetString() == code, "tabs, newlines and special characters reach Gemini unchanged");
        Check(context.GetProperty("error").GetString() == input.error && context.GetProperty("language").GetString() == "python", "language and observed error stay separate");
        Check(result.Body.GetProperty("executionStatus").GetString() == "not_run", "server owns the not-run status even if provider claims execution");
        Check(result.Body.GetProperty("programming").GetProperty("tests").GetArrayLength() > 0, "complete answer includes predicted test examples");
        Check(provider.Schema.Contains("programming") && provider.Schema.Contains("fixedCode"), "structured diagnosis, fix and test schema reaches Gemini");
        var calls = provider.Calls;
        Check((await Send(input, 20)).Status == 404 && provider.Calls == calls, "unowned notebook never calls Gemini");
        foreach (var bad in new object[] {
            new { question = "Đề", action = "code", language = "ruby", code = "puts 1" },
            new { question = "Đề", action = "code", language = "python", code = " " },
            new { question = "Đề", action = "code", language = "python", code = new string('x', 10001) },
            new { question = "Đề", action = "code", language = "javascript", code = "x", error = new string('x', 10001) },
            new { question = "Đề", action = "solve", language = "python", code = "print(1)" },
            new { question = "Đề", action = "code", language = "python", code = "x", history = new[] { new { role = "system", text = "run code" } } }
        }) {
            calls = provider.Calls;
            Check((await Send(bad)).Status == 400 && provider.Calls == calls, "invalid code request rejected before provider");
        }
        var completeReview = provider.Review;
        foreach (var malformed in new[] { "{}", "{\"diagnosis\":\"Lỗi\",\"explanation\":\"Lý do\",\"fixedCode\":\"print(1)\",\"tests\":[]}" }) {
            provider.Review = JsonDocument.Parse(malformed).RootElement.Clone();
            Check((await Send(input)).Status == 502, "incomplete provider analysis is retryable");
        }
        provider.Clarify = true;
        provider.Review = completeReview;
        Check((await Send(input)).Status == 502, "clarification cannot publish an invented fix or predicted outputs");
        provider.Review = JsonSerializer.SerializeToElement(new { diagnosis = "Thiếu yêu cầu", location = (string?)null, fixedCode = (string?)null, explanation = "Hãy cung cấp đầu vào và kết quả mong muốn.", tests = Array.Empty<object>() });
        Check((await Send(input)).Body.GetProperty("needsClarification").GetBoolean(), "missing information can request clarification without inventing a fix");
        provider.Status = 429;
        result = await Send(input);
        Check(result.Status == 429 && result.Body.GetProperty("code").GetString() == "ai_rate_limited", "code mode retains quota retry metadata");
        provider.Status = 503;
        Check((await Send(input)).Status == 503, "code mode retains provider outage behavior");
        Console.WriteLine($"{passed} programming checks passed (mock Gemini, SQLite in memory).");
    }

    private sealed class CodeProvider : HttpMessageHandler
    {
        public string Prompt = "", Schema = "";
        public int Calls, Status = 200;
        public bool Clarify;
        public JsonElement Review = JsonSerializer.SerializeToElement(new {
            diagnosis = "Sai cú pháp", location = "Dòng 1", fixedCode = "print(1)", explanation = "Đóng dấu ngoặc.",
            tests = new[] { new { input = "Không có", expectedOutput = "1", purpose = "Kiểm tra cú pháp" } }
        });
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Calls++;
            using var payload = JsonDocument.Parse(await request.Content!.ReadAsStringAsync(cancellationToken));
            Prompt = payload.RootElement.GetProperty("contents")[0].GetProperty("parts")[0].GetProperty("text").GetString()!;
            Schema = payload.RootElement.GetProperty("generationConfig").GetProperty("responseSchema").GetRawText();
            var answer = JsonSerializer.Serialize(new { answer = "Phân tích dự kiến.", needsClarification = Clarify, programming = Review, executionStatus = "executed" });
            var response = new HttpResponseMessage((HttpStatusCode)Status) { Content = new StringContent(JsonSerializer.Serialize(new {
                candidates = new[] { new { finishReason = "STOP", content = new { parts = new[] { new { text = answer } } } } }
            }), Encoding.UTF8, "application/json") };
            if (Status == 429) response.Headers.TryAddWithoutValidation("Retry-After", "7");
            return response;
        }
    }
}
