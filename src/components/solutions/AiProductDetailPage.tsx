import React, { useEffect, useState } from 'react';
import { ArrowLeft, Layers, CheckCircle2, Sparkles } from 'lucide-react';
import { publicApi, PublicProduct, PublicProductModule } from '../../lib/publicApi';
import { updatePageSeo } from '../../utils/seo';

interface AiProductDetailPageProps {
  productSlug: string;
  onBackToSolutions: () => void;
  onSelectProduct: (product: { slug: string }) => void;
  onOpenConsultant: () => void;
  onOpenSolutionBuilder: () => void;
  onNavigateToContact: () => void;
  theme?: 'dark' | 'light';
}

export const AiProductDetailPage: React.FC<AiProductDetailPageProps> = ({
  productSlug,
  onBackToSolutions,
  onNavigateToContact,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [modules, setModules] = useState<PublicProductModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    setProduct(null);
    setModules([]);
    Promise.all([publicApi.getProductBySlug(productSlug), publicApi.getProductModules(productSlug)])
      .then(([p, m]) => {
        if (cancelled) return;
        setProduct(p);
        setModules(m);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  useEffect(() => {
    if (!product) return;
    const cleanup = updatePageSeo({
      title: `${product.name} | Artify Solutions`,
      description: product.shortDescription,
      canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/ai-solutions/${product.slug}` : `https://artifysols.com/ai-solutions/${product.slug}`,
      ogType: 'website',
      ogTitle: product.name,
      ogDescription: product.shortDescription,
      twitterCard: 'summary_large_image',
    });
    return () => cleanup();
  }, [product]);

  const backButton = (
    <button
      onClick={onBackToSolutions}
      className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all mb-8 ${
        isLight
          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
          : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-zinc-300 hover:text-white'
      }`}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>Back to Catalog</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen pt-28 pb-24 px-6 lg:px-[8%] ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-zinc-100'}`}>
        {backButton}
        <div className={`p-10 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0e0e16] border-white/[0.08] text-zinc-400'}`}>
          Loading…
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className={`min-h-screen pt-28 pb-24 px-6 lg:px-[8%] ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-zinc-100'}`}>
        {backButton}
        <div className={`p-12 text-center rounded-2xl border ${isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#0e0e16] border-white/[0.08] text-zinc-400'}`}>
          <Layers className="w-8 h-8 text-violet-400 mx-auto mb-3 opacity-60" />
          <h1 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Product not found</h1>
          <p className="text-xs">This product may be unpublished or no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-28 pb-24 px-6 lg:px-[8%] ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-zinc-100'}`}>
      {backButton}

      <div className="max-w-3xl space-y-4 mb-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {product.type === 'PRODUCT' ? 'Product' : 'Service'}
          </span>
          {product.isFeatured && (
            <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
        <h1 className={`text-3xl sm:text-4xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {product.name}
        </h1>
        <p className={`text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{product.shortDescription}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {product.description.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={`text-sm leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-4">
          <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0d0d14] border-white/[0.08]'}`}>
            <h2 className={`text-sm font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Interested?</h2>
            <button
              onClick={() => onNavigateToContact()}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-violet-600/30"
            >
              Request a Consultation
            </button>
          </div>
        </div>
      </div>

      {modules.length > 0 && (
        <div className="mt-14 space-y-6">
          <h2 className={`text-xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Modules & Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod) => (
              <div
                key={mod.slug}
                className={`p-5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0d0d14] border-white/[0.08]'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{mod.name}</h3>
                  {mod.isCore && (
                    <span className="flex items-center gap-1 text-[10px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Core
                    </span>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
