namespace TradeDiary.API.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<Trade> Trades { get; set; } = new List<Trade>();
    public ICollection<Strategy> Strategies { get; set; } = new List<Strategy>();
}
