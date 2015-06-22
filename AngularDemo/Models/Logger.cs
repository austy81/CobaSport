using System.ComponentModel.DataAnnotations;

namespace CobaSports.Models
{
    public class Logger
    {
        public int Id { get; set; }

        [MaxLength(10)]
        public string Level { get; set; }

        [MaxLength(2047)]
        public string Message { get; set; }
    }
}