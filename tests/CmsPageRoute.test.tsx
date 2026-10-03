import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CmsPageRoute } from '../src/components/pages/CmsPageRoute';
import { publicApi } from '../src/lib/publicApi';
import { ApiClientError } from '../src/lib/apiClient';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return {
    ...actual,
    publicApi: {
      ...actual.publicApi,
      getPageBySlug: vi.fn(),
      getRedirectForPath: vi.fn(),
    },
  };
});

const noop = () => {};

const REAL_PAGE = {
  slug: 'about-our-mission',
  title: 'About Our Mission',
  body: '<p>Real CMS page content.</p>',
  excerpt: null,
  seo: {},
  featuredMedia: null,
  publishedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('CmsPageRoute', () => {
  beforeEach(() => {
    vi.mocked(publicApi.getPageBySlug).mockReset();
    vi.mocked(publicApi.getRedirectForPath).mockReset();
    window.history.pushState({}, '', `/${REAL_PAGE.slug}`);
  });

  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('resolves a published CMS Page via the real single-page endpoint and renders its sanitized body', async () => {
    vi.mocked(publicApi.getPageBySlug).mockResolvedValue(REAL_PAGE);

    render(<CmsPageRoute slug={REAL_PAGE.slug} theme="dark" onNavigateHome={noop} />);

    expect(publicApi.getPageBySlug).toHaveBeenCalledWith(REAL_PAGE.slug);
    expect(await screen.findByText('About Our Mission')).toBeInTheDocument();
    expect(await screen.findByText('Real CMS page content.')).toBeInTheDocument();
  });

  it('follows a redirect for a renamed page slug instead of hard-404ing', async () => {
    vi.mocked(publicApi.getPageBySlug).mockImplementation(async (slug: string) => {
      if (slug === 'old-page-slug') throw new ApiClientError('Not found', { code: 'NOT_FOUND', status: 404 });
      return REAL_PAGE;
    });
    vi.mocked(publicApi.getRedirectForPath).mockResolvedValue({ toPath: `/${REAL_PAGE.slug}`, statusCode: 301 });

    render(<CmsPageRoute slug="old-page-slug" theme="dark" onNavigateHome={noop} />);

    expect(await screen.findByText('About Our Mission')).toBeInTheDocument();
    expect(publicApi.getRedirectForPath).toHaveBeenCalledWith('/old-page-slug');
    expect(window.location.pathname).toBe(`/${REAL_PAGE.slug}`);
  });

  it('never follows a redirect aimed outside root-level page paths (e.g. /blog/...)', async () => {
    vi.mocked(publicApi.getPageBySlug).mockRejectedValue(new ApiClientError('Not found', { code: 'NOT_FOUND', status: 404 }));
    vi.mocked(publicApi.getRedirectForPath).mockResolvedValue({ toPath: '/blog/some-post', statusCode: 301 });

    render(<CmsPageRoute slug="stale-page" theme="dark" onNavigateHome={noop} />);

    expect(await screen.findByText('Page not found')).toBeInTheDocument();
  });

  it('shows a real not-found state — never a blank or broken page — for an unknown slug with no redirect', async () => {
    vi.mocked(publicApi.getPageBySlug).mockRejectedValue(new ApiClientError('Not found', { code: 'NOT_FOUND', status: 404 }));
    vi.mocked(publicApi.getRedirectForPath).mockResolvedValue(null);

    render(<CmsPageRoute slug="never-existed" theme="dark" onNavigateHome={noop} />);

    expect(await screen.findByText('Page not found')).toBeInTheDocument();
  });

  // Phase 8 (Advanced SEO Control Center) — resolveSlug previously had no
  // depth/visited guard at all: a redirect cycle (A -> B -> A, however it
  // was created) recursed forever. This must terminate in a real
  // not-found state instead of hanging the page in its loading state.
  it('terminates on a redirect cycle (A -> B -> A) instead of recursing forever', async () => {
    vi.mocked(publicApi.getPageBySlug).mockRejectedValue(new ApiClientError('Not found', { code: 'NOT_FOUND', status: 404 }));
    vi.mocked(publicApi.getRedirectForPath).mockImplementation(async (path: string) => {
      if (path === '/page-a') return { toPath: '/page-b', statusCode: 301 };
      if (path === '/page-b') return { toPath: '/page-a', statusCode: 301 };
      return null;
    });

    render(<CmsPageRoute slug="page-a" theme="dark" onNavigateHome={noop} />);

    expect(await screen.findByText('Page not found')).toBeInTheDocument();
  });
});
