using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("coverage")]
public class CoverageController : ControllerBase
{
    private readonly IRepository<Coverage> _repo;
    public CoverageController(IRepository<Coverage> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<Coverage>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("locations")]
    public ActionResult GetAllLocations()
    {
        // 1️⃣ Fetch once
        var all = _repo.GetAll();

        // 2️⃣ Group & project to location strings
        var residential = all
            .Where(c => c.plan_type_id == 2)
            .Select(c => c.location)
            .Distinct()
            .ToList();

        var fiber = all
            .Where(c => c.plan_type_id == 1)
            .Select(c => c.location)
            .Distinct()
            .ToList();

        var corporate = all
            .Where(c => c.plan_type_id == 3)
            .Select(c => c.location)
            .Distinct()
            .ToList();

        // 3️⃣ Return a named JSON object
        return Ok(new
        {
            Residential = residential,
            Fiber = fiber,
            Corporate = corporate
        });
    }

    [HttpGet("{id:int}")]
    public ActionResult<Coverage> Get(int id)
        => _repo.GetById(id) is Coverage c ? Ok(c) : NotFound();
    [HttpGet("type/{planTypeId:int}")] public ActionResult<IEnumerable<Coverage>> GetByType(int planTypeId)
    {
        if (  planTypeId<1 || planTypeId>3) return BadRequest("type doesnt exist");
        var list = _repo
         .GetAll()
         .Where(c => c.plan_type_id == planTypeId)
         .ToList();
        return Ok(list); 
    }

    [HttpPost]
    public ActionResult<long> Create(Coverage cov)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(cov) }, cov);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Coverage cov)
    {
        if (_repo.GetById(id) is null) return NotFound();
        cov.id = id;
        return _repo.Update(cov) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
