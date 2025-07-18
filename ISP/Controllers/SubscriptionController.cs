using ISP.DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using ISP.Models;

namespace ISP.Controllers
{
    public class SubscriptionController : Controller
    {
        public readonly IRepository<Subscription> _repo;

        public SubscriptionController(IRepository<Subscription> repo)
        {
            _repo = repo;
        }

        [HttpGet("active/{userID:int}")]
        public ActionResult<IEnumerable<Subscription>> GetAllActive(int userID)
        {
            if(userID < 1)
            {
                return BadRequest("Invalid user ID.");
            }
            else if(userID == null)
            {
                return BadRequest("User ID cannot be null.");
            }
            var subscriptions = _repo.GetAll()
                .Where(s => s.users_id == userID && (s.end_date > DateTime.Now || s.end_date== null))
                .ToList();
            if (subscriptions.Count == 0) { 
                return NotFound("No active subscriptions found for this user.");
            }
            return Ok(subscriptions);
        }
    }

}
