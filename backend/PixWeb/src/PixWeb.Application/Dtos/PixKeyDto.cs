namespace PixWeb.Application.Dtos
{
    public class PixKeyDto : PixKeyBaseDto
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; }
        public string UserId { get; set; }
    }
}

