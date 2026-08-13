using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db) => _db = db;

    public async Task<User?> GetByIdWithSkillsAsync(Guid id)
        => await _db.Users
            .Include(u => u.SkillsOffered)
                .ThenInclude(us => us.Skill)
            .FirstOrDefaultAsync(u => u.Id == id);

    public async Task<UserSkill?> GetUserSkillAsync(Guid userId, Guid skillId)
        => await _db.UserSkills
            .FirstOrDefaultAsync(us => us.UserId == userId && us.SkillId == skillId);

    public async Task AddUserSkillAsync(UserSkill userSkill)
    {
        _db.UserSkills.Add(userSkill);
        await _db.SaveChangesAsync();
    }

    public async Task RemoveUserSkillAsync(UserSkill userSkill)
    {
        _db.UserSkills.Remove(userSkill);
        await _db.SaveChangesAsync();
    }
}
