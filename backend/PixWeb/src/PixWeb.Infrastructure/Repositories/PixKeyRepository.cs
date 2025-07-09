using Microsoft.EntityFrameworkCore;
using PixWeb.Application.Notifications;
using PixWeb.Application.Utils;
using PixWeb.Domain.Entities;
using PixWeb.Domain.Interfaces;
using PixWeb.Infrastructure.Data;

namespace PixWeb.Infrastructure.Repositories
{
    public class PixKeyRepository : BaseRepository, IPixKeyRepository
    {
        private readonly AppDbContext _context;

        public PixKeyRepository(AppDbContext context, INotificator notificator)
            : base(notificator)
        {
            _context = context;
        }

        public async Task<(IEnumerable<PixKey> pixKeys, int totalRecords)> GetAllAsync(
            string userId,
            string? field = null,
            string? value = null,
            int? page = null,
            int? pageSize = null,
            Action<string>? notify = null)
        {
            var query = _context.PixKeys.Where(k => k.UserId == userId);

            if (!string.IsNullOrEmpty(field) && !string.IsNullOrEmpty(value))
            {
                var filterExpression = ExpressionHelper.BuildFilterExpression<PixKey>(field, value, notify ?? (_ => { }));

                if (filterExpression != null)
                {
                    query = query.Where(filterExpression);
                }
            }

            var totalRecords = await query.CountAsync();

            if (page.HasValue && pageSize.HasValue)
            {
                query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            var pixKeys = await query.ToListAsync();

            return (pixKeys, totalRecords);
        }

        public async Task<PixKey?> GetByIdAsync(string userId, int id)
        {
            return await _context.PixKeys.FirstOrDefaultAsync(k => k.UserId == userId && k.Id == id);
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
