using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("users")]
public class UsersController : ControllerBase
{
    private readonly IRepository<Users> _repo;
    public UsersController(IRepository<Users> repo) => _repo = repo;

    // GET /users
    [HttpGet]
    public ActionResult<IEnumerable<Users>> GetAll()
        => Ok(_repo.GetAll());

    // GET /users/{id}
    [HttpGet("{id:int}")]
    public ActionResult<Users> Get(int id)
        => _repo.GetById(id) is Users u ? Ok(u) : NotFound();

    // POST /users    (Sign‑Up)
    [HttpPost]
    public ActionResult<long> Create([FromBody] Signup nu)
    {
        var u = new Users { fn=nu.FirstName,ln=nu.LastName,role= "Customer", email = nu.Email, password_hash = nu.Password,phone_number=nu.Phone, created_at= DateTime.Now };
        var id = _repo.Insert(u);
        return CreatedAtAction(nameof(Get), new { id }, u);
    }

    // POST /users/login  (Login)
    [HttpPost("login")]
    public ActionResult<Users> Login([FromBody] Login creds)
    {
        if (creds == null
            || string.IsNullOrWhiteSpace(creds.Email)
            || string.IsNullOrWhiteSpace(creds.Password))
        {
            return BadRequest("Email and password required.");
        }

        // Find matching user by email+password
        var user = _repo
            .GetAll()
            .FirstOrDefault(u =>
                u.email == creds.Email &&
                u.password_hash == creds.Password);

        if (user == null)
            return Unauthorized("Invalid credentials.");

        // Remove password before returning
        user.password_hash = null;
        return Ok(user);
    }

    // PUT /users/{id}
    [HttpPut("{id:int}")]
    public IActionResult Update(int id, Users u)
    {
        if (_repo.GetById(id) is null) return NotFound();
        u.id = id;
        return _repo.Update(u) ? NoContent() : StatusCode(500);
    }

    // DELETE /users/{id}
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
        => _repo.Delete(id) ? NoContent() : NotFound();
}
