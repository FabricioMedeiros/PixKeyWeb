using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PixWeb.Domain.Entities;
using PixWeb.Infrastructure.Data;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//Add. DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//Add . Dependecy Injection
builder.Services.AddScoped<UserManager<ApplicationUser>>();
builder.Services.AddScoped<ClaimsPrincipal>(s => s.GetService<IHttpContextAccessor>()?.HttpContext?.User);

//Add .Auto Mapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
