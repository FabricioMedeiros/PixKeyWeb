using System.Globalization;
using System.Linq.Expressions;

namespace PixWeb.Application.Utils
{
    public static class ExpressionHelper
    {
        public static Expression<Func<TEntity, bool>>? BuildFilterExpression<TEntity>(
            string field,
            object value,
            Action<string> notify)
        {
            var parameter = Expression.Parameter(typeof(TEntity), "entity");
            var property = Expression.PropertyOrField(parameter, field);

            if (property == null)
            {
                notify($"Campo '{field}' não encontrado.");
                return null;
            }

            var propertyType = Nullable.GetUnderlyingType(property.Type) ?? property.Type;

            try
            {
                object? typedValue;

                if (propertyType.IsEnum)
                {
                    if (int.TryParse(value.ToString(), out var intValue))
                    {
                        typedValue = Enum.ToObject(propertyType, intValue);
                    }
                    else
                    {
                        typedValue = Enum.Parse(propertyType, value.ToString()!, ignoreCase: true);
                    }
                }
                else if (propertyType == typeof(DateTime))
                {
                    if (DateTime.TryParseExact(value.ToString(), "dd/MM/yyyy",
                        CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateValue))
                    {
                        typedValue = dateValue;
                    }
                    else
                    {
                        notify($"Valor '{value}' não é uma data válida (esperado dd/MM/yyyy).");
                        return null;
                    }
                }
                else
                {
                    typedValue = Convert.ChangeType(value, propertyType);
                }

                var constant = Expression.Constant(typedValue, propertyType);

                Expression comparison;

                if (propertyType == typeof(string))
                {
                    var method = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) });
                    comparison = Expression.Call(property, method!, constant);
                }
                else if (propertyType == typeof(DateTime))
                {
                    var day = Expression.Property(property, "Day");
                    var month = Expression.Property(property, "Month");
                    var year = Expression.Property(property, "Year");

                    var dateValue = (DateTime)typedValue;

                    comparison = Expression.AndAlso(
                        Expression.AndAlso(
                            Expression.Equal(day, Expression.Constant(dateValue.Day)),
                            Expression.Equal(month, Expression.Constant(dateValue.Month))
                        ),
                        Expression.Equal(year, Expression.Constant(dateValue.Year))
                    );
                }
                else
                {
                    comparison = Expression.Equal(property, constant);
                }

                return Expression.Lambda<Func<TEntity, bool>>(comparison, parameter);
            }
            catch (Exception ex)
            {
                notify($"Erro ao processar o campo '{field}' com valor '{value}': {ex.Message}");
                return null;
            }
        }
    }
}