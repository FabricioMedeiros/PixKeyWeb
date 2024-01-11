using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PixWeb.Domain.Entities;

namespace PixWeb.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<PixKey> PixKeys { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("usuarios");
            builder.Entity<PixKey>()
                .ToTable("chaves_pix")
                .HasIndex(c => new { c.Key, c.UserId })
                .IsUnique();
        }
    }
}
