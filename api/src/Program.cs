using System.Text;
using api.src.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

internal class Program {
    private static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        var configuration = builder.Configuration;

        // --- Configure Authentication AND Set Defaults ---
        builder.Services.AddAuthentication()
        .AddJwtBearer(options => // Configure the specifics for the JWT Bearer scheme
        {
            options.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["JWT:ValidIssuer"],
                ValidAudience = configuration["JWT:ValidAudience"],
                // Ensure your secret retrieval handles potential nulls safely
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    configuration["JWT:Secret"] ?? throw new InvalidOperationException("JWT:Secret not found in configuration")
                ))
            };
            // You can add event handlers here if needed, e.g., for logging failures
            // options.Events = new JwtBearerEvents { ... };
        });

        // var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>(); // Get logger
        // logger.LogInformation("Example: {Var}", 123);

        // --- Add Authorization Services ---
        // Ensures services needed by UseAuthorization() middleware are registered
        builder.Services.AddAuthorization();
        // ----------------------------------

        builder.Services.AddControllers();

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(
                builder.Configuration.GetConnectionString("DefaultConnection"),
                new MySqlServerVersion(new Version(8, 0, 23)), mySqlOptions => mySqlOptions.EnableRetryOnFailure())
        );

        var app = builder.Build();

        app.UseHttpsRedirection(); // Use HTTPS redirection
        app.UseStaticFiles(); // Serve static files from wwwroot (standard location). This MUST come before UseRouting and MapFallbackToFile.
        app.UseRouting(); // Enable routing (needed for MapFallbackToFile and API endpoints)
        app.MapControllers(); // Map the controllers

        app.UseAuthentication(); // First, authenticate the user (validate JWT)
        app.UseAuthorization();  // THEN, authorize the request (check [Authorize] attributes)

        // TODO: Configure 404 pages
        app.MapFallbackToFile("index.html"); // When endpoint not found, serve the index.html file for the SPA routing to handle
        app.Run();
    }
}
