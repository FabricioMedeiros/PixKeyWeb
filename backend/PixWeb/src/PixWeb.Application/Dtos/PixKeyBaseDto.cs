using PixWeb.Domain.Enums;

namespace PixWeb.Application.Dtos
{
    public abstract class PixKeyBaseDto
    {
        public string Description { get; set; }
        public string Key { get; set; }
        public KeyType KeyType { get; set; }
        public bool IsPersonalKey { get; set; }
    }
}
