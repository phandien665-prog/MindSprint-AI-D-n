using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Controllers;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using TaskStatus = MindSprint.Api.Models.TaskStatus;

// Isolated SQLite database. Reopen DbContext to prove order is stored, not just tracked.
await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options;
var passed = 0;
void Check(bool value, string name) { if (!value) throw new Exception("FAIL " + name); passed++; Console.WriteLine("PASS " + name); }
TasksController Controller(AppDbContext db, int userId = 1) => new(db) {
    ControllerContext = new ControllerContext {HttpContext = new DefaultHttpContext {
        User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, userId.ToString())], "test"))
    }}
};
async Task Order(TaskStatus status, params int[] ids) {
    await using var db = new AppDbContext(options);
    var tasks = (IEnumerable<KanbanTask>)((OkObjectResult)await Controller(db).GetAll()).Value!;
    var column = tasks.Where(t => t.Status == status).ToArray();
    Check(column.Select(t=>t.Id).SequenceEqual(ids) && column.Select(t=>t.Position).SequenceEqual(Enumerable.Range(0,ids.Length)), "stored column order: " + string.Join(",",ids));
}
await using (var db = new AppDbContext(options)) {
    await db.Database.EnsureCreatedAsync();
    db.Users.AddRange(new User {Id=1, Email="owner@example.test"}, new User {Id=2, Email="other@example.test"});
    await db.SaveChangesAsync();
}
int a, b, c, d;
await using (var db = new AppDbContext(options)) {
    var api = Controller(db);
    async Task<int> Create(string title, TaskStatus status = TaskStatus.Todo) => ((KanbanTask)((OkObjectResult)await api.Create(new(title,"Description",null,"High",status))).Value!).Id;
    a=await Create("A"); b=await Create("B"); c=await Create("C"); d=await Create("D",TaskStatus.Doing);
    Check(await api.Move(c,new(TaskStatus.Todo,0)) is OkObjectResult, "move to start of same column");
}
await Order(TaskStatus.Todo,c,a,b);
await using (var db = new AppDbContext(options)) {await Controller(db).Move(c,new(TaskStatus.Todo,2));}
await Order(TaskStatus.Todo,a,b,c);
await using (var db = new AppDbContext(options)) {await Controller(db).Move(a,new(TaskStatus.Doing,0));}
await Order(TaskStatus.Todo,b,c); await Order(TaskStatus.Doing,a,d);
await using (var db = new AppDbContext(options)) {await Controller(db).Move(c,new(TaskStatus.Done,99));}
await Order(TaskStatus.Done,c); await Order(TaskStatus.Todo,b);
await using (var db = new AppDbContext(options)) {
    var api=Controller(db);
    Check(await api.Update(b,new("Edited","New description",new DateTime(2030,1,2),"Low",TaskStatus.Todo)) is OkObjectResult,"edit task");
    Check(await Controller(db,2).Move(b,new(TaskStatus.Done,0)) is NotFoundResult,"cannot move another account's task");
    Check(await Controller(db,2).Update(b,new("Forbidden",null,null)) is NotFoundResult,"cannot edit another account's task");
    Check(await Controller(db,2).Delete(b) is NotFoundResult,"cannot delete another account's task");
    Check(!((IEnumerable<KanbanTask>)((OkObjectResult)await Controller(db,2).GetAll()).Value!).Any(),"another account's list is empty");
    Check(await api.Move(b,new(TaskStatus.Todo,-1)) is BadRequestObjectResult,"reject negative position");
    Check(await api.Move(b,new((TaskStatus)9,0)) is BadRequestObjectResult,"reject invalid status");
    Check(await api.Create(new(" ",null,null)) is BadRequestObjectResult,"reject empty title");
}
await using (var db = new AppDbContext(options)) {
    var stored=await db.Tasks.SingleAsync(t=>t.Id==b);
    Check(stored.Title=="Edited" && stored.Priority=="Low" && stored.Description=="New description" && stored.DueDate==new DateTime(2030,1,2),"edits persist in a fresh context");
    Check(await Controller(db).Delete(a) is NoContentResult,"delete task");
}
await Order(TaskStatus.Doing,d);
await using (var db = new AppDbContext(options)) {Check(!await db.Tasks.AnyAsync(t=>t.Id==a),"deletion persists in a fresh context");}
Console.WriteLine($"{passed} Kanban checks passed.");
