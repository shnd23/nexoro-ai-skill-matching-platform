using GigMarketplace.Domain.Entities;

namespace GigMarketplace.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdWithSkillsAsync(Guid id);
    Task<UserSkill?> GetUserSkillAsync(Guid userId, Guid skillId);
    Task AddUserSkillAsync(UserSkill userSkill);
    Task RemoveUserSkillAsync(UserSkill userSkill);
}
