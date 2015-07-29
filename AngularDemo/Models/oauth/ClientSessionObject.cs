using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CobaSports.Models.oauth
{
    public class ClientSessionObject
    {
        public string sessionId { get; set; }
        public string token { get; set; }
        public int? playerId { get; set; }
    }
}