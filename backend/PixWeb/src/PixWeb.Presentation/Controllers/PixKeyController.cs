using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PixWeb.Application.Dtos;
using PixWeb.Application.Notifications;
using PixWeb.Application.Services;
using PixWeb.Application.Validators;
using System.Security.Claims;

namespace PixWeb.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class PixKeyController : MainController
    {
        private readonly IPixKeyService _pixKeyService;

        public PixKeyController(IPixKeyService pixKeyService,
            INotificator notificator,
            ClaimsPrincipal currentUser) : base(notificator, currentUser)
        {
            _pixKeyService = pixKeyService;
        }
        [HttpGet]
        public async Task<ActionResult<PixKeyListDto>> GetPixKeys([FromQuery] string? field = null, [FromQuery] string? value = null, [FromQuery] int? page = null, [FromQuery] int? pageSize = null)
        {
            var pixKeys = await _pixKeyService.GetAllAsync(field, value, page, pageSize);
            return CustomResponse(pixKeys);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<PixKeyDto>> GetPixKeyById(int id)
        {
            var pixKey = await _pixKeyService.GetByIdAsync(id);

            if (pixKey == null)
            {
                return NotFound();
            }

            return Ok(pixKey);

        }

        [HttpPost]
        public async Task<ActionResult<PixKeyDto>> CreatePixKey(PixKeyCreateDto pixKeyCreateDto)
        {
            var validationResult = await new PixKeyValidator().ValidateAsync(pixKeyCreateDto);

            if (!validationResult.IsValid)
            {
                return CustomResponse(validationResult);
            }

            var createdPixKey = await _pixKeyService.CreateAsync(pixKeyCreateDto);
            return CustomResponse(createdPixKey);
        }

        [HttpPut()]
        public async Task<ActionResult<PixKeyDto>> UpdatePixKey(PixKeyUpdateDto pixKeyUpdateDto)
        {
            var validationResult = await new PixKeyValidator().ValidateAsync(pixKeyUpdateDto);

            if (!validationResult.IsValid)
            {
                return CustomResponse(validationResult);
            }

            var updatedPixKey = await _pixKeyService.UpdateAsync(pixKeyUpdateDto);

            if (updatedPixKey == null)
            {
                return CustomResponse();
            }

            return CustomResponse(updatedPixKey);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePixKey(int id)
        {
            var result = await _pixKeyService.DeleteAsync(id);

            if (!result)
            {
                return CustomResponse();
            }

            return Ok();
        }
    }
}

