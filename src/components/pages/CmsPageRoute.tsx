/**
 * Phase 4 (scoped) — the generic public route for a CMS Page authored in
 * the Control Center. Until now `publicApi.getPageBySlug()` existed
 * (Phase 11) but nothing on this site ever called it — a Page could be
 * written and published and would still be unreachable by any URL. This
 * mirrors BlogPage.tsx's slug-resolution pattern (Phase 11/§63): resolve
 * against the real API, fall back to the redirect table on a 404 (Phase 5
 * SEO Control Center, extended to Pages this same phase — see
 * Artify-Backend's docs/CMS_ARCHITECTURE.md), and only then show a genuine
 * not-found state — never a silent 200 on the wrong content.
 *
 * Deliberately not a full BlogPostPage-class reading experience (no
 * comments/reactions/ratings/table-of-contents) — a Page is static content
 * (an About variant, a policy doc, a one-off landing page), not an article.
 */
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { publicApi, PublicPage } from '../../lib/publicApi';
import { ApiClientError } from '../../lib/apiClient';
import { updatePageSeo } from '../../utils/seo';

// Mirrors server/utils/sanitizeHtml.ts in Artify-Backend exactly (same list
// BlogPostPage.tsx uses) — a client-side re-sanitization pass never strips
// anything the server already considered safe to store.
const CONTENT_ALLOWED_TAGS = [
  'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup', 'a',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span',
];
const CONTENT_ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class', 'colspan', 'rowspan',
];

function plainTextExcerpt(html: string, maxLen = 160): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? `${text.slice(0, maxLen - 3)}...` : text;
}

interface CmsPageRouteProps {
  slug: string;
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
}

export const CmsPageRoute: React.FC<CmsPageRouteProps> = ({ slug, theme, onNavigateHome }) => {
  const isLight = theme === 'light';
  const [page, setPage] = useState<PublicPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Phase 8 (Advanced SEO Control Center) — a visited-slug set guards
    // against a redirect cycle (A -> B -> A, however it was created)
    // recursing forever: without it, this function had no depth/visited
    // check at all. See ssrMeta.ts's resolveRedirectChain in api/index.ts
    // for the matching server-side guard.
    const visited = new Set<string>();

    const resolveSlug = async (currentSlug: string) => {
      if (visited.has(currentSlug)) {
        if (!cancelled) {
          setPage(null);
          setNotFound(true);
          setIsLoading(false);
        }
        return;
      }
      visited.add(currentSlug);

      try {
        const resolved = await publicApi.getPageBySlug(currentSlug);
        if (!cancelled) {
          setPage(resolved);
          setNotFound(false);
          setIsLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 404) {
          try {
            const redirect = await publicApi.getRedirectForPath(`/${currentSlug}`);
            if (cancelled) return;
            // Only follow a redirect that lands on another root-level page
            // path — never one aimed at /blog/, a product, or an external
            // path, which this route has no business rendering.
            if (redirect && /^\/[^/]+$/.test(redirect.toPath) && !visited.has(redirect.toPath.slice(1))) {
              const newSlug = redirect.toPath.slice(1);
              window.history.replaceState({}, '', redirect.toPath);
              await resolveSlug(newSlug);
              return;
            }
          } catch {
            // Redirect lookup itself failing is not fatal — fall through to a real not-found state.
          }
          if (!cancelled) {
            setPage(null);
            setNotFound(true);
            setIsLoading(false);
          }
        } else if (!cancelled) {
          setNotFound(true);
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    setNotFound(false);
    void resolveSlug(slug);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const contentHtml = React.useMemo(() => {
    if (!page) return '';
    return DOMPurify.sanitize(page.body || '', { ALLOWED_TAGS: CONTENT_ALLOWED_TAGS, ALLOWED_ATTR: CONTENT_ALLOWED_ATTR });
  }, [page]);

  useEffect(() => {
    if (!page) return undefined;
    const seo = (page.seo || {}) as { metaTitle?: string; metaDescription?: string; ogImage?: string };
    const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/${page.slug}` : `https://artifysols.com/${page.slug}`;
    const cleanup = updatePageSeo({
      title: seo.metaTitle || `${page.title} | Artify Solutions`,
      description: seo.metaDescription || plainTextExcerpt(page.body || '') || page.title,
      canonicalUrl,
      ogType: 'website',
      ogTitle: seo.metaTitle || page.title,
      ogDescription: seo.metaDescription || plainTextExcerpt(page.body || ''),
      ogImage: seo.ogImage || page.featuredMedia?.url,
    });
    return () => cleanup();
  }, [page]);

  if (isLoading) {
    return <div className="min-h-screen" aria-hidden="true" />;
  }

  if (notFound || !page) {
    return (
      <div
        className={`min-h-screen pt-32 pb-24 flex items-center justify-center px-6 ${
          isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-zinc-100'
        }`}
      >
        <div className="max-w-md text-center space-y-4">
          <FileQuestion className={`w-10 h-10 mx-auto ${isLight ? 'text-slate-300' : 'text-zinc-700'}`} />
          <h1 className="text-2xl font-bold font-display">Page not found</h1>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            This page may have been moved, renamed, or unpublished.
          </p>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-[#F5F5F5]'
      } transition-colors duration-300 pt-28 sm:pt-36 pb-24`}
    >
      <div className="w-[92%] sm:w-[88%] max-w-4xl mx-auto">
        <div
          className={`p-8 sm:p-12 rounded-3xl border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c0c14] border-white/[0.08]'
          }`}
        >
          {page.featuredMedia && (
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8">
              <img
                src={page.featuredMedia.url}
                alt={page.featuredMedia.altText ?? page.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className={`text-2xl sm:text-4xl font-bold font-display mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {page.title}
          </h1>

          <div
            className={`artify-post-body max-w-none ${isLight ? 'artify-post-body-light' : 'artify-post-body-dark'}`}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>
    </div>
  );
};
