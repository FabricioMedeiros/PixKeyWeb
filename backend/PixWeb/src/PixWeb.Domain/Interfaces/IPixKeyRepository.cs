using PixWeb.Domain.Entities;

namespace PixWeb.Domain.Interfaces
{
    public interface IPixKeyRepository
    {
        Task<(IEnumerable<PixKey> pixKeys, int totalRecords)> GetAllAsync(
            string userId,
            string? field = null,
            string? value = null,
            int? page = null,
            int? pageSize = null,
            Action<string>? notify = null);
        Task<PixKey?> GetByIdAsync(string userId, int id);
        Task<PixKey> AddAsync(PixKey entity);
        Task<PixKey> UpdateAsync(PixKey entity);
        Task DeleteAsync(PixKey entity);
    }
}

