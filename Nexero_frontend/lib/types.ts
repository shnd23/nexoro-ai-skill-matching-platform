export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Expert';
export type GigStatus = 'Open' | 'Matched' | 'Closed';
export type MatchStatus = 'Suggested' | 'Accepted' | 'Declined';

export interface Skill {
  id: string;
  name: string;
}

export interface UserSkill {
  skillId: string;
  skill: Skill;
  proficiencyLevel?: ProficiencyLevel;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  skillsOffered: UserSkill[];
}

export interface GigRequest {
  id: string;
  authorId: string;
  author: User;
  title: string;
  description: string;
  status: GigStatus;
  budget: number | null;
  timeframe: string | null;
  createdAt: string;
  requiredSkills: Skill[];
}

export interface Match {
  id: string;
  gigRequestId: string;
  gigRequest: GigRequest;
  candidateUserId: string;
  candidateUser: User;
  score: number;
  status: MatchStatus;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface FeedItem {
  match: Match;
  gigRequest: GigRequest;
}
