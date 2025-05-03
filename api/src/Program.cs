internal class Program {
    private static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddControllers();
        var app = builder.Build();

        app.UseHttpsRedirection(); // Use HTTPS redirection
        app.UseStaticFiles(); // Serve static files from wwwroot (standard location). This MUST come before UseRouting and MapFallbackToFile.
        app.UseRouting(); // Enable routing (needed for MapFallbackToFile and API endpoints)
        app.MapControllers(); // Map the controllers

        // TODO: Configure 404 pages
        app.MapFallbackToFile("index.html"); // When endpoint not found, serve the index.html file for the SPA routing to handle

        app.Run();
    }
}
