using OAuth2.Models;

namespace CobaSports.Models.oauth
{
    public class Token
    {
        public string token { get; set; }
        public Player player { get; set; }
        public UserInfo userInfo { get; set; }
    }
}