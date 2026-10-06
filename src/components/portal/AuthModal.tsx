import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Lock,
  Mail,
  Building2,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { apiClient, ApiClientError } from '../../lib/apiClient';
import { EMAIL_PATTERN, TurnstileWidget, TURNSTILE_SITE_KEY, checkPassword, friendlyAuthError } from './authHelpers';

export const AuthModal: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme: propTheme }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    login,
    register,
    resendVerification,
  } = useAuth();

  const isLight = propTheme === 'light' || (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light'));

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const pw = checkPassword(password, email);
  const captchaMissing = !!TURNSTILE_SITE_KEY && !captchaToken;
  const resetCaptcha = () => {
    setCaptchaToken('');
    setCaptchaReset((n) => n + 1);
  };

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Keep mode in sync with context when modal opens
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMsg('');
    setInfoMsg('');
    setNeedsVerification(false);
    setPendingEmail(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setNeedsVerification(false);
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrorMsg('Please provide a valid corporate email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim(), password, keepSignedIn);
    } catch (err: unknown) {
      if (err instanceof ApiClientError && err.code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
        setErrorMsg('');
      } else {
        setErrorMsg(friendlyAuthError(err, 'Login failed. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMsg('');
    setInfoMsg('');
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrorMsg('Enter your email above first, then use "Forgot password?".');
      return;
    }
    if (captchaMissing) {
      setErrorMsg('Please complete the security check first.');
      return;
    }
    setIsLoading(true);
    try {
      // Real backend contract (Phase 3 POST /auth/password-reset/request) —
      // always a generic response, never reveals whether the account
      // exists. No fabricated "email dispatched" behavior.
      const res = await apiClient.post<{ message?: string }>('/auth/password-reset/request', { email: email.trim(), captchaToken: captchaToken || undefined });
      setInfoMsg(res.message || 'If an account exists for that email, a reset link is on its way. It expires in 1 hour.');
    } catch (err: unknown) {
      setErrorMsg(friendlyAuthError(err, 'Could not process the request. Please try again.'));
    } finally {
      resetCaptcha();
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !company || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrorMsg('Please provide a valid business email address.');
      return;
    }
    if (!pw.valid) {
      setErrorMsg(
        !pw.length ? 'Password must be at least 10 characters.' : !pw.noEmail ? 'Password must not contain your email name.' : 'Please choose a less common password.'
      );
      return;
    }
    if (captchaMissing) {
      setErrorMsg('Please complete the security check first.');
      return;
    }
    setIsLoading(true);
    try {
      const outcome = await register({
        name,
        email: email.trim(),
        password,
        company,
        role,
        website: honeypot,
        captchaToken: captchaToken || undefined,
      });
      if (outcome === 'verification_required') {
        setPendingEmail(email.trim());
        setPassword('');
      }
    } catch (err: unknown) {
      setErrorMsg(friendlyAuthError(err, 'Registration failed. Please try again.'));
    } finally {
      resetCaptcha();
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const target = pendingEmail ?? email.trim();
    if (!target || resendCooldown > 0) return;
    setErrorMsg('');
    try {
      await resendVerification(target, captchaToken || undefined);
      setInfoMsg('If that account is awaiting verification, a new link has been sent.');
      setResendCooldown(60);
    } catch (err: unknown) {
      setErrorMsg(friendlyAuthError(err, 'Could not resend the email. Please try again shortly.'));
    } finally {
      resetCaptcha();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      id="client-auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            : 'bg-[#0d0d14] border-violet-500/30 text-zinc-100 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(139,92,246,0.15)]'
        }`}
        id="client-auth-modal-card"
      >
        {/* Top Gradient Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors z-10 ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              : 'text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]'
          }`}
          id="close-auth-modal-btn"
          aria-label="Close Authentication Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-[1px] shadow-lg shadow-violet-600/30 flex items-center justify-center">
              <div className={`w-full h-full rounded-[11px] flex items-center justify-center ${
                isLight ? 'bg-white text-violet-600' : 'bg-[#0c0c12] text-violet-400'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className={`text-xl font-bold tracking-tight font-display flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>Artify Client Portal</span>
                <span className={`text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-violet-50 border-violet-200 text-violet-700 font-semibold'
                    : 'bg-violet-950/70 border-violet-500/30 text-violet-300'
                }`}>
                  Secured
                </span>
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Manage your contracts, subscriptions, and billing in one place.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className={`flex rounded-xl p-1 mb-6 border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/[0.08]'
          }`}>
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              id="auth-tab-login"
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign In to Portal
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              id="auth-tab-signup"
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create Client Account
            </button>
          </div>


          {/* Error Message */}
          {errorMsg && (
            <div className={`mb-4 p-3 rounded-lg border text-xs flex items-center gap-2 animate-in fade-in ${
              isLight
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          {pendingEmail ? (
            <div id="check-email-state" className="text-center space-y-4 py-4" role="status">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-950/40 text-emerald-400'}`}>
                <Mail className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Check your email</h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                If <strong>{pendingEmail}</strong> can be registered, we have sent a verification link. Open it to activate your account,
                then sign in. An Artify team member will then link your account to your workspace.
              </p>
              {infoMsg && <p className={`text-xs ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>{infoMsg}</p>}
              <TurnstileWidget onToken={setCaptchaToken} resetKey={captchaReset} />
              <div className="flex items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={resendCooldown > 0 || captchaMissing}
                  className="font-semibold text-violet-500 underline disabled:opacity-50 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingEmail(null);
                    setInfoMsg('');
                    setMode('login');
                  }}
                  className={isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}
                >
                  Back to sign in
                </button>
              </div>
            </div>
          ) : mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="client-login-form">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. s.jenkins@apexlogistics.com"
                    required
                    id="login-email-input"
                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-violet-500 transition-colors border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                        : 'bg-[#14141e] border-white/[0.1] text-white placeholder-zinc-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Password</label>
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your portal password"
                    id="login-password-input"
                    className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-violet-500 transition-colors border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                        : 'bg-[#14141e] border-white/[0.1] text-white placeholder-zinc-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                      isLight ? 'text-slate-400 hover:text-slate-600' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className={`flex items-center gap-2 cursor-pointer ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    id="keep-signed-in"
                    className="rounded text-violet-600 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => void handleForgotPassword()}
                  className={`transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}
                >
                  Forgot password?
                </button>
              </div>

              {infoMsg && (
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {infoMsg}
                </div>
              )}

              {needsVerification && (
                <div
                  id="unverified-email-notice"
                  className={`p-3 rounded-lg border text-xs space-y-2 ${
                    isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <p>Please verify your email address before signing in. Check your inbox for the verification link.</p>
                  <button
                    type="button"
                    onClick={() => void handleResend()}
                    disabled={resendCooldown > 0 || captchaMissing}
                    className="font-semibold underline disabled:opacity-50 disabled:no-underline"
                  >
                    {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend verification email'}
                  </button>
                </div>
              )}

              <TurnstileWidget onToken={setCaptchaToken} resetKey={captchaReset} />

              <button
                type="submit"
                disabled={isLoading}
                id="submit-login-btn"
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Enter Client Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Partner Access Notice */}
              <div className={`mt-3 p-3 rounded-xl border text-[11px] leading-relaxed flex items-center justify-between gap-2.5 ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-white/[0.03] border-white/[0.06] text-zinc-400'
              }`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">Portal & Backend are reserved for contracted partners.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    if (typeof window !== 'undefined' && window.location.pathname !== '/about') {
                      window.history.pushState({}, '', '/about');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                    setTimeout(() => {
                      const el = document.getElementById('partner-access-policy');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-violet-400 hover:text-violet-300 font-semibold underline shrink-0 whitespace-nowrap"
                >
                  Partner Policy
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5" id="client-signup-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Full Name</label>
                  <div className="relative">
                    <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      required
                      id="signup-name-input"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-violet-500 border ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                          : 'bg-[#14141e] border-white/[0.1] text-white placeholder-zinc-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Corporate Email</label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. j.miller@corp.com"
                      required
                      id="signup-email-input"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-violet-500 border ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                          : 'bg-[#14141e] border-white/[0.1] text-white placeholder-zinc-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Password</label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 10 characters"
                    required
                    minLength={10}
                    autoComplete="new-password"
                    id="signup-password-input"
                    className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-violet-500 border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                        : 'bg-[#14141e] border-white/[0.1] text-white placeholder-zinc-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Company / Organization</label>
                  <div className="relative">
                    <Building2 className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Nexus Global Enterprises"
                      required
                      id="signup-company-input"
                      className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-violet-500 border ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                          : 'bg-[#14141e] border-white/[0.1] text-white placeholder-zinc-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Role / Title (optional)</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Chief Technology Officer"
                    id="signup-role-input"
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-500 border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                        : 'bg-[#14141e] border-white/[0.1] text-white placeholder-zinc-500'
                    }`}
                  />
                </div>
              </div>

              {password && (
                <div id="password-strength" aria-live="polite" className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= pw.score
                            ? pw.score <= 1
                              ? 'bg-rose-500'
                              : pw.score === 2
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : isLight
                            ? 'bg-slate-200'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    {!pw.length
                      ? 'Use at least 10 characters.'
                      : !pw.noEmail
                      ? 'Avoid using your email name in the password.'
                      : !pw.mix
                      ? 'Too common — try a longer passphrase.'
                      : pw.score >= 4
                      ? 'Strong password.'
                      : 'Good — longer and more varied is stronger.'}
                  </p>
                </div>
              )}

              {/* Honeypot: invisible to people, tempting to bots. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>
                  Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" id="signup-website-input" />
                </label>
              </div>

              <TurnstileWidget onToken={setCaptchaToken} resetKey={captchaReset} />

              <button
                type="submit"
                disabled={isLoading}
                id="submit-signup-btn"
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating your account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Client Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] ${
            isLight ? 'border-slate-200 text-slate-500' : 'border-white/[0.08] text-zinc-400'
          }`}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <span>SOC2 Type II & HIPAA Certified Infrastructure</span>
            </span>
            <span className={`font-mono-code text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
