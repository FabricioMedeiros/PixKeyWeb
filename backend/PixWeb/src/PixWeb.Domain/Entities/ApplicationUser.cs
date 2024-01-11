using Microsoft.AspNetCore.Identity;

namespace PixWeb.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }
}