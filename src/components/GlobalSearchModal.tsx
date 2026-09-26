import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Bot,
  Layers,
  Sparkles,
  Building2,
  FileText,
  ArrowRight,
  Command,
  Compass,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Clock,
  History,
  Workflow,
  LayoutDashboard,
} from 'lucide-react';
import { AI_PRODUCTS } from '../data/aiProductsData';
import { ENTERPRISE_SOLUTIONS } from '../data/solutionsCatalogData';
import { INDUSTRIES_DATA } from '../data/solutionsData';
import { INITIAL_BLOG_POSTS } from '../data/blogData';
import { AiProductItem } from '../types';
import { safeGetLocalStorage, safeSetLocalStorage } from '../utils/storage';

export type SearchCategoryFilter = 'all' | 'products' | 'solutions' | 'industries' | 'blog' | 'actions';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'product' | 'solution' | 'industry' | 'blog' | 'action';
  categoryLabel: string;
  icon: any;
  badge?: string;
  route?: string;
  hash?: string;
  action?: () => void;
  product?: AiProductItem;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: AiProductItem) => void;
  onNavigateToRoute: (route: any, path: string) => void;
  onOpenConsultant: () => void;
  onOpenSolutionBuilder: () => void;
  onOpenClientPortal: () => void;
  onOpenAuditSpec?: () => void;
  theme: 'dark' | 'light';
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigateToRoute,
  onOpenConsultant,
  onOpenSolutionBuilder,
  onOpenClientPortal,
  onOpenAuditSpec,
  theme,
}) => {
  const isLight = theme === 'light';
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SearchCategoryFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = safeGetLocalStorage('artify_recent_searches');
      return saved ? JSON.parse(saved) : ['Autonomous AP', 'Document Parser', 'Health', 'ERP'];
    } catch {
      return ['Autonomous AP', 'Document Parser', 'Health', 'ERP'];
    }
  });

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setCategoryFilter('all');
    }
  }, [isOpen]);

  // Master index of searchable records
  const masterDataset = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Quick System Actions
    items.push(
      {
        id: 'action-ai-advisor',
        title: 'Open Interactive AI Advisor',
        subtitle: 'Consult the enterprise architecture reasoning agent for bespoke topologies',
        category: 'action',
        categoryLabel: 'Quick Action',
        icon: Bot,
        badge: 'AI Assistant',
        action: () => {
          onClose();
          onOpenConsultant();
        },
      },
      {
        id: 'action-solution-wizard',
        title: 'Launch Solution Builder Wizard',
        subtitle: '5-step visual configurator with instant ROI & timeline synthesis',
        category: 'action',
        categoryLabel: 'Quick Action',
        icon: Sliders,
        badge: 'Interactive Configurator',
        action: () => {
          onClose();
          onOpenSolutionBuilder();
        },
      },
      {
        id: 'action-client-portal',
        title: 'Access Enterprise Client Portal',
        subtitle: 'Manage coworker fleets, human approvals, API keys, and subscriptions',
        category: 'action',
        categoryLabel: 'Quick Action',
        icon: LayoutDashboard,
        badge: 'Telemetry & RBAC',
        action: () => {
          onClose();
          onOpenClientPortal();
        },
      },
      {
        id: 'action-audit-spec',
        title: 'View Technical & SEO Audit Spec',
        subtitle: 'Full architectural audit, Core Web Vitals report, and AI Studio rebuild spec',
        category: 'action',
        categoryLabel: 'Quick Action',
        icon: FileText,
        badge: 'Audit & Blueprint',
        action: () => {
          onClose();
          if (onOpenAuditSpec) onOpenAuditSpec();
        },
      },
      {
        id: 'action-live-scenarios',
        title: 'Real-World Live Scenarios Walkthrough',
        subtitle: 'Watch multi-agent stepped choreographies and execution durations',
        category: 'action',
        categoryLabel: 'Quick Action',
        icon: Workflow,
        hash: 'scenarios',
        action: () => {
          onClose();
          onNavigateToRoute('home', '/');
          setTimeout(() => {
            const el = document.getElementById('scenarios');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        },
      }
    );

    // 2. AI Products
    AI_PRODUCTS.forEach((prod) => {
      items.push({
        id: `prod-${prod.id}`,
        title: prod.name,
        subtitle: prod.tagline || prod.longDescription || '',
        category: 'product',
        categoryLabel: 'AI Product & Agent',
        icon: Cpu,
        badge: prod.category ? prod.category.toUpperCase() : 'AI AGENT',
        route: `/ai-solutions/${prod.slug}`,
        product: prod,
        action: () => {
          onClose();
          if (onSelectProduct) {
            onSelectProduct(prod);
          } else {
            onNavigateToRoute('product-detail', `/ai-solutions/${prod.slug}`);
          }
        },
      });
    });

    // 3. Enterprise Solutions Catalog
    ENTERPRISE_SOLUTIONS.forEach((sol) => {
      items.push({
        id: `sol-${sol.id}`,
        title: sol.title,
        subtitle: sol.tagline,
        category: 'solution',
        categoryLabel: 'Enterprise Solution',
        icon: Layers,
        badge: sol.categoryLabel || 'ENTERPRISE',
        route: '/solutions',
        action: () => {
          onClose();
          onNavigateToRoute('solutions-catalog', '/solutions');
        },
      });
    });

    // 4. Industry Verticals
    INDUSTRIES_DATA.forEach((ind) => {
      items.push({
        id: `ind-${ind.id}`,
        title: ind.name,
        subtitle: ind.tagline || ind.description || `Autonomous multi-agent ecosystems tailored for ${ind.name}`,
        category: 'industry',
        categoryLabel: 'Industry Vertical',
        icon: Building2,
        badge: 'VERTICAL',
        route: '/industries',
        action: () => {
          onClose();
          onNavigateToRoute('industries', '/industries');
        },
      });
    });

    // 5. Research & Insights Articles
    INITIAL_BLOG_POSTS.forEach((post) => {
      items.push({
        id: `blog-${post.id}`,
        title: post.title,
        subtitle: post.excerpt,
        category: 'blog',
        categoryLabel: 'Insight & Article',
        icon: FileText,
        badge: post.category,
        route: `/blog/${post.slug}`,
        action: () => {
          onClose();
          onNavigateToRoute('blog', `/blog/${post.slug}`);
        },
      });
    });

    return items;
  }, [
    onClose,
    onNavigateToRoute,
    onOpenConsultant,
    onOpenSolutionBuilder,
    onOpenClientPortal,
    onOpenAuditSpec,
    onSelectProduct,
  ]);

  // Filter items by query and active category
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    return masterDataset.filter((item) => {
      // Category filter check
      if (categoryFilter === 'products' && item.category !== 'product') return false;
      if (categoryFilter === 'solutions' && item.category !== 'solution') return false;
      if (categoryFilter === 'industries' && item.category !== 'industry') return false;
      if (categoryFilter === 'blog' && item.category !== 'blog') return false;
      if (categoryFilter === 'actions' && item.category !== 'action') return false;

      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const subtitleMatch = item.subtitle.toLowerCase().includes(q);
      const badgeMatch = item.badge?.toLowerCase().includes(q);
      const labelMatch = item.categoryLabel.toLowerCase().includes(q);

      return titleMatch || subtitleMatch || badgeMatch || labelMatch;
    });
  }, [masterDataset, query, categoryFilter]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleExecuteItem(filteredResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleExecuteItem = (item: SearchResultItem) => {
    // Save to recent searches if query exists
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      safeSetLocalStorage('artify_recent_searches', JSON.stringify(updated));
    }
    if (item.action) {
      item.action();
    }
  };

  const handleRecentClick = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search Command Palette"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 transform scale-100 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
            : 'bg-[#0c0c12] border-white/10 text-white shadow-black/80'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${isLight ? 'border-slate-100' : 'border-white/[0.08]'}`}>
          <Search className={`w-5 h-5 shrink-0 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search AI agents, solutions, industries, insights, or commands..."
            className={`w-full bg-transparent text-sm sm:text-base font-medium focus:outline-none placeholder:text-zinc-400 ${
              isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-zinc-500'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 rounded-md transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded border shadow-xs ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-[#161622] border-white/10 text-zinc-400'
            }`}
          >
            ESC
          </kbd>
        </div>

        {/* Category Filter Tabs */}
        <div
          className={`flex items-center gap-1.5 px-4 py-2 border-b overflow-x-auto no-scrollbar text-xs font-medium ${
            isLight ? 'bg-slate-50/80 border-slate-100' : 'bg-[#0f0f18]/60 border-white/[0.06]'
          }`}
        >
          {[
            { id: 'all', label: 'All' },
            { id: 'products', label: 'AI Products' },
            { id: 'solutions', label: 'Solutions' },
            { id: 'industries', label: 'Industries' },
            { id: 'blog', label: 'Insights' },
            { id: 'actions', label: 'Actions' },
          ].map((cat) => {
            const active = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryFilter(cat.id as SearchCategoryFilter);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                  active
                    ? 'bg-violet-600 text-white font-semibold shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                    : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Recent Searches (when query is empty) */}
        {!query && recentSearches.length > 0 && (
          <div className={`px-4 py-2.5 border-b flex items-center gap-2 flex-wrap ${isLight ? 'bg-slate-50/40 border-slate-100' : 'bg-white/[0.02] border-white/[0.04]'}`}>
            <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
              <History className="w-3 h-3 text-zinc-400" />
              Popular:
            </span>
            {recentSearches.map((term, i) => (
              <button
                key={i}
                onClick={() => handleRecentClick(term)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-600'
                    : 'bg-[#14141f] border-white/5 text-zinc-300 hover:border-violet-500/40 hover:text-white'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] sm:max-h-[440px] overflow-y-auto p-2 divide-y divide-transparent">
          {filteredResults.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <Compass className={`w-10 h-10 mx-auto mb-3 opacity-30 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
              <p className="text-sm font-semibold mb-1">No matching results found</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No items matching &ldquo;{query}&rdquo;. Try searching for &ldquo;Autonomous AP&rdquo;, &ldquo;ReconAI&rdquo;, &ldquo;Healthcare&rdquo;, or &ldquo;Advisor&rdquo;.
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.id}
                  data-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleExecuteItem(item)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 mb-1 ${
                    isSelected
                      ? isLight
                        ? 'bg-violet-50/90 text-slate-900 border border-violet-200/80 shadow-xs'
                        : 'bg-violet-950/40 text-white border border-violet-500/30 shadow-xs'
                      : isLight
                      ? 'hover:bg-slate-50 text-slate-800'
                      : 'hover:bg-white/[0.04] text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-violet-600 border-violet-500 text-white shadow-sm'
                          : isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-600 group-hover:text-violet-600'
                          : 'bg-[#151522] border-white/10 text-zinc-400 group-hover:text-violet-400'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                              item.category === 'action'
                                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                                : item.category === 'product'
                                ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                                : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-medium hidden sm:inline-block ${
                        isLight ? 'text-slate-400' : 'text-zinc-500'
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                        isSelected ? 'text-violet-400' : 'opacity-30'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info & shortcut guide */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-t text-[11px] font-medium ${
            isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-[#0a0a10] border-white/[0.06] text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 text-[10px]">↵</kbd>
              Select
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>{filteredResults.length} indexed records</span>
          </div>
        </div>
      </div>
    </div>
  );
};
