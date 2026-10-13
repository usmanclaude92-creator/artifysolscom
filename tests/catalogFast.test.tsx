import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { apiClient } from '../src/lib/apiClient';
import { addCatalogHints, CATALOG_PATHS } from '../src/utils/ssrMeta';
import { AiSolutionsPage } from '../src/components/solutions/AiSolutionsPage';
import { publicApi } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, listProducts: vi.fn(() => new Promise(() => {})), listProductCategories: vi.fn(async () => []), listIndustries: vi.fn(async () => []) } };
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function stubFetch() {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true, data: {}, meta: { requestId: 'r', timestamp: 't' } }), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('apiClient preflight avoidance', () => {
  it('sends no Content-Type on a body-less GET (so the browser skips the CORS preflight)', async () => {
    const f = stubFetch();
    await apiClient.get('/public/products');
    const init = (f.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.headers).toEqual({});
  });
  it('still sends JSON Content-Type with a body', async () => {
    const f = stubFetch();
    await apiClient.post('/public/analytics/events', { a: 1 });
    const init = (f.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });
});

describe('addCatalogHints', () => {
  const html = '<html><head><title>x</title></head><body></body></html>';
  it('adds a credentialed preconnect and a preload of the first-page products request', () => {
    const out = addCatalogHints(html, 'https://cc.artifysols.com/api/v1');
    expect(out).toContain('<link rel="preconnect" href="https://cc.artifysols.com" crossorigin="use-credentials" />');
    expect(out).toContain('rel="preload" as="fetch" crossorigin="use-credentials" href="https://cc.artifysols.com/api/v1/public/products?limit=50"');
    expect(out.indexOf('preload')).toBeLessThan(out.indexOf('</head>'));
  });
  it('does nothing without an API base, and only the catalog routes are listed', () => {
    expect(addCatalogHints(html, undefined)).toBe(html);
    expect(CATALOG_PATHS).toEqual(['/solutions', '/ai-solutions', '/solutions-catalog']);
    expect(CATALOG_PATHS).not.toContain('/');
  });
});

describe('catalog loading state', () => {
  it('shows skeleton cards (not a bare text box) while the catalog loads', () => {
    vi.mocked(publicApi.listProducts);
    render(<AiSolutionsPage onSelectProduct={() => {}} onOpenConsultant={() => {}} onOpenSolutionBuilder={() => {}} onNavigateToContact={() => {}} />);
    expect(screen.getByRole('status', { name: 'Loading catalog' })).toBeTruthy();
  });
});
