import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BlogPage } from '../src/components/blog/BlogPage';
import { publicApi } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return {
    ...actual,
    publicApi: { ...actual.publicApi, listPosts: vi.fn(), listCategories: vi.fn() },
  };
});

const noop = () => {};

describe('BlogPage', () => {
  beforeEach(() => {
    vi.mocked(publicApi.listPosts).mockReset();
    vi.mocked(publicApi.listCategories).mockReset();
  });

  it('renders real published posts fetched from the platform API', async () => {
    vi.mocked(publicApi.listPosts).mockResolvedValue({
      posts: [
        {
          slug: 'real-post',
          title: 'A Real Published Article',
          body: 'Some real content from the CMS.',
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
});
