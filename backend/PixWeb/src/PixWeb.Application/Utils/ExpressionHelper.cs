using System.Globalization;
using System.Linq.Expressions;

namespace PixWeb.Application.Utils
{
    public static class ExpressionHelper
    {
        public static Expression<Func<TEntity, bool>>? BuildFilterExpression<TEntity>(
            string field,
            string value,
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
                Expression? comparison = BuildComparisonExpression(property, propertyType, value);
                if (comparison == null)
                {
                    notify($"Valor '{value}' inválido para o campo '{field}'.");
                    return null;
                }

                return Expression.Lambda<Func<TEntity, bool>>(comparison, parameter);
            }
            catch
            {
                notify($"Erro ao processar o campo '{field}' com valor '{value}'.");
                return null;
            }
        }

        private static Expression? BuildComparisonExpression(Expression property, Type propertyType, string value)
        {
            switch (Type.GetTypeCode(propertyType))
            {
                case TypeCode.String:
                    var method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                    return Expression.Call(property, method!, Expression.Constant(value));

                case TypeCode.Int32:
                    if (int.TryParse(value, out var intValue))
                        return Expression.Equal(property, Expression.Constant(intValue));
                    break;

                case TypeCode.Decimal:
                    if (decimal.TryParse(value, out var decimalValue))
                        return Expression.Equal(property, Expression.Constant(decimalValue));
                    break;

                case TypeCode.DateTime:
                    if (DateTime.TryParseExact(value, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateValue))
                    {
                        var day = Expression.Property(property, "Day");
                        var month = Expression.Property(property, "Month");
                        var year = Expression.Property(property, "Year");

                        return Expression.AndAlso(
                            Expression.AndAlso(
                                Expression.Equal(day, Expression.Constant(dateValue.Day)),
                                Expression.Equal(month, Expression.Constant(dateValue.Month))
                            ),
                            Expression.Equal(year, Expression.Constant(dateValue.Year))
                        );
                    }
                    break;

                case TypeCode.Boolean:
                    if (bool.TryParse(value, out var boolValue))
                        return Expression.Equal(property, Expression.Constant(boolValue));
                    break;
            }

            return null;
        }
    }
}