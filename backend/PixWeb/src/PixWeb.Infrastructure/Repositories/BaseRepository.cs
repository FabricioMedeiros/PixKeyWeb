using PixWeb.Application.Notifications;

namespace PixWeb.Infrastructure.Repositories
{
    public abstract class BaseRepository
    {
        private readonly INotificator _notificator;

        protected BaseRepository(INotificator notificator)
        {
            _notificator = notificator;
        }

        protected void Notify(string message)
        {
            _notificator.AddNotification(new Notification(message));
        }
    }
}

