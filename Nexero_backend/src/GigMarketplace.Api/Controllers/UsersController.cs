using System.Security.Claims;
using GigMarketplace.Api.DTOs.Users;
using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Enums;
using GigMarketplace.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GigMarketplace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IUserRepository _userRepo;
    private readonly ISkillRepository _skillRepo;

    public UsersController(UserManager<User> userManager, IUserRepository userRepo, ISkillRepository skillRepo)
    {
        _userManager = userManager;
        _userRepo = userRepo;
        _skillRepo = skillRepo;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileResponse>> GetMyProfile()
    {
        var user = await _userRepo.GetByIdWithSkillsAsync(GetUserId());
        if (user == null) return NotFound();

        return Ok(MapToResponse(user));
    }

    [HttpPut("me")]
    public async Task<ActionResult<UserProfileResponse>> UpdateMyProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await _userRepo.GetByIdWithSkillsAsync(GetUserId());
        if (user == null) return NotFound();

        if (request.DisplayName != null) user.DisplayName = request.DisplayName;
        if (request.Bio != null) user.Bio = request.Bio;
        if (request.AvatarUrl != null) user.AvatarUrl = request.AvatarUrl;

        await _userManager.UpdateAsync(user);

        return Ok(MapToResponse(user));
    }

    [HttpPost("me/skills")]
    public async Task<ActionResult> AddSkill([FromBody] AddSkillRequest request)
    {
        var userId = GetUserId();
        var skill = await _skillRepo.GetByIdAsync(request.SkillId);
        if (skill == null) return BadRequest(new { message = "Skill not found." });

        var existing = await _userRepo.GetUserSkillAsync(userId, request.SkillId);
        if (existing != null) return BadRequest(new { message = "Skill already added." });

        ProficiencyLevel? level = null;
        if (!string.IsNullOrEmpty(request.ProficiencyLevel) &&
            Enum.TryParse<ProficiencyLevel>(request.ProficiencyLevel, true, out var parsed))
        {
            level = parsed;
        }

        await _userRepo.AddUserSkillAsync(new UserSkill
        {
            UserId = userId,
            SkillId = request.SkillId,
            ProficiencyLevel = level
        });

        return Ok(new { message = "Skill added." });
    }

    [HttpDelete("me/skills/{skillId:guid}")]
    public async Task<ActionResult> RemoveSkill(Guid skillId)
    {
        var userId = GetUserId();
        var userSkill = await _userRepo.GetUserSkillAsync(userId, skillId);
        if (userSkill == null) return NotFound(new { message = "Skill not found on your profile." });

        await _userRepo.RemoveUserSkillAsync(userSkill);
        return Ok(new { message = "Skill removed." });
    }

    private static UserProfileResponse MapToResponse(User user) => new()
    {
        Id = user.Id,
        Email = user.Email!,
        DisplayName = user.DisplayName,
        Bio = user.Bio,
        AvatarUrl = user.AvatarUrl,
        CreatedAt = user.CreatedAt,
        SkillsOffered = user.SkillsOffered.Select(us => new UserSkillDto
        {
            SkillId = us.SkillId,
            SkillName = us.Skill.Name,
            ProficiencyLevel = us.ProficiencyLevel?.ToString()
        }).ToList()
    };
}
