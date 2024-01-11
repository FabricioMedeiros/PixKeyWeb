using Microsoft.EntityFrameworkCore;
using PixWeb.Domain.Entities;
using PixWeb.Domain.Interfaces;
using PixWeb.Infrastructure.Data;

namespace PixWeb.Infrastructure.Repositories
{
    public class PixKeyRepository : IPixKeyRepository
    {
        private readonly AppDbContext _context;

        public PixKeyRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PixKey>> GetAllAsync(string userId)
        {
            return await _context.PixKeys.Where(key => key.UserId == userId).ToListAsync();
        }

        public async Task<PixKey> GetByIdAsync(string userId, int id)
        {
            return await _context.PixKeys.FirstOrDefaultAsync(k => k.UserId == userId && k.Id == id);
        }

        public async Task<PixKey> GetByKeyAsync(string userId, string key)
        {
            return await _context.PixKeys.FirstOrDefaultAsync(k => k.UserId == userId && k.Key == key);
        }

        public async Task<PixKey> AddAsync(PixKey entity)
        {
            _context.PixKeys.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<PixKey> UpdateAsync(PixKey pixKey)
        {
            _context.Entry(pixKey).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return pixKey; 
        }

        public async Task DeleteAsync(PixKey entity)
        {
            _context.PixKeys.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
