using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CobaSports.Models
{
    public class Player
    {
        public int Id { get; set; }

        [Required, MaxLength(20)]
        public string FirstName { get; set; }

        [Required, MaxLength(20)]
        public string LastName { get; set; }

        [MaxLength(254), EmailAddress]
        public string Email { get; set; }

        public virtual ICollection<SportPlayer> SportPlayers { get; set; }
        public virtual ICollection<MeetingPlayer> MeetingPlayers { get; set; }
    }
}