namespace PixWeb.Application.Notifications
{
    public interface INotificator
    {
        List<Notification> GetNotifications();

        void AddNotification(Notification notification);

        bool HasNotification();
    }
}
