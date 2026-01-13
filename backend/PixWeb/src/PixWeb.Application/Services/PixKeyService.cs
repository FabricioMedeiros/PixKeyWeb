using AutoMapper;
using Microsoft.AspNetCore.Http;
using PixWeb.Application.Dtos;
using PixWeb.Application.Notifications;
using PixWeb.Domain.Entities;
using PixWeb.Domain.Interfaces;

namespace PixWeb.Application.Services
{
    public class PixKeyService : BaseService, IPixKeyService
    {
        private readonly IPixKeyRepository _pixKeyRepository;
        private readonly IMapper _mapper;

        public PixKeyService(
            IPixKeyRepository pixKeyRepository,
            IMapper mapper,
            INotificator notificator,
            IHttpContextAccessor httpContextAccessor)
            : base(notificator, httpContextAccessor)
        {
            _pixKeyRepository = pixKeyRepository ?? throw new ArgumentNullException(nameof(pixKeyRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<PixKeyListDto> GetAllAsync(
            string? field = null,
            object? value = null,
            int? page = null,
            int? pageSize = null)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return new PixKeyListDto { PixKeys = Enumerable.Empty<PixKeyDto>(), TotalRecords = 0 };
            }

            var (pixKeys, totalRecords) = await _pixKeyRepository.GetAllAsync(userId, field, value, page, pageSize, Notify);

            return new PixKeyListDto
            {
                PixKeys = _mapper.Map<IEnumerable<PixKeyDto>>(pixKeys),
                TotalRecords = totalRecords,
                Page = page ?? 1,
                PageSize = pageSize ?? pixKeys.Count()
            };
        }

        public async Task<PixKeyDto> GetByIdAsync(int id)
        {
            var pixKey = await _pixKeyRepository.GetByIdAsync(userId, id);
            return _mapper.Map<PixKeyDto>(pixKey);
        }

        public async Task<PixKeyDto> CreateAsync(PixKeyCreateDto pixKeyCreateDto)
        {
            var existingPixKeys = await _pixKeyRepository.GetAllAsync(userId, "Key", pixKeyCreateDto.Key, null, null, Notify);

            if (existingPixKeys.pixKeys.Any(k => k.UserId == userId))
            {
                Notify("Chave já cadastrada.");
                return _mapper.Map<PixKeyDto>(pixKeyCreateDto);
            }

            var pixKey = _mapper.Map<PixKey>(pixKeyCreateDto);
            pixKey.CreationDate = DateTime.UtcNow;
            pixKey.UserId = userId;

            var createdPixKey = await _pixKeyRepository.AddAsync(pixKey);
            return _mapper.Map<PixKeyDto>(createdPixKey);
        }

        public async Task<PixKeyDto> UpdateAsync(PixKeyUpdateDto pixKeyUpdateDto)
        {
            var existingKey = await _pixKeyRepository.GetByIdAsync(userId, pixKeyUpdateDto.Id);

            if (existingKey == null)
            {
                Notify("Chave não localizada.");
                return _mapper.Map<PixKeyDto>(pixKeyUpdateDto);
            }

            var existingKeyForUser = await _pixKeyRepository.GetAllAsync(userId, "Key", pixKeyUpdateDto.Key);
            
            if (existingKeyForUser.pixKeys.Any(k => k.Id != pixKeyUpdateDto.Id))
            {
                Notify("Chave já cadastrada.");
                return _mapper.Map<PixKeyDto>(pixKeyUpdateDto);
            }

            _mapper.Map(pixKeyUpdateDto, existingKey);

            var updatedPixKey = await _pixKeyRepository.UpdateAsync(existingKey);
            return _mapper.Map<PixKeyDto>(updatedPixKey);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existingPixKey = await _pixKeyRepository.GetByIdAsync(userId, id);

            if (existingPixKey == null)
            {
                Notify("Chave não localizada.");
                return false;
            }

            await _pixKeyRepository.DeleteAsync(existingPixKey);
            return true;
        }
    }
}
