/** Phase 15 — first-party page-view/CTA beacon: fires real events, never blocks on failure, never sends raw IP/user-agent. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const postMock = vi.fn();
vi.mock('./apiClient', () => ({
  apiClient: { post: (...args: unknown[]) => postMock(...args) },
}));

describe('analytics beacon', () => {
  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue(undefined);
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('posts a real page_view event with path, a session id, and any UTM params present in the URL', async () => {
    window.history.pushState({}, '', '/solutions?utm_source=google&utm_campaign=spring');
    const { analytics } = await import('./analytics');
    analytics.trackPageView();

    expect(postMock).toHaveBeenCalledTimes(1);
    const [path, body] = postMock.mock.calls[0];
    expect(path).toBe('/public/analytics/events');
    expect(body.eventType).toBe('page_view');
    expect(body.path).toBe('/solutions');
    expect(body.utmSource).toBe('google');
    expect(body.utmCampaign).toBe('spring');
    expect(typeof body.sessionId).toBe('string');
    expect(body.sessionId!.length).toBeGreaterThan(0);
  });

  it('reuses the same session id across multiple events in the same tab session', async () => {
    const { analytics } = await import('./analytics');
    analytics.trackPageView('/a');
    analytics.trackPageView('/b');
    const first = postMock.mock.calls[0][1].sessionId;
    const second = postMock.mock.calls[1][1].sessionId;
    expect(first).toBe(second);
  });

  it('never includes an ipAddress or userAgent field in the request body', async () => {
    const { analytics } = await import('./analytics');
    analytics.trackCtaClick('/pricing');
    const body = postMock.mock.calls[0][1];
    expect(body).not.toHaveProperty('ipAddress');
    expect(body).not.toHaveProperty('userAgent');
  });

  it('never throws even if the network call rejects (fire-and-forget)', async () => {
    postMock.mockRejectedValue(new Error('network down'));
    const { analytics } = await import('./analytics');
    expect(() => analytics.trackPageView('/anything')).not.toThrow();
  });
});
