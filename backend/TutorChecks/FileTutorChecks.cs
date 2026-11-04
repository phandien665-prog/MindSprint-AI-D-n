using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
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
using UglyToad.PdfPig.Writer;

internal static class FileTutorChecks
{
    public static async Task Live(string imagePath)
    {
        var apiDir=Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,"../../../../MindSprint.Api"));
        var cfg=new ConfigurationBuilder().AddJsonFile(Path.Combine(apiDir,"appsettings.json"))
            .AddJsonFile(Path.Combine(apiDir,"appsettings.Development.json"),optional:true).AddEnvironmentVariables()
            .AddInMemoryCollection(new Dictionary<string,string?> { ["Gemini:MaxRetries"]="0", ["Gemini:AttemptTimeoutSeconds"]="45", ["Gemini:TotalTimeoutSeconds"]="90" }).Build();
        var service=new TutorService(new GeminiService(new HttpClient {Timeout=Timeout.InfiniteTimeSpan},cfg,new GeminiAvailability(cfg),NullLogger<GeminiService>.Instance,new HttpContextAccessor()));
        var bytes=await System.IO.File.ReadAllBytesAsync(imagePath);
        var builder=new PdfDocumentBuilder(); builder.AddPage(595,842).AddPng(bytes,new UglyToad.PdfPig.Core.PdfRectangle(20,350,575,820));
        var samples=new List<(byte[] Bytes,string Mime)> { (bytes,"image/png"),(builder.Build(),"application/pdf") };
        foreach(var (ext,mime) in new[]{(".jpg","image/jpeg"),(".webp","image/webp")}) {
            var path=Path.ChangeExtension(imagePath,ext);
            if(System.IO.File.Exists(path)) samples.Add((await System.IO.File.ReadAllBytesAsync(path),mime));
        }
        foreach(var (data,mime) in samples) {
            var reply=await service.SolveAsync(new("Giải câu 2, tính A. Không cần viết biểu thức x².","brief"),file:new(data,mime,1));
            if(reply.NeedsClarification || !Regex.IsMatch(reply.Answer,@"2[,.]5|\\frac\s*\{5\}\s*\{2\}|5\s*/\s*2"))
                throw new Exception("FAIL live direct file answer " + mime);
            Console.WriteLine("PASS live direct " + mime + ": reads fraction/root and returns A = 5/2 with valid math JSON");
        }
        var typed=await service.SolveAsync(new("Tính đạo hàm f(x)=x^3-3x^2+1.","brief"));
        if(typed.NeedsClarification || !typed.Answer.Contains('6') || !typed.Answer.Contains('3') || typed.Answer.Any(c=>char.IsControl(c)&&c is not ('\n' or '\r' or '\t')))
            throw new Exception("FAIL live typed polynomial JSON");
        Console.WriteLine("PASS live typed polynomial: valid Markdown/LaTeX JSON");
    }

    public static async Task Run()
    {
        var passed = 0;
        void Check(bool ok, string name) { if (!ok) throw new Exception("FAIL file tutor " + name); passed++; Console.WriteLine("PASS file tutor " + name); }
        static int Status(IActionResult result) => result is ObjectResult o ? o.StatusCode ?? 200 : ((StatusCodeResult)result).StatusCode;
        var cfg = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string,string?> { ["Gemini:ApiKey"]="test-only", ["Gemini:Model"]="test", ["Gemini:MaxRetries"]="0" }).Build();
        var provider = new Provider();
        var service = new TutorService(new GeminiService(new HttpClient(provider), cfg, new GeminiAvailability(cfg), NullLogger<GeminiService>.Instance, new HttpContextAccessor()));
        await using var connection = new SqliteConnection("Data Source=:memory:"); await connection.OpenAsync();
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options); await db.Database.EnsureCreatedAsync();
        db.Users.Add(new User {Id=1,Email="file@example.test",DisplayName="File",PasswordHash="test"});
        db.Notebooks.Add(new Notebook {Id=10,UserId=1,Title="File"}); await db.SaveChangesAsync();
        var controller = new TutorController(db,service) {ControllerContext=new ControllerContext {HttpContext=new DefaultHttpContext {User=new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier,"1")],"test"))}}};
        static IFormFile File(byte[] bytes,string name)=>new FormFile(new MemoryStream(bytes),0,bytes.Length,"file",name);
        var png=Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN5kAAAAASUVORK5CYII=");
        var request=JsonSerializer.Serialize(new TutorRequest("Giải câu 1"));
        Check(Status(await controller.SolveFile(999,File(png,"a.png"),request))==404 && provider.Calls==0,"ownership checked before AI");
        foreach(var bad in new[]{"not-json","null",JsonSerializer.Serialize(new TutorRequest("")),JsonSerializer.Serialize(new TutorRequest("Câu 1",Action:"check"))})
            Check(Status(await controller.SolveFile(10,File(png,"a.png"),bad))==400 && provider.Calls==0,"invalid question rejected before AI");
        Check(Status(await controller.SolveFile(10,File(Encoding.UTF8.GetBytes("fake"),"a.png"),request))==400 && provider.Calls==0,"invalid file rejected");
        var result=await controller.SolveFile(10,File(png,"a.png"),request);
        Check(Status(result)==200 && ((TutorReply)((OkObjectResult)result).Value!).Answer.Contains("\\frac"),"LaTeX answer preserved");
        Check(provider.Inline.GetProperty("mimeType").GetString()=="image/png" && provider.Inline.GetProperty("data").GetString()==Convert.ToBase64String(png),"original image sent with short question");
        Check(provider.Prompt.Contains("Giải câu 1") && provider.Prompt.Contains("Không chép lại toàn bộ tài liệu") && provider.HasSchema,"no OCR echo and structured solver output");
        var builder=new PdfDocumentBuilder(); builder.AddPage(595,842);
        var pdf=builder.Build();
        Check(Status(await controller.SolveFile(10,File(pdf,"scan.pdf"),request))==200 && provider.Inline.GetProperty("data").GetString()==Convert.ToBase64String(pdf),"PDF goes to vision intact, even without text layer");
        foreach(var ext in new[]{"txt","md","csv"}) {
            Check(Status(await controller.SolveFile(10,File(Encoding.UTF8.GetBytes("Câu 1: x² + 2 = 11"),"a."+ext),request))==200 && provider.Text.Contains("x²"),"UTF-8 "+ext+" retains mathematical symbols");
        }
        Check(!await db.NotebookSources.AnyAsync() && !await db.NotebookNotes.AnyAsync(),"attachments not stored as sources or notes");
        provider.Answer=JsonSerializer.Serialize(new TutorReply("Dùng phép biến đổi tương đương.",false,RevealsAnswer:false));
        var calls=provider.Calls;
        Check(Status(await controller.SolveFile(10,File(png,"hint.png"),JsonSerializer.Serialize(new TutorRequest("Câu 1",Action:"hint",HintLevel:1))))==200 && provider.Calls==calls+2 && provider.ReviewReadsFile==1,"hint safety review sees the original attachment");
        provider.Answer=JsonSerializer.Serialize(new TutorReply("$"+'\f'+"rac{1}{2}$",false));
        Check(Status(await controller.SolveFile(10,File(png,"bad-math.png"),request))==502,"bad LaTeX control characters rejected instead of displayed");
        provider.Answer="{\"answer\":\"Công thức trong ảnh mờ, bạn thay ảnh rõ hơn nhé.\",\"needsClarification\":true}";
        result=await controller.SolveFile(10,File(png,"blur.png"),request);
        Check(Status(result)==200 && ((TutorReply)((OkObjectResult)result).Value!).NeedsClarification,"unreadable formula requests clarification");
        provider.Finish="MAX_TOKENS";
        Check(Status(await controller.SolveFile(10,File(png,"cut.png"),request))==422,"truncated file answer not published");
        Console.WriteLine($"File tutor: {passed}/{passed} checks passed");
    }

    private sealed class Provider : HttpMessageHandler
    {
        public int Calls,ReviewReadsFile; public string Prompt="",Text="",Finish="STOP";
        public string Answer=JsonSerializer.Serialize(new TutorReply("$\\frac{1}{2}+\\sqrt{4}$",false));
        public JsonElement Inline; public bool HasSchema;
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,CancellationToken token)
        {
            Calls++; using var doc=JsonDocument.Parse(await request.Content!.ReadAsStringAsync(token));
            var parts=doc.RootElement.GetProperty("contents")[0].GetProperty("parts"); Prompt=parts[0].GetProperty("text").GetString()!;
            if(parts[1].TryGetProperty("inlineData",out var inline)) Inline=inline.Clone();
            else Text=parts[1].GetProperty("text").GetString()!;
            HasSchema=doc.RootElement.GetProperty("generationConfig").TryGetProperty("responseSchema",out _);
            var review=Prompt.Contains("KIỂM ĐỊNH GỢI Ý"); if(review) ReviewReadsFile++;
            return new(HttpStatusCode.OK) {Content=new StringContent(JsonSerializer.Serialize(new {candidates=new[]{new {finishReason=Finish,content=new {parts=new[]{new {text=review?"{\"isSafe\":true}":Answer}}}}}}))};
        }
    }
}
