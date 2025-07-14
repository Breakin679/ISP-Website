using Microsoft.AspNetCore.Mvc;

namespace ISP.Controllers
{
    public class SubscriptionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
