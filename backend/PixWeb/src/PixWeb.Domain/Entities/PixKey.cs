using PixWeb.Domain.Enums;

namespace PixWeb.Domain.Entities
{
    public class PixKey
    {
        public int Id { get; set; }
        public string Description { get; set; } = null!;
        public string Key { get; set; } = null!;
        public KeyType KeyType { get; set; }
        public bool IsPersonalKey { get; set; }
        public DateTime CreationDate { get; set; } 
        public DateTime LastUpdateDate { get; set; }
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}

