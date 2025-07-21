using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using ISP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
namespace ISP.Controllers
{
    [ApiController]
    [Route("subscriptions")]
    public class SubscriptionController : ControllerBase
    {
        private readonly string _connString;

        public SubscriptionController(IConfiguration configuration)
        {
            _connString = configuration.GetConnectionString("MyISP")
               ?? throw new InvalidOperationException("Missing MyISP connection string");
        }
        private IDbConnection Connection() => new SqlConnection(_connString);


        // GET /subscriptions/active/{userId}
        [HttpGet("active/{userId:int}")]
        public ActionResult<IEnumerable<SubscriptionView>> GetActive(int userId)
        {

            using var db = Connection();
            var sql = @"
SELECT 
  s.id            AS SubscriptionId,
  s.start_date    AS StartDate,
  s.end_date      AS EndDate,
  p.id            AS PlanId,
  p.name          AS PlanName,
  p.description_plan   AS PlanDesc,
  p.price         AS PlanPrice,
  sv.id           AS ServerId,
  sv.location     AS Location
FROM Subscription s
JOIN Plans   p  ON s.plan_id   = p.id
JOIN Servers sv ON s.server_id = sv.id
WHERE s.users_id = @uid
  AND (s.end_date IS NULL OR s.end_date > GETUTCDATE())";

            var list = db.Query<SubscriptionView>(sql, new { uid = userId }).ToList();
            if (!list.Any()) return NotFound();
            return Ok(list);
        }

        // POST /subscriptions
        [HttpPost]
        public ActionResult<SubscriptionView> Add([FromBody] AddSubscriptionModel m)
        {
            using var db = Connection();
            
            var insertSql = @"
INSERT INTO Subscription (users_id, plan_id, server_id, start_date)
VALUES (@UserId, @PlanId, @ServerId, GETUTCDATE());
SELECT CAST(SCOPE_IDENTITY() AS INT);";

            var newId = db.ExecuteScalar<int>(insertSql, m);

           
            var sql = @"
SELECT 
  s.id            AS SubscriptionId,
  s.start_date    AS StartDate,
  s.end_date      AS EndDate,
  p.id            AS PlanId,
  p.name          AS PlanName,
  p.description_plan   AS PlanDesc,
  p.price         AS PlanPrice,
  sv.id           AS ServerId,
  sv.location     AS Location
FROM Subscription s
JOIN Plans   p  ON s.plan_id   = p.id
JOIN Servers sv ON s.server_id = sv.id
WHERE s.id = @sid;";

            var created = db.QuerySingle<SubscriptionView>(sql, new { sid = newId });
            return CreatedAtAction(nameof(GetActive), new { userId = m.UserId }, created);
        }

        // DELETE /subscriptions/{subscriptionId}
        [HttpDelete("{subscriptionId:int}")]
        public IActionResult Remove(int subscriptionId)
        {
            using var db = Connection();
            var sql = @"UPDATE Subscription
                        SET end_date = GETUTCDATE()
                        WHERE id = @sid";
            var rows = db.Execute(sql, new { sid = subscriptionId });
            if (rows == 0) return NotFound();
            return NoContent();
        }
    }
}


/* [HttpGet("active/{userID:int}")]
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
 }*/
