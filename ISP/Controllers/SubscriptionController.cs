using Dapper;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
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

    [HttpGet]
    public ActionResult<IEnumerable<SubscriptionWithUsersDto>> GetAll()
    {
        using var db = Connection();
        var sql = @"
SELECT 
  s.id AS SubscriptionId,
  s.plan_id AS PlanId,
  s.server_id AS ServerId,
  s.start_date AS StartDate,
  u.id AS UserId,
  u.fn + ' ' + u.ln AS FullName
FROM Subscription s
LEFT JOIN SubscriptionUsers su ON su.subscription_id = s.id
LEFT JOIN Users u ON u.id = su.user_id
ORDER BY s.id;
";

        var lookup = new Dictionary<long, SubscriptionWithUsersDto>();

        db.Query<SubscriptionWithUsersDto, UserDto, SubscriptionWithUsersDto>(
            sql,
            (sub, user) =>
            {
                if (!lookup.TryGetValue(sub.SubscriptionId, out var dto))
                {
                    dto = sub;
                    lookup.Add(sub.SubscriptionId, dto);
                }
                if (user?.UserId > 0)
                    dto.Users.Add(user);
                return dto;
            },
            splitOn: "UserId"
        );

        return Ok(lookup.Values);
    }

    [HttpGet("details")]
    public ActionResult<IEnumerable<SubscriptionWithUsersAndIpsDto>> GetDetails()
    {
        using var db = Connection();
        var sql = @"
SELECT
  s.id AS SubscriptionId,
  s.plan_id AS PlanId,
  s.server_id AS ServerId,
  u.id AS UserId,
  u.fn + ' ' + u.ln AS FullName,
  ip.ip_address AS Ip
FROM Subscription s
LEFT JOIN SubscriptionUsers su ON su.subscription_id = s.id
LEFT JOIN Users u ON u.id = su.user_id
LEFT JOIN IPAddresses ip ON ip.subscription_id = s.id
ORDER BY s.id;
";

        var lookup = new Dictionary<long, SubscriptionWithUsersAndIpsDto>();

        db.Query<SubscriptionWithUsersAndIpsDto, UserDto, IpDto, SubscriptionWithUsersAndIpsDto>(
            sql,
            (sub, user, ip) =>
            {
                if (!lookup.TryGetValue(sub.SubscriptionId, out var dto))
                {
                    dto = sub;
                    lookup[sub.SubscriptionId] = dto;
                }
                if (user?.UserId > 0)
                    dto.Users.Add(user);
                if (!string.IsNullOrWhiteSpace(ip?.Ip))
                    dto.Ips.Add(ip.Ip);
                return dto;
            },
            splitOn: "UserId,Ip"
        );

        return Ok(lookup.Values);
    }
    // POST /subscriptions/full
    [HttpPost("full")]
    public IActionResult CreateFull([FromBody] FullSubscriptionDto dto)
    {
        using var db = Connection();
        db.Open();
        using var tx = db.BeginTransaction();

        // 1️⃣ Create the subscription header
        var subSql = @"
      INSERT INTO Subscription (plan_id, server_id, start_date)
      VALUES (@PlanId, @ServerId, SYSUTCDATETIME());
      SELECT CAST(SCOPE_IDENTITY() AS BIGINT);
    ";
        var newSubId = db.ExecuteScalar<long>(subSql, dto, tx);

        // 2️⃣ Link users
        var linkSql = @"
      INSERT INTO SubscriptionUsers
        (subscription_id, user_id, is_primary, added_at)
      VALUES (@SubId, @UserId, @IsPrimary, SYSUTCDATETIME());
    ";
        foreach (var u in dto.UserIds)
        {
            db.Execute(linkSql, new
            {
                SubId = newSubId,
                UserId = u,
                IsPrimary = u == dto.PrimaryUserId
            }, tx);
        }

        // 3️⃣ Assign IPs
        var ipSql = @"
      INSERT INTO IPAddresses
        (subscription_id, ip_address,server_id, is_public, is_assigned, seen_at)
      VALUES (@SubId, @Ip, @ServId,@IsPublic, 1, SYSUTCDATETIME());
    ";
        foreach (var ip in dto.IpAddresses)
        {
            db.Execute(ipSql, new
            {
                SubId = newSubId,
                Ip = ip.Address,
                ServId= dto.ServerId,
                IsPublic = ip.IsPublic
            }, tx);
        }

        tx.Commit();
        return CreatedAtAction(nameof(GetDetails), new { }, null);
    }
    public class FullSubscriptionDto
    {
        public long PlanId { get; set; }
        public long ServerId { get; set; }
        public long[] UserIds { get; set; }
        public long PrimaryUserId { get; set; }
        public IpAddressDto[] IpAddresses { get; set; }
    }
    // PUT /subscriptions/full/{id}
    [HttpPut("full/{id:long}")]
    public IActionResult UpdateFull(long id, [FromBody] FullSubscriptionDto dto)
    {
        using var db = Connection();
        db.Open();
        using var tx = db.BeginTransaction();

        // 1️⃣ Update header
        db.Execute(
          @"UPDATE Subscription 
        SET plan_id = @PlanId, server_id = @ServerId
        WHERE id = @SubId;",
          new { SubId = id, dto.PlanId, dto.ServerId },
          tx
        );

        // 2️⃣ Replace user links
        db.Execute(
          "DELETE FROM SubscriptionUsers WHERE subscription_id = @SubId;",
          new { SubId = id }, tx
        );
        foreach (var u in dto.UserIds)
        {
            db.Execute ( @"
INSERT INTO SubscriptionUsers
  (subscription_id, user_id, is_primary, added_at)
VALUES (@SubId, @UserId, @IsPrimary, SYSUTCDATETIME());",   new
            {
                SubId = id,
                UserId = u,
                IsPrimary = u == dto.PrimaryUserId
            }, tx);
        }

        // 3️⃣ Replace IPs
        db.Execute(
          "DELETE FROM IPAddresses WHERE subscription_id = @SubId;",
          new { SubId = id }, tx
        );
        foreach (var ip in dto.IpAddresses)
        {
            db.Execute(@"
INSERT INTO IPAddresses
(subscription_id, ip_address, is_public, is_assigned, seen_at)
VALUES (@SubId, @Ip, @IsPublic, 1, SYSUTCDATETIME());", new
            {
                SubId = id,
                Ip = ip.Address,
                IsPublic = ip.IsPublic
            }, tx);
        }

        tx.Commit();
        return NoContent();
    }

    public class IpAddressDto
    {
        public string Address { get; set; }
        public bool IsPublic { get; set; }
    }

    // DTOs
    public class SubscriptionWithUsersDto
    {
        public long SubscriptionId { get; set; }
        public long PlanId { get; set; }
        public long ServerId { get; set; }
        public DateTime StartDate { get; set; }
        public List<UserDto> Users { get; set; } = new();
    }

    public class SubscriptionWithUsersAndIpsDto
    {
        public long SubscriptionId { get; set; }
        public long PlanId { get; set; }
        public long ServerId { get; set; }
        public List<UserDto> Users { get; set; } = new();
        public List<string> Ips { get; set; } = new();
    }

    public class UserDto
    {
        public long UserId { get; set; }
        public string FullName { get; set; }
    }

    public class IpDto
    {
        public string Ip { get; set; }
    }
}
