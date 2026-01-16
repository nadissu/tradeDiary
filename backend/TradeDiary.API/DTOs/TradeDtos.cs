using System.ComponentModel.DataAnnotations;
using TradeDiary.API.Models;

namespace TradeDiary.API.DTOs;

// Create/Update Trade DTO
public record CreateTradeDto(
    [Required] string Coin,
    [Required] decimal EntryPrice,
    [Required] decimal PositionSize,
    [Required] TradeDirection Direction,
    [Required] DateTime EntryTime,
    decimal? ExitPrice = null,
    int Leverage = 1,
    DateTime? ExitTime = null,
    string Timeframe = "1h",
    string? Strategy = null,
    TradeEmotion? Emotion = null,
    string? Notes = null,
    bool IsFromBot = false,
    string? BotName = null
);

public record UpdateTradeDto(
    string? Coin = null,
    decimal? EntryPrice = null,
    decimal? ExitPrice = null,
    int? Leverage = null,
    decimal? PositionSize = null,
    TradeDirection? Direction = null,
    DateTime? EntryTime = null,
    DateTime? ExitTime = null,
    string? Timeframe = null,
    string? Strategy = null,
    TradeEmotion? Emotion = null,
    string? Notes = null,
    bool? IsFromBot = null,
    string? BotName = null
);

// Response DTO
public record TradeDto(
    Guid Id,
    string Coin,
    decimal EntryPrice,
    decimal? ExitPrice,
    int Leverage,
    decimal PositionSize,
    TradeDirection Direction,
    DateTime EntryTime,
    DateTime? ExitTime,
    decimal? PnL,
    decimal? PnLPercent,
    string Timeframe,
    string? Strategy,
    TradeEmotion? Emotion,
    string? Notes,
    bool IsFromBot,
    string? BotName,
    DateTime CreatedAt
);

// Trade Filter DTO
public record TradeFilterDto(
    string? Coin = null,
    TradeDirection? Direction = null,
    TradeEmotion? Emotion = null,
    string? Strategy = null,
    bool? IsFromBot = null,
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    int Page = 1,
    int PageSize = 20
);

// Bot Import DTO
public record BotTradeImportDto(
    string Coin,
    decimal EntryPrice,
    decimal ExitPrice,
    decimal PositionSize,
    TradeDirection Direction,
    DateTime EntryTime,
    DateTime ExitTime,
    int Leverage = 1,
    string BotName = "Unknown Bot"
);
