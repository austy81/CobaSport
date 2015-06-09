using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CobaSports.Models
{
    public class Sport
    {
        public int Id { get; set; }
        [Required, MaxLength(250)]
        public string Caption { get; set; }

        public virtual ICollection<SportPlayer> SportPlayers { get; set; }
        public virtual ICollection<Meeting> Meetings { get; set; }
    }
}