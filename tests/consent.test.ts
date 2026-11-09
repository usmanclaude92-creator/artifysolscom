import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CONSENT_KEY, GA_MEASUREMENT_ID, __resetConsentForTests, initConsent, readConsent, setConsent, trackPageView } from '../src/lib/consent';
import { buildCspReportOnly } from '../src/utils/csp';

const gtagScripts = () => Array.from(document.querySelectorAll('script')).filter((s) => s.src.includes('googletagmanager.com/gtag/js'));
const read = (rel: string) => fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');

beforeEach(() => {
  document.head.innerHTML = '';
  window.localStorage.clear();
  delete (window as { dataLayer?: unknown }).dataLayer;
  __resetConsentForTests();
});

describe('analytics consent', () => {
  it('loads nothing before a choice', () => {
    initConsent();
    trackPageView('/x');
    expect(gtagScripts()).toHaveLength(0);
    expect(readConsent()).toBeNull();
  });
  it('Reject loads nothing and is remembered', () => {
    setConsent('rejected');
    expect(gtagScripts()).toHaveLength(0);
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('rejected');
    __resetConsentForTests();
    initConsent();
    expect(gtagScripts()).toHaveLength(0);
  });
  it('Accept loads gtag once for the right ID, with ads storage denied', () => {
    setConsent('accepted');
    setConsent('accepted');
    const s = gtagScripts();
    expect(s).toHaveLength(1);
    expect(s[0]!.src).toContain(`id=${GA_MEASUREMENT_ID}`);
    const dl = (window as unknown as { dataLayer: unknown[][] }).dataLayer.map((a) => Array.from(a as ArrayLike<unknown>));
    const def = dl.find((a) => a[0] === 'consent' && a[1] === 'default')!;
    expect(def[2]).toMatchObject({ analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  });
  it('an earlier Accept is honoured on the next visit, and page views only flow after loading', () => {
    window.localStorage.setItem(CONSENT_KEY, 'accepted');
    initConsent();
    expect(gtagScripts()).toHaveLength(1);
    trackPageView('/blog');
    const events = (window as unknown as { dataLayer: unknown[][] }).dataLayer.map((a) => Array.from(a as ArrayLike<unknown>)).filter((a) => a[0] === 'event');
    expect(events.length).toBe(2); // initial load + /blog
  });
});

describe('AdSense and CSP are untouched', () => {
  it('ads.txt is unchanged and no ads script is added', () => {
    expect(read('public/ads.txt').trim()).toBe('google.com, pub-5321065144371084, DIRECT, f08c47fec0942fa0');
    expect(read('src/lib/consent.ts')).not.toMatch(/adsbygoogle|googlesyndication/);
  });
  it('CSP allows GA hosts and stays report-only', () => {
    const csp = buildCspReportOnly('<html></html>');
    expect(csp).toContain('script-src');
    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://www.google-analytics.com');
  });
});
