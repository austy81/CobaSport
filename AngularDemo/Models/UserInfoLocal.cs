using System.ComponentModel.DataAnnotations.Schema;

namespace CobaSports.Models
{
    public class UserInfoLocal
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