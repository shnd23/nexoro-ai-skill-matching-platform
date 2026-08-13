using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Enums;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using GigMarketplace.Infrastructure.Repositories;
using GigMarketplace.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Tests.IntegrationTests;

/// <summary>
/// Full integration test: register users → add skills → post gig → verify matches → accept → verify status cascade.
/// Uses an in-memory database so no Postgres needed.
/// </summary>
public class GigRequestFlowTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly SkillRepository _skillRepo;
    private readonly UserRepository _userRepo;
    private readonly GigRequestRepository _gigRepo;
    private readonly MatchRepository _matchRepo;
    private readonly TagOverlapMatchingService _matchingService;

    public GigRequestFlowTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _db = new AppDbContext(options);
        _skillRepo = new SkillRepository(_db);
        _userRepo = new UserRepository(_db);
        _gigRepo = new GigRequestRepository(_db);
        _matchRepo = new MatchRepository(_db);
        _matchingService = new TagOverlapMatchingService(_db);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task FullFlow_CreateGig_MatchesAppear_AcceptCascadesStatus()
    {
        // ─── 1. Create users ───────────────────────────
        var alice = new User
        {
            Id = Guid.NewGuid(),
            UserName = "alice@test.com",
            Email = "alice@test.com",
            DisplayName = "Alice"
        };
        var bob = new User
        {
            Id = Guid.NewGuid(),
            UserName = "bob@test.com",
            Email = "bob@test.com",
            DisplayName = "Bob"
        };
        _db.Users.AddRange(alice, bob);

        // ─── 2. Create skills ──────────────────────────
        var react = await _skillRepo.CreateAsync(new Skill { Name = "React" });
        var ts = await _skillRepo.CreateAsync(new Skill { Name = "TypeScript" });
        var python = await _skillRepo.CreateAsync(new Skill { Name = "Python" });

        // ─── 3. Bob adds skills ────────────────────────
        await _userRepo.AddUserSkillAsync(new UserSkill { UserId = bob.Id, SkillId = react.Id });
        await _userRepo.AddUserSkillAsync(new UserSkill { UserId = bob.Id, SkillId = ts.Id });

        // Verify Bob has 2 skills
        var bobWithSkills = await _userRepo.GetByIdWithSkillsAsync(bob.Id);
        Assert.NotNull(bobWithSkills);
        Assert.Equal(2, bobWithSkills!.SkillsOffered.Count);

        // ─── 4. Alice posts a gig ──────────────────────
        var gigRequest = new GigRequest
        {
            AuthorId = alice.Id,
            Title = "Build a React Dashboard",
            Description = "Need React + TypeScript developer",
            Budget = 500m,
            Timeframe = "2 weeks",
            RequiredSkills = new List<GigRequestSkill>
            {
                new() { SkillId = react.Id },
                new() { SkillId = ts.Id }
            }
        };
        var createdGig = await _gigRepo.CreateAsync(gigRequest);
        Assert.Equal(GigRequestStatus.Open, createdGig.Status);

        // ─── 5. Run matching ───────────────────────────
        var candidates = await _matchingService.FindCandidatesAsync(createdGig);
        Assert.Single(candidates);
        Assert.Equal(bob.Id, candidates[0].UserId);
        Assert.Equal(1.0f, candidates[0].Score); // 2/2 skills match

        // Create match rows (simulating what the controller does)
        var matches = candidates.Select(c => new Match
        {
            GigRequestId = createdGig.Id,
            CandidateUserId = c.UserId,
            Score = c.Score
        });
        await _matchRepo.CreateRangeAsync(matches);

        // ─── 6. Verify Bob's feed ──────────────────────
        var bobFeed = await _matchRepo.GetByCandidateUserIdAsync(bob.Id, MatchStatus.Suggested);
        Assert.Single(bobFeed);
        Assert.Equal(createdGig.Id, bobFeed[0].GigRequestId);
        Assert.Equal(MatchStatus.Suggested, bobFeed[0].Status);

        // ─── 7. Bob accepts the match ──────────────────
        var match = bobFeed[0];
        match.Status = MatchStatus.Accepted;
        await _matchRepo.UpdateAsync(match);

        // Verify match status updated
        var updatedMatch = await _matchRepo.GetByIdAsync(match.Id);
        Assert.NotNull(updatedMatch);
        Assert.Equal(MatchStatus.Accepted, updatedMatch!.Status);

        // ─── 8. Cascade gig status to Matched ──────────
        var gig = await _gigRepo.GetByIdAsync(createdGig.Id);
        Assert.NotNull(gig);
        gig!.Status = GigRequestStatus.Matched;
        await _gigRepo.UpdateAsync(gig);

        var finalGig = await _gigRepo.GetByIdAsync(createdGig.Id);
        Assert.Equal(GigRequestStatus.Matched, finalGig!.Status);

        // ─── 9. Verify Bob no longer sees Suggested ────
        var emptyFeed = await _matchRepo.GetByCandidateUserIdAsync(bob.Id, MatchStatus.Suggested);
        Assert.Empty(emptyFeed);
    }

    [Fact]
    public async Task Decline_DoesNot_CascadeGigStatus()
    {
        var alice = new User { Id = Guid.NewGuid(), UserName = "a@t.com", Email = "a@t.com", DisplayName = "A" };
        var bob = new User { Id = Guid.NewGuid(), UserName = "b@t.com", Email = "b@t.com", DisplayName = "B" };
        _db.Users.AddRange(alice, bob);

        var skill = await _skillRepo.CreateAsync(new Skill { Name = "Go" });
        await _userRepo.AddUserSkillAsync(new UserSkill { UserId = bob.Id, SkillId = skill.Id });

        var gig = await _gigRepo.CreateAsync(new GigRequest
        {
            AuthorId = alice.Id,
            Title = "Go API",
            Description = "Need Go dev",
            RequiredSkills = new List<GigRequestSkill> { new() { SkillId = skill.Id } }
        });

        // Create match
        await _matchRepo.CreateAsync(new Match
        {
            GigRequestId = gig.Id,
            CandidateUserId = bob.Id,
            Score = 1.0f
        });

        // Bob declines
        var match = (await _matchRepo.GetByCandidateUserIdAsync(bob.Id, MatchStatus.Suggested)).First();
        match.Status = MatchStatus.Declined;
        await _matchRepo.UpdateAsync(match);

        // Gig should still be Open (decline doesn't cascade)
        var finalGig = await _gigRepo.GetByIdAsync(gig.Id);
        Assert.Equal(GigRequestStatus.Open, finalGig!.Status);
    }
}
