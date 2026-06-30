using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("pending-requests")]
public class PendingRequestsController : ControllerBase
{
    private readonly IRepository<Pending_Requests> _repo;
    public PendingRequestsController(IRepository<Pending_Requests> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<Pending_Requests>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<Pending_Requests> Get(int id)
        => _repo.GetById(id) is Pending_Requests pr ? Ok(pr) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(Pending_Requests pr)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(pr) }, pr);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Pending_Requests pr)
    {
        if (_repo.GetById(id) is null) return NotFound();
        pr.id = id;
        return _repo.Update(pr) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
