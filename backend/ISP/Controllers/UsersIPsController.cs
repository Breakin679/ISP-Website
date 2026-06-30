using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("user-ips")]
public class UsersIPsController : ControllerBase
{
    private readonly IRepository<UsersIPs> _repo;
    public UsersIPsController(IRepository<UsersIPs> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<UsersIPs>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<UsersIPs> Get(int id)
        => _repo.GetById(id) is UsersIPs ui ? Ok(ui) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(UsersIPs ui)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(ui) }, ui);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, UsersIPs ui)
    {
        if (_repo.GetById(id) is null) return NotFound();
        ui.id = id;
        return _repo.Update(ui) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
