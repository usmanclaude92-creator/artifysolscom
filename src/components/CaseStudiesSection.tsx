import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
} from 'lucide-react';
import { publicApi, mapPostToBlogPost } from '../lib/publicApi';
import { BlogPost } from '../types';

interface CaseStudiesSectionProps {
  onOpenSolutionBuilder: () => void;
  onNavigateToContact: () => void;
}

// Case studies are not a separate backend content type — they are real,
// published CMS Posts filed under the "case-studies" Category. An admin
// makes one appear here simply by publishing a Post in the Control Center
// and tagging it with that category. There is no local/fallback dataset:
// an empty or unreachable category honestly shows an empty/error state
// rather than fabricated client outcomes.
const CASE_STUDIES_CATEGORY_SLUG = 'case-studies';

function plainTextExcerpt(html: string, maxLength = 480): string {
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength - 3)}...` : plain;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  onNavigateToContact,
}) => {
  const [caseStudies, setCaseStudies] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    publicApi
      .listPosts({ category: CASE_STUDIES_CATEGORY_SLUG, limit: 20 })
      .then(({ posts: rows }) => {
        if (cancelled) return;
        const mapped = rows.map(mapPostToBlogPost);
        setCaseStudies(mapped);
        setSelectedCaseId(mapped[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Unable to load case studies right now.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectCase = (id: string) => {
    if (id === selectedCaseId && !isSwitching) return;
    setIsSwitching(true);
    setSelectedCaseId(id);
    setTimeout(() => {
      setIsSwitching(false);
    }, 380);
  };

  const selectedCase = caseStudies.find((cs) => cs.id === selectedCaseId) || caseStudies[0] || null;

  return (
    <section className="py-14 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full px-[5%] relative z-10">

        {/* Header */}
        <div className="w-full max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-700/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span>TRANSFORMATION BLUEPRINTS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display mb-4">
            What We Can Transform.
          </h2>
          <p className="text-lg text-zinc-300 leading-relaxed font-normal">
            Deep architectural blueprints showcasing how Artify replaces fragmented operational toil with custom, multi-agent AI ecosystems.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0e0e16] text-xs text-zinc-400">
            Loading case studies…
          </div>
        )}

        {/* Honest error state — never a fabricated fallback case study */}
        {!isLoading && loadError && (
          <div className="p-10 text-center rounded-2xl border border-amber-500/30 bg-[#0e0e16] text-xs text-amber-300">
            We couldn't load case studies right now. Please try again shortly.
          </div>
        )}

        {/* Honest empty state — the "case-studies" category has no published posts yet */}
        {!isLoading && !loadError && caseStudies.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#0e0e16] text-zinc-300">
            <Layers className="w-8 h-8 text-violet-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold mb-1 text-white">Case studies are being prepared</h3>
            <p className="text-xs max-w-sm mx-auto text-zinc-400">
              We're compiling real transformation blueprints. Check back soon — or reach out and we'll walk you through one directly.
            </p>
            <button
              onClick={onNavigateToContact}
              className="mt-5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500"
            >
              Talk to Us
            </button>
          </div>
        )}

        {!isLoading && !loadError && caseStudies.length > 0 && selectedCase && (
          <>
            {/* Case Studies Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {caseStudies.map((cs) => {
                const isSelected = selectedCaseId === cs.id;

                return (
                  <button
                    key={cs.id}
                    onClick={() => handleSelectCase(cs.id)}
                    id={`case-study-tab-${cs.id}`}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between focus:outline-none ${
                      isSelected
                        ? 'bg-[#151522] border-2 border-violet-400 shadow-[0_0_25px_rgba(139,92,246,0.3)] scale-105'
                        : 'bg-[#0a0a0f] border border-white/[0.08] hover:border-white/[0.2] hover:bg-[#101018]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono-code font-bold text-violet-400 uppercase">
                          {cs.category}
                        </span>
                        <span className="text-[9px] font-mono-code text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded">
                          {cs.readTime}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-display leading-tight mb-1">
                        {cs.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {cs.excerpt}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Case Study Deep Dive */}
            <div className="p-8 sm:p-12 rounded-3xl bg-[#09090e] border border-violet-500/40 shadow-2xl relative overflow-hidden min-h-[440px]">
              {isSwitching ? (
                /* Skeleton Loader */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse" role="status" aria-label="Loading case study blueprint...">
                  {/* Left Skeleton */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="h-4 w-36 bg-violet-500/20 rounded" />
                    <div className="h-8 w-3/4 bg-white/15 rounded-lg" />
                    <div className="h-4 w-5/6 bg-white/10 rounded" />
                    <div className="p-4 rounded-xl bg-violet-950/15 border border-violet-900/20 space-y-2">
                      <div className="h-3 w-40 bg-violet-400/20 rounded" />
                      <div className="h-3 w-full bg-white/10 rounded" />
                      <div className="h-3 w-4/5 bg-white/10 rounded" />
                    </div>
                    <div className="flex gap-2 pt-3">
                      {[1, 2, 3, 4].map((t) => (
                        <div key={t} className="h-6 w-20 bg-white/10 rounded" />
                      ))}
                    </div>
                  </div>

                  {/* Right Skeleton */}
                  <div className="lg:col-span-5 flex flex-col justify-between bg-[#060609] border border-white/[0.08] rounded-2xl p-6 space-y-6">
                    <div>
                      <div className="h-4 w-48 bg-white/15 rounded mb-5" />
                      <div className="h-40 w-full bg-white/10 rounded-xl mb-6" />
                      <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-800/20 h-14" />
                    </div>
                    <div className="h-10 w-full bg-violet-600/30 rounded-xl" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Overview & Tags */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-2 text-xs font-bold text-violet-400 font-mono-code uppercase mb-2">
                      <span>{selectedCase.category}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-4">
                      {selectedCase.title}
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
                      {selectedCase.excerpt}
                    </p>

                    {/* Overview */}
                    <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/30 mb-6">
                      <span className="text-xs font-bold text-violet-300 font-mono-code uppercase block mb-1">
                        OVERVIEW:
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {plainTextExcerpt(selectedCase.content)}
                      </p>
                    </div>

                    {/* Tags */}
                    {selectedCase.tags.length > 0 && (
                      <div className="pt-4 border-t border-white/[0.08]">
                        <span className="text-xs font-bold text-zinc-400 font-mono-code uppercase tracking-wider block mb-2">
                          TOPICS:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedCase.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded bg-[#12121c] border border-white/[0.08] text-xs font-mono-code text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Cover, Author & Publish Info */}
                  <div className="lg:col-span-5 flex flex-col justify-between bg-[#060609] border border-white/[0.08] rounded-2xl p-6">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                        <span className="text-xs font-bold text-zinc-300 font-mono-code uppercase tracking-wider">
                          BLUEPRINT DETAILS
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono-code flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> PUBLISHED
                        </span>
                      </div>

                      {selectedCase.coverImage ? (
                        <div className="w-full h-40 rounded-xl overflow-hidden mb-6 bg-black/40">
                          <img
                            src={selectedCase.coverImage}
                            alt={selectedCase.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 rounded-xl mb-6 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 flex items-center justify-center">
                          <Layers className="w-8 h-8 text-violet-400 opacity-60" />
                        </div>
                      )}

                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-zinc-300 leading-relaxed font-mono-code space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Published {selectedCase.publishDate || 'recently'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{selectedCase.readTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">By</span>
                          <span>{selectedCase.author.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/[0.06] mt-6">
                      <button
                        onClick={onNavigateToContact}
                        className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 py-3 rounded-xl shadow-lg shadow-violet-600/30 transition-all"
                      >
                        <span>Request Similar Architecture Blueprint</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </section>
  );
};
