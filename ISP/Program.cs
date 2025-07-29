using ISP.DataAccess;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using ISP.Services;
using ISP.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using System.Text;
using Dapper;

var builder = WebApplication.CreateBuilder(args);

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var jwt = builder.Configuration
    .GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwt["Key"]!);

builder.Services.AddAuthentication(options => { options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

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



builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MyISP API", Version = "v1" });
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT with Bearer prefix"
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [scheme] = new[] { "Bearer" }
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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseCors(MyAllowSpecificOrigins);

app.Run();
