using Microsoft.AspNet.Identity.EntityFramework;

namespace PixWeb.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }
}