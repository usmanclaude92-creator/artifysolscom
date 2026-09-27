import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { safeGetLocalStorage, safeSetLocalStorage, safeRemoveLocalStorage } from '../utils/storage';
import { apiClient, setAuthTokenGetter } from '../lib/apiClient';

interface BackendUser {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string | null;
  phone: string | null;
  role: { key: string; name: string; permissions: string[] };
}

interface MembershipSummary {
  organizationId: string;
  organizationName: string;
  isCurrent: boolean;
}

function mapBackendUser(user: BackendUser, organizations: MembershipSummary[]): AuthUser {
  const currentOrg = organizations.find((o) => o.isCurrent) ?? organizations.find((o) => o.organizationId === user.organizationId);
  return {
    id: user.id,
    organizationId: user.organizationId,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    company: currentOrg?.organizationName ?? '',
    role: user.role.key,
    roleName: user.role.name,
    permissions: user.role.permissions,
    jobTitle: user.title,
    phone: user.phone,
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True only while rehydrating a persisted session on initial page load. */
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company: string;
    role?: string;
  }) => Promise<boolean>;
  logout: () => void;
  /** Updates the caller's own profile fields via the Platform API (PATCH /users/:id) and refreshes the local session. Never touches role/permissions. */
  updateProfile: (updates: { firstName?: string; lastName?: string; title?: string; phone?: string }) => Promise<void>;

  // Portal & Modal UI States
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;

  isPortalOpen: boolean;
  portalActiveTab: string;
  openPortal: (tab?: string) => void;
  closePortal: () => void;
  setPortalActiveTab: (tab: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_SESSION_KEY = 'artify_auth_session';

interface StoredSession {
  token: string;
  expiresAt: string;
}

function loadStoredSession(): StoredSession | null {
  try {
    const raw = safeGetLocalStorage(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.token || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

// A single module-level slot backing apiClient.ts's token getter — set once
// here so every request always reads the current token synchronously,
// regardless of render timing. Updated by the provider whenever the
// session changes (see the `currentToken` assignments below).
let currentToken: string | null = null;
setAuthTokenGetter(() => currentToken);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [portalActiveTab, setPortalActiveTab] = useState<string>('overview');

  const applySession = (session: StoredSession | null) => {
    currentToken = session?.token ?? null;
    if (session) {
      safeSetLocalStorage(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      safeRemoveLocalStorage(STORAGE_SESSION_KEY);
    }
  };

  const refreshUser = async (): Promise<AuthUser> => {
    const { user: backendUser, organizations } = await apiClient.get<{ user: BackendUser; organizations: MembershipSummary[] }>('/auth/me');
    const mapped = mapBackendUser(backendUser, organizations);
    setUser(mapped);
    return mapped;
  };

  // Rehydrate a persisted session on first load — never trust the stored
  // identity fields themselves (there aren't any anymore); always re-verify
  // against the real backend before treating the visitor as signed in.
  useEffect(() => {
    const stored = loadStoredSession();
    if (!stored) {
      setIsAuthLoading(false);
      return;
    }
    applySession(stored);
    refreshUser()
      .catch(() => {
        applySession(null);
        setUser(null);
      })
      .finally(() => setIsAuthLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openPortal = (tab: string = 'overview') => {
    setPortalActiveTab(tab);
    setIsPortalOpen(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closePortal = () => {
    setIsPortalOpen(false);
  };

  /**
   * Verifies the credential against the Artify Platform API
   * (Artify-Backend's /auth/login) and establishes a real session — the
   * returned session token is captured and attached to every subsequent
   * apiClient request via setAuthTokenGetter. Nothing about the resulting
   * user is fabricated: every field on AuthUser comes from the backend's
   * own /auth/me response.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await apiClient.post<{ session: { token: string; expiresAt: string } }>('/auth/login', { email, password });
    applySession({ token: result.session.token, expiresAt: result.session.expiresAt });
    try {
      await refreshUser();
    } catch (err) {
      applySession(null);
      throw err;
    }
    setIsAuthModalOpen(false);
    openPortal('overview');
    return true;
  };

  /**
   * Creates the account via the Platform API's /auth/register (real bcrypt
   * hash, real organization + ADMIN-role membership). A self-registered
   * account has its own brand-new organization — it is not automatically
   * linked to any CRM Client workspace, so its portal screens will
   * correctly show a "no workspace linked" state until an Artify agency
   * operator provisions one from the Control Center.
   */
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    company: string;
    role?: string;
  }): Promise<boolean> => {
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Member';

    const result = await apiClient.post<{ session: { token: string; expiresAt: string } }>('/auth/register', {
      email: data.email,
      password: data.password,
      firstName,
      lastName,
      organizationName: data.company,
      title: data.role || undefined,
    });
    applySession({ token: result.session.token, expiresAt: result.session.expiresAt });
    try {
      await refreshUser();
    } catch (err) {
      applySession(null);
      throw err;
    }
    setIsAuthModalOpen(false);
    openPortal('overview');
    return true;
  };

  const updateProfile = async (updates: { firstName?: string; lastName?: string; title?: string; phone?: string }): Promise<void> => {
    if (!user) throw new Error('Not signed in.');
    await apiClient.patch(`/users/${user.id}`, updates);
    await refreshUser();
  };

  const logout = () => {
    // Best-effort — revoke the session server-side too, but never block
    // signing the visitor out locally on a network hiccup.
    apiClient.post('/auth/logout').catch(() => {});
    applySession(null);
    setUser(null);
    setIsPortalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isPortalOpen,
        portalActiveTab,
        openPortal,
        closePortal,
        setPortalActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
