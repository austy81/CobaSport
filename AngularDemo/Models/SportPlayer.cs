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
        public int Id { get; set; }
        
        [Key]
        [Column(Order = 10)]
        //[Required]
        public int SportId { get; set; }
        public Sport Sport { get; set; }
        
        [Key]
        [Column(Order = 20)]
        //[Required]
        public int PlayerId { get; set; }
        public Player Player { get; set; }
    }
}