using PixWeb.Application.Dtos;

namespace PixWeb.Application.Services
{
    public interface IPixKeyService
    {
        Task<PixKeyListDto> GetAllAsync(string? field = null, string? value = null, int? page = null, int? pageSize = null);
        Task<PixKeyDto> GetByIdAsync(int id);
        Task<PixKeyDto> CreateAsync(PixKeyCreateDto pixKeyCreateDto);
        Task<PixKeyDto> UpdateAsync(PixKeyUpdateDto pixKeyUpdateDto);
        Task<bool> DeleteAsync(int id);
    }
}
