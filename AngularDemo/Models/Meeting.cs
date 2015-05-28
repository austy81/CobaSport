using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CobaSports.Models
{
    public class Meeting
    {
        public int Id { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        
        [Range(1,int.MaxValue)]
        public int SportId { get; set; }
        public virtual Sport Sport { get; set; }

        public virtual ICollection<MeetingPlayer> MeetingPlayer { get; set; }
    }
}