'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from './types';
import { auth, users, getToken, setToken, clearToken, ApiUser } from './api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  googleLogin: (idToken: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

function apiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    displayName: apiUser.displayName,
    bio: apiUser.bio ?? '',
    avatarUrl: apiUser.avatarUrl ?? '',
    createdAt: apiUser.createdAt,
    skillsOffered: (apiUser.skillsOffered ?? []).map(us => ({
      skillId: us.skillId,
      skill: us.skill,
      proficiencyLevel: (us.proficiencyLevel as 'Beginner' | 'Intermediate' | 'Expert') ?? 'Intermediate',
    })),
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_CACHE_KEY = 'nexero_user_cache';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    async function rehydrate() {
      const token = getToken();
      if (!token) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const cached = localStorage.getItem(USER_CACHE_KEY);
        if (cached) {
          const cachedUser = JSON.parse(cached) as User;
          setState({ user: cachedUser, isAuthenticated: true, isLoading: true });
        }
      } catch {  }

      try {
        const apiUser = await users.me();
        const user = apiUserToUser(apiUser);
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {

        clearToken();
        localStorage.removeItem(USER_CACHE_KEY);
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    }

    rehydrate();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const response = await auth.login(email, password);
    setToken(response.token);
    const apiUser = await users.me();
    const user = apiUserToUser(apiUser);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    displayName: string
  ): Promise<boolean> => {
    const response = await auth.register(email, password, displayName);
    setToken(response.token);

    const apiUser = await users.me();
    const user = apiUserToUser(apiUser);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
  }, []);

  const googleLogin = useCallback(async (idToken: string): Promise<boolean> => {
    const response = await auth.googleLogin(idToken);
    setToken(response.token);
    const apiUser = await users.me();
    const user = apiUserToUser(apiUser);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem(USER_CACHE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...updates };
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
