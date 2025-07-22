using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

[ApiController]
[Route("subscriptions")]
public class SubscriptionController : ControllerBase
{
    private readonly IRepository<Subscription> _subRepo;
    private readonly IRepository<SubscriptionUser> _subUserRepo;
    private readonly IRepository<Plan> _planRepo;
    private readonly IRepository<Server> _serverRepo;
    private readonly ILogger<SubscriptionController> _logger;

    public SubscriptionController(
        IRepository<Subscription> subRepo,
        IRepository<SubscriptionUser> subUserRepo,
        IRepository<Plan> planRepo,
        IRepository<Server> serverRepo,
        ILogger<SubscriptionController> logger)
    {
        _subRepo = subRepo;
        _subUserRepo = subUserRepo;
        _planRepo = planRepo;
        _serverRepo = serverRepo;
        _logger = logger;
    }

    // GET /subscriptions/active/{userId}
    [HttpGet("active/{userId:long}")]
    public ActionResult GetActive(long userId)
    {
        // 1) find all subscription-user links for this user
        var links = _subUserRepo.GetAll()
                    .Where(su => su.user_id == userId)
                    .Select(su => su.subscription_id);

        // 2) load subs
        var views = links
            .Select(id => _subRepo.GetById((int)id))
            .Where(s => s != null && (s.end_date == null || s.end_date > DateTime.UtcNow))
            .Select(s => {
                var plan = _planRepo.GetById((int)s.plan_id);
                var srv = _serverRepo.GetById(s.server_id   );
                return new SubscriptionView
                {
                    SubscriptionId = s.id,
                    StartDate = s.start_date,
                    EndDate = s.end_date,
                    PlanId = plan.id,
                    PlanName = plan.name,
                    PlanDesc = plan.description_plan,
                    PlanPrice = plan.price,
                    ServerId = srv.id,
                    Location = srv.location
                };
            })
            .ToList();

        if (!views.Any()) return NotFound();
        return Ok(views);
    }

    // POST /subscriptions
    [HttpPost]
    public ActionResult Add([FromBody] AddSubscriptionModel m)
    {
        // 1) insert subscription
        var sub = new Subscription
        {
            plan_id = m.PlanId,
            server_id = m.ServerId,
            start_date = DateTime.UtcNow
        };
        var newId = _subRepo.Insert(sub);
        sub.id = (int)newId;

        // 2) insert link
        var link = new SubscriptionUser
        {
            subscription_id = newId,
            user_id = m.UserId,
            is_primary = true,
            added_at = DateTime.UtcNow
        };
        _subUserRepo.Insert(link);

        // 3) return SubscriptionView
        var plan = _planRepo.GetById((int)m.PlanId);
        var srv = _serverRepo.GetById(m.ServerId);
        var view = new SubscriptionView
        {
            SubscriptionId = (int)newId,
            StartDate = sub.start_date,
            EndDate = sub.end_date,
            PlanId = plan.id,
            PlanName = plan.name,
            PlanDesc = plan.description_plan,
            PlanPrice = plan.price,
            ServerId = srv.id,
            Location = srv.location
        };
        return CreatedAtAction(nameof(GetActive),
            new { userId = m.UserId }, view);
    }

    // DELETE /subscriptions/{id}
    [HttpDelete("{id:long}")]
    public IActionResult Remove(long id)
    {
        // 1) delete all subscription-user links
        var links = _subUserRepo.GetAll()
                      .Where(su => su.subscription_id == id)
                      .ToList();
        foreach (var su in links)
            _subUserRepo.Delete((int)su.subscription_id /*timestamp?*/);

        // 2) soft‑end subscription
        var sub = _subRepo.GetById((int)id);
        if (sub == null) return NotFound();
        sub.end_date = DateTime.UtcNow;
        _subRepo.Update(sub);
        return NoContent();
    }
}
