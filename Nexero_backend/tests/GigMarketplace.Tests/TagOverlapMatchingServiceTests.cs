using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using GigMarketplace.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Tests;

public class TagOverlapMatchingServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly TagOverlapMatchingService _service;

    public TagOverlapMatchingServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _db = new AppDbContext(options);
        _service = new TagOverlapMatchingService(_db);
    }

    public void Dispose() => _db.Dispose();

    private async Task<(User author, User candidate, Skill s1, Skill s2, Skill s3)> SeedAsync()
    {
        var author = new User
        {
            Id = Guid.NewGuid(),
            UserName = "author@test.com",
            Email = "author@test.com",
            DisplayName = "Author"
        };

        var candidate = new User
        {
            Id = Guid.NewGuid(),
            UserName = "candidate@test.com",
            Email = "candidate@test.com",
            DisplayName = "Candidate"
        };

        var s1 = new Skill { Name = "React" };
        var s2 = new Skill { Name = "TypeScript" };
        var s3 = new Skill { Name = "Python" };

        _db.Users.AddRange(author, candidate);
        _db.Skills.AddRange(s1, s2, s3);
        await _db.SaveChangesAsync();

        return (author, candidate, s1, s2, s3);
    }

    [Fact]
    public async Task FullOverlap_Returns_Score_1()
    {
        var (author, candidate, s1, s2, _) = await SeedAsync();

        // Candidate has React + TypeScript
        _db.UserSkills.AddRange(
            new UserSkill { UserId = candidate.Id, SkillId = s1.Id },
            new UserSkill { UserId = candidate.Id, SkillId = s2.Id }
        );
        await _db.SaveChangesAsync();

        // Gig requires React + TypeScript
        var gig = new GigRequest
        {
            AuthorId = author.Id,
            Title = "Test",
            Description = "Test",
            RequiredSkills = new List<GigRequestSkill>
            {
                new() { SkillId = s1.Id },
                new() { SkillId = s2.Id }
            }
        };
        _db.GigRequests.Add(gig);
        await _db.SaveChangesAsync();

        var results = await _service.FindCandidatesAsync(gig);

        Assert.Single(results);
        Assert.Equal(candidate.Id, results[0].UserId);
        Assert.Equal(1.0f, results[0].Score);
    }

    [Fact]
    public async Task PartialOverlap_Returns_Correct_Score()
    {
        var (author, candidate, s1, s2, s3) = await SeedAsync();

        // Candidate has React only
        _db.UserSkills.Add(new UserSkill { UserId = candidate.Id, SkillId = s1.Id });
        await _db.SaveChangesAsync();

        // Gig requires React + TypeScript
        var gig = new GigRequest
        {
            AuthorId = author.Id,
            Title = "Test",
            Description = "Test",
            RequiredSkills = new List<GigRequestSkill>
            {
                new() { SkillId = s1.Id },
                new() { SkillId = s2.Id }
            }
        };
        _db.GigRequests.Add(gig);
        await _db.SaveChangesAsync();

        var results = await _service.FindCandidatesAsync(gig);

        Assert.Single(results);
        Assert.Equal(0.5f, results[0].Score);
    }

    [Fact]
    public async Task NoOverlap_Returns_Empty()
    {
        var (author, candidate, _, _, s3) = await SeedAsync();
        var s1 = _db.Skills.First(s => s.Name == "React");
        var s2 = _db.Skills.First(s => s.Name == "TypeScript");

        // Candidate has Python only
        _db.UserSkills.Add(new UserSkill { UserId = candidate.Id, SkillId = s3.Id });
        await _db.SaveChangesAsync();

        // Gig requires React + TypeScript
        var gig = new GigRequest
        {
            AuthorId = author.Id,
            Title = "Test",
            Description = "Test",
            RequiredSkills = new List<GigRequestSkill>
            {
                new() { SkillId = s1.Id },
                new() { SkillId = s2.Id }
            }
        };
        _db.GigRequests.Add(gig);
        await _db.SaveChangesAsync();

        var results = await _service.FindCandidatesAsync(gig);

        Assert.Empty(results);
    }

    [Fact]
    public async Task Author_Is_Excluded_From_Candidates()
    {
        var (author, _, s1, s2, _) = await SeedAsync();

        // Author has the skills too
        _db.UserSkills.AddRange(
            new UserSkill { UserId = author.Id, SkillId = s1.Id },
            new UserSkill { UserId = author.Id, SkillId = s2.Id }
        );
        await _db.SaveChangesAsync();

        // Gig by author requires React + TypeScript
        var gig = new GigRequest
        {
            AuthorId = author.Id,
            Title = "Test",
            Description = "Test",
            RequiredSkills = new List<GigRequestSkill>
            {
                new() { SkillId = s1.Id },
                new() { SkillId = s2.Id }
            }
        };
        _db.GigRequests.Add(gig);
        await _db.SaveChangesAsync();

        var results = await _service.FindCandidatesAsync(gig);

        // Author should NOT appear as their own candidate
        Assert.DoesNotContain(results, r => r.UserId == author.Id);
    }

    [Fact]
    public async Task NoRequiredSkills_Returns_Empty()
    {
        var (author, candidate, s1, _, _) = await SeedAsync();

        _db.UserSkills.Add(new UserSkill { UserId = candidate.Id, SkillId = s1.Id });
        await _db.SaveChangesAsync();

        var gig = new GigRequest
        {
            AuthorId = author.Id,
            Title = "Test",
            Description = "Test",
            RequiredSkills = new List<GigRequestSkill>()
        };
        _db.GigRequests.Add(gig);
        await _db.SaveChangesAsync();

        var results = await _service.FindCandidatesAsync(gig);

        Assert.Empty(results);
    }

    [Fact]
    public async Task Multiple_Candidates_Ordered_By_Score_Descending()
    {
        var (author, candidate, s1, s2, s3) = await SeedAsync();

        var candidate2 = new User
        {
            Id = Guid.NewGuid(),
            UserName = "c2@test.com",
            Email = "c2@test.com",
            DisplayName = "Candidate2"
        };
        _db.Users.Add(candidate2);

        // candidate has React only (0.5), candidate2 has React+TypeScript (1.0)
        _db.UserSkills.Add(new UserSkill { UserId = candidate.Id, SkillId = s1.Id });
        _db.UserSkills.AddRange(
            new UserSkill { UserId = candidate2.Id, SkillId = s1.Id },
            new UserSkill { UserId = candidate2.Id, SkillId = s2.Id }
        );
        await _db.SaveChangesAsync();

        var gig = new GigRequest
        {
            AuthorId = author.Id,
            Title = "Test",
            Description = "Test",
            RequiredSkills = new List<GigRequestSkill>
            {
                new() { SkillId = s1.Id },
                new() { SkillId = s2.Id }
            }
        };
        _db.GigRequests.Add(gig);
        await _db.SaveChangesAsync();

        var results = await _service.FindCandidatesAsync(gig);

        Assert.Equal(2, results.Count);
        Assert.Equal(candidate2.Id, results[0].UserId); // Higher score first
        Assert.Equal(1.0f, results[0].Score);
        Assert.Equal(candidate.Id, results[1].UserId);
        Assert.Equal(0.5f, results[1].Score);
    }
}
