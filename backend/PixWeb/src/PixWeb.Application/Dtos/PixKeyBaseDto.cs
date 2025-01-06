using PixWeb.Domain.Enums;

namespace PixWeb.Application.Dtos
{
    public abstract class PixKeyBaseDto
    {
        public string Description { get; set; } = null!;
        public string Key { get; set; } = null!;
        public KeyType KeyType { get; set; } 
        public bool IsPersonalKey { get; set; }
    }
}
