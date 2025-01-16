using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using PixWeb.API.Entities;
using PixWeb.Domain.Entities;
using PixWeb.Infrastructure.Data;

namespace PixWeb.API.Extensions
{
    public static class IdentityExtensions
    {
        public static void ConfigureIdentity(this IServiceCollection services)
        {
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -._@+";
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();
        }
    }
}
