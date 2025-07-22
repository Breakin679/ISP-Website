using Dapper.Contrib.Extensions;

namespace ISP.Models
{ 
    [Table("Servers")]
    public class Server
    {
        [Key]
        public int id { get; set; }
        
        public string name { get; set; } = string.Empty;
        public string location { get; set; } = string.Empty;
        public string coverage_id { get; set; } = string.Empty;
        public bool status { get; set; }

        public int bandwidth { get; set; } = 0; // in Mbps
        

        // Additional properties can be added as needed
    }
}
