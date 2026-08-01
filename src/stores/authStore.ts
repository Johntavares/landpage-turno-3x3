import { create } from 'zustand';
import type { UserProfile } from '../types';
import { getLocalProfile, saveLocalProfile, syncRemoteProfile, fetchRemoteProfile } from '../services/storage';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  authError: string | null;
  
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithProvider: (provider: 'google' | 'apple') => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (name: string, team: UserProfile['team'], baseDate: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialLocal = getLocalProfile();

  return {
    user: initialLocal,
    isAuthenticated: Boolean(initialLocal && initialLocal.email),
    isOnboarded: Boolean(initialLocal && initialLocal.name && initialLocal.team && initialLocal.baseDate),
    isLoading: false,
    authError: null,

    login: async (email: string, _password?: string) => {
      set({ isLoading: true, authError: null });
      try {
        // Tenta buscar o perfil remoto do Neon PostgreSQL
        const remoteProfile = await fetchRemoteProfile(email);

        const existing = remoteProfile || getLocalProfile();
        const profile: UserProfile = {
          id: existing?.id || 'usr_' + Date.now(),
          name: existing?.name || 'Operador 3x3',
          email,
          team: existing?.team || 'A',
          baseDate: existing?.baseDate || '2026-07-01',
          theme: existing?.theme || 'system',
          createdAt: existing?.createdAt || new Date().toISOString(),
        };

        saveLocalProfile(profile);
        await syncRemoteProfile(profile);

        const hasOnboarding = Boolean(profile.team && profile.baseDate);
        set({ user: profile, isAuthenticated: true, isOnboarded: hasOnboarding, isLoading: false });
        return true;
      } catch {
        set({ authError: 'Erro ao conectar ao banco de dados Neon.', isLoading: false });
        return false;
      }
    },

    loginWithProvider: async (provider: 'google' | 'apple') => {
      set({ isLoading: true, authError: null });
      try {
        const mockProfile: UserProfile = {
          id: `${provider}_` + Date.now(),
          name: provider === 'google' ? 'Operador Google' : 'Operador Apple',
          email: `operador.${provider}@turno3x3.com`,
          team: 'A',
          baseDate: '2026-07-01',
          theme: 'system',
          createdAt: new Date().toISOString(),
        };
        saveLocalProfile(mockProfile);
        await syncRemoteProfile(mockProfile);
        set({ user: mockProfile, isAuthenticated: true, isOnboarded: false, isLoading: false });
        return true;
      } catch {
        set({ authError: `Erro ao iniciar login com ${provider}.`, isLoading: false });
        return false;
      }
    },

    register: async (name: string, email: string, _password?: string) => {
      set({ isLoading: true, authError: null });
      try {
        const profile: UserProfile = {
          id: 'usr_neon_' + Date.now(),
          name,
          email,
          team: 'A',
          baseDate: '2026-07-01',
          theme: 'system',
          createdAt: new Date().toISOString(),
        };
        saveLocalProfile(profile);
        await syncRemoteProfile(profile);
        set({ user: profile, isAuthenticated: true, isOnboarded: false, isLoading: false });
        return true;
      } catch {
        set({ authError: 'Erro ao cadastrar conta no Neon PostgreSQL.', isLoading: false });
        return false;
      }
    },

    resetPassword: async (_email: string) => {
      set({ isLoading: true, authError: null });
      setTimeout(() => {
        set({ isLoading: false });
      }, 800);
      return true;
    },

    updateProfile: async (updates: Partial<UserProfile>) => {
      const current = get().user;
      if (!current) return;
      const updated: UserProfile = { ...current, ...updates };
      saveLocalProfile(updated);
      await syncRemoteProfile(updated);
      set({ user: updated });
    },

    completeOnboarding: async (name: string, team: UserProfile['team'], baseDate: string) => {
      const current = get().user;
      const updated: UserProfile = {
        id: current?.id || 'usr_neon_' + Date.now(),
        name,
        email: current?.email || 'operador@turno3x3.com',
        team,
        baseDate,
        theme: current?.theme || 'system',
        createdAt: current?.createdAt || new Date().toISOString(),
      };
      saveLocalProfile(updated);
      await syncRemoteProfile(updated);
      set({ user: updated, isOnboarded: true });
    },

    logout: () => {
      localStorage.removeItem('turno3x3_profile');
      set({ user: null, isAuthenticated: false, isOnboarded: false });
    },

    clearError: () => set({ authError: null }),
  };
});
