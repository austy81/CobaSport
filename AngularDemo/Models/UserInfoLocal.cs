using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OAuth2.Models;

namespace CobaSports.Models
{
    public class LocalUserInfo
    {
   
        public string Id { get; set; }

        public string ProviderName { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PhotoUri { get; set; }

        [ForeignKey("Player")]
        public int PlayerId { get; set; }
        public virtual Player Player { get; set; }
    }
}