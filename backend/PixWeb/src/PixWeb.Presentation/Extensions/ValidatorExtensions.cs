using FluentValidation;
using PixWeb.Application.Validators;

namespace PixWeb.API.Extensions
{
    public static class ValidatorExtensions
    {
        public static void ConfigureValidators(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<PixKeyValidator>();
        }
    }
}
