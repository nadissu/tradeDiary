using TradeDiary.API.Models;

namespace TradeDiary.API.DTOs;

// Summary Analytics
public record AnalyticsSummaryDto(
    int TotalTrades,
    int WinningTrades,
    int LosingTrades,
    decimal WinRate,
    decimal TotalPnL,
    decimal AveragePnL,
    decimal BestTrade,
    decimal WorstTrade,
    decimal AverageWin,
    decimal AverageLoss
);

// Performance by category
public record PerformanceByEmotionDto(
    TradeEmotion Emotion,
    int TradeCount,
    decimal WinRate,
    decimal TotalPnL,
    decimal AveragePnL
);

public record PerformanceByStrategyDto(
    string Strategy,
    int TradeCount,
    decimal WinRate,
    decimal TotalPnL,
    decimal AveragePnL
);

public record PerformanceByCoinDto(
    string Coin,
    int TradeCount,
    decimal WinRate,
    decimal TotalPnL,
    decimal AveragePnL
);

public record PerformanceByTimeDto(
    int Hour,
    int TradeCount,
    decimal WinRate,
    decimal TotalPnL
);

// Insights
public record InsightDto(
    string Type,       // Warning, Tip, Achievement
    string Title,
    string Message,
    string? Emoji
);

public record AnalyticsInsightsDto(
    List<InsightDto> Insights
);
