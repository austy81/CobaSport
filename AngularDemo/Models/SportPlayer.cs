using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace CobaSports.Models
{
    public class SportPlayer
    {
        [Key]
        public int Id { get; set; }

        [Required, ForeignKey("Sport"), Column(Order = 10), Index("IX_Sport_Player", 10, IsUnique = true)]
        public int SportId { get; set; }
        public Sport Sport { get; set; }

        [Required, ForeignKey("Player"), Column(Order = 20), Index("IX_Sport_Player", 20, IsUnique = true)]
        public int PlayerId { get; set; }
        public Player Player { get; set; }
    }
}