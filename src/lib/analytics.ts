/**
 * Phase 15 — first-party page-view/CTA beacon (docs/ANALYTICS_ARCHITECTURE.md).
 * Fire-and-forget: never blocks rendering, never throws into a caller, and
 * silently does nothing if the request fails (an analytics beacon must
 * never surface an error to a real visitor).
 *
 * `sessionId` is a random, client-generated token held in
 * `sessionStorage` (cleared when the browser tab closes) — never a
 * persistent cross-session visitor identity, no fingerprinting, no raw
 * IP/user-agent capture from this module (the server may derive those
 * from the request itself; this beacon never sends them explicitly).
 */
import { apiClient } from './apiClient';
import { readUtmParams, getLandingPagePath } from './utm';

const SESSION_KEY = 'artify_analytics_session';

function getSessionId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Private browsing / blocked storage — the beacon still fires, just
    // without a session id to correlate repeat events within the tab.
    return undefined;
  }
}

type PublicEventType = 'page_view' | 'cta_click' | 'content_interaction';

function send(eventType: PublicEventType, path?: string): void {
  if (typeof window === 'undefined') return;
  const utm = readUtmParams();
  apiClient
    .post('/public/analytics/events', {
      eventType,
      path: path ?? getLandingPagePath(),
      referrer: document.referrer || undefined,
      sessionId: getSessionId(),
      ...utm,
    })
    .catch(() => undefined);
}

export const analytics = {
  trackPageView(path?: string): void {
    send('page_view', path);
  },
  trackCtaClick(path?: string): void {
    send('cta_click', path);
  },
};
