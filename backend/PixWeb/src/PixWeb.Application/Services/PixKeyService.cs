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

        public async Task<PixKeyListDto> GetAllAsync(int? page = null, int? pageSize = null)
        {
            if (string.IsNullOrEmpty(_userId))
            {
                return new PixKeyListDto { PixKeys = Enumerable.Empty<PixKeyDto>(), TotalRecords = 0 };
            }

            var (pixKeys, totalRecords) = await _pixKeyRepository.GetAllAsync(_userId, page, pageSize);
            return new PixKeyListDto { PixKeys = _mapper.Map<IEnumerable<PixKeyDto>>(pixKeys), TotalRecords = totalRecords, Page = page ?? 1, PageSize = pageSize ?? totalRecords };
        }

        public async Task<PixKeyDto> GetByKeyAsync(string key)
        {
            var pixKey = await _pixKeyRepository.GetByKeyAsync(_userId, key);
            return _mapper.Map<PixKeyDto>(pixKey);
        }

        public async Task<PixKeyDto> GetByIdAsync(int id)
        {
            var pixKey = await _pixKeyRepository.GetByIdAsync(_userId, id);
            return _mapper.Map<PixKeyDto>(pixKey);
        }


        public async Task<PixKeyDto> CreateAsync(PixKeyCreateDto pixKeyCreateDto)
        {
            var existingPixKey = await _pixKeyRepository.GetByKeyAsync(_userId, pixKeyCreateDto.Key);

            if (existingPixKey != null && existingPixKey.UserId == _userId)
            {
                Notify("Chave já cadastrada.");
                return _mapper.Map<PixKeyDto>(pixKeyCreateDto);
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
            
            var existingKeyForUser = await _pixKeyRepository.GetByKeyAsync(_userId, pixKeyUpdateDto.Key);

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
