using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeDiary.API.DTOs;
using TradeDiary.API.Services;

namespace TradeDiary.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TradesController : ControllerBase
{
    private readonly ITradeService _tradeService;

    public TradesController(ITradeService tradeService)
    {
        _tradeService = tradeService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TradeDto>>> GetTrades([FromQuery] TradeFilterDto filter)
    {
        var userId = GetUserId();
        var trades = await _tradeService.GetTradesAsync(userId, filter);
        return Ok(trades);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TradeDto>> GetTrade(Guid id)
    {
        var userId = GetUserId();
        var trade = await _tradeService.GetTradeByIdAsync(userId, id);
        
        if (trade == null)
        {
            return NotFound(new { message = "İşlem bulunamadı." });
        }

        return Ok(trade);
    }

    [HttpPost]
    public async Task<ActionResult<TradeDto>> CreateTrade([FromBody] CreateTradeDto dto)
    {
        var userId = GetUserId();
        var trade = await _tradeService.CreateTradeAsync(userId, dto);
        return CreatedAtAction(nameof(GetTrade), new { id = trade.Id }, trade);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TradeDto>> UpdateTrade(Guid id, [FromBody] UpdateTradeDto dto)
    {
        var userId = GetUserId();
        var trade = await _tradeService.UpdateTradeAsync(userId, id, dto);
        
        if (trade == null)
        {
            return NotFound(new { message = "İşlem bulunamadı." });
        }

        return Ok(trade);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTrade(Guid id)
    {
        var userId = GetUserId();
        var result = await _tradeService.DeleteTradeAsync(userId, id);
        
        if (!result)
        {
            return NotFound(new { message = "İşlem bulunamadı." });
        }

        return NoContent();
    }

    [HttpPost("import")]
    public async Task<ActionResult<List<TradeDto>>> ImportBotTrades([FromBody] List<BotTradeImportDto> trades)
    {
        var userId = GetUserId();
        var importedTrades = await _tradeService.ImportBotTradesAsync(userId, trades);
        return Ok(new { 
            message = $"{importedTrades.Count} işlem başarıyla import edildi.",
            trades = importedTrades 
        });
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}
