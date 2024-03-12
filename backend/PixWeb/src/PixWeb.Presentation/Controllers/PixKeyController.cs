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
        public async Task<ActionResult<IEnumerable<PixKeyDto>>> GetPixKeys()
        {
            var pixKeys = await _pixKeyService.GetAllAsync();
            return Ok(pixKeys);
        }

        [HttpGet("key/{key}")]
        public async Task<ActionResult<PixKeyDto>> GetPixKey(string key)
        {
            var pixKey = await _pixKeyService.GetByKeyAsync(key);

            if (pixKey == null)
            {
                return NotFound();
            }

            return Ok(pixKey);
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
                return NotFound();
            }

            return CustomResponse(updatedPixKey);
        }

        [HttpDelete("{key}")]
        public async Task<IActionResult> DeletePixKey(string key)
        {
            var result = await _pixKeyService.DeleteAsync(key);

            if (!result)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}

