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
  login: (email: string, password: string, keepSignedIn?: boolean) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company: string;
    role?: string;
    /** Honeypot field — real users never fill it. */
    website?: string;
    captchaToken?: string;
  }) => Promise<RegisterOutcome>;
  resendVerification: (email: string, captchaToken?: string) => Promise<void>;
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

/** 'signed_in' = degraded mode (no email service): session issued immediately. 'verification_required' = check inbox. */
export type RegisterOutcome = 'signed_in' | 'verification_required';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_SESSION_KEY = 'artify_auth_session';

interface StoredSession {
  token: string;
  expiresAt: string;
}

function readSessionStorage(): string | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage.getItem(STORAGE_SESSION_KEY) : null;
  } catch {
    return null;
  }
}

function loadStoredSession(): StoredSession | null {
  try {
    const raw = safeGetLocalStorage(STORAGE_SESSION_KEY) ?? readSessionStorage();
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

  // `persist` = "Keep me signed in": localStorage survives browser restarts,
  // sessionStorage ends with the tab/browser session.
  const applySession = (session: StoredSession | null, persist = true) => {
    currentToken = session?.token ?? null;
    try {
      window.sessionStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      /* storage unavailable */
    }
    safeRemoveLocalStorage(STORAGE_SESSION_KEY);
    if (!session) return;
    if (persist) {
      safeSetLocalStorage(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      try {
        window.sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      } catch {
        /* session stays in memory only */
      }
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
    applySession(stored, safeGetLocalStorage(STORAGE_SESSION_KEY) !== null);
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
  const login = async (email: string, password: string, keepSignedIn = true): Promise<boolean> => {
    const result = await apiClient.post<{ session: { token: string; expiresAt: string } }>('/auth/login', { email, password });
    applySession({ token: result.session.token, expiresAt: result.session.expiresAt }, keepSignedIn);
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
   * Creates a client-portal account via POST /auth/portal/register. With the
   * backend email service on, no session is issued — the visitor must verify
   * their email first ('verification_required'); the response is identical
   * for new and already-registered emails (anti-enumeration). In degraded
   * mode (no email provider) a session is returned and we sign in directly.
   */
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    company: string;
    role?: string;
    website?: string;
    captchaToken?: string;
  }): Promise<RegisterOutcome> => {
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Member';

    const result = await apiClient.post<{ status?: string; session?: { token: string; expiresAt: string } }>('/auth/portal/register', {
      email: data.email,
      password: data.password,
      firstName,
      lastName,
      organizationName: data.company,
      title: data.role || undefined,
      website: data.website ?? '',
      captchaToken: data.captchaToken || undefined,
    });
    if (!result.session) return 'verification_required';
    applySession({ token: result.session.token, expiresAt: result.session.expiresAt });
    try {
      await refreshUser();
    } catch (err) {
      applySession(null);
      throw err;
    }
    setIsAuthModalOpen(false);
    openPortal('overview');
    return 'signed_in';
  };

  const resendVerification = async (email: string, captchaToken?: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification', { email, captchaToken });
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
        resendVerification,
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
