/**
 * /verify-email?token=… and /reset-password?token=… — landing pages for the
 * links in Artify's account emails. The token is read once, stripped from the
 * address bar (so it never lands in history/referrers) and exchanged with the
 * Platform API. Both pages are noindex.
 */
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Loader2, Lock } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import { checkPassword, friendlyAuthError } from '../portal/authHelpers';

function takeToken(): string {
  if (typeof window === 'undefined') return '';
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  if (token) window.history.replaceState({}, '', window.location.pathname);
  return token;
}

const Shell: React.FC<{ title: string; children: React.ReactNode; theme?: 'dark' | 'light' }> = ({ title, children, theme }) => (
  <main className="min-h-screen flex items-center justify-center px-4 py-24">
    <div
      className={`w-full max-w-md rounded-2xl border p-8 text-center space-y-4 ${
        theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0d0d14] border-violet-500/30 text-zinc-100'
      }`}
    >
      <h1 className="text-xl font-bold font-display">{title}</h1>
      {children}
    </div>
  </main>
);

const LoginButton: React.FC<{ label?: string }> = ({ label = 'Sign in' }) => {
  const { openAuthModal } = useAuth();
  return (
    <button
      type="button"
      onClick={() => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        openAuthModal('login');
      }}
      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold"
      id="account-action-signin"
    >
      {label}
    </button>
  );
};

export const VerifyEmailPage: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme }) => {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const token = takeToken();
    if (!token) {
      setState('error');
      setMessage('This verification link is missing its token. Please use the link from your email.');
      return;
    }
    apiClient
      .post('/auth/verify-email', { token })
      .then(() => setState('ok'))
      .catch((err) => {
        setState('error');
        setMessage(friendlyAuthError(err, 'This link is invalid or has expired. Sign in to request a new one.'));
      });
  }, []);

  return (
    <Shell title="Email verification" theme={theme}>
      {state === 'loading' && <Loader2 className="w-6 h-6 mx-auto animate-spin text-violet-500" aria-label="Verifying" />}
      {state === 'ok' && (
        <>
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
          <p className="text-sm" role="status">Your email is verified. You can now sign in.</p>
          <LoginButton />
        </>
      )}
      {state === 'error' && (
        <>
          <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
          <p className="text-sm" role="alert">{message}</p>
          <LoginButton label="Go to sign in" />
        </>
      )}
    </Shell>
  );
};

export const ResetPasswordPage: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme }) => {
  const [token] = useState(takeToken);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const pw = checkPassword(password, '');

  if (!token && !done) {
    return (
      <Shell title="Reset password" theme={theme}>
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
        <p className="text-sm" role="alert">This reset link is missing or has already been used. Request a new one from the sign-in form.</p>
        <LoginButton label="Go to sign in" />
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell title="Password updated" theme={theme}>
        <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
        <p className="text-sm" role="status">Your password has been changed and all other sessions were signed out.</p>
        <LoginButton />
      </Shell>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pw.valid) {
      setError(!pw.length ? 'Password must be at least 10 characters.' : 'Please choose a less common password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await apiClient.post('/auth/password-reset/confirm', { token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(friendlyAuthError(err, 'This reset link is invalid or has expired. Request a new one.'));
    } finally {
      setBusy(false);
    }
  };

  const input = `w-full rounded-xl px-3 py-2.5 text-xs border focus:outline-none focus:border-violet-500 ${
    theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#14141e] border-white/[0.1] text-white'
  }`;

  return (
    <Shell title="Choose a new password" theme={theme}>
      <form onSubmit={submit} className="space-y-3 text-left" id="reset-password-form">
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (10+ characters)" className={`${input} pl-9`} id="reset-password-input" aria-label="New password" required />
        </div>
        <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" className={input} id="reset-confirm-input" aria-label="Confirm new password" required />
        {error && <p className="text-xs text-rose-500" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold disabled:opacity-50" id="reset-submit-btn">
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </Shell>
  );
};
