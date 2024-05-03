using System.Collections.Generic;
using System.Threading.Tasks;
using PixWeb.Application.Dtos;

namespace PixWeb.Application.Services
{
    public interface IPixKeyService
    {
        Task<PixKeyListDto> GetAllAsync(int? page = null, int? pageSize = null);
        Task<PixKeyDto> GetByKeyAsync(string key);
        Task<PixKeyDto> GetByIdAsync(int id);
        Task<PixKeyDto> CreateAsync(PixKeyCreateDto pixKeyCreateDto);
        Task<PixKeyDto> UpdateAsync(PixKeyUpdateDto pixKeyUpdateDto);
        Task<bool> DeleteAsync(int id);
    }
}
