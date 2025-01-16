using Microsoft.AspNetCore.Identity;
using PixWeb.Application.Notifications;
using PixWeb.Application.Services;
using PixWeb.Domain.Entities;
using PixWeb.Domain.Interfaces;
using PixWeb.Infrastructure.Repositories;
using System.Security.Claims;

namespace PixWeb.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureDependencyInjection(this IServiceCollection services)
        {
            services.AddScoped<UserManager<ApplicationUser>>();
            services.AddScoped<IPixKeyService, PixKeyService>();
            services.AddScoped<IPixKeyRepository, PixKeyRepository>();
            services.AddScoped<INotificator, Notificator>();
            services.AddScoped<List<Notification>>();
            services.AddScoped<ClaimsPrincipal>(static s => s.GetService<IHttpContextAccessor>()!.HttpContext!.User!);
        }
    }
}
