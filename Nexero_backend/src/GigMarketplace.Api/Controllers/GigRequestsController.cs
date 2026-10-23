using System.Security.Claims;
using GigMarketplace.Api.DTOs.GigRequests;
using GigMarketplace.Api.DTOs.Matches;
using GigMarketplace.Api.DTOs.Skills;
using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Enums;
using GigMarketplace.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GigMarketplace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GigRequestsController : ControllerBase
{
    private readonly IGigRequestRepository _gigRepo;
    private readonly ISkillRepository _skillRepo;
    private readonly IMatchingService _matchingService;
    private readonly IMatchRepository _matchRepo;

    public GigRequestsController(
        IGigRequestRepository gigRepo,
        ISkillRepository skillRepo,
        IMatchingService matchingService,
        IMatchRepository matchRepo)
    {
        _gigRepo = gigRepo;
        _skillRepo = skillRepo;
        _matchingService = matchingService;
        _matchRepo = matchRepo;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<ActionResult<GigRequestResponse>> Create([FromBody] CreateGigRequestDto request)
    {
        var userId = GetUserId();

        var skills = await _skillRepo.GetByIdsAsync(request.RequiredSkillIds);
        if (skills.Count != request.RequiredSkillIds.Count)
            return BadRequest(new { message = "One or more skill IDs are invalid." });

        var gigRequest = new GigRequest
        {
            AuthorId = userId,
            Title = request.Title,
            Description = request.Description,
            Budget = request.Budget,
            Timeframe = request.Timeframe,
            RequiredSkills = request.RequiredSkillIds.Select(sid => new GigRequestSkill
            {
                SkillId = sid
            }).ToList()
        };

        await _gigRepo.CreateAsync(gigRequest);

        var candidates = await _matchingService.FindCandidatesAsync(gigRequest);
        if (candidates.Count > 0)
        {
            var matches = candidates.Select(c => new Match
            {
                GigRequestId = gigRequest.Id,
                CandidateUserId = c.UserId,
                Score = c.Score
            });
            await _matchRepo.CreateRangeAsync(matches);
        }

        var created = await _gigRepo.GetByIdAsync(gigRequest.Id);
        return CreatedAtAction(nameof(GetById), new { id = gigRequest.Id }, MapToResponse(created!));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GigRequestResponse>> GetById(Guid id)
    {
        var gig = await _gigRepo.GetByIdAsync(id);
        if (gig == null) return NotFound();
        return Ok(MapToResponse(gig));
    }

    [HttpGet("mine")]
    public async Task<ActionResult<List<GigRequestResponse>>> GetMine()
    {
        var userId = GetUserId();
        var gigs = await _gigRepo.GetByAuthorIdAsync(userId);
        return Ok(gigs.Select(MapToResponse));
    }

    [HttpGet("{id:guid}/matches")]
    public async Task<ActionResult<List<MatchResponse>>> GetMatches(Guid id)
    {
        var userId = GetUserId();
        var gig = await _gigRepo.GetByIdAsync(id);
        if (gig == null) return NotFound();
        if (gig.AuthorId != userId) return Forbid();

        var matches = await _matchRepo.GetByGigRequestIdAsync(id);
        var result = matches
            .OrderByDescending(m => m.Score)
            .Select(m => new MatchResponse
            {
                Id = m.Id,
                GigRequestId = m.GigRequestId,
                GigRequestTitle = gig.Title,
                CandidateUserId = m.CandidateUserId,
                CandidateDisplayName = m.CandidateUser?.DisplayName ?? "Unknown",
                Score = m.Score,
                Status = m.Status.ToString(),
                CreatedAt = m.CreatedAt,
            })
            .ToList();

        return Ok(result);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        var userId = GetUserId();
        var gig = await _gigRepo.GetByIdAsync(id);
        if (gig == null) return NotFound();
        if (gig.AuthorId != userId) return Forbid();

        if (!Enum.TryParse<GigRequestStatus>(request.Status, true, out var status))
            return BadRequest(new { message = "Invalid status. Must be: Open, Matched, or Closed." });

        gig.Status = status;
        await _gigRepo.UpdateAsync(gig);

        return Ok(new { message = $"Status updated to {status}." });
    }

    private static GigRequestResponse MapToResponse(GigRequest g) => new()
    {
        Id = g.Id,
        AuthorId = g.AuthorId,
        AuthorName = g.Author?.DisplayName ?? "Unknown",
        Title = g.Title,
        Description = g.Description,
        Status = g.Status.ToString(),
        Budget = g.Budget,
        Timeframe = g.Timeframe,
        CreatedAt = g.CreatedAt,
        RequiredSkills = g.RequiredSkills.Select(rs => new SkillDto
        {
            Id = rs.SkillId,
            Name = rs.Skill?.Name ?? ""
        }).ToList(),
        MatchCount = g.Matches?.Count ?? 0
    };
}
