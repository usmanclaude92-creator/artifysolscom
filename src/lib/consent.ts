/**
 * Analytics consent + Google Analytics 4 loader.
 *
 * Nothing from Google is requested until the visitor presses Accept. Reject (or no choice) means no Google script,
 * no cookies and no network request. The choice lives in localStorage (best effort: if storage is blocked the banner
 * simply shows again). This module never touches AdSense: no ads script, ads.txt or publisher tag is loaded here.
 */
export const GA_MEASUREMENT_ID = 'G-074D7L8J30';
export const CONSENT_KEY = 'artify_analytics_consent';
export const CONSENT_EVENT = 'artify:consent-change';

export type ConsentChoice = 'accepted' | 'rejected';

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

let loaded = false;

export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    return null;
  }
}

function writeConsent(choice: ConsentChoice | null): void {
  try {
    if (choice) window.localStorage.setItem(CONSENT_KEY, choice);
    else window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* storage blocked: the choice applies to this page view only */
  }
}

/** Loads gtag.js once, with Consent Mode v2 granted for analytics only (ads storage stays denied). */
export function loadAnalytics(): void {
  if (typeof document === 'undefined' || loaded) return;
  loaded = true;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js requires the real `arguments` object, not a rest array
    w.dataLayer!.push(arguments);
  };
  w.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  w.gtag('js', new Date());
  w.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  trackPageView(window.location.pathname + window.location.search);
}

/** Sends a page view; a no-op unless analytics has been accepted and loaded. */
export function trackPageView(path: string): void {
  if (typeof window === 'undefined' || !loaded) return;
  const w = window as GtagWindow;
  w.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title });
}

export function setConsent(choice: ConsentChoice): void {
  writeConsent(choice);
  if (choice === 'accepted') loadAnalytics();
  else if (loaded) {
    // Withdrawn after loading: stop further collection immediately.
    (window as GtagWindow).gtag?.('consent', 'update', { analytics_storage: 'denied' });
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

/** Runs once at startup: honours an earlier Accept. */
export function initConsent(): void {
  if (typeof window !== 'undefined' && readConsent() === 'accepted') loadAnalytics();
}

/** Re-opens the banner (Footer "Cookie settings"). */
export function reopenConsent(): void {
  writeConsent(null);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

/** Test helper. */
export function __resetConsentForTests(): void {
  loaded = false;
}
