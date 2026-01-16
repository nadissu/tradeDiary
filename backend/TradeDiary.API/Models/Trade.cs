namespace TradeDiary.API.Models;

public enum TradeDirection
{
    Long,
    Short
}

public enum TradeEmotion
{
    FOMO,       // Fear of Missing Out
    Fear,       // Korku
    Greed,      // Açgözlülük
    Revenge,    // İntikam İşlemi
    Confident,  // Güvenli
    Uncertain,  // Kararsız
    Calm,       // Sakin
    Excited,    // Heyecanlı
    Anxious     // Endişeli
}

public class Trade
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    // Trade Details
    public string Coin { get; set; } = string.Empty;
    public decimal EntryPrice { get; set; }
    public decimal? ExitPrice { get; set; }
    public int Leverage { get; set; } = 1;
    public decimal PositionSize { get; set; }
    public TradeDirection Direction { get; set; }
    
    // Timing
    public DateTime EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
    
    // Results
    public decimal? PnL { get; set; }
    public decimal? PnLPercent { get; set; }
    
    // Analysis
    public string Timeframe { get; set; } = "1h";
    public string? Strategy { get; set; }
    public TradeEmotion? Emotion { get; set; }
    public string? Notes { get; set; }
    
    // Bot tracking
    public bool IsFromBot { get; set; } = false;
    public string? BotName { get; set; }
    
    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation
    public User User { get; set; } = null!;
}
