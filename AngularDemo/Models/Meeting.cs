using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CobaSports.Models
{
    public class Meeting
    {
        public int Id { get; set; }
        
        [Required, Column(TypeName = "datetime2")]
        public DateTime Timestamp { get; set; }

        [Required, ForeignKey("Sport")] 
        public int SportId { get; set; }
        public virtual Sport Sport { get; set; }

        public virtual ICollection<MeetingPlayer> MeetingPlayers { get; set; }
    }
}