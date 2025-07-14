using ISP.DataAccess;
using ISP.DataAccess.Interfaces;
using ISP.Services;
using ISP.Services.Interfaces;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1) Add controllers
builder.Services.AddControllers();

// 2) Register your data‑access and service layers
builder.Services.AddSingleton(typeof(IRepository<>), typeof(DapperRepository<>));
builder.Services.AddSingleton<IPlansDataAccess, PlansDataAccess>();
builder.Services.AddSingleton<IPlansService, PlansService>();

// 3) Add Swagger generation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MyISP API",
        Version = "v1",
        Description = "ISP endpoints"
    });
});

var app = builder.Build();

// 4) Configure middleware – **no environment check**, so always enabled
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    // The JSON endpoint:
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyISP API v1");
    // Serve Swagger UI at the app root (https://localhost:<port>/)
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
