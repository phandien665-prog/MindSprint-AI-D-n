using System.Net;
using System.Security.Claims;
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
using MindSprint.Api.Migrations;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using UglyToad.PdfPig.Writer;

internal static class SharedSourceChecks
{
    public static async Task Live(string imagePath)
    {
        var apiDir=Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,"../../../../MindSprint.Api"));
        var cfg=new ConfigurationBuilder().AddJsonFile(Path.Combine(apiDir,"appsettings.json"))
            .AddJsonFile(Path.Combine(apiDir,"appsettings.Development.json"),optional:true).AddEnvironmentVariables()
            .AddInMemoryCollection(new Dictionary<string,string?> { ["Gemini:MaxRetries"]="0",["Gemini:AttemptTimeoutSeconds"]="45",["Gemini:TotalTimeoutSeconds"]="90" }).Build();
        var gemini=new GeminiService(new HttpClient {Timeout=Timeout.InfiniteTimeSpan},cfg,new GeminiAvailability(cfg),NullLogger<GeminiService>.Instance,new HttpContextAccessor());
        await using var connection=new SqliteConnection("Data Source=:memory:"); await connection.OpenAsync();
        await using var db=new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options); await db.Database.EnsureCreatedAsync();
        db.Users.Add(new User {Id=1,Email="live-shared@example.test",DisplayName="Test",PasswordHash="test"});
        db.Notebooks.Add(new Notebook {Id=10,UserId=1,Title="Synthetic"}); await db.SaveChangesAsync();
        using var renderer=new NotebookPageRenderer();
        var caller=new ControllerContext {HttpContext=new DefaultHttpContext {User=new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier,"1")],"test"))}};
        var controller=new NotebooksController(db,new NotebookAi(db,gemini),new Factory(new Provider()),new NotebookUrlImporter(renderer)) {ControllerContext=caller};
        var bytes=await System.IO.File.ReadAllBytesAsync(imagePath);
        var pdfBuilder=new PdfDocumentBuilder(); pdfBuilder.AddPage(595,842).AddPng(bytes,new UglyToad.PdfPig.Core.PdfRectangle(20,350,575,820));
        foreach(var (data,name) in new[]{(bytes,"Anh-bai-tap.png"),(pdfBuilder.Build(),"PDF-bai-tap.pdf")}) {
            var uploaded=await controller.AddFile(10,new FormFile(new MemoryStream(data),0,data.Length,"file",name));
            if(uploaded is not OkObjectResult) throw new Exception("FAIL live source upload");
        }
        db.ChangeTracker.Clear();
        var answered=await controller.Chat(10,new("Trong nguồn 1, câu 2 yêu cầu tính biểu thức A nào?",[]));
        if(answered is not OkObjectResult {Value: ChatAnswer chat} || !chat.Answer.Contains("frac") || !chat.Answer.Contains("sqrt") || chat.Citations?.Any(c=>c.Source==1)!=true)
            throw new Exception("FAIL live grounded reading/citation from shared source");
        Console.WriteLine("PASS live Theo nguồn: saved image/PDF read after reload, fraction/root retained with source citation");
        var tutor=new TutorController(db,new TutorService(gemini)) {ControllerContext=caller};
        var solved=await tutor.Solve(10,new("Giải câu 2 trong nguồn Anh-bai-tap, tính A.","brief"));
        if(solved is not OkObjectResult {Value: TutorReply reply} || reply.NeedsClarification || !Regex.IsMatch(reply.Answer,@"2[,.]5|\\frac\s*\{5\}\s*\{2\}|5\s*/\s*2"))
            throw new Exception("FAIL live tutor shared source answer");
        Console.WriteLine("PASS live Gia sư: same saved sources produce A = 5/2 without re-uploading");
    }

    public static async Task Run()
    {
        var passed=0;
        void Check(bool ok,string name) {if(!ok) throw new Exception("FAIL shared source "+name); passed++; Console.WriteLine("PASS shared source "+name);}
        static int Status(IActionResult r)=>r is ObjectResult o ? o.StatusCode??200 : ((StatusCodeResult)r).StatusCode;
        static IFormFile File(byte[] bytes,string name)=>new FormFile(new MemoryStream(bytes),0,bytes.Length,"file",name);
        var cfg=new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string,string?> { ["Gemini:ApiKey"]="test-only",["Gemini:Model"]="test",["Gemini:MaxRetries"]="0" }).Build();
        var provider=new Provider();
        var gemini=new GeminiService(new HttpClient(provider),cfg,new GeminiAvailability(cfg),NullLogger<GeminiService>.Instance,new HttpContextAccessor());
        await using var connection=new SqliteConnection("Data Source=:memory:"); await connection.OpenAsync();
        await using var db=new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options); await db.Database.EnsureCreatedAsync();
        db.Users.Add(new User {Id=1,Email="source@example.test",DisplayName="Source",PasswordHash="test"});
        db.Notebooks.Add(new Notebook {Id=10,UserId=1,Title="Sources"}); await db.SaveChangesAsync();
        using var renderer=new NotebookPageRenderer();
        var caller=new ControllerContext {HttpContext=new DefaultHttpContext {User=new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier,"1")],"test"))}};
        var controller=new NotebooksController(db,new NotebookAi(db,gemini),new Factory(provider),new NotebookUrlImporter(renderer)) {ControllerContext=caller};
        var png=Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN5kAAAAASUVORK5CYII=");
        var result=await controller.AddFile(10,File(png,"de.png"));
        Check(Status(result)==200 && provider.Calls==0,"image saved without OCR/solving");
        db.ChangeTracker.Clear();
        var image=await db.NotebookSources.SingleAsync();
        Check(image.FileBytes!.SequenceEqual(png) && image.FileMediaType=="image/png" && image.Content=="","original image survives database reload without text echo");
        var metadata=JsonSerializer.Serialize(((OkObjectResult)await controller.Sources(10)).Value);
        Check(metadata.Contains("hasFile") && !metadata.Contains("FileBytes") && !metadata.Contains(Convert.ToBase64String(png)),"source list returns metadata without binary contents");
        var pdfBuilder=new PdfDocumentBuilder(); pdfBuilder.AddPage(595,842); var pdf=pdfBuilder.Build();
        Check(Status(await controller.AddFile(10,File(pdf,"scan.pdf")))==200 && provider.Calls==0,"scan PDF saved even without text layer");
        Check(Status(await controller.Chat(10,new("Đọc câu 1 trong ảnh",[])))==200 && provider.Binaries.SequenceEqual(new[]{Convert.ToBase64String(png),Convert.ToBase64String(pdf)}),"source chat reads both original files");
        Check(provider.Labels[0].Contains("S1") && provider.Labels[0].Contains("de") && provider.Labels[1].Contains("S2") && provider.Labels[1].Contains("scan"),"citation labels match source order");
        var chatCalls=provider.Calls;
        Check(Status(await controller.Chat(10,new("Đọc câu 1 trong ảnh",[])))==200 && provider.Calls==chatCalls,"unchanged image/PDF sources reuse cached chat");
        image.FileBytes=[..png,0]; await db.SaveChangesAsync();
        Check(Status(await controller.Chat(10,new("Đọc câu 1 trong ảnh",[])))==200 && provider.Calls==chatCalls+1 && provider.Binaries[0]==Convert.ToBase64String(image.FileBytes),"changing only image bytes invalidates cached chat");
        image.FileBytes=png; await db.SaveChangesAsync();
        var tutor=new TutorController(db,new TutorService(gemini)) {ControllerContext=caller};
        Check(Status(await tutor.Solve(10,new("Giải câu 1")))==200 && provider.Binaries.Count==2,"tutor uses the same saved sources without uploading again");
        Check(Status(await tutor.Solve(10,new("Câu 1",Action:"hint",HintLevel:1)))==200 && provider.Binaries.Count==2 && provider.Prompt.Contains("KIỂM ĐỊNH"),"independent hint review reads shared originals");
        Check(Status(await controller.Suggestions(10))==200 && provider.Binaries.Count==2,"suggestions read image/PDF sources");
        Check(Status(await controller.Generate(10,new("summary",null)))==200 && provider.Binaries.Count==2,"Studio text output uses shared files");
        var generationCalls=provider.Calls;
        Check(Status(await controller.Generate(10,new("summary",null)))==200 && provider.Calls==generationCalls,"unchanged image/PDF sources reuse cached generation");
        var pdfSource=await db.NotebookSources.SingleAsync(s=>s.Type=="pdf");
        pdfSource.FileBytes=[..pdf,0]; await db.SaveChangesAsync();
        Check(Status(await controller.Generate(10,new("summary",null)))==200 && provider.Calls==generationCalls+1 && provider.Binaries[1]==Convert.ToBase64String(pdfSource.FileBytes),"changing only PDF bytes invalidates cached generation");
        pdfSource.FileBytes=pdf; await db.SaveChangesAsync();
        Check(Status(await controller.Generate(10,new("quiz",null)))==200 && provider.Binaries.Count==2,"Studio JSON output uses shared files");
        var calls=provider.Calls;
        Check(Status(await controller.Chat(999,new("Câu 1",[])))==404 && Status(await tutor.Solve(999,new("Câu 1")))==404 && Status(await controller.AddFile(999,File(png,"x.png")))==404 && provider.Calls==calls,"foreign/missing notebook never reaches saved files or AI");
        db.Notebooks.Add(new Notebook {Id=20,UserId=1,Title="Empty"}); await db.SaveChangesAsync();
        Check(Status(await tutor.Solve(20,new("Bài khác")))==200 && provider.Binaries.Count==0,"another notebook cannot inherit files");
        Check(Status(await controller.DeleteSource(10,image.Id))==204,"deleting source removes saved image");
        await controller.Chat(10,new("Đọc PDF",[]));
        Check(provider.Binaries.SequenceEqual(new[]{Convert.ToBase64String(pdf)}) && provider.Labels.Single().Contains("S1"),"deleted image not sent and citations renumbered");
        foreach(var invalid in new[]{File([],"empty.png"),File(new byte[]{1,2,3},"fake.png"),File(png,"a.exe"),File(new byte[TutorFileReader.MaxFileBytes+1],"large.png")})
            Check(Status(await controller.AddFile(10,invalid))==400,"invalid upload rejected: "+invalid.FileName);
        Check(Status(await controller.AddText(10,new("large",new string('a',200001))))==400,"source text cannot silently truncate");
        var savedPdf=await db.NotebookSources.SingleAsync(); savedPdf.FileBytes=new byte[GeminiService.MaxAttachmentBytes]; await db.SaveChangesAsync();
        Check(Status(await controller.AddFile(10,File(png,"overflow.png")))==400 && await db.NotebookSources.CountAsync()==1,"combined file budget enforced without partial save");
        savedPdf.FileBytes=pdf; await db.SaveChangesAsync();
        await controller.AddText(10,new("Legacy text","A legacy text source remains usable."));
        await controller.Chat(10,new("Nội dung là gì?",[]));
        Check(provider.Binaries.Count==1 && provider.Prompt.Contains("legacy text"),"legacy text and binary sources coexist");
        provider.Citation=99;
        Check(Status(await controller.Chat(10,new("Câu 1",[])))==502,"invalid source references rejected");
        var migration=new AddNotebookSourceFiles();
        Check(migration.UpOperations.Count==2 && migration.UpOperations.All(op=>op is AddColumnOperation {IsNullable:true}),"migration only adds nullable columns, keeps existing sources");
        Check(migration.UpOperations.Cast<AddColumnOperation>().All(op=>op.ColumnType is "bytea" or "text"),"source migration uses PostgreSQL column types");
        db.Users.Add(new User {Id=2,Email="private@example.test",DisplayName="Private",PasswordHash="test"});
        db.Notebooks.Add(new Notebook {Id=30,UserId=2,Title="Private"});
        db.NotebookSources.Add(new NotebookSource {NotebookId=30,Title="Private image",Type="image",FileBytes=png,FileMediaType="image/png"}); await db.SaveChangesAsync();
        calls=provider.Calls;
        Check(Status(await controller.Sources(30))==404 && Status(await controller.Chat(30,new("Đọc ảnh",[])))==404 && Status(await tutor.Solve(30,new("Giải bài")))==404 && provider.Calls==calls,"another account cannot list or read saved original files");
        using var sqlDb=new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseNpgsql("Host=localhost;Database=QueryTranslationOnly;Username=test;Password=test").Options);
        var quotaSql=sqlDb.NotebookSources.Where(s=>s.NotebookId==10).GroupBy(s=>s.NotebookId)
            .Select(group=>group.Sum(s=>(long)(s.FileBytes==null?0:s.FileBytes.Length))).ToQueryString();
        Check(quotaSql.Contains("length") && quotaSql.Contains("FileBytes"),"PostgreSQL translates binary size quota without loading file bytes");
        Check(sqlDb.Database.GetMigrations().Any(id=>id.EndsWith("AddNotebookSourceFiles")) && sqlDb.Database.GetMigrations().All(id=>!id.Contains("AddRefreshTokens") && !id.Contains("AddFlashcardVersioning") && !id.Contains("AddStudyStats")),"PostgreSQL assembly excludes historical SQL Server migrations");
        Console.WriteLine($"Shared sources: {passed}/{passed} checks passed");
    }
    private sealed class Provider : HttpMessageHandler
    {
        public int Calls,Citation=1; public string Prompt=""; public List<string> Binaries=[],Labels=[];
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,CancellationToken token)
        {
            Calls++;
            using var doc=JsonDocument.Parse(await request.Content!.ReadAsStringAsync(token));
            var parts=doc.RootElement.GetProperty("contents")[0].GetProperty("parts"); Prompt=parts[0].GetProperty("text").GetString()!;
            Binaries=parts.EnumerateArray().Where(p=>p.TryGetProperty("inlineData",out _)).Select(p=>p.GetProperty("inlineData").GetProperty("data").GetString()!).ToList();
            Labels=parts.EnumerateArray().Skip(1).Where(p=>p.TryGetProperty("text",out _)).Select(p=>p.GetProperty("text").GetString()!).ToList();
            var answer=Prompt.Contains("KIỂM ĐỊNH") ? "{\"isSafe\":true}" : Prompt.Contains("Đề xuất 5") ? "[\"Câu 1\"]" : JsonSerializer.Serialize(new {answer="$x=4$ [1]",needsClarification=false,revealsAnswer=false,citations=new[]{new {source=Citation,quote="2x+3=11"}}});
            var body=new {candidates=new[] {new {finishReason="STOP",content=new {parts=new[] {new {text=answer}}}}}};
            return new HttpResponseMessage(HttpStatusCode.OK) {Content=new StringContent(JsonSerializer.Serialize(body))};
        }
    }
    private sealed class Factory(Provider provider) : IHttpClientFactory {public HttpClient CreateClient(string name)=>new(provider);}
}
