
using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Subscription")]
    public class Subscription
    {
        [Key]
        public int id { get; set; }
        public int users_id { get; set; }
        public int plan_id { get; set; }
        public DateTime date { get; set; }
        public decimal consumption { get; set; }
    }
}
