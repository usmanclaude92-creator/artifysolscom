/**
 * Phase 11 (Case Studies + Content Relationships) — the real, published
 * Case Study detail route at /case-studies/:slug. Mirrors CmsPageRoute.tsx's
 * slug-resolution pattern (Phase 4/§63): resolve against the real API,
 * fall back to the redirect table on a 404 (caseStudyService's
 * autoRedirectOnSlugChange creates one when a published case study's slug
 * changes), and only then show a genuine not-found state.
 *
 * Additive only — this is a brand-new route; it never touches the
 * existing illustrative /case-studies index (CaseStudiesPage.tsx), which
 * keeps rendering exactly as before.
 */
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { FileQuestion, ArrowLeft, Quote, CheckCircle2 } from 'lucide-react';
import { publicApi, PublicCaseStudy } from '../../lib/publicApi';
import { ApiClientError } from '../../lib/apiClient';
import { updatePageSeo } from '../../utils/seo';
import { PublicBlockRenderer } from '../blocks/PublicBlockRenderer';
import { PublicForm } from '../forms/PublicForm';

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

interface CaseStudyDetailPageProps {
  slug: string;
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  onNavigateToCaseStudies: () => void;
}

export const CaseStudyDetailPage: React.FC<CaseStudyDetailPageProps> = ({ slug, theme, onNavigateHome, onNavigateToCaseStudies }) => {
  const isLight = theme === 'light';
  const [caseStudy, setCaseStudy] = useState<PublicCaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const visited = new Set<string>();

    const resolveSlug = async (currentSlug: string) => {
      if (visited.has(currentSlug)) {
        if (!cancelled) {
          setCaseStudy(null);
          setNotFound(true);
          setIsLoading(false);
        }
        return;
      }
      visited.add(currentSlug);

      try {
        const resolved = await publicApi.getCaseStudyBySlug(currentSlug);
        if (!cancelled) {
          setCaseStudy(resolved);
          setNotFound(false);
          setIsLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 404) {
          try {
            const redirect = await publicApi.getRedirectForPath(`/case-studies/${currentSlug}`);
            if (cancelled) return;
            if (redirect && redirect.toPath.startsWith('/case-studies/') && !visited.has(redirect.toPath.replace('/case-studies/', ''))) {
              const newSlug = redirect.toPath.replace('/case-studies/', '');
              window.history.replaceState({}, '', redirect.toPath);
              await resolveSlug(newSlug);
              return;
            }
          } catch {
            // Redirect lookup failing is not fatal — fall through to a real not-found state.
          }
          if (!cancelled) {
            setCaseStudy(null);
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
    if (!caseStudy) return '';
    return DOMPurify.sanitize(caseStudy.body || '', { ALLOWED_TAGS: CONTENT_ALLOWED_TAGS, ALLOWED_ATTR: CONTENT_ALLOWED_ATTR });
  }, [caseStudy]);

  useEffect(() => {
    if (!caseStudy) return undefined;
    const seo = caseStudy.seo as { metaTitle?: string; metaDescription?: string; ogImage?: string };
    const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/case-studies/${caseStudy.slug}` : `https://artifysols.com/case-studies/${caseStudy.slug}`;
    const description = seo.metaDescription || caseStudy.excerpt || plainTextExcerpt(caseStudy.body || '') || caseStudy.title;
    const cleanup = updatePageSeo({
      title: seo.metaTitle || `${caseStudy.title} | Artify Solutions Case Studies`,
      description,
      canonicalUrl,
      ogType: 'article',
      ogTitle: seo.metaTitle || caseStudy.title,
      ogDescription: description,
      ogImage: seo.ogImage || caseStudy.featuredMedia?.url,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: caseStudy.title,
        description,
        datePublished: caseStudy.publishedAt ?? undefined,
        dateModified: caseStudy.updatedAt,
        image: caseStudy.featuredMedia?.url ?? seo.ogImage,
      },
    });
    return () => cleanup();
  }, [caseStudy]);

  if (isLoading) {
    return <div className="min-h-screen" aria-hidden="true" />;
  }

  if (notFound || !caseStudy) {
    return (
      <div className={`min-h-screen pt-32 pb-24 flex items-center justify-center px-6 ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-zinc-100'}`}>
        <div className="max-w-md text-center space-y-4">
          <FileQuestion className={`w-10 h-10 mx-auto ${isLight ? 'text-slate-300' : 'text-zinc-700'}`} />
          <h1 className="text-2xl font-bold font-display">Case study not found</h1>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>This case study may have been moved, renamed, or unpublished.</p>
          <button
            onClick={onNavigateToCaseStudies}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to case studies
          </button>
        </div>
      </div>
    );
  }

  const hasStructuredDetail = caseStudy.challenge || caseStudy.solutionApproach || caseStudy.implementation || caseStudy.results;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-[#F5F5F5]'} transition-colors duration-300 pt-28 sm:pt-36 pb-24`}>
      <div className="w-[92%] sm:w-[88%] max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <nav className={`text-xs flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`} aria-label="Breadcrumb">
          <button onClick={onNavigateHome} className="hover:underline">Home</button>
          <span>/</span>
          <button onClick={onNavigateToCaseStudies} className="hover:underline">Case Studies</button>
          <span>/</span>
          <span className={isLight ? 'text-slate-700' : 'text-zinc-300'}>{caseStudy.title}</span>
        </nav>

        <div className={`p-8 sm:p-12 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
          {caseStudy.featuredMedia && (
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8">
              <img src={caseStudy.featuredMedia.url} alt={caseStudy.featuredMedia.altText ?? caseStudy.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {caseStudy.industry && (
              <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {caseStudy.industry.name}
              </span>
            )}
            {caseStudy.clientName && (
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{caseStudy.clientName}</span>
            )}
          </div>

          <h1 className={`text-2xl sm:text-4xl font-bold font-display mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>{caseStudy.title}</h1>

          {caseStudy.editorBlocks && caseStudy.editorBlocks.blocks.length > 0 ? (
            <PublicBlockRenderer blocks={caseStudy.editorBlocks.blocks} />
          ) : (
            <div className={`artify-post-body max-w-none ${isLight ? 'artify-post-body-light' : 'artify-post-body-dark'}`} dangerouslySetInnerHTML={{ __html: contentHtml }} />
          )}

          {hasStructuredDetail && (
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {caseStudy.challenge && (
                <div>
                  <h2 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>The Challenge</h2>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{caseStudy.challenge}</p>
                </div>
              )}
              {caseStudy.solutionApproach && (
                <div>
                  <h2 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>The Solution</h2>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{caseStudy.solutionApproach}</p>
                </div>
              )}
              {caseStudy.implementation && (
                <div>
                  <h2 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Implementation</h2>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{caseStudy.implementation}</p>
                </div>
              )}
              {caseStudy.results && (
                <div>
                  <h2 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Results</h2>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{caseStudy.results}</p>
                </div>
              )}
            </div>
          )}

          {caseStudy.technologies.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {caseStudy.technologies.map((tech) => (
                <span key={tech} className={`text-[11px] px-2.5 py-1 rounded-full border ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/[0.05] border-white/[0.1] text-zinc-300'}`}>
                  {tech}
                </span>
              ))}
            </div>
          )}

          {caseStudy.testimonial && (
            <div className={`mt-10 p-6 rounded-2xl border ${isLight ? 'bg-violet-50 border-violet-200' : 'bg-violet-500/5 border-violet-500/20'}`}>
              <Quote className="w-6 h-6 text-violet-400 mb-3" />
              <p className={`text-base italic leading-relaxed ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>&ldquo;{caseStudy.testimonial.quote}&rdquo;</p>
              {(caseStudy.testimonial.authorName || caseStudy.testimonial.authorTitle) && (
                <p className={`mt-3 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {caseStudy.testimonial.authorName}
                  {caseStudy.testimonial.authorName && caseStudy.testimonial.authorTitle && ', '}
                  {caseStudy.testimonial.authorTitle}
                </p>
              )}
            </div>
          )}

          {caseStudy.gallery.length > 0 && (
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {caseStudy.gallery.map((img) => (
                <div key={img.url} className="rounded-xl overflow-hidden border" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}>
                  <img src={img.url} alt={img.altText ?? ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {(caseStudy.relatedProducts.length > 0 || caseStudy.relatedPages.length > 0 || caseStudy.relatedPosts.length > 0) && (
            <div className="mt-10 pt-8 border-t space-y-4" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}>
              <h2 className={`text-sm font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>Related</h2>
              {caseStudy.relatedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {caseStudy.relatedProducts.map((p) => (
                    <a
                      key={p.slug}
                      href={`/ai-solutions/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                    >
                      <CheckCircle2 className="w-3 h-3" /> {p.name}
                    </a>
                  ))}
                </div>
              )}
              {caseStudy.relatedPages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {caseStudy.relatedPages.map((p) => (
                    <a key={p.slug} href={`/${p.slug}`} className={`text-xs underline ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      {p.title}
                    </a>
                  ))}
                </div>
              )}
              {caseStudy.relatedPosts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {caseStudy.relatedPosts.map((p) => (
                    <a key={p.slug} href={`/blog/${p.slug}`} className={`text-xs underline ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      {p.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {caseStudy.ctaForm && (
            <div className="mt-10 pt-8 border-t" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}>
              <h2 className={`text-sm font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{caseStudy.ctaForm.name}</h2>
              <PublicForm formId={caseStudy.ctaForm.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
