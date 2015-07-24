namespace CobaSports.Models.oauth
{
    public class AuthResponse
    {
        public string clientId { get; set; }
        public string code { get; set; }
        public string redirectUri { get; set; }
    }
}