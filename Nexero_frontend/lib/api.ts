const BASE = '/api/backend';
const TOKEN_KEY = 'nexero_jwt';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token = getToken() } = opts;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);

  if (!res.ok) {

    const message =
      data?.message ||
      data?.errors?.[0] ||
      `API error ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export interface ApiUser {
  id: string;
  email: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  skillsOffered: ApiUserSkill[];
}

export interface ApiUserSkill {
  skillId: string;
  skill: ApiSkill;
  proficiencyLevel?: string;
}

export interface ApiSkill {
  id: string;
  name: string;
}

export interface ApiGigRequest {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  status: 'Open' | 'Matched' | 'Closed';
  budget: number | null;
  timeframe: string | null;
  createdAt: string;
  requiredSkills: ApiSkill[];
  matchCount: number;
}

export interface ApiFeedItem {
  matchId: string;
  score: number;
  status: 'Suggested' | 'Accepted' | 'Declined';
  matchedAt: string;
  gigRequest: ApiGigRequest;
}

export interface ApiMatch {
  id: string;
  gigRequestId: string;
  candidateUserId: string;
  candidateDisplayName: string;
  score: number;
  status: 'Suggested' | 'Accepted' | 'Declined';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: { id: string; email: string; displayName: string };
}

export const auth = {
  register: (email: string, password: string, displayName: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, displayName },
      token: null,
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      token: null,
    }),

  googleLogin: (idToken: string) =>
    request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: { idToken },
      token: null,
    }),
};

export const users = {
  me: () => request<ApiUser>('/users/me'),

  update: (updates: { displayName?: string; bio?: string; avatarUrl?: string }) =>
    request<ApiUser>('/users/me', { method: 'PUT', body: updates }),

  addSkill: (skillId: string, proficiencyLevel?: string) =>
    request<{ message: string }>('/users/me/skills', {
      method: 'POST',
      body: { skillId, proficiencyLevel: proficiencyLevel ?? 'Intermediate' },
    }),

  removeSkill: (skillId: string) =>
    request<void>(`/users/me/skills/${skillId}`, { method: 'DELETE' }),
};

export const skills = {
  search: (query: string) =>
    request<ApiSkill[]>(`/skills?query=${encodeURIComponent(query)}`),

  createOrGet: (name: string) =>
    request<ApiSkill>('/skills', { method: 'POST', body: { name } }),
};

export const gigs = {
  mine: () => request<ApiGigRequest[]>('/gigrequests/mine'),

  getById: (id: string) => request<ApiGigRequest>(`/gigrequests/${id}`),

  create: (payload: {
    title: string;
    description: string;
    requiredSkillIds: string[];
    budget?: number | null;
    timeframe?: string | null;
  }) =>
    request<ApiGigRequest>('/gigrequests', { method: 'POST', body: payload }),

  getMatchesForGig: (gigId: string) =>
    request<ApiMatch[]>(`/gigrequests/${gigId}/matches`),
};

export const feed = {
  get: () => request<ApiFeedItem[]>('/feed'),
};

export const matches = {
  accept: (matchId: string) =>
    request<{ message: string }>(`/matches/${matchId}/accept`, { method: 'POST' }),

  decline: (matchId: string) =>
    request<{ message: string }>(`/matches/${matchId}/decline`, { method: 'POST' }),
};
