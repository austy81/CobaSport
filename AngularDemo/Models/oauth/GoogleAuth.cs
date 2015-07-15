using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CobaSports.Models.oauth
{
    public class GoogleAuth
    {
        public string clientId { get; set; }
        public string code { get; set; }
        public string redirectUri { get; set; }
    }
}