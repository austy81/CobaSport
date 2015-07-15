using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CobaSports.Models.oauth
{
    public class GoogleTokenRequest
    {
        //4%2FTsSkYzmrLoM9InucJKTe_iFACJLVXQpPgEZtuA-N_98
        public string code { get; set; }

        //https%3A%2F%2Fdevelopers.google.com%2Foauthplayground
        public string redirect_uri { get; set; }
        
        //407408718192.apps.googleusercontent.com
        public string client_id { get; set; }

        //************
        public string client_secret { get; set; }
        
        //
        public string scope { get; set; }
        
        //authorization_code
        public string grant_type { get; set; }
    }
}