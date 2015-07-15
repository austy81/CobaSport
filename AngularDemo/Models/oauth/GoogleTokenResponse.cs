using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CobaSports.Models.oauth
{
    public class GoogleTokenResponse
    {
        public string access_token { get; set; }
        
        //Bearer
        public string token_type { get; set; }
        
        //3600
        public string expires_in { get; set; }
        
        public string refresh_token { get; set; }
        public string id_token { get; set; }

    }
}