using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Coverage")]
    public class Coverage
    {
        [Key]
        public int id { get; set; }
        public string? name { get; set; }
        public int plan_type_id { get; set; }
        public string? location { get; set; }
        public string? ContactInfo { get; set; }
        public string? Status { get; set; }
    }
}
