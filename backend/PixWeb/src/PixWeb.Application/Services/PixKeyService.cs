using AutoMapper;
using PixWeb.Application.Dtos;
using PixWeb.Application.Notifications;
using PixWeb.Domain.Entities;
using PixWeb.Domain.Interfaces;
using System.Security.Claims;

namespace PixWeb.Application.Services
{
    public class PixKeyService : BaseService, IPixKeyService
    {
        private readonly IPixKeyRepository _pixKeyRepository;
        private readonly IMapper _mapper;
        private readonly ClaimsPrincipal _currentUser;
        private readonly string? _userId;

        public PixKeyService(IPixKeyRepository pixKeyRepository, 
            IMapper mapper,
            INotificator notificator,
            ClaimsPrincipal currentUser) : base(notificator, currentUser)
        {
            _pixKeyRepository = pixKeyRepository ?? throw new ArgumentNullException(nameof(pixKeyRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _currentUser = currentUser ?? throw new ArgumentNullException(nameof(currentUser));
            _userId = _currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task<PixKeyListDto> GetAllAsync(string? field = null, string? value = null, int? page = null, int? pageSize = null)
        {
            if (string.IsNullOrEmpty(_userId))
            {
                return new PixKeyListDto { PixKeys = Enumerable.Empty<PixKeyDto>(), TotalRecords = 0 };
            }

            var (pixKeys, totalRecords) = await _pixKeyRepository.GetAllAsync(_userId, field, value, page, pageSize);
            return new PixKeyListDto { PixKeys = _mapper.Map<IEnumerable<PixKeyDto>>(pixKeys), TotalRecords = totalRecords, Page = page ?? 1, PageSize = pageSize ?? totalRecords };
        }

        public async Task<PixKeyDto> GetByIdAsync(int id)
        {
            var pixKey = await _pixKeyRepository.GetByIdAsync(_userId, id);
            return _mapper.Map<PixKeyDto>(pixKey);
        }

        public async Task<PixKeyDto> CreateAsync(PixKeyCreateDto pixKeyCreateDto)
        {
            var existingPixKeys = await _pixKeyRepository.GetAllAsync(_userId, "Key", pixKeyCreateDto.Key);

            if (existingPixKeys.pixKeys.Any())
            {
                foreach (var existingPixKey in existingPixKeys.pixKeys)
                {
                    if (existingPixKey.UserId == _userId)
                    {
                        Notify("Chave já cadastrada.");
                        return _mapper.Map<PixKeyDto>(pixKeyCreateDto);
                    }
                }
            }

            var pixKey = _mapper.Map<PixKey>(pixKeyCreateDto);

            pixKey.CreationDate = DateTime.UtcNow;
            pixKey.UserId = _userId;

            var createdPixKey = await _pixKeyRepository.AddAsync(pixKey);
            return _mapper.Map<PixKeyDto>(createdPixKey);
        }

        public async Task<PixKeyDto> UpdateAsync(PixKeyUpdateDto pixKeyUpdateDto)
        {
            var existingKey = await _pixKeyRepository.GetByIdAsync(_userId, pixKeyUpdateDto.Id);
            
            if (existingKey == null)
            {
                Notify("Chave 'não localizada.");
                return _mapper.Map<PixKeyDto>(pixKeyUpdateDto);
            }
            
            var existingKeyForUser = await _pixKeyRepository.GetByIdAsync(_userId, pixKeyUpdateDto.Id);

            if (existingKeyForUser != null && existingKeyForUser.Id != existingKey.Id)
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
            var existingPixKey = await _pixKeyRepository.GetByIdAsync(_userId, id);

            if (existingPixKey == null)
            {
                Notify("Chave 'não localizada.");
                return false;
            }

            await _pixKeyRepository.DeleteAsync(existingPixKey);
            return true;
        }
    }
}
