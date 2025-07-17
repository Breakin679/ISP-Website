using ISP.DataAccess;
using ISP.DataAccess.Interfaces;
using ISP.Services;
using ISP.Services.Interfaces;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// 1. Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy
          .WithOrigins("*")   // your React app URL
          .AllowAnyHeader()
          .AllowAnyMethod();
    });
});
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


app.UseRouting();

// IMPORTANT: UseCors before any endpoints



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
app.UseCors(MyAllowSpecificOrigins);

app.Run();
