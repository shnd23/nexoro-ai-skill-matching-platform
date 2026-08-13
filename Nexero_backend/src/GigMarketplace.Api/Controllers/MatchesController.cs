using System.Security.Claims;
using GigMarketplace.Api.DTOs.Matches;
using GigMarketplace.Domain.Enums;
using GigMarketplace.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GigMarketplace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MatchesController : ControllerBase
{
    private readonly IMatchRepository _matchRepo;
    private readonly IGigRequestRepository _gigRepo;

    public MatchesController(IMatchRepository matchRepo, IGigRequestRepository gigRepo)
    {
        _matchRepo = matchRepo;
        _gigRepo = gigRepo;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("{id:guid}/accept")]
    public async Task<ActionResult> Accept(Guid id)
    {
        var userId = GetUserId();
        var match = await _matchRepo.GetByIdAsync(id);
        if (match == null) return NotFound();
        if (match.CandidateUserId != userId) return Forbid();
        if (match.Status != MatchStatus.Suggested)
            return BadRequest(new { message = $"Cannot accept a match with status '{match.Status}'." });

        match.Status = MatchStatus.Accepted;
        await _matchRepo.UpdateAsync(match);

        // Update gig status to Matched
        var gig = await _gigRepo.GetByIdAsync(match.GigRequestId);
        if (gig != null && gig.Status == GigRequestStatus.Open)
        {
            gig.Status = GigRequestStatus.Matched;
            await _gigRepo.UpdateAsync(gig);
        }

        return Ok(new { message = "Match accepted." });
    }

    [HttpPost("{id:guid}/decline")]
    public async Task<ActionResult> Decline(Guid id)
    {
        var userId = GetUserId();
        var match = await _matchRepo.GetByIdAsync(id);
        if (match == null) return NotFound();
        if (match.CandidateUserId != userId) return Forbid();
        if (match.Status != MatchStatus.Suggested)
            return BadRequest(new { message = $"Cannot decline a match with status '{match.Status}'." });

        match.Status = MatchStatus.Declined;
        await _matchRepo.UpdateAsync(match);

        return Ok(new { message = "Match declined." });
    }
}
