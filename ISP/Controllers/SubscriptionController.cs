using Dapper;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using ISP.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

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
    private readonly string _conn;



    public SubscriptionController(
        IRepository<Subscription> subRepo,
        IRepository<SubscriptionUser> subUserRepo,
        IRepository<Plan> planRepo,
        IRepository<Server> serverRepo,
        IRepository<Coverage> coverageRepo,
        ILogger<SubscriptionController> logger,
        IConfiguration config

        )
    {
        _subRepo = subRepo;
        _subUserRepo = subUserRepo;
        _planRepo = planRepo;
        _serverRepo = serverRepo;
        _coverageRepo = coverageRepo;
        _logger = logger;
        _conn = config.GetConnectionString("MyISP")
                    ?? throw new InvalidOperationException("Missing MyISP connection string");


    }
    private IDbConnection Connection() => new SqlConnection(_conn);


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
                PlanTypeId = plan?.plan_type_id ?? 0,
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
    public class ChangePlanDto
    {
        public int NewPlanId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }
    [HttpPost("{id:long}/change-plan")]
    public IActionResult ChangePlan(long id, [FromBody] ChangePlanDto dto)
    {
        using var db = Connection();

        db.Open();
        using var tx = db.BeginTransaction();

        // 1. Get current subscription
        var current = _subRepo.GetById((int)id);
        if (current == null)
            return NotFound("Subscription not found");

        // 2. Get current & new plan
        var currentPlan = _planRepo.GetById((int)current.plan_id);
        var newPlan = _planRepo.GetById(dto.NewPlanId);
        if (newPlan == null)
            return NotFound("New plan not found");

        int currentPublicIPs = currentPlan.public_ip_count;
        int newPublicIPs = newPlan.public_ip_count;

        // 3. End current subscription
        current.end_date = DateTime.UtcNow;
        _subRepo.Update(current);

        // Get user (assumes one user, primary)
        var userLink = _subUserRepo.GetAll()
            .FirstOrDefault(x => x.subscription_id == id && x.is_primary);
        if (userLink == null)
            return BadRequest("Subscription user link not found");

        if (newPublicIPs != currentPublicIPs)
        {
            // 4. New installation request needed
            var pending = new PendingRequest
            {
                UserId = userLink.user_id,
                Email = dto.Email,
                PhoneNumber = dto.Phone,
                Location = dto.Location,
                PlanId = dto.NewPlanId,
                RequestedAt = DateTime.UtcNow,
                Status = "Pending"
            };
            db.Execute(@"
            INSERT INTO Pending_Requests (user_id, email, phone_number, location, plan_id, requested_at)
            VALUES (@UserId, @Email, @PhoneNumber, @Location, @PlanId, SYSUTCDATETIME());
        ", pending, tx);

            tx.Commit();
            return Ok(new { message = "Installation request created due to public IP increase" });
        }

        // 5. New subscription
        var sub = new Subscription
        {
            plan_id = dto.NewPlanId,
            server_id = current.server_id,
            start_date = DateTime.UtcNow
        };
        var newId = _subRepo.Insert(sub);
        sub.id = (int)newId;

        // 6. Re-link user
        _subUserRepo.Insert(new SubscriptionUser
        {
            subscription_id = newId,
            user_id = userLink.user_id,
            is_primary = true,
            added_at = DateTime.UtcNow
        });

        // 7. Transfer IPs
        db.Execute(@"
        UPDATE IPAddresses
        SET subscription_id = @NewId
        WHERE subscription_id = @OldId;
    ", new { NewId = newId, OldId = id }, tx);

        tx.Commit();
        return Ok(new { message = "Subscription changed", newSubId = newId });
    }

}
