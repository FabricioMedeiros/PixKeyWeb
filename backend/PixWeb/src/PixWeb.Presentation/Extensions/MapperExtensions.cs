using AutoMapper;
using PixWeb.Infrastructure.Mapping;

namespace PixWeb.API.Extensions
{
    public static class MapperExtensions
    {
        public static void ConfigureMapper(this IServiceCollection services)
        {
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MappingProfile());
            });

            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);
        }
    }
}
