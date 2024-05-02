namespace PixWeb.Application.Dtos
{
    public class PixKeyListDto
    {
        public int TotalRecords { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }

        public IEnumerable<PixKeyDto>? PixKeys { get; set; }
    }
}
