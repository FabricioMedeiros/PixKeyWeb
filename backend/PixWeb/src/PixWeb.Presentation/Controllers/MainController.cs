using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using PixWeb.Application.Notifications;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace PixWeb.API.Controllers
{
    [ApiController]
    public abstract class MainController : ControllerBase
    {
        private readonly INotificator _notificator;
        private readonly ClaimsPrincipal _currentUser;
        protected String UserId { get; private set; }
        protected MainController(INotificator notificator, ClaimsPrincipal currentUser)
        {
            _notificator = notificator;
            _currentUser = currentUser;

            UserId = _currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        protected bool IsValid()
        {
            return !_notificator.HasNotification();
        }

        protected ActionResult CustomResponse(object result = null)
        {
            if (IsValid())
            {
                return Ok(new
                {
                    success = true,
                    data = result
                });
            }

            return BadRequest(new
            {
                success = false,
                errors = _notificator.GetNotifications().Select(n => n.Message)
            });
        }

        protected void CustomResponse(ModelStateDictionary modelState)
        {
            var errors = modelState.Values.SelectMany(e => e.Errors);
            foreach (var error in errors)
            {
                var errorMsg = error.Exception == null ? error.ErrorMessage : error.Exception.Message;
                NotifyError(errorMsg);
            }

            CustomResponse();
        }

        protected void NotifyError(string message)
        {
            _notificator.AddNotification(new Notification(message));
        }
    }
}
