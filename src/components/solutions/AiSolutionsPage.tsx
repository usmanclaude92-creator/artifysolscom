import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Search, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { publicApi, PublicProduct } from '../../lib/publicApi';
import { updatePageSeo, generateDynamicKeywords } from '../../utils/seo';

interface AiSolutionsPageProps {
  onSelectProduct: (product: { slug: string }) => void;
  onOpenConsultant: () => void;
  onOpenSolutionBuilder: () => void;
  onNavigateToContact: () => void;
  theme?: 'dark' | 'light';
}

type TypeFilter = 'ALL' | 'PRODUCT' | 'SERVICE';

export const AiSolutionsPage: React.FC<AiSolutionsPageProps> = ({
  onSelectProduct,
  onOpenConsultant,
  onNavigateToContact,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    publicApi
      .listProducts({ limit: 50 })
      .then(({ products: rows }) => {
        if (!cancelled) setProducts(rows);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Unable to load the catalog right now.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesType = typeFilter === 'ALL' || product.type === typeFilter;
      if (!matchesType) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q)
      );
    });
  }, [products, typeFilter, searchQuery]);

  useEffect(() => {
    const cleanup = updatePageSeo({
      title: 'AI Solutions & Product Catalog | Artify Solutions',
      description: 'Explore the Artify Solutions product and service catalog.',
      keywords: generateDynamicKeywords({
        type: 'product',
        title: 'Artify Solutions Product Catalog',
        customKeywords: ['Artify Solutions Products', 'Artify Solutions Services'],
        tags: [],
      }),
      canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/ai-solutions` : 'https://artifysols.com/ai-solutions',
      ogType: 'website',
      twitterCard: 'summary_large_image',
    });
    return () => cleanup();
  }, []);

  return (
    <div
      className={`min-h-screen pt-28 pb-24 px-6 lg:px-[8%] ${
        isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-zinc-100'
      }`}
    >
      <div className="max-w-3xl space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono-code uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product & Service Catalog</span>
        </div>
        <h1 className={`text-3xl sm:text-4xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Artify Solutions Product Catalog
        </h1>
        <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
          Browse the products and services Artify Solutions currently offers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          {(['ALL', 'PRODUCT', 'SERVICE'] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                typeFilter === t
                  ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/30'
                  : isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-[#12121a] border-white/[0.08] text-zinc-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All' : t === 'PRODUCT' ? 'Products' : 'Services'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the catalog..."
            className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs border focus:outline-none focus:border-violet-500 transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
                : 'bg-[#12121a] border-white/[0.1] text-white placeholder-zinc-500'
            }`}
          />
        </div>
      </div>

      {isLoading && (
        <div className={`p-10 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0e0e16] border-white/[0.08] text-zinc-400'}`}>
          Loading catalog…
        </div>
      )}

      {!isLoading && loadError && (
        <div className={`p-10 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-amber-200 text-amber-700' : 'bg-[#0e0e16] border-amber-500/30 text-amber-300'}`}>
          We couldn't load the catalog right now. Please try again shortly.
        </div>
      )}

      {!isLoading && !loadError && filteredProducts.length === 0 && (
        <div className={`p-12 text-center rounded-2xl border ${isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#0e0e16] border-white/[0.08] text-zinc-400'}`}>
          <Layers className="w-8 h-8 text-violet-400 mx-auto mb-3 opacity-60" />
          <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {products.length === 0 ? 'No products published yet' : 'No matches for your filters'}
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            {products.length === 0 ? 'Check back soon.' : 'Try a different search term or category.'}
          </p>
        </div>
      )}

      {!isLoading && !loadError && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <button
              key={product.slug}
              onClick={() => onSelectProduct(product)}
              className={`group text-left rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 hover:scale-[1.01] ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-violet-400 hover:shadow-xl'
                  : 'bg-[#0d0d14] border-white/[0.08] hover:border-violet-500/40 hover:bg-[#10101c] shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {product.type === 'PRODUCT' ? 'Product' : 'Service'}
                  </span>
                  {product.isFeatured && (
                    <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>
                <h3 className={`text-lg font-bold font-display tracking-tight mb-2 group-hover:text-violet-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {product.name}
                </h3>
                <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {product.shortDescription}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center gap-1.5 text-xs text-violet-500 font-bold group-hover:translate-x-1 transition-transform border-white/[0.06]">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-16 p-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
          Not sure which product fits your use case? Talk to our team.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenConsultant}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold hover:bg-white/20"
          >
            Ask AI Advisor
          </button>
          <button
            onClick={onNavigateToContact}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-violet-600/30"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};
