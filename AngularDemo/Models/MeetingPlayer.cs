using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CobaSports.Models
{
    public class MeetingPlayer
    {
        public int Id { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        public bool? IsAttending { get; set; }

        //[Required]
        [Key]
        [Column(Order = 10)]
        public int MeetingId { get; set; }
        public virtual Meeting Meeting { get; set; }

        //[Required]
        [Key]
        [Column(Order = 20)]
        public int PlayerId { get; set; }
        public virtual Player Player { get; set; }
    }
}