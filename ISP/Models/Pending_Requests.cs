using Dapper.Contrib.Extensions;

namespace ISP.Models
{
    [Table("Pending_Requests")]
    public class Pending_Requests
    {
        [Key]
        public int id { get; set; }
        public required string location { get; set; }
        public int user_id { get; set; }
    }
}
