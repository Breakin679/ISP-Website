// ISP/Controllers/PlansController.cs
using ISP.Models;
using ISP.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

[ApiController]
[Route("plans")]
public class PlansController : ControllerBase
{
    private readonly ILogger<PlansController> _logger;
    private readonly IPlansService _plansService;

    public PlansController(
        ILogger<PlansController> logger,
        IPlansService plansService)
    {
        _logger = logger;
        _plansService = plansService;
    }

    [HttpGet("available")]
    public ActionResult<IEnumerable<Plan>> GetAvailablePlans()
        => Ok(_plansService.GetAvailablePlans());

    [HttpGet("{id:int}")]
    public ActionResult<Plan> GetById(int id)
    {
        var plan = _plansService.GetPlanById(id);
        if (plan is null) return NotFound();
        return Ok(plan);
    }

    [HttpGet("type/{typeId:int}")]
    public ActionResult<IEnumerable<Plan>> GetByType(int typeId)
        => Ok(_plansService.GetPlansByType(typeId));
}
