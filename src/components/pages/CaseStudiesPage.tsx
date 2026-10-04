import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { CaseStudiesSection } from '../CaseStudiesSection';
import { updatePageSeo } from '../../utils/seo';
import { publicApi, PublicCaseStudy } from '../../lib/publicApi';

interface CaseStudiesPageProps {
  onOpenSolutionBuilder: () => void;
  onNavigateToContact: () => void;
  /** Phase 11 — navigates to the real case study detail route (/case-studies/:slug). Omitted in contexts that don't support it (none today, but kept optional so this component never hard-requires the new routing). */
  onSelectCaseStudy?: (slug: string) => void;
  theme?: 'dark' | 'light';
}

/**
 * Phase 11 (Case Studies + Content Relationships) — real, published Case
 * Studies from the Control Center, shown additively above the existing
 * illustrative scenarios below. Fetches real data only; renders nothing
 * at all when none has been published yet (every org today), so the
 * existing illustrative page is completely unaffected until real case
 * studies actually exist.
 */
const RealCaseStudiesSection: React.FC<{ isLight: boolean; onSelectCaseStudy?: (slug: string) => void }> = ({ isLight, onSelectCaseStudy }) => {
  const [caseStudies, setCaseStudies] = useState<PublicCaseStudy[]>([]);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .listCaseStudies({ limit: 6 })
      .then(({ caseStudies: rows }) => {
        if (!cancelled) setCaseStudies(rows);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (caseStudies.length === 0) return null;

  return (
    <div className="w-[92%] sm:w-[88%] max-w-7xl mx-auto mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-4 h-4 text-violet-400" />
        <h2 className={`text-sm font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>Customer Case Studies</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((cs) => (
          <button
            key={cs.slug}
            onClick={() => onSelectCaseStudy?.(cs.slug)}
            className={`group text-left rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 hover:scale-[1.01] ${
              isLight ? 'bg-white border-slate-200 hover:border-violet-400 hover:shadow-xl' : 'bg-[#0d0d14] border-white/[0.08] hover:border-violet-500/40 hover:bg-[#10101c] shadow-lg'
            }`}
          >
            <div>
              {cs.industry && (
                <span className="inline-block text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-3">
                  {cs.industry.name}
                </span>
              )}
              <h3 className={`text-lg font-bold font-display tracking-tight mb-2 group-hover:text-violet-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>{cs.title}</h3>
              {cs.clientName && <p className={`text-xs font-semibold mb-2 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>{cs.clientName}</p>}
              <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{cs.excerpt}</p>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-1.5 text-xs text-violet-500 font-bold group-hover:translate-x-1 transition-transform border-white/[0.06]">
              <span>Read case study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({
  onOpenSolutionBuilder,
  onNavigateToContact,
  onSelectCaseStudy,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  React.useEffect(() => {
    updatePageSeo({
      title: 'Enterprise AI Case Studies & Transformation Blueprints',
      description: 'Discover how global enterprises deploy Artify autonomous agent swarms and neural RAG systems to eliminate manual bottlenecks.',
      canonicalUrl: 'https://artifysols.com/case-studies',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-[#F5F5F5]'
      } transition-colors duration-300 pt-28 sm:pt-36 pb-24`}
    >
      <div className="w-[92%] sm:w-[88%] max-w-7xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Illustrative Architecture Scenarios</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-white">
          Case Studies & Architectures
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
          Illustrative scenarios showing how Artify's architecture patterns apply to common enterprise problems — representative examples, not published customer results.
        </p>
      </div>

      <RealCaseStudiesSection isLight={isLight} onSelectCaseStudy={onSelectCaseStudy} />

      <CaseStudiesSection
        onOpenSolutionBuilder={onOpenSolutionBuilder}
        onNavigateToContact={onNavigateToContact}
      />
    </div>
  );
};
