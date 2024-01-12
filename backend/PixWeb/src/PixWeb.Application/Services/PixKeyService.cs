using AutoMapper;
using PixWeb.Application.Dtos;
using PixWeb.Domain.Entities;
using PixWeb.Domain.Interfaces;
using System.Security.Claims;

namespace PixWeb.Application.Services
{
    public class PixKeyService : IPixKeyService
    {
        private readonly IPixKeyRepository _pixKeyRepository;
        private readonly IMapper _mapper;
        private readonly ClaimsPrincipal _currentUser;
        private readonly string _userId;

        public PixKeyService(IPixKeyRepository pixKeyRepository, 
            IMapper mapper,
            ClaimsPrincipal currentUser)
        {
            _pixKeyRepository = pixKeyRepository ?? throw new ArgumentNullException(nameof(pixKeyRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _currentUser = currentUser ?? throw new ArgumentNullException(nameof(currentUser));
            _userId = _currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task<IEnumerable<PixKeyDto>> GetAllAsync()
        {
            if (string.IsNullOrEmpty(_userId))
            {  
                return Enumerable.Empty<PixKeyDto>();
            }

            var pixKeys = await _pixKeyRepository.GetAllAsync(_userId);
            return _mapper.Map<IEnumerable<PixKeyDto>>(pixKeys);
        }

        public async Task<PixKeyDto> GetByKeyAsync(string key)
        {
            var pixKey = await _pixKeyRepository.GetByKeyAsync(_userId, key);
            return _mapper.Map<PixKeyDto>(pixKey);
        }

        public async Task<PixKeyDto> CreateAsync(PixKeyCreateDto pixKeyCreateDto)
        {
            var existingPixKey = await _pixKeyRepository.GetByKeyAsync(_userId, pixKeyCreateDto.Key);

            if (existingPixKey != null && existingPixKey.UserId == _userId)
            {
                throw new InvalidOperationException("Chave já cadastrada para o usuário.");
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
                throw new InvalidOperationException("Chave 'não localizada.");
            }
            
            var existingKeyForUser = await _pixKeyRepository.GetByKeyAsync(_userId, pixKeyUpdateDto.Key);

            if (existingKeyForUser != null && existingKeyForUser.Id != existingKey.Id)
            {
                throw new InvalidOperationException("Chave já cadastrada para o usuário.");
            }

            _mapper.Map(pixKeyUpdateDto, existingKey);
         
            var updatedPixKey = await _pixKeyRepository.UpdateAsync(existingKey);
            return _mapper.Map<PixKeyDto>(updatedPixKey);
        }

        public async Task<bool> DeleteAsync(string key)
        {
            var existingPixKey = await _pixKeyRepository.GetByKeyAsync(_userId, key);

            if (existingPixKey == null)
            {
                throw new InvalidOperationException("Chave 'não localizada.");
            }

            await _pixKeyRepository.DeleteAsync(existingPixKey);
            return true;
        }
    }
}
