import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BlogPage } from '../src/components/blog/BlogPage';
import { publicApi } from '../src/lib/publicApi';
import { ApiClientError } from '../src/lib/apiClient';
import { AuthProvider } from '../src/context/AuthContext';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return {
    ...actual,
    publicApi: {
      ...actual.publicApi,
      listPosts: vi.fn(),
      listCategories: vi.fn(),
      getPostBySlug: vi.fn(),
      getRedirectForPath: vi.fn(),
    },
  };
});

const noop = () => {};

const REAL_POST = {
  slug: 'deep-linked-post',
  title: 'Deep Linked Article',
  body: 'Content reached via direct slug lookup.',
  excerpt: null,
  seo: {},
  category: null,
  tags: [],
  author: null,
  featuredMedia: null,
  publishedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('BlogPage', () => {
  beforeEach(() => {
    vi.mocked(publicApi.listPosts).mockReset();
    vi.mocked(publicApi.listCategories).mockReset();
    vi.mocked(publicApi.getPostBySlug).mockReset();
    vi.mocked(publicApi.getRedirectForPath).mockReset();
    vi.mocked(publicApi.listPosts).mockResolvedValue({ posts: [], total: 0 });
    vi.mocked(publicApi.listCategories).mockResolvedValue([]);
    window.history.pushState({}, '', '/blog');
  });

  afterEach(() => {
    window.history.pushState({}, '', '/blog');
  });

  it('renders real published posts fetched from the platform API', async () => {
    vi.mocked(publicApi.listPosts).mockResolvedValue({
      posts: [
        {
          slug: 'real-post',
          title: 'A Real Published Article',
          body: 'Some real content from the CMS.',
          excerpt: null,
          seo: {},
          category: { slug: 'news', name: 'Product Updates & News' },
          tags: [],
          author: { name: 'Real Author', bio: null, avatarUrl: null },
          featuredMedia: null,
          publishedAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      total: 1,
    });
    vi.mocked(publicApi.listCategories).mockResolvedValue([{ slug: 'news', name: 'Product Updates & News', description: null }]);

    render(<BlogPage theme="dark" onBackToHome={noop} />);

    expect((await screen.findAllByText('A Real Published Article')).length).toBeGreaterThan(0);
    expect(screen.queryByText('Loading articles…')).not.toBeInTheDocument();
  });

  it('shows an honest empty state instead of fabricated articles when nothing is published', async () => {
    vi.mocked(publicApi.listPosts).mockResolvedValue({ posts: [], total: 0 });
    vi.mocked(publicApi.listCategories).mockResolvedValue([]);

    render(<BlogPage theme="dark" onBackToHome={noop} />);

    await waitFor(() => expect(screen.getByText('No articles have been published yet. Check back soon.')).toBeInTheDocument());
  });

  it('shows an honest error state rather than silently pretending nothing is wrong', async () => {
    vi.mocked(publicApi.listPosts).mockRejectedValue(new Error('boom'));
    vi.mocked(publicApi.listCategories).mockResolvedValue([]);

    render(<BlogPage theme="dark" onBackToHome={noop} />);

    expect(await screen.findByText(/couldn't load articles/)).toBeInTheDocument();
  });

  it('resolves a deep-linked /blog/:slug via the real single-post endpoint, not the (possibly incomplete) in-memory list', async () => {
    window.history.pushState({}, '', '/blog/deep-linked-post');
    vi.mocked(publicApi.getPostBySlug).mockResolvedValue(REAL_POST);

    render(
      <AuthProvider>
        <BlogPage theme="dark" onBackToHome={noop} />
      </AuthProvider>
    );

    expect(publicApi.getPostBySlug).toHaveBeenCalledWith('deep-linked-post');
    expect((await screen.findAllByText('Deep Linked Article')).length).toBeGreaterThan(0);
  });

  it('follows a redirect for a renamed slug instead of hard-404ing', async () => {
    window.history.pushState({}, '', '/blog/old-slug');
    vi.mocked(publicApi.getPostBySlug).mockImplementation(async (slug: string) => {
      if (slug === 'old-slug') throw new ApiClientError('Not found', { code: 'NOT_FOUND', status: 404 });
      return REAL_POST;
    });
    vi.mocked(publicApi.getRedirectForPath).mockResolvedValue({ toPath: '/blog/deep-linked-post', statusCode: 301 });

    render(
      <AuthProvider>
        <BlogPage theme="dark" onBackToHome={noop} />
      </AuthProvider>
    );

    expect((await screen.findAllByText('Deep Linked Article')).length).toBeGreaterThan(0);
    expect(publicApi.getRedirectForPath).toHaveBeenCalledWith('/blog/old-slug');
    expect(window.location.pathname).toBe('/blog/deep-linked-post');
  });

  it('shows a real not-found state — never the blog hub at a silent 200 — for an unknown slug with no redirect', async () => {
    window.history.pushState({}, '', '/blog/never-existed');
    vi.mocked(publicApi.getPostBySlug).mockRejectedValue(new ApiClientError('Not found', { code: 'NOT_FOUND', status: 404 }));
    vi.mocked(publicApi.getRedirectForPath).mockResolvedValue(null);

    render(<BlogPage theme="dark" onBackToHome={noop} />);

    expect(await screen.findByText('Article not found')).toBeInTheDocument();
  });
});
