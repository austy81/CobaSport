using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CobaSports.Models
{
    public class MeetingPlayer
    {
        [Key]
        public int Id { get; set; }

        [Required, Column(TypeName = "datetime2")]
        public DateTime Timestamp { get; set; }
        public bool? IsAttending { get; set; }

        [Required, ForeignKey("Meeting"), Column(Order = 10), Index("IX_Meeting_Player", 10, IsUnique = true)]
        public int MeetingId { get; set; }
        public virtual Meeting Meeting { get; set; }

        [Required, ForeignKey("Player"), Column(Order = 20), Index("IX_Meeting_Player", 20, IsUnique = true)]
        public int PlayerId { get; set; }
        public virtual Player Player { get; set; }
    }
}