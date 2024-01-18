using PixWeb.Application.Notifications;
using System.Security.Claims;

namespace PixWeb.Application.Services
{
    public abstract class BaseService
    {
        private readonly INotificator _notificator;
        private readonly ClaimsPrincipal _currentUser;
        protected String UserId { get; private set; }

        protected BaseService(INotificator notificator, ClaimsPrincipal currentUser)
        {
            _notificator = notificator;
            _currentUser = currentUser;

            UserId = _currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        protected void Notify(string message)
        {
            _notificator.AddNotification(new Notification(message));
        }
    }
}
