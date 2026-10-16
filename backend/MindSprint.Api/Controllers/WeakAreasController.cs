using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindSprint.Api.Services;

namespace MindSprint.Api.Controllers;

[Authorize, Route("api/weak-areas")]
public class WeakAreasController(WeakAreaService service) : ApiBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var areas = await service.GetWeakAreasAsync(UserId);
        return Ok(areas);
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze()
    {
        var result = await service.AnalyzeAndUpdateWeakAreasAsync(UserId);
        return Ok(result);
    }
}