using GigMarketplace.Api.DTOs.Skills;
using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GigMarketplace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly ISkillRepository _skillRepo;

    public SkillsController(ISkillRepository skillRepo) => _skillRepo = skillRepo;

    [HttpGet]
    public async Task<ActionResult<List<SkillDto>>> Search([FromQuery] string? query)
    {
        var skills = string.IsNullOrWhiteSpace(query)
            ? await _skillRepo.SearchAsync("", 50)
            : await _skillRepo.SearchAsync(query);

        return Ok(skills.Select(s => new SkillDto { Id = s.Id, Name = s.Name }));
    }

    [HttpPost]
    public async Task<ActionResult<SkillDto>> CreateOrGet([FromBody] CreateSkillRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Skill name is required." });

        var trimmed = request.Name.Trim();

        var existing = await _skillRepo.GetByNameAsync(trimmed);
        if (existing != null)
            return Ok(new SkillDto { Id = existing.Id, Name = existing.Name });

        var skill = await _skillRepo.CreateAsync(new Skill { Name = trimmed });
        return CreatedAtAction(nameof(Search), new { query = skill.Name }, new SkillDto { Id = skill.Id, Name = skill.Name });
    }
}
