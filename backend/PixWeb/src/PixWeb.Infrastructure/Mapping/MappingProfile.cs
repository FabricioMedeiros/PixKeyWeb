using AutoMapper;
using PixWeb.Application.Dtos;
using PixWeb.Domain.Entities;

namespace PixWeb.Infrastructure.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<PixKeyCreateDto, PixKey>();
            CreateMap<PixKeyCreateDto, PixKeyDto>().ReverseMap();
            CreateMap<PixKeyUpdateDto, PixKey>();
            CreateMap<PixKeyUpdateDto, PixKeyDto>().ReverseMap();
            CreateMap<PixKey, PixKeyDto>().ReverseMap();

            CreateMap<UserRegistrationDto, ApplicationUser>().ReverseMap();
            CreateMap<UserLoginDto, ApplicationUser>().ReverseMap();
        }
    }

}
