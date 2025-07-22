// ISP/Controllers/PlansController.cs
using ISP.DataAccess.Interfaces;
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
    private readonly IRepository<Plan> _repo;
    public PlansController(IRepository<Plan> repo,
        ILogger<PlansController> logger,
        IPlansService plansService)
    {
        _repo = repo;
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

    [HttpGet("types")]
    public ActionResult<IEnumerable<Plan>> GetPlanTypes()
    {
        var types = _repo.GetAll();
        return Ok(types);
    }
    [HttpPost]
    public ActionResult<long> Create([FromBody] Plan newPlan)
    {
        if (!ModelState.IsValid)
            return BadRequest("Invalid input");

       return CreatedAtAction(nameof(GetById), new { id = _repo.Insert(newPlan) }, newPlan);
    }
    [HttpDelete("{id:int}")]
    public ActionResult Delete(int id)
    {
        var plan = _repo.GetById(id);
        if (plan is null) return NotFound();
        
        _repo.Delete(id);
        return NoContent();
    }
    [HttpPut("{id:int}")]
    public ActionResult Update(int id, [FromBody] Plan updatedPlan)
    {
        if (!ModelState.IsValid)
            return BadRequest("Invalid input");
        var existingPlan = _repo.GetById(id);
        if (existingPlan is null) return NotFound();
        updatedPlan.id = id; // Ensure the ID matches
        if (!_repo.Update(updatedPlan))
            return StatusCode(500, "Update failed");
        return NoContent();
    }
}
