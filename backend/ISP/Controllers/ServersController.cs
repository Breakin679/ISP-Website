using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("servers")]
public class ServersController : ControllerBase
{
    private readonly IRepository<Servers> _repo;
    public ServersController(IRepository<Servers> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<Servers>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<Servers> Get(int id)
        => _repo.GetById(id) is Servers s ? Ok(s) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(Servers s)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(s) }, s);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Servers s)
    {
        if (_repo.GetById(id) is null) return NotFound();
        s.id = id;
        return _repo.Update(s) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
