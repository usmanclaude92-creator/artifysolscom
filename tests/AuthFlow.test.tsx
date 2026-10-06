import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { AuthModal } from '../src/components/portal/AuthModal';
import { VerifyEmailPage, ResetPasswordPage } from '../src/components/pages/AccountActionPage';
import { checkPassword } from '../src/components/portal/authHelpers';
import { ApiClientError, apiClient } from '../src/lib/apiClient';

const Opener: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const { openAuthModal, isAuthModalOpen } = useAuth();
  React.useEffect(() => {
    if (!isAuthModalOpen) openAuthModal(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const setup = (mode: 'login' | 'signup') =>
  render(
    <AuthProvider>
      <Opener mode={mode} />
      <AuthModal />
    </AuthProvider>
  );

const fill = (id: string, value: string) => fireEvent.change(document.getElementById(id)!, { target: { value } });

beforeEach(() => {
  window.scrollTo = vi.fn() as never;
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe('checkPassword', () => {
  it('mirrors the server policy', () => {
    expect(checkPassword('short', '').valid).toBe(false);
    expect(checkPassword('1234567890', '').valid).toBe(false);
    expect(checkPassword('jordanmiller-1', 'jordan@x.com').valid).toBe(false);
    expect(checkPassword('correct horse battery', 'jordan@x.com').valid).toBe(true);
  });
});

describe('signup', () => {
  it('shows the check-your-email state and sends honeypot field empty', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({ status: 'verification_required' } as never);
    setup('signup');
    fill('signup-name-input', 'Jordan Miller');
    fill('signup-email-input', 'j@corp.com');
    fill('signup-password-input', 'correct horse battery');
    fill('signup-company-input', 'Corp');
    fireEvent.submit(document.getElementById('client-signup-form')!);
    await waitFor(() => expect(document.getElementById('check-email-state')).toBeTruthy());
    expect(post).toHaveBeenCalledWith('/auth/portal/register', expect.objectContaining({ website: '', email: 'j@corp.com' }));
    expect(window.localStorage.getItem('artify_auth_session')).toBeNull();
  });

  it('rejects weak passwords and bad emails client-side', async () => {
    const post = vi.spyOn(apiClient, 'post');
    setup('signup');
    fill('signup-name-input', 'Jordan Miller');
    fill('signup-email-input', 'not-an-email');
    fill('signup-password-input', 'x');
    fill('signup-company-input', 'Corp');
    fireEvent.submit(document.getElementById('client-signup-form')!);
    expect(await screen.findByText(/valid business email/i)).toBeTruthy();
    expect(post).not.toHaveBeenCalled();
  });
});

describe('login', () => {
  it('offers resend when the email is unverified', async () => {
    const post = vi
      .spyOn(apiClient, 'post')
      .mockRejectedValueOnce(new ApiClientError('verify', { code: 'EMAIL_NOT_VERIFIED', status: 403 }))
      .mockResolvedValue({} as never);
    setup('login');
    fill('login-email-input', 'j@corp.com');
    fill('login-password-input', 'correct horse battery');
    fireEvent.submit(document.getElementById('client-login-form')!);
    const resend = await screen.findByText(/resend verification email/i);
    fireEvent.click(resend);
    await waitFor(() => expect(post).toHaveBeenCalledWith('/auth/resend-verification', expect.objectContaining({ email: 'j@corp.com' })));
  });

  it('stores the session in sessionStorage when "Keep me signed in" is off', async () => {
    vi.spyOn(apiClient, 'post').mockResolvedValue({ session: { token: 't', expiresAt: new Date(Date.now() + 3600_000).toISOString() } } as never);
    vi.spyOn(apiClient, 'get').mockResolvedValue({
      user: { id: '1', organizationId: 'o', firstName: 'J', lastName: 'M', email: 'j@corp.com', title: null, phone: null, role: { key: 'CLIENT_PORTAL', name: 'Client', permissions: [] } },
      organizations: [],
    } as never);
    setup('login');
    fireEvent.click(document.getElementById('keep-signed-in')!);
    fill('login-email-input', 'j@corp.com');
    fill('login-password-input', 'correct horse battery');
    fireEvent.submit(document.getElementById('client-login-form')!);
    await waitFor(() => expect(window.sessionStorage.getItem('artify_auth_session')).toBeTruthy());
    expect(window.localStorage.getItem('artify_auth_session')).toBeNull();
  });
});

describe('account pages', () => {
  it('verify-email exchanges the token and strips it from the URL', async () => {
    window.history.pushState({}, '', '/verify-email?token=abc');
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({} as never);
    render(<AuthProvider><VerifyEmailPage /></AuthProvider>);
    expect(await screen.findByText(/email is verified/i)).toBeTruthy();
    expect(post).toHaveBeenCalledWith('/auth/verify-email', { token: 'abc' });
    expect(window.location.search).toBe('');
  });

  it('reset-password confirms with the token', async () => {
    window.history.pushState({}, '', '/reset-password?token=tok');
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({} as never);
    render(<AuthProvider><ResetPasswordPage /></AuthProvider>);
    fill('reset-password-input', 'correct horse battery');
    fill('reset-confirm-input', 'correct horse battery');
    fireEvent.submit(document.getElementById('reset-password-form')!);
    expect(await screen.findByText(/password has been changed/i)).toBeTruthy();
    expect(post).toHaveBeenCalledWith('/auth/password-reset/confirm', { token: 'tok', newPassword: 'correct horse battery' });
  });
});

describe('Control Center handoff', () => {
  const staff = {
    user: { id: '1', organizationId: 'o', firstName: 'S', lastName: 'T', email: 's@corp.com', title: null, phone: null, role: { key: 'ADMIN', name: 'Admin', permissions: [] } },
    organizations: [],
  };

  it('sends non-portal roles to the Control Center with a one-time code (never the token)', async () => {
    const assign = vi.fn();
    Object.defineProperty(window, 'location', { value: { ...window.location, assign }, writable: true });
    const post = vi.spyOn(apiClient, 'post').mockImplementation(async (path: string) => {
      if (path === '/auth/login') return { session: { token: 'secret-token', expiresAt: new Date(Date.now() + 3600_000).toISOString() } } as never;
      if (path === '/auth/handoff') return { code: 'art_handoff_x' } as never;
      return {} as never;
    });
    vi.spyOn(apiClient, 'get').mockResolvedValue(staff as never);
    setup('login');
    fill('login-email-input', 's@corp.com');
    fill('login-password-input', 'correct horse battery');
    fireEvent.submit(document.getElementById('client-login-form')!);
    await waitFor(() => expect(assign).toHaveBeenCalled());
    const url = String(assign.mock.calls[0]![0]);
    expect(url).toBe('https://cc.artifysols.com/auth/callback?code=art_handoff_x');
    expect(url).not.toContain('secret-token');
    expect(post).toHaveBeenCalledWith('/auth/logout');
    expect(window.localStorage.getItem('artify_auth_session')).toBeNull();
  });
});
