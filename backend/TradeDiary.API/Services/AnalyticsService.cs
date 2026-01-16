using Microsoft.EntityFrameworkCore;
using TradeDiary.API.Data;
using TradeDiary.API.DTOs;
using TradeDiary.API.Models;

namespace TradeDiary.API.Services;

public interface IAnalyticsService
{
    Task<AnalyticsSummaryDto> GetSummaryAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<List<PerformanceByEmotionDto>> GetPerformanceByEmotionAsync(Guid userId);
    Task<List<PerformanceByStrategyDto>> GetPerformanceByStrategyAsync(Guid userId);
    Task<List<PerformanceByCoinDto>> GetPerformanceByCoinAsync(Guid userId);
    Task<List<PerformanceByTimeDto>> GetPerformanceByTimeAsync(Guid userId);
    Task<AnalyticsInsightsDto> GetInsightsAsync(Guid userId);
}

public class AnalyticsService : IAnalyticsService
{
    private readonly TradeDiaryContext _context;

    public AnalyticsService(TradeDiaryContext context)
    {
        _context = context;
    }

    public async Task<AnalyticsSummaryDto> GetSummaryAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Trades
            .Where(t => t.UserId == userId && t.ExitPrice.HasValue);

        if (startDate.HasValue)
            query = query.Where(t => t.EntryTime >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(t => t.EntryTime <= endDate.Value);

        var trades = await query.ToListAsync();

        if (!trades.Any())
        {
            return new AnalyticsSummaryDto(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }

        var winningTrades = trades.Where(t => t.PnL > 0).ToList();
        var losingTrades = trades.Where(t => t.PnL <= 0).ToList();

        return new AnalyticsSummaryDto(
            TotalTrades: trades.Count,
            WinningTrades: winningTrades.Count,
            LosingTrades: losingTrades.Count,
            WinRate: trades.Count > 0 ? (decimal)winningTrades.Count / trades.Count * 100 : 0,
            TotalPnL: trades.Sum(t => t.PnL ?? 0),
            AveragePnL: trades.Average(t => t.PnL ?? 0),
            BestTrade: trades.Max(t => t.PnL ?? 0),
            WorstTrade: trades.Min(t => t.PnL ?? 0),
            AverageWin: winningTrades.Any() ? winningTrades.Average(t => t.PnL ?? 0) : 0,
            AverageLoss: losingTrades.Any() ? losingTrades.Average(t => t.PnL ?? 0) : 0
        );
    }

    public async Task<List<PerformanceByEmotionDto>> GetPerformanceByEmotionAsync(Guid userId)
    {
        var trades = await _context.Trades
            .Where(t => t.UserId == userId && t.ExitPrice.HasValue && t.Emotion.HasValue)
            .ToListAsync();

        return trades
            .GroupBy(t => t.Emotion!.Value)
            .Select(g => new PerformanceByEmotionDto(
                Emotion: g.Key,
                TradeCount: g.Count(),
                WinRate: g.Count() > 0 ? (decimal)g.Count(t => t.PnL > 0) / g.Count() * 100 : 0,
                TotalPnL: g.Sum(t => t.PnL ?? 0),
                AveragePnL: g.Average(t => t.PnL ?? 0)
            ))
            .OrderByDescending(p => p.TradeCount)
            .ToList();
    }

    public async Task<List<PerformanceByStrategyDto>> GetPerformanceByStrategyAsync(Guid userId)
    {
        var trades = await _context.Trades
            .Where(t => t.UserId == userId && t.ExitPrice.HasValue && t.Strategy != null)
            .ToListAsync();

        return trades
            .GroupBy(t => t.Strategy!)
            .Select(g => new PerformanceByStrategyDto(
                Strategy: g.Key,
                TradeCount: g.Count(),
                WinRate: g.Count() > 0 ? (decimal)g.Count(t => t.PnL > 0) / g.Count() * 100 : 0,
                TotalPnL: g.Sum(t => t.PnL ?? 0),
                AveragePnL: g.Average(t => t.PnL ?? 0)
            ))
            .OrderByDescending(p => p.TotalPnL)
            .ToList();
    }

    public async Task<List<PerformanceByCoinDto>> GetPerformanceByCoinAsync(Guid userId)
    {
        var trades = await _context.Trades
            .Where(t => t.UserId == userId && t.ExitPrice.HasValue)
            .ToListAsync();

        return trades
            .GroupBy(t => t.Coin)
            .Select(g => new PerformanceByCoinDto(
                Coin: g.Key,
                TradeCount: g.Count(),
                WinRate: g.Count() > 0 ? (decimal)g.Count(t => t.PnL > 0) / g.Count() * 100 : 0,
                TotalPnL: g.Sum(t => t.PnL ?? 0),
                AveragePnL: g.Average(t => t.PnL ?? 0)
            ))
            .OrderByDescending(p => p.TradeCount)
            .ToList();
    }

    public async Task<List<PerformanceByTimeDto>> GetPerformanceByTimeAsync(Guid userId)
    {
        var trades = await _context.Trades
            .Where(t => t.UserId == userId && t.ExitPrice.HasValue)
            .ToListAsync();

        return trades
            .GroupBy(t => t.EntryTime.Hour)
            .Select(g => new PerformanceByTimeDto(
                Hour: g.Key,
                TradeCount: g.Count(),
                WinRate: g.Count() > 0 ? (decimal)g.Count(t => t.PnL > 0) / g.Count() * 100 : 0,
                TotalPnL: g.Sum(t => t.PnL ?? 0)
            ))
            .OrderBy(p => p.Hour)
            .ToList();
    }

    public async Task<AnalyticsInsightsDto> GetInsightsAsync(Guid userId)
    {
        var trades = await _context.Trades
            .Where(t => t.UserId == userId && t.ExitPrice.HasValue)
            .OrderByDescending(t => t.EntryTime)
            .Take(100) // Analyze last 100 trades
            .ToListAsync();

        var insights = new List<InsightDto>();

        if (!trades.Any())
        {
            insights.Add(new InsightDto("Tip", "İlk Adım", "Henüz işlem kaydı yok. İlk trade'ini ekle ve analiz etmeye başla!", "🚀"));
            return new AnalyticsInsightsDto(insights);
        }

        // FOMO Analysis
        var fomoTrades = trades.Where(t => t.Emotion == TradeEmotion.FOMO).ToList();
        if (fomoTrades.Count >= 5)
        {
            var fomoLossRate = fomoTrades.Count > 0 
                ? (decimal)fomoTrades.Count(t => t.PnL <= 0) / fomoTrades.Count * 100 
                : 0;
            
            if (fomoLossRate >= 60)
            {
                insights.Add(new InsightDto(
                    "Warning",
                    "FOMO Uyarısı",
                    $"FOMO ile açtığın işlemlerin %{fomoLossRate:F0}'ı zararda. Acele etme, fırsatlar her zaman gelir!",
                    "😰"
                ));
            }
        }

        // Revenge Trading
        var revengeTrades = trades.Where(t => t.Emotion == TradeEmotion.Revenge).ToList();
        if (revengeTrades.Any())
        {
            var revengeLoss = revengeTrades.Sum(t => t.PnL ?? 0);
            if (revengeLoss < 0)
            {
                insights.Add(new InsightDto(
                    "Warning",
                    "İntikam İşlemleri",
                    $"Revenge trade'lerden toplam ${Math.Abs(revengeLoss):F2} kayıp. Kayıptan sonra mola ver!",
                    "😤"
                ));
            }
        }

        // Night Trading Analysis
        var nightTrades = trades.Where(t => t.EntryTime.Hour >= 0 && t.EntryTime.Hour <= 6).ToList();
        if (nightTrades.Count >= 5)
        {
            var nightLossRate = nightTrades.Count > 0 
                ? (decimal)nightTrades.Count(t => t.PnL <= 0) / nightTrades.Count * 100 
                : 0;
            
            if (nightLossRate >= 65)
            {
                insights.Add(new InsightDto(
                    "Warning",
                    "Gece İşlemleri",
                    $"Gece 00:00-06:00 arası işlemlerin %{nightLossRate:F0}'ı zararda. Uykulu trade yapmaktan kaçın!",
                    "🌙"
                ));
            }
        }

        // Best Strategy
        var strategyPerformance = trades
            .Where(t => !string.IsNullOrEmpty(t.Strategy))
            .GroupBy(t => t.Strategy)
            .Select(g => new { Strategy = g.Key, PnL = g.Sum(t => t.PnL ?? 0), Count = g.Count() })
            .OrderByDescending(s => s.PnL)
            .FirstOrDefault();

        if (strategyPerformance != null && strategyPerformance.PnL > 0 && strategyPerformance.Count >= 5)
        {
            insights.Add(new InsightDto(
                "Achievement",
                "En İyi Strateji",
                $"'{strategyPerformance.Strategy}' stratejisi ${strategyPerformance.PnL:F2} kar sağladı. Bu stratejiyi korumaya devam et!",
                "🏆"
            ));
        }

        // Best Coin
        var coinPerformance = trades
            .GroupBy(t => t.Coin)
            .Select(g => new { Coin = g.Key, WinRate = g.Count() > 0 ? (decimal)g.Count(t => t.PnL > 0) / g.Count() * 100 : 0, Count = g.Count() })
            .Where(c => c.Count >= 5)
            .OrderByDescending(c => c.WinRate)
            .FirstOrDefault();

        if (coinPerformance != null && coinPerformance.WinRate >= 60)
        {
            insights.Add(new InsightDto(
                "Tip",
                $"{coinPerformance.Coin} Performansı",
                $"{coinPerformance.Coin} işlemlerinde %{coinPerformance.WinRate:F0} win rate! Bu coin sana iyi geliyor.",
                "💰"
            ));
        }

        // Worst Coin
        var worstCoin = trades
            .GroupBy(t => t.Coin)
            .Select(g => new { Coin = g.Key, WinRate = g.Count() > 0 ? (decimal)g.Count(t => t.PnL > 0) / g.Count() * 100 : 0, Count = g.Count() })
            .Where(c => c.Count >= 5)
            .OrderBy(c => c.WinRate)
            .FirstOrDefault();

        if (worstCoin != null && worstCoin.WinRate < 40)
        {
            insights.Add(new InsightDto(
                "Warning",
                $"{worstCoin.Coin} Dikkat",
                $"{worstCoin.Coin} işlemlerinde sadece %{worstCoin.WinRate:F0} win rate. Bu coin'i tekrar değerlendir!",
                "⚠️"
            ));
        }

        // Win Streak
        var winStreak = 0;
        var currentStreak = 0;
        foreach (var trade in trades.OrderBy(t => t.EntryTime))
        {
            if (trade.PnL > 0)
            {
                currentStreak++;
                winStreak = Math.Max(winStreak, currentStreak);
            }
            else
            {
                currentStreak = 0;
            }
        }

        if (winStreak >= 5)
        {
            insights.Add(new InsightDto(
                "Achievement",
                "Kazanan Seri",
                $"En uzun kazanma serin: {winStreak} işlem! Harika performans!",
                "🔥"
            ));
        }

        // Calm Trading is Best
        var calmTrades = trades.Where(t => t.Emotion == TradeEmotion.Calm).ToList();
        if (calmTrades.Count >= 5)
        {
            var calmWinRate = calmTrades.Count > 0 
                ? (decimal)calmTrades.Count(t => t.PnL > 0) / calmTrades.Count * 100 
                : 0;
            
            if (calmWinRate >= 55)
            {
                insights.Add(new InsightDto(
                    "Tip",
                    "Sakin Ol, Kazan",
                    $"Sakin durumdayken win rate: %{calmWinRate:F0}. Duygularını kontrol etmeye devam et!",
                    "😎"
                ));
            }
        }

        // Bot Performance vs Manual
        var botTrades = trades.Where(t => t.IsFromBot).ToList();
        var manualTrades = trades.Where(t => !t.IsFromBot).ToList();
        if (botTrades.Count >= 10 && manualTrades.Count >= 10)
        {
            var botWinRate = (decimal)botTrades.Count(t => t.PnL > 0) / botTrades.Count * 100;
            var manualWinRate = (decimal)manualTrades.Count(t => t.PnL > 0) / manualTrades.Count * 100;

            if (Math.Abs(botWinRate - manualWinRate) >= 10)
            {
                var better = botWinRate > manualWinRate ? "Bot" : "Manuel";
                var betterRate = Math.Max(botWinRate, manualWinRate);
                insights.Add(new InsightDto(
                    "Tip",
                    "Bot vs Manuel",
                    $"{better} işlemler daha iyi (%{betterRate:F0} win rate). Stratejini buna göre ayarla!",
                    "🤖"
                ));
            }
        }

        if (!insights.Any())
        {
            insights.Add(new InsightDto(
                "Tip",
                "Daha Fazla Veri Gerekli",
                "Daha detaylı analiz için işlem sayını artır ve duygu/strateji bilgilerini ekle!",
                "📊"
            ));
        }

        return new AnalyticsInsightsDto(insights);
    }
}
