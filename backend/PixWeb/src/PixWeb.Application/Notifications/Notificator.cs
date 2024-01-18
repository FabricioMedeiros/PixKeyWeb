namespace PixWeb.Application.Notifications
{
    public class Notificator : INotificator
    {
        private List<Notification> _notifications;
        public Notificator(List<Notification> notifications)
        {
            _notifications = notifications;
        }

        public List<Notification> GetNotifications()
        {
            return _notifications;
        }

        public void AddNotification(Notification notification)
        {
            _notifications.Add(notification);
        }

        public bool HasNotification()
        {
            return _notifications.Any();
        }
    }
}
