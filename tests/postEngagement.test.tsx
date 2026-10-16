import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mapPostToBlogPost, type PublicPost } from '../src/lib/publicApi';
import type { BlogPost } from '../src/types';

const setPostLike = vi.fn();
const setPostRating = vi.fn();
const addPostComment = vi.fn();
vi.mock('../src/lib/publicApi', async (orig) => {
  const actual = await orig<typeof import('../src/lib/publicApi')>();
  return { ...actual, publicApi: { ...actual.publicApi, setPostLike: (...a: unknown[]) => setPostLike(...a), setPostRating: (...a: unknown[]) => setPostRating(...a), addPostComment: (...a: unknown[]) => addPostComment(...a) } };
});

import { usePostEngagement, LikeButton, RatingCard, CommentsSection, VisitsPill, AuthorCard } from '../src/components/blog/PostEngagement';

const apiPost: PublicPost = {
  slug: 'p', title: 'P', body: '<p>x</p>', excerpt: null, seo: {}, category: null, tags: [], author: null, featuredMedia: null,
  publishedAt: '2026-10-16T00:00:00.000Z', updatedAt: '2026-10-16T00:00:00.000Z',
};

const Harness: React.FC<{ post: BlogPost }> = ({ post }) => {
  const eng = usePostEngagement(post);
  return (
    <div>
      <VisitsPill visits={eng.visits} />
      <LikeButton eng={eng} isLight />
      <RatingCard eng={eng} isLight />
      <AuthorCard post={post} isLight />
      <CommentsSection eng={eng} isLight />
    </div>
  );
};

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  setPostLike.mockReset();
  setPostRating.mockReset();
  addPostComment.mockReset();
});

describe('mapping real engagement from the API', () => {
  it('starts at zero when the API reports nothing', () => {
    const p = mapPostToBlogPost(apiPost);
    expect([p.views, p.likes, p.rating, p.ratingCount, p.commentsCount]).toEqual([0, 0, 0, 0, 0]);
    expect(p.comments).toEqual([]);
  });
  it('carries real counts and approved comments', () => {
    const p = mapPostToBlogPost({
      ...apiPost, visits: 12, likes: 3, rating: { average: 4.5, count: 2 }, commentCount: 1,
      comments: [{ id: 'c1', authorName: 'Reader One', authorRole: 'CFO', body: 'Nice.', createdAt: '2026-10-16T10:00:00.000Z' }],
    });
    expect([p.views, p.likes, p.rating, p.ratingCount, p.commentsCount]).toEqual([12, 3, 4.5, 2, 1]);
    expect(p.comments?.[0]).toMatchObject({ authorName: 'Reader One', authorRole: 'CFO', content: 'Nice.', authorAvatar: 'RE' });
  });
});

describe('engagement UI', () => {
  it('shows honest empty states, not invented numbers', () => {
    render(<Harness post={mapPostToBlogPost(apiPost)} />);
    expect(screen.getByText(/No ratings yet/)).toBeTruthy();
    expect(screen.getByText(/No comments yet/)).toBeTruthy();
    expect(screen.getByText('Comments (0)')).toBeTruthy();
    expect(screen.getByText('visits')).toBeTruthy();
    expect(screen.getByText('Published by Artify Solutions.')).toBeTruthy();
  });

  it('likes optimistically, saves through the API with an anonymous reader id, and can unlike', async () => {
    setPostLike.mockResolvedValueOnce({ likes: 1, liked: true }).mockResolvedValueOnce({ likes: 0, liked: false });
    render(<Harness post={mapPostToBlogPost(apiPost)} />);
    const btn = screen.getByLabelText('Like this article');
    fireEvent.click(btn);
    expect(screen.getByLabelText('Unlike this article').textContent).toBe('1');
    await waitFor(() => expect(setPostLike).toHaveBeenCalledTimes(1));
    expect(setPostLike.mock.calls[0]![0]).toBe('p');
    expect(String(setPostLike.mock.calls[0]![1])).toMatch(/^[A-Za-z0-9_-]{16,64}$/);
    expect(setPostLike.mock.calls[0]![2]).toBe(true);
    await waitFor(() => expect(localStorage.getItem('artify_liked_p')).toBe('1'));
    fireEvent.click(screen.getByLabelText('Unlike this article'));
    await waitFor(() => expect(setPostLike).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByLabelText('Like this article').textContent).toBe('0'));
  });

  it('rolls a like back when the server refuses it', async () => {
    setPostLike.mockRejectedValueOnce(new Error('nope'));
    render(<Harness post={mapPostToBlogPost(apiPost)} />);
    fireEvent.click(screen.getByLabelText('Like this article'));
    await waitFor(() => expect(screen.getByLabelText('Like this article').textContent).toBe('0'));
  });

  it('saves a rating and shows the real average returned by the server', async () => {
    setPostRating.mockResolvedValue({ rating: { average: 4, count: 3 }, score: 4 });
    render(<Harness post={mapPostToBlogPost(apiPost)} />);
    await act(async () => { fireEvent.click(screen.getByLabelText('Rate 4 out of 5 stars')); });
    await waitFor(() => expect(screen.getByText(/Your rating of 4\/5 was saved/)).toBeTruthy());
    expect(setPostRating.mock.calls[0]![0]).toBe('p');
    expect(setPostRating.mock.calls[0]![2]).toBe(4);
    expect(screen.getByText('4.0 / 5')).toBeTruthy();
  });

  it('submits a comment for review, never showing it as published', async () => {
    addPostComment.mockResolvedValue({ status: 'pending' });
    render(<Harness post={mapPostToBlogPost(apiPost)} />);
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Reader One' } });
    fireEvent.change(screen.getByLabelText('Your comment'), { target: { value: 'A thoughtful comment.' } });
    fireEvent.submit(screen.getByLabelText('Leave a comment'));
    await waitFor(() => expect(screen.getByText(/will appear once it has been reviewed/)).toBeTruthy());
    expect(addPostComment).toHaveBeenCalledWith('p', expect.objectContaining({ name: 'Reader One', body: 'A thoughtful comment.', website: '' }));
    expect(screen.getByText('Comments (0)')).toBeTruthy();
  });

  it('renders approved comments from the API', () => {
    const post = mapPostToBlogPost({ ...apiPost, comments: [{ id: 'c1', authorName: 'Reader One', authorRole: null, body: 'Approved text.', createdAt: '2026-10-16T10:00:00.000Z' }] });
    render(<Harness post={post} />);
    expect(screen.getByText('Approved text.')).toBeTruthy();
    expect(screen.getByText('Comments (1)')).toBeTruthy();
  });
});
