import React, { useEffect, useRef } from 'react';
import { ApiClientError } from '../../lib/apiClient';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const TURNSTILE_SITE_KEY: string =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_TURNSTILE_SITE_KEY ?? '';

export interface PasswordCheck {
  length: boolean;
  mix: boolean;
  noEmail: boolean;
  /** 0–4 */
  score: number;
  valid: boolean;
}

const COMMON = new Set(['password', 'password123', '12345678', '123456789', 'qwerty123', 'letmein123', 'admin1234', 'welcome123', 'changeme123']);

/** Mirrors the server policy (length-based: min 10 chars, not purely numeric/common, must not contain the email name). */
export function checkPassword(password: string, email: string): PasswordCheck {
  const length = password.length >= 10;
  const mix = !!password && !/^\d+$/.test(password) && !COMMON.has(password.toLowerCase());
  const local = email.split('@')[0]?.toLowerCase() ?? '';
  const noEmail = !(local.length >= 4 && password.toLowerCase().includes(local));
  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const score = !length || !mix || !noEmail ? (password ? 1 : 0) : Math.min(4, 2 + (password.length >= 14 ? 1 : 0) + (variety >= 3 ? 1 : 0));
  return { length, mix, noEmail, score, valid: length && mix && noEmail };
}

/** Maps backend error codes to calm, actionable copy. Never reveals whether an account exists. */
export function friendlyAuthError(err: unknown, fallback: string): string {
  if (err instanceof ApiClientError) {
    if (err.status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
    if (err.code === 'EMAIL_NOT_VERIFIED') return 'Please verify your email address first.';
    if (err.status === 401) return 'Incorrect email or password.';
    if (err.status === 0 || err.code === 'NETWORK_ERROR') return 'Cannot reach the server. Check your connection and try again.';
    return err.message || fallback;
  }
  return fallback;
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

let turnstileScript: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!turnstileScript) {
    turnstileScript = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        turnstileScript = null;
        reject(new Error('turnstile'));
      };
      document.head.appendChild(s);
    });
  }
  return turnstileScript;
}

/** Renders Cloudflare Turnstile only when VITE_TURNSTILE_SITE_KEY is configured; otherwise nothing. */
export const TurnstileWidget: React.FC<{ onToken: (token: string) => void; resetKey?: number }> = ({ onToken, resetKey = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return;
    let widgetId: string | undefined;
    let cancelled = false;
    onToken('');
    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId = window.turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t: string) => onToken(t),
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={ref} className="flex justify-center" data-testid="turnstile-widget" />;
};
