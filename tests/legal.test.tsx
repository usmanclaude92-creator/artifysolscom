/** Step 15: legal pages render the real content, keep unfinished owner wording visible, are server-renderable, and are in the sitemap. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { LegalPage } from '../src/components/pages/LegalPage';
import { LEGAL_DOCS, listOwnerMarkers } from '../src/components/pages/legalContent';
import { renderLegalHtml } from '../src/legal/renderLegalHtml';
import { getSitemapUrlList } from '../src/utils/sitemap';
import { resolveSsrRoute } from '../src/utils/ssrMeta';

const get = vi.hoisted(() => vi.fn());
vi.mock('../src/lib/apiClient.js', () => ({ apiClient: { get } }));
afterEach(() => { cleanup(); get.mockReset(); });

describe('legal content', () => {
  it('describes what the platform really stores and keeps the retention numbers of the backend policy', () => {
    const t = JSON.stringify(LEGAL_DOCS.privacy);
    for (const needle of ['180 days', '395 days', '30 days', 'Facebook', 'Instagram', 'access tokens', 'consent', 'IP address']) expect(t).toContain(needle);
  });
  it('makes no certification, uptime or zero-retention claims', () => {
    const t = JSON.stringify(LEGAL_DOCS);
    for (const banned of ['SOC2', 'SOC 2', 'HIPAA', 'ISO 27001', '99.9', 'zero-data-retention', 'GDPR compliant', 'GDPR-compliant']) expect(t).not.toContain(banned);
  });
  it('lists every value the owner still has to confirm (none may be silently dropped)', () => {
    const m = listOwnerMarkers();
    expect(m.length).toBeGreaterThan(10);
    for (const must of ['company legal name', 'registered business address', 'privacy contact email']) expect(m).toContain(must);
  });
});

describe('LegalPage', () => {
  it('renders owner markers as visible placeholders', () => {
    render(<LegalPage type="privacy" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-owner-confirm="true"]').length).toBeGreaterThan(10);
    expect(screen.getAllByText(/Owner to confirm: privacy contact email/).length).toBeGreaterThan(0);
  });
  it('renders terms and data deletion instructions with the three options', () => {
    render(<LegalPage type="data-deletion" />);
    for (const h of [/Option 1/, /Option 2/, /Option 3/]) expect(screen.getByRole('heading', { name: h })).toBeInTheDocument();
    expect(screen.getByText(/MDR-/, { exact: false })).toBeInTheDocument();
  });
});

describe('deletion status page', () => {
  it('looks up the code and shows the state without personal data', async () => {
    get.mockResolvedValue({ code: 'MDR-abcdefghijklmnop', status: 'IN_REVIEW', receivedAt: '2026-10-09T10:00:00Z', updatedAt: '2026-10-09T10:00:00Z', message: 'We received the request and a person on our team is reviewing it. Nothing has been deleted yet.' });
    render(<LegalPage type="data-deletion-status" />);
    fireEvent.change(screen.getByLabelText('Confirmation code'), { target: { value: 'MDR-abcdefghijklmnop' } });
    fireEvent.click(screen.getByRole('button', { name: /Check status/ }));
    expect(await screen.findByText(/Status: In review/)).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/meta/deletion-status?code=MDR-abcdefghijklmnop');
  });
  it('says so for an unknown code and for a failure', async () => {
    get.mockRejectedValueOnce(Object.assign(new Error('x'), { status: 404 }));
    render(<LegalPage type="data-deletion-status" />);
    fireEvent.change(screen.getByLabelText('Confirmation code'), { target: { value: 'MDR-nope' } });
    fireEvent.click(screen.getByRole('button', { name: /Check status/ }));
    expect(await screen.findByText(/could not find a request/)).toBeInTheDocument();
    get.mockRejectedValueOnce(new Error('network'));
    fireEvent.click(screen.getByRole('button', { name: /Check status/ }));
    await waitFor(() => expect(screen.getByText(/could not be loaded right now/)).toBeInTheDocument());
  });
});

describe('server-rendered legal HTML', () => {
  it('contains the full text, a canonical link, escaped content and visible owner markers', () => {
    for (const type of ['privacy', 'terms', 'data-deletion'] as const) {
      const html = renderLegalHtml(type, 'https://artifysols.com');
      expect(html).toContain(`<link rel="canonical" href="https://artifysols.com${LEGAL_DOCS[type].path}">`);
      expect(html).toContain(LEGAL_DOCS[type].sections[0]!.heading);
      expect(html).toContain('data-owner-confirm="true"');
      expect(html).not.toContain('{{OWNER');
      expect(html).not.toMatch(/<script/i);
    }
  });
});

describe('discoverability', () => {
  it('sitemap lists privacy, terms and data deletion but not the status page', async () => {
    const urls = (await getSitemapUrlList('https://artifysols.com', undefined)).map((u) => u.loc);
    for (const p of ['/privacy', '/terms', '/data-deletion']) expect(urls).toContain(`https://artifysols.com${p}`);
    expect(urls.some((u) => u.includes('data-deletion-status'))).toBe(false);
  });
  it('are not treated as CMS pages by the SSR router', () => {
    for (const p of ['/privacy', '/terms', '/data-deletion', '/data-deletion-status']) expect(resolveSsrRoute(p).kind).toBe('other');
  });
});
