using System.Security.Claims;
using GigMarketplace.Api.DTOs.Feed;
using GigMarketplace.Api.DTOs.GigRequests;
using GigMarketplace.Api.DTOs.Skills;
using GigMarketplace.Domain.Enums;
using GigMarketplace.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GigMarketplace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FeedController : ControllerBase
{
    private readonly IMatchRepository _matchRepo;

    public FeedController(IMatchRepository matchRepo) => _matchRepo = matchRepo;

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Returns matches for the current user.
    /// Optional ?status=Suggested|Accepted|Declined — omit for all.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<FeedItemResponse>>> GetFeed([FromQuery] string? status = null)
    {
        var userId = GetUserId();

        // If a status filter is provided, parse it; otherwise return ALL matches
        List<GigMarketplace.Domain.Entities.Match> matches;
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<MatchStatus>(status, true, out var parsedStatus))
        {
            matches = await _matchRepo.GetByCandidateUserIdAsync(userId, parsedStatus);
        }
        else
        {
            // Return all statuses by fetching each and combining
            var suggested = await _matchRepo.GetByCandidateUserIdAsync(userId, MatchStatus.Suggested);
            var accepted  = await _matchRepo.GetByCandidateUserIdAsync(userId, MatchStatus.Accepted);
            var declined  = await _matchRepo.GetByCandidateUserIdAsync(userId, MatchStatus.Declined);
            matches = suggested.Concat(accepted).Concat(declined).ToList();
        }

        var feed = matches.Select(m => new FeedItemResponse
        {
            MatchId = m.Id,
            Score = m.Score,
            Status = m.Status.ToString(),
            MatchedAt = m.CreatedAt,
            GigRequest = new GigRequestResponse
            {
                Id = m.GigRequest.Id,
                AuthorId = m.GigRequest.AuthorId,
                AuthorName = m.GigRequest.Author?.DisplayName ?? "Unknown",
                Title = m.GigRequest.Title,
                Description = m.GigRequest.Description,
                Status = m.GigRequest.Status.ToString(),
                Budget = m.GigRequest.Budget,
                Timeframe = m.GigRequest.Timeframe,
                CreatedAt = m.GigRequest.CreatedAt,
                RequiredSkills = m.GigRequest.RequiredSkills?.Select(rs => new SkillDto
                {
                    Id = rs.SkillId,
                    Name = rs.Skill?.Name ?? ""
                }).ToList() ?? new()
            }
        }).ToList();

        return Ok(feed);
    }
}
