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
        // --- Use CORS Middleware ---
        app.UseCors(policyName);
        // Configura o pipeline HTTP para usar os controllers
        app.MapControllers();
        app.Run();
    }
}