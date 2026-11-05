using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using MindSprint.Api.Models;

namespace MindSprint.Api.Services;

/// <summary>Validate untrusted model and cached output before rendering or persistence.</summary>
public static class NotebookOutputValidation
{
    private static GeminiUnavailableException Invalid() => new("ai_invalid_response", "AI chưa tạo được kết quả hoặc trích dẫn hợp lệ. Bạn có thể thử lại.", 502);
    private static bool Text(string? value, int max) => !string.IsNullOrWhiteSpace(value) && value.Length <= max
        && !value.Any(c => char.IsControl(c) && c is not ('\n' or '\r' or '\t'));
    private static string Canonical(string value) => Regex.Replace(value.Normalize(NormalizationForm.FormC), @"\s+", " ").Trim();

    public static void Chat(ChatAnswer? answer, IReadOnlyList<NotebookSource> sources)
    {
        if (answer is null || !Text(answer.Answer, 20_000) || answer.Citations is null || answer.Citations.Count > 30) throw Invalid();
        foreach (var cite in answer.Citations)
        {
            if (cite is null || cite.Source < 1 || cite.Source > sources.Count) throw Invalid();
            var source = sources[cite.Source - 1];
            // Image-only originals have no verifiable text layer: cite the file without a purported quote.
            if (cite.Quote is null && string.IsNullOrWhiteSpace(source.Content) && source.FileBytes is { Length: > 0 }) continue;
            if (!Text(cite.Quote, 1000) || Canonical(cite.Quote!).Split(' ').Length >= 25
                || !Canonical(source.Content ?? "").Contains(Canonical(cite.Quote!), StringComparison.Ordinal)) throw Invalid();
        }
        foreach (Match marker in Regex.Matches(answer.Answer, @"\[(\d+)\]"))
            if (!int.TryParse(marker.Groups[1].Value, out var index) || !answer.Citations.Any(c => c.Source == index)) throw Invalid();
    }

    public static void Generation(JsonElement value, string type, int count)
    {
        try
        {
            if (value.GetRawText().Length > 200_000) throw Invalid();
            if (type == "mindmap") { var nodes = 0; Node(value, 1, ref nodes); return; }
            if (value.ValueKind != JsonValueKind.Array || value.GetArrayLength() != Math.Clamp(count, 3, 30)) throw Invalid();
            foreach (var item in value.EnumerateArray())
            {
                if (!Field(item, "question", 2000)) throw Invalid();
                if (type == "flashcards")
                {
                    if (!Field(item, "answer", 4000) || (item.TryGetProperty("example", out var example)
                        && example.ValueKind != JsonValueKind.Null && (example.ValueKind != JsonValueKind.String
                        || example.GetString()!.Length > 2000))) throw Invalid();
                }
                else if (type == "quiz")
                {
                    if (!Field(item, "explanation", 4000) || !item.TryGetProperty("options", out var options)
                        || options.ValueKind != JsonValueKind.Array || options.GetArrayLength() != 4
                        || options.EnumerateArray().Any(o => o.ValueKind != JsonValueKind.String || !Text(o.GetString(), 2000))
                        || options.EnumerateArray().Select(o => o.GetString()!.Trim()).Distinct(StringComparer.OrdinalIgnoreCase).Count() != 4
                        || !item.TryGetProperty("correctIndex", out var index) || !index.TryGetInt32(out var correct) || correct is < 0 or > 3) throw Invalid();
                }
                else throw new ArgumentException("Unsupported JSON generation type.");
            }
        }
        catch (InvalidOperationException e) when (e is not GeminiUnavailableException) { throw Invalid(); }
    }

    private static bool Field(JsonElement item, string key, int max) => item.ValueKind == JsonValueKind.Object
        && item.TryGetProperty(key, out var field) && field.ValueKind == JsonValueKind.String && Text(field.GetString(), max);

    private static void Node(JsonElement node, int depth, ref int total)
    {
        if (depth > 3 || ++total > 100 || !Field(node, "title", 100)
            || Canonical(node.GetProperty("title").GetString()!).Split(' ').Length >= 8) throw Invalid();
        if (!node.TryGetProperty("children", out var children)) return;
        if (children.ValueKind != JsonValueKind.Array || children.GetArrayLength() > 12) throw Invalid();
        foreach (var child in children.EnumerateArray()) Node(child, depth + 1, ref total);
    }
}
