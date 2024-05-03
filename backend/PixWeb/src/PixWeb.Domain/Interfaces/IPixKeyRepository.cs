using System.Collections.Generic;
using System.Threading.Tasks;
using PixWeb.Domain.Entities;

namespace PixWeb.Domain.Interfaces
{
    public interface IPixKeyRepository
    {
        Task<(IEnumerable<PixKey> pixKeys, int totalRecords)> GetAllAsync(string userId, int? page = null, int? pageSize = null);
        Task<PixKey> GetByIdAsync(string userId, int id);
        Task<PixKey> GetByKeyAsync(string userId, string key);
        Task<PixKey> AddAsync(PixKey entity);
        Task<PixKey> UpdateAsync(PixKey entity);
        Task DeleteAsync(PixKey entity);
    }
}

