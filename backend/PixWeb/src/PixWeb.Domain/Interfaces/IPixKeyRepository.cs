using PixWeb.Domain.Entities;

namespace PixWeb.Domain.Interfaces
{
    public interface IPixKeyRepository
    {
        Task<IEnumerable<PixKey>> GetAllAsync(string userId);
        Task<PixKey> GetByIdAsync(string userId, int id);
        Task<PixKey> GetByKeyAsync(string userId, string key);
        Task<PixKey> AddAsync(PixKey entity);
        Task<PixKey> UpdateAsync(PixKey entity);
        Task DeleteAsync(PixKey entity);
    }
}

