using PixWeb.Application.Notifications;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace PixWeb.Application.Services
{
    public abstract class BaseService
    {
        private readonly INotificator _notificator;
        private readonly IHttpContextAccessor _httpContextAccessor;
        protected string userId { get; private set; } 

        protected BaseService(INotificator notificator, IHttpContextAccessor httpContextAccessor)
        {
            _notificator = notificator;
            _httpContextAccessor = httpContextAccessor;

            var user = _httpContextAccessor.HttpContext?.User ;
            userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

        }

        protected void Notify(string message)
        {
            _notificator.AddNotification(new Notification(message));
        }
    }
}
