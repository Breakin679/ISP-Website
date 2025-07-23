using ISP.DataAccess.Interfaces;
using ISP.Models;
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
    private readonly IRepository<Coverage> _coverageRepo;
    private readonly ILogger<SubscriptionController> _logger;

    public SubscriptionController(
        IRepository<Subscription> subRepo,
        IRepository<SubscriptionUser> subUserRepo,
        IRepository<Plan> planRepo,
        IRepository<Server> serverRepo,
        IRepository<Coverage> coverageRepo,
        ILogger<SubscriptionController> logger)
    {
        _subRepo = subRepo;
        _subUserRepo = subUserRepo;
        _planRepo = planRepo;
        _serverRepo = serverRepo;
        _coverageRepo = coverageRepo;
        _logger = logger;
    }

    // GET /subscriptions/active/{userId}
    [HttpGet("active/{userId:long}")]
    public ActionResult GetActive(long userId)
    {
        var links = _subUserRepo.GetAll()
                        .Where(su => su.user_id == userId)
                        .Select(su => su.subscription_id);

        var subs = links.Select(id => _subRepo.GetById((int)id))
                        .Where(s => s != null && (s.end_date == null || s.end_date > DateTime.UtcNow))
                        .ToList();

        var views = subs.Select(s =>
        {
            var plan = _planRepo.GetById((int)s.plan_id);
            var srv = _serverRepo.GetById(s.server_id);
            var cov = _coverageRepo.GetAll().FirstOrDefault(c => c.id == srv.coverage_id);

            var location = cov.location ?? "Unknown";

            return new
            {
                SubscriptionId = s.id,
                StartDate = s.start_date,
                EndDate = s.end_date,
                PlanId = plan?.id ?? 0,
                PlanName = plan?.name,
                PlanDesc = plan?.description_plan,
                PlanPrice = plan?.price ?? 0,
                ServerId = srv?.id ?? 0,
                Location = location
            };
        }).ToList();

        if (!views.Any())
            return NotFound();

        return Ok(views);
    }

    // POST /subscriptions
    [HttpPost]
    public ActionResult Add([FromBody] dynamic m)
    {
        int planId = m.PlanId;
        int serverId = m.ServerId;
        long userId = m.UserId;

        var sub = new Subscription
        {
            plan_id = planId,
            server_id = serverId,
            start_date = DateTime.UtcNow
        };
        var newId = _subRepo.Insert(sub);
        sub.id = (int)newId;

        var link = new SubscriptionUser
        {
            subscription_id = newId,
            user_id = userId,
            is_primary = true,
            added_at = DateTime.UtcNow
        };
        _subUserRepo.Insert(link);

        var plan = _planRepo.GetById(planId);
        var srv = _serverRepo.GetById(serverId);
        var cov = _coverageRepo.GetAll().FirstOrDefault(c => c.id == srv.coverage_id);

        var location = cov.location ?? "Unknown";

        var view = new
        {
            SubscriptionId = (int)newId,
            StartDate = sub.start_date,
            EndDate = sub.end_date,
            PlanId = plan?.id ?? 0,
            PlanName = plan?.name,
            PlanDesc = plan?.description_plan,
            PlanPrice = plan?.price ?? 0,
            ServerId = srv?.id ?? 0,
            Location = location
        };

        return CreatedAtAction(nameof(GetActive), new { userId }, view);
    }

    // DELETE /subscriptions/{id}
    [HttpDelete("{id:long}")]
    public IActionResult Remove(long id)
    {
        var links = _subUserRepo.GetAll()
                      .Where(su => su.subscription_id == id)
                      .ToList();
        foreach (var su in links)
            _subUserRepo.Delete((int)su.subscription_id); // if you use timestamps, adjust this

        var sub = _subRepo.GetById((int)id);
        if (sub == null)
            return NotFound();

        sub.end_date = DateTime.UtcNow;
        _subRepo.Update(sub);
        return NoContent();
    }
}
