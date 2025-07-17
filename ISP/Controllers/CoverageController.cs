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
