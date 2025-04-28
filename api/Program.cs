internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var policyName = "allow_origins";
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: policyName,
                policy =>
                {
                    // Use WithOrigins para permitir apenas a origem específica
                    policy.WithOrigins("http://localhost:5173")  // Adicione o seu front-end aqui
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });

        builder.Services.AddControllers();

        var app = builder.Build();
        
        app.UseCors(policyName); // Use CORS middleware
        

        // Configure the HTTP request pipeline.

        // Use HTTPS redirection (recommended)
        // app.UseHttpsRedirection();


        // --- Configuration for Serving Static React App ---

        // 1. Serve static files from wwwroot (standard location)
        //    This MUST come before UseRouting and MapFallbackToFile
        app.UseStaticFiles();

        // 2. Enable routing (needed for MapFallbackToFile and API endpoints)
        app.UseRouting();

        // 3. Define any backend API endpoints *here*, between UseRouting and MapFallbackToFile
        // Example using Minimal API:

        // Redirect to login page if the user is not authenticated
        app.MapGet("/api/test", () => "Test successful");
        app.MapGet("/api/login", () => "Sample");

        // Example if using Controllers:
        app.MapControllers();


        // 4. Configure SPA fallback routing.
        //    If a request doesn't match a static file or an API endpoint,
        //    serve 'index.html' from wwwroot. This lets React Router handle the route.
        //    This MUST come *after* API endpoints.
        app.MapFallbackToFile("index.html");

        // --- End Configuration ---


        app.Run();
    }
}
