using Dapper.Contrib.Extensions;


namespace ISP.Models
{
    [Table("Billing")]
    public class Billing
    {
        [Key]
        public int id { get; set; }
        public string? bill_type { get; set; }
        public int user_id { get; set; }
        public int plan_id { get; set; }
        public string? description { get; set; }
        public int operation_id { get; set; }
        public decimal total_costs { get; set; }
    }
}
