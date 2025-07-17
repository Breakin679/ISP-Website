using System;
using System.Collections.Generic;
using System.Linq;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using ISP.Services;


namespace ISP.Controllers
{
    [ApiController]
    [Route("users")]
    public class UsersController : ControllerBase
    {
        private readonly IRepository<Users> _repo;

        public UsersController(IRepository<Users> repo)
        {
            _repo = repo;
        }

        // GET /users
        [HttpGet]
        public ActionResult<IEnumerable<Users>> GetAll()
        {
            var all = _repo.GetAll().ToList();
            // strip hashes
            all.ForEach(u => u.password_hash = null);
            return Ok(all);
        }

        // GET /users/{id}
        [HttpGet("{id:int}")]
        public ActionResult<Users> Get(int id)
        {
            var u = _repo.GetById(id);
            if (u == null) return NotFound();
            u.password_hash = null;
            return Ok(u);
        }

        // POST /users   (Sign‑Up)
        [HttpPost]
        public ActionResult<long> Create([FromBody] Signup nu)
        {
            if (nu == null ||
                string.IsNullOrWhiteSpace(nu.Email) ||
                string.IsNullOrWhiteSpace(nu.Password))
            {
                return BadRequest("Email and password required.");
            }

            // hash the password
            var hashed = Hashfunction.ComputeSha1(nu.Password.Trim());

            var u = new Users
            {
                fn = nu.FirstName,
                ln = nu.LastName,
                role = "Customer",
                email = nu.Email,
                password_hash = hashed,
                phone_number = nu.Phone,
                created_at = DateTime.UtcNow
            };

            var newId = _repo.Insert(u);
            u.id = (int)newId;
            u.password_hash = null;  // don't return hash

            return CreatedAtAction(nameof(Get), new { id = newId }, u);
        }

        // POST /users/login  (Login)
        [HttpPost("login")]
        public ActionResult<Users> Login([FromBody] Login creds)
        {
            if (creds == null ||
                string.IsNullOrWhiteSpace(creds.Email) ||
                string.IsNullOrWhiteSpace(creds.Password))
            {
                return BadRequest("Email and password required.");
            }

            // lookup user by email
            var user = _repo
                .GetAll()
                .FirstOrDefault(u => u.email == creds.Email && u.password_hash==Hashfunction.ComputeSha1(creds.Password));

            if (user == null)
                return Unauthorized("Invalid credentials.");

            // verify password
            

            // success: strip hash and return
            user.password_hash = null;
            return Ok(user);
        }

        // PUT /users/{id}
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, Users u)
        {
            if (_repo.GetById(id) == null) return NotFound();
            u.id = id;
            // if updating password, remember to hash it first:
            if (!string.IsNullOrWhiteSpace(u.password_hash))
            {
                u.password_hash = Hashfunction.ComputeSha1(u.password_hash);
            }
            return _repo.Update(u) ? NoContent() : StatusCode(500);
        }

        // DELETE /users/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
            => _repo.Delete(id) ? NoContent() : NotFound();
    }
}
