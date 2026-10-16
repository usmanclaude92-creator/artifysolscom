/**
 * Reader engagement on a blog post: visits, likes, ratings, comments and the author card. Every number is real: it comes from the public
 * API and starts at zero. Likes and ratings are one per browser; comments are held for approval in the Control Center before they appear.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Eye, Heart, MessageSquare, Send, Star } from 'lucide-react';
import { publicApi } from '../../lib/publicApi';
import { getReaderId, readLiked, readRated, writeLiked, writeRated } from '../../lib/readerId';
import type { BlogComment, BlogPost } from '../../types';

export interface PostEngagementState {
  visits: number;
  likes: number;
  liked: boolean;
  rating: { average: number; count: number };
  userRating: number;
  comments: BlogComment[];
  toggleLike: () => void;
  rate: (score: number) => Promise<void>;
  submitComment: (input: { name: string; role?: string; body: string; website?: string }) => Promise<void>;
}

export function usePostEngagement(post: BlogPost): PostEngagementState {
  const slug = post.slug || post.id;
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState({ average: post.rating || 0, count: post.ratingCount || 0 });
  const [userRating, setUserRating] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    setLikes(post.likes || 0);
    setRating({ average: post.rating || 0, count: post.ratingCount || 0 });
    setLiked(readLiked(slug));
    setUserRating(readRated(slug));
  }, [slug, post.likes, post.rating, post.ratingCount]);

  const toggleLike = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const next = !liked;
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    publicApi
      .setPostLike(slug, getReaderId(), next)
      .then((res) => {
        setLikes(res.likes);
        writeLiked(slug, next);
      })
      .catch(() => {
        setLiked(!next);
        setLikes((n) => Math.max(0, n + (next ? -1 : 1)));
      })
      .finally(() => {
        busy.current = false;
      });
  }, [liked, slug]);

  const rate = useCallback(
    async (score: number) => {
      const res = await publicApi.setPostRating(slug, getReaderId(), score);
      setRating(res.rating);
      setUserRating(score);
      writeRated(slug, score);
    },
    [slug]
  );

  const submitComment = useCallback(
    async (input: { name: string; role?: string; body: string; website?: string }) => {
      await publicApi.addPostComment(slug, input);
    },
    [slug]
  );

  return { visits: post.views || 0, likes, liked, rating, userRating, comments: post.comments || [], toggleLike, rate, submitComment };
}

const muted = 'text-zinc-400';

export const VisitsPill: React.FC<{ visits: number }> = ({ visits }) => (
  <div
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300"
    title="Sessions in which this article was opened"
  >
    <Eye className="w-3.5 h-3.5 text-violet-400" />
    <span className="font-mono-code font-bold">{visits.toLocaleString()}</span>
    <span className={muted}>{visits === 1 ? 'visit' : 'visits'}</span>
  </div>
);

export const RatingPill: React.FC<{ rating: { average: number; count: number } }> = ({ rating }) => (
  <div
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300"
    title="Average reader rating"
  >
    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
    <span className="font-mono-code font-bold">{rating.count > 0 ? rating.average.toFixed(1) : '–'}</span>
    <span className={muted}>({rating.count})</span>
  </div>
);

export const LikeButton: React.FC<{ eng: PostEngagementState; isLight: boolean }> = ({ eng, isLight }) => (
  <button
    type="button"
    onClick={eng.toggleLike}
    id="like-post-btn"
    aria-pressed={eng.liked}
    aria-label={eng.liked ? 'Unlike this article' : 'Like this article'}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
      eng.liked
        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm'
        : isLight
        ? 'bg-white border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
        : 'bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] hover:text-rose-400'
    }`}
  >
    <Heart className={`w-3.5 h-3.5 ${eng.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
    <span>{eng.likes}</span>
  </button>
);

const card = (isLight: boolean) =>
  `p-6 sm:p-8 rounded-2xl border transition-colors my-10 ${
    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c0c14] border-white/[0.08] shadow-lg'
  }`;

export const RatingCard: React.FC<{ eng: PostEngagementState; isLight: boolean }> = ({ eng, isLight }) => {
  const [hover, setHover] = useState(0);
  const [error, setError] = useState('');
  const { rating, userRating } = eng;

  const onRate = async (score: number) => {
    setError('');
    try {
      await eng.rate(score);
    } catch {
      setError('Your rating could not be saved. Please try again in a moment.');
    }
  };

  return (
    <section id="article-rating-section" className={card(isLight)}>
      <div className="text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
        </div>
        <h3 className={`text-xl font-bold font-display mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Rate this article</h3>
        <p className="text-xs text-zinc-400 mb-4">Your rating helps us decide what to write next.</p>
        <div className="flex items-center justify-center gap-2 mb-3" role="group" aria-label="Rate this article">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => void onRate(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-2 transition-transform hover:scale-125 focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
              aria-pressed={userRating === star}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  (hover || userRating || 0) >= star ? 'text-amber-400 fill-amber-400' : isLight ? 'text-slate-300' : 'text-zinc-600'
                }`}
              />
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-rose-400 mb-2">{error}</p>}
        {userRating > 0 && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Thank you. Your rating of {userRating}/5 was saved.</span>
          </div>
        )}
        <p className="text-xs text-zinc-500">
          {rating.count > 0 ? (
            <>
              Rated <strong className="text-amber-400">{rating.average.toFixed(1)} / 5</strong> by {rating.count} {rating.count === 1 ? 'reader' : 'readers'}
            </>
          ) : (
            'No ratings yet. Be the first to rate this article.'
          )}
        </p>
      </div>
    </section>
  );
};

export const AuthorCard: React.FC<{ post: BlogPost; isLight: boolean }> = ({ post, isLight }) => (
  <section className={`${card(isLight)} !my-0`}>
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold font-display flex items-center justify-center text-base shadow-md shrink-0">
        {post.author.avatar || post.author.name.substring(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Written by {post.author.name}</p>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{post.author.bio?.trim() || 'Published by Artify Solutions.'}</p>
      </div>
    </div>
  </section>
);

export const CommentsSection: React.FC<{ eng: PostEngagementState; isLight: boolean }> = ({ eng, isLight }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const field = `w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-white/[0.04] border-white/[0.1] text-white placeholder-zinc-500'
  }`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setMessage('');
    try {
      await eng.submitComment({ name, role: role || undefined, body, website });
      setState('sent');
      setBody('');
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error && err.message ? err.message : 'Your comment could not be sent. Please try again.');
    }
  };

  return (
    <section id="article-comments" className={card(isLight)}>
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="w-5 h-5 text-violet-400" />
        <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>Comments ({eng.comments.length})</h3>
      </div>

      {eng.comments.length === 0 ? (
        <p className="text-sm text-zinc-400 mb-6">No comments yet. Be the first to share a thought.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {eng.comments.map((c) => (
            <li key={c.id} className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.08]'}`}>
              <div className="flex items-center gap-2 text-xs mb-1.5">
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{c.authorName}</span>
                {c.authorRole && <span className={muted}>· {c.authorRole}</span>}
                <span className={`${muted} ml-auto`}>{c.date}</span>
              </div>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>{c.content}</p>
            </li>
          ))}
        </ul>
      )}

      {state === 'sent' ? (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-2" role="status">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Thank you. Your comment was received and will appear once it has been reviewed.</span>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3" aria-label="Leave a comment">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} aria-label="Your name" />
            <input className={field} placeholder="Role or company (optional)" value={role} onChange={(e) => setRole(e.target.value)} maxLength={120} aria-label="Role or company (optional)" />
          </div>
          <textarea className={`${field} min-h-[96px]`} placeholder="Share your thoughts on this article" value={body} onChange={(e) => setBody(e.target.value)} required minLength={5} maxLength={2000} aria-label="Your comment" />
          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
          </div>
          {state === 'error' && <p className="text-xs text-rose-400" role="alert">{message}</p>}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-zinc-500">Comments are reviewed before they are shown. Links are not allowed.</p>
            <button
              type="submit"
              disabled={state === 'sending'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> {state === 'sending' ? 'Sending…' : 'Post comment'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
