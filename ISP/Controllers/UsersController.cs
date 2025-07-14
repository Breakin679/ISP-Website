using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("users")]
public class UsersController : ControllerBase
{
    private readonly IRepository<Users> _repo;
    public UsersController(IRepository<Users> repo) => _repo = repo;

    [HttpGet] public ActionResult<IEnumerable<Users>> GetAll() => Ok(_repo.GetAll());
    [HttpGet("{id:int}")]
    public ActionResult<Users> Get(int id)
        => _repo.GetById(id) is Users u ? Ok(u) : NotFound();

    [HttpPost]
    public ActionResult<long> Create(Users u)
        => CreatedAtAction(nameof(Get), new { id = _repo.Insert(u) }, u);

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Users u)
    {
        if (_repo.GetById(id) is null) return NotFound();
        u.id = id;
        return _repo.Update(u) ? NoContent() : StatusCode(500);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
