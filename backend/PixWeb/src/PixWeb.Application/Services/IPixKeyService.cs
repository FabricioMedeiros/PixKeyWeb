using PixWeb.Application.Dtos;

namespace PixWeb.Application.Services
{
    public interface IPixKeyService
    {
        Task<IEnumerable<PixKeyDto>> GetAllAsync();
        Task<PixKeyDto> GetByKeyAsync(string key);
        Task<PixKeyDto> GetByIdAsync(int id);
        Task<PixKeyDto> CreateAsync(PixKeyCreateDto pixKeyCreateDto);
        Task<PixKeyDto> UpdateAsync(PixKeyUpdateDto pixKeyUpdateDto);
        Task<bool> DeleteAsync(string key);
    }
}
