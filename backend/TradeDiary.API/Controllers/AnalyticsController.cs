using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeDiary.API.DTOs;
using TradeDiary.API.Services;

namespace TradeDiary.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AnalyticsSummaryDto>> GetSummary(
        [FromQuery] DateTime? startDate = null, 
        [FromQuery] DateTime? endDate = null)
    {
        var userId = GetUserId();
        var summary = await _analyticsService.GetSummaryAsync(userId, startDate, endDate);
        return Ok(summary);
    }

    [HttpGet("by-emotion")]
    public async Task<ActionResult<List<PerformanceByEmotionDto>>> GetByEmotion()
    {
        var userId = GetUserId();
        var data = await _analyticsService.GetPerformanceByEmotionAsync(userId);
        return Ok(data);
    }

    [HttpGet("by-strategy")]
    public async Task<ActionResult<List<PerformanceByStrategyDto>>> GetByStrategy()
    {
        var userId = GetUserId();
        var data = await _analyticsService.GetPerformanceByStrategyAsync(userId);
        return Ok(data);
    }

    [HttpGet("by-coin")]
    public async Task<ActionResult<List<PerformanceByCoinDto>>> GetByCoin()
    {
        var userId = GetUserId();
        var data = await _analyticsService.GetPerformanceByCoinAsync(userId);
        return Ok(data);
    }

    [HttpGet("by-time")]
    public async Task<ActionResult<List<PerformanceByTimeDto>>> GetByTime()
    {
        var userId = GetUserId();
        var data = await _analyticsService.GetPerformanceByTimeAsync(userId);
        return Ok(data);
    }

    [HttpGet("insights")]
    public async Task<ActionResult<AnalyticsInsightsDto>> GetInsights()
    {
        var userId = GetUserId();
        var insights = await _analyticsService.GetInsightsAsync(userId);
        return Ok(insights);
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}
