using Microsoft.EntityFrameworkCore;
using TradeDiary.API.Data;
using TradeDiary.API.DTOs;
using TradeDiary.API.Models;

namespace TradeDiary.API.Services;

public interface ITradeService
{
    Task<List<TradeDto>> GetTradesAsync(Guid userId, TradeFilterDto filter);
    Task<TradeDto?> GetTradeByIdAsync(Guid userId, Guid tradeId);
    Task<TradeDto> CreateTradeAsync(Guid userId, CreateTradeDto dto);
    Task<TradeDto?> UpdateTradeAsync(Guid userId, Guid tradeId, UpdateTradeDto dto);
    Task<bool> DeleteTradeAsync(Guid userId, Guid tradeId);
    Task<List<TradeDto>> ImportBotTradesAsync(Guid userId, List<BotTradeImportDto> trades);
}

public class TradeService : ITradeService
{
    private readonly TradeDiaryContext _context;

    public TradeService(TradeDiaryContext context)
    {
        _context = context;
    }

    public async Task<List<TradeDto>> GetTradesAsync(Guid userId, TradeFilterDto filter)
    {
        var query = _context.Trades
            .Where(t => t.UserId == userId)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(filter.Coin))
            query = query.Where(t => t.Coin.ToLower().Contains(filter.Coin.ToLower()));
        
        if (filter.Direction.HasValue)
            query = query.Where(t => t.Direction == filter.Direction.Value);
        
        if (filter.Emotion.HasValue)
            query = query.Where(t => t.Emotion == filter.Emotion.Value);
        
        if (!string.IsNullOrEmpty(filter.Strategy))
            query = query.Where(t => t.Strategy != null && t.Strategy.ToLower().Contains(filter.Strategy.ToLower()));
        
        if (filter.IsFromBot.HasValue)
            query = query.Where(t => t.IsFromBot == filter.IsFromBot.Value);
        
        if (filter.StartDate.HasValue)
            query = query.Where(t => t.EntryTime >= filter.StartDate.Value);
        
        if (filter.EndDate.HasValue)
            query = query.Where(t => t.EntryTime <= filter.EndDate.Value);

        var trades = await query
            .OrderByDescending(t => t.EntryTime)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return trades.Select(MapToDto).ToList();
    }

    public async Task<TradeDto?> GetTradeByIdAsync(Guid userId, Guid tradeId)
    {
        var trade = await _context.Trades
            .FirstOrDefaultAsync(t => t.Id == tradeId && t.UserId == userId);
        
        return trade == null ? null : MapToDto(trade);
    }

    public async Task<TradeDto> CreateTradeAsync(Guid userId, CreateTradeDto dto)
    {
        var trade = new Trade
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Coin = dto.Coin.ToUpper(),
            EntryPrice = dto.EntryPrice,
            ExitPrice = dto.ExitPrice,
            Leverage = dto.Leverage,
            PositionSize = dto.PositionSize,
            Direction = dto.Direction,
            EntryTime = dto.EntryTime,
            ExitTime = dto.ExitTime,
            Timeframe = dto.Timeframe,
            Strategy = dto.Strategy,
            Emotion = dto.Emotion,
            Notes = dto.Notes,
            IsFromBot = dto.IsFromBot,
            BotName = dto.BotName,
            CreatedAt = DateTime.UtcNow
        };

        // Calculate PnL if trade is closed
        CalculatePnL(trade);

        _context.Trades.Add(trade);
        await _context.SaveChangesAsync();

        return MapToDto(trade);
    }

    public async Task<TradeDto?> UpdateTradeAsync(Guid userId, Guid tradeId, UpdateTradeDto dto)
    {
        var trade = await _context.Trades
            .FirstOrDefaultAsync(t => t.Id == tradeId && t.UserId == userId);

        if (trade == null) return null;

        // Update fields if provided
        if (dto.Coin != null) trade.Coin = dto.Coin.ToUpper();
        if (dto.EntryPrice.HasValue) trade.EntryPrice = dto.EntryPrice.Value;
        if (dto.ExitPrice.HasValue) trade.ExitPrice = dto.ExitPrice.Value;
        if (dto.Leverage.HasValue) trade.Leverage = dto.Leverage.Value;
        if (dto.PositionSize.HasValue) trade.PositionSize = dto.PositionSize.Value;
        if (dto.Direction.HasValue) trade.Direction = dto.Direction.Value;
        if (dto.EntryTime.HasValue) trade.EntryTime = dto.EntryTime.Value;
        if (dto.ExitTime.HasValue) trade.ExitTime = dto.ExitTime.Value;
        if (dto.Timeframe != null) trade.Timeframe = dto.Timeframe;
        if (dto.Strategy != null) trade.Strategy = dto.Strategy;
        if (dto.Emotion.HasValue) trade.Emotion = dto.Emotion.Value;
        if (dto.Notes != null) trade.Notes = dto.Notes;
        if (dto.IsFromBot.HasValue) trade.IsFromBot = dto.IsFromBot.Value;
        if (dto.BotName != null) trade.BotName = dto.BotName;

        trade.UpdatedAt = DateTime.UtcNow;
        
        // Recalculate PnL
        CalculatePnL(trade);

        await _context.SaveChangesAsync();

        return MapToDto(trade);
    }

    public async Task<bool> DeleteTradeAsync(Guid userId, Guid tradeId)
    {
        var trade = await _context.Trades
            .FirstOrDefaultAsync(t => t.Id == tradeId && t.UserId == userId);

        if (trade == null) return false;

        _context.Trades.Remove(trade);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<TradeDto>> ImportBotTradesAsync(Guid userId, List<BotTradeImportDto> trades)
    {
        var importedTrades = new List<Trade>();

        foreach (var dto in trades)
        {
            var trade = new Trade
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Coin = dto.Coin.ToUpper(),
                EntryPrice = dto.EntryPrice,
                ExitPrice = dto.ExitPrice,
                Leverage = dto.Leverage,
                PositionSize = dto.PositionSize,
                Direction = dto.Direction,
                EntryTime = dto.EntryTime,
                ExitTime = dto.ExitTime,
                IsFromBot = true,
                BotName = dto.BotName,
                CreatedAt = DateTime.UtcNow
            };

            CalculatePnL(trade);
            importedTrades.Add(trade);
        }

        _context.Trades.AddRange(importedTrades);
        await _context.SaveChangesAsync();

        return importedTrades.Select(MapToDto).ToList();
    }

    private void CalculatePnL(Trade trade)
    {
        if (!trade.ExitPrice.HasValue) return;

        decimal priceDiff = trade.Direction == TradeDirection.Long
            ? trade.ExitPrice.Value - trade.EntryPrice
            : trade.EntryPrice - trade.ExitPrice.Value;

        trade.PnLPercent = (priceDiff / trade.EntryPrice) * 100 * trade.Leverage;
        trade.PnL = trade.PositionSize * (trade.PnLPercent / 100);
    }

    private static TradeDto MapToDto(Trade trade)
    {
        return new TradeDto(
            trade.Id,
            trade.Coin,
            trade.EntryPrice,
            trade.ExitPrice,
            trade.Leverage,
            trade.PositionSize,
            trade.Direction,
            trade.EntryTime,
            trade.ExitTime,
            trade.PnL,
            trade.PnLPercent,
            trade.Timeframe,
            trade.Strategy,
            trade.Emotion,
            trade.Notes,
            trade.IsFromBot,
            trade.BotName,
            trade.CreatedAt
        );
    }
}
