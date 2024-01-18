using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PixWeb.Application.Dtos;
using PixWeb.Application.Services;

namespace PixWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PixKeyController : ControllerBase
    {
        private readonly IPixKeyService _pixKeyService;

        public PixKeyController(IPixKeyService pixKeyService)
        {
            _pixKeyService = pixKeyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PixKeyDto>>> GetPixKeys()
        {
            var pixKeys = await _pixKeyService.GetAllAsync();
            return Ok(pixKeys);
        }

        [HttpGet("{key}")]
        public async Task<ActionResult<PixKeyDto>> GetPixKey(string key)
        {
            var pixKey = await _pixKeyService.GetByKeyAsync(key);

            if (pixKey == null)
            {
                return NotFound();
            }

            return Ok(pixKey);
        }

        [HttpPost]
        public async Task<ActionResult<PixKeyDto>> CreatePixKey(PixKeyCreateDto pixKeyCreateDto)
        {
            var createdPixKey = await _pixKeyService.CreateAsync(pixKeyCreateDto);
            return Ok(createdPixKey);
        }


        [HttpPut()]
        public async Task<ActionResult<PixKeyDto>> UpdatePixKey(PixKeyUpdateDto pixKeyUpdateDto)
        {
            var updatedPixKey = await _pixKeyService.UpdateAsync(pixKeyUpdateDto);

            if (updatedPixKey == null)
            {
                return NotFound();
            }

            return Ok(updatedPixKey);
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

