using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace MindSprint.Api.Controllers;

[ApiController]
public abstract class ApiBase : ControllerBase
{
    protected int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
