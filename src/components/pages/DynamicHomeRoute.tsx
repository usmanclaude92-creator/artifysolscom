/**
 * Phase 5 (Navigation + Pages + Homepage, Artify-Backend repo) — renders a
 * real Page the Control Center has designated as the site's homepage
 * (`publicApi.getHomepage()`). Every production org today has none
 * configured, so `App.tsx` only mounts this when a real published page
 * comes back — the pre-existing hardcoded home branch is otherwise left
 * completely unchanged. Mirrors CmsPageRoute.tsx's rendering/sanitization
 * exactly (same allow-list, same DOMPurify pass) since both render the same
 * server-authored Page shape.
 */
import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { PublicPage } from '../../lib/publicApi';
import { updatePageSeo } from '../../utils/seo';

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

interface DynamicHomeRouteProps {
  page: PublicPage;
  theme: 'dark' | 'light';
}

export const DynamicHomeRoute: React.FC<DynamicHomeRouteProps> = ({ page, theme }) => {
  const isLight = theme === 'light';

  const contentHtml = React.useMemo(
    () => DOMPurify.sanitize(page.body || '', { ALLOWED_TAGS: CONTENT_ALLOWED_TAGS, ALLOWED_ATTR: CONTENT_ALLOWED_ATTR }),
    [page]
  );

  useEffect(() => {
    const seo = (page.seo || {}) as { metaTitle?: string; metaDescription?: string; ogImage?: string };
    const canonicalUrl = typeof window !== 'undefined' ? window.location.origin : 'https://artifysols.com';
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
