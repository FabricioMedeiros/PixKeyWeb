using Microsoft.EntityFrameworkCore;
using PixWeb.Application.Notifications;
using PixWeb.Domain.Entities;
using PixWeb.Domain.Interfaces;
using PixWeb.Infrastructure.Data;
using System.Globalization;
using System.Linq.Expressions;

namespace PixWeb.Infrastructure.Repositories
{
    public class PixKeyRepository : BaseRepository, IPixKeyRepository
    {
        private readonly AppDbContext _context;

        public PixKeyRepository(AppDbContext context, INotificator notificator) : base(notificator)
        {
            _context = context;
        }

        public async Task<(IEnumerable<PixKey> pixKeys, int totalRecords)> GetAllAsync(string userId, string? propertyName = null, string? value = null, int? page = null, int? pageSize = null)
        {
            var query = _context.PixKeys.Where(k => k.UserId == userId);

            if (!string.IsNullOrEmpty(propertyName) && !string.IsNullOrEmpty(value))
            {
                var propertyInfo = typeof(PixKey).GetProperty(propertyName);
                if (propertyInfo == null)
                {
                    Notify("Campo de pesquisa não encontrado.");
                    return (Enumerable.Empty<PixKey>(), 0);
                }

                var parameter = Expression.Parameter(typeof(PixKey), "k");
                var property = Expression.Property(parameter, propertyName);
                Expression? searchExpression = null;

                switch (Type.GetTypeCode(propertyInfo.PropertyType))
                {
                    case TypeCode.String:
                        searchExpression = Expression.Call(property, "Contains", null, Expression.Constant(value, typeof(string)));
                        break;
                    case TypeCode.Int32:
                        if (int.TryParse(value, out var intValue))
                        {
                            searchExpression = Expression.Equal(property, Expression.Constant(intValue));
                        }
                        break;
                    case TypeCode.Decimal:
                        if (decimal.TryParse(value, out var decimalValue))
                        {
                            searchExpression = Expression.Equal(property, Expression.Constant(decimalValue));
                        }
                        break;
                    case TypeCode.DateTime:
                        if (DateTime.TryParseExact(value, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateValue))
                        {
                            var dayExpression = Expression.Equal(Expression.Property(property, "Day"), Expression.Constant(dateValue.Day));
                            var monthExpression = Expression.Equal(Expression.Property(property, "Month"), Expression.Constant(dateValue.Month));
                            var yearExpression = Expression.Equal(Expression.Property(property, "Year"), Expression.Constant(dateValue.Year));

                            searchExpression = Expression.AndAlso(Expression.AndAlso(dayExpression, monthExpression), yearExpression);
                        }
                        break;
                    case TypeCode.Boolean:
                        if (bool.TryParse(value, out var boolValue))
                        {
                            searchExpression = Expression.Equal(property, Expression.Constant(boolValue));
                        }
                        break;
                    default:
                        {
                            Notify("Tipo de Propriedade não suportada. " + nameof(propertyName));
                            return (Enumerable.Empty<PixKey>(), 0);
                        }
                }

                if (searchExpression == null)
                {
                    Notify("Valor de pesquisa inválido para o tipo de propriedade fornecido. " + nameof(value));
                    return (Enumerable.Empty<PixKey>(), 0);
                }

                var lambda = Expression.Lambda<Func<PixKey, bool>>(searchExpression, parameter);
                query = query.Where(lambda);
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
