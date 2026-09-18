import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Layers,
  Database,
  Users,
  Smartphone,
  DollarSign,
  CreditCard,
  Truck,
  Briefcase,
  Boxes,
  Workflow,
  Building2,
  Sliders,
  Code2,
  Network,
  RefreshCw,
  FileSearch,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  FileText,
  Cpu,
  Zap,
  Bot,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  SlidersHorizontal,
  Grid,
  List,
  X,
  ChevronDown,
  Shield,
  Activity,
  Check,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  EnterpriseSolutionItem,
  SolutionCatalogCategory,
  CATALOG_CATEGORIES,
  ENTERPRISE_SOLUTIONS,
} from '../../data/solutionsCatalogData';
import { AI_PRODUCTS } from '../../data/aiProductsData';
import { AiProductItem } from '../../types';
import { updatePageSeo } from '../../utils/seo';

interface SolutionsCatalogPageProps {
  onSelectProduct?: (product: AiProductItem) => void;
  onOpenConsultant: () => void;
  onOpenSolutionBuilder: (solutionId?: string) => void;
  onNavigateToContact: () => void;
  onNavigateToIndustries?: () => void;
  onNavigateToAiSolutions?: () => void;
  theme?: 'dark' | 'light';
}

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Database,
  BarChart3: TrendingUp,
  Users,
  Smartphone,
  DollarSign,
  CreditCard,
  Truck,
  Briefcase,
  Boxes,
  Workflow,
  Building2,
  Sliders,
  Code2,
  Network,
  RefreshCw,
  FileSearch,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  FileText,
  Cpu,
  Zap,
  Bot,
};

export const SolutionsCatalogPage: React.FC<SolutionsCatalogPageProps> = ({
  onSelectProduct,
  onOpenConsultant,
  onOpenSolutionBuilder,
  onNavigateToContact,
  onNavigateToIndustries,
  onNavigateToAiSolutions,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<SolutionCatalogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeployment, setSelectedDeployment] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'category'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');

  // Architecture Inspection Modal State
  const [activeDossier, setActiveDossier] = useState<EnterpriseSolutionItem | null>(null);

  // SEO
  useEffect(() => {
    updatePageSeo({
      title: 'Enterprise Solutions Catalog | Artify Solutions',
      description:
        'Explore our comprehensive catalog of 24 modular enterprise software solutions, autonomous AI agent swarms, and sovereign private cloud architectures.',
      canonicalUrl: 'https://artifysols.com/solutions',
    });
  }, []);

  // Filtered and Sorted Solutions
  const filteredSolutions = useMemo(() => {
    let result = ENTERPRISE_SOLUTIONS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Deployment filter
      if (selectedDeployment !== 'all' && item.deployment !== selectedDeployment) {
        return false;
      }

      // Tier filter
      if (selectedTier !== 'all' && item.tier !== selectedTier) {
        return false;
      }

      // Industry filter
      if (selectedIndustry !== 'all') {
        const matchesIndustry = item.targetIndustries.some((ind) =>
          ind.toLowerCase().includes(selectedIndustry.toLowerCase()) || ind.includes('All')
        );
        if (!matchesIndustry) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.title.toLowerCase().includes(q);
        const matchesTagline = item.tagline.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesProblem = item.problemSolved.toLowerCase().includes(q);
        const matchesCategory =
          item.categoryLabel.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        const matchesCaps = item.capabilities.some((c) => c.toLowerCase().includes(q));
        const matchesSync = item.ecosystemNodes.some((node) => node.toLowerCase().includes(q));
        const matchesIndustries = item.targetIndustries.some((ind) => ind.toLowerCase().includes(q));
        const matchesCompliance = item.compliance.some((comp) => comp.toLowerCase().includes(q));
        const matchesDeployment = item.deployment.toLowerCase().includes(q);
        const matchesTier = item.tier.toLowerCase().includes(q);

        // Synonyms and category aliases (e.g. Financial -> finance, People -> workforce, Operations -> operations)
        const matchesAlias =
          ((q === 'financial' || q === 'finance' || q === 'accounting' || q === 'treasury') &&
            item.category === 'finance') ||
          ((q === 'people' || q === 'workforce' || q === 'hr' || q === 'payroll' || q === 'talent') &&
            item.category === 'workforce') ||
          ((q === 'operations' || q === 'operation' || q === 'ops' || q === 'execution' || q === 'logistics') &&
            item.category === 'operations') ||
          ((q === 'platform' || q === 'erp' || q === 'ledger') && item.category === 'platform') ||
          ((q === 'ai' || q === 'agent' || q === 'agents' || q === 'intelligence' || q === 'rag') &&
            item.category === 'intelligence') ||
          ((q === 'security' || q === 'sovereign' || q === 'privacy' || q === 'audit') &&
            item.category === 'security') ||
          ((q === 'custom' || q === 'bespoke' || q === 'adaptive') && item.category === 'custom');

        return (
          matchesName ||
          matchesTagline ||
          matchesDesc ||
          matchesProblem ||
          matchesCategory ||
          matchesCaps ||
          matchesSync ||
          matchesIndustries ||
          matchesCompliance ||
          matchesDeployment ||
          matchesTier ||
          matchesAlias
        );
      }

      return true;
    });

    // Sorting
    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      result = [...result].sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [selectedCategory, searchQuery, selectedDeployment, selectedTier, selectedIndustry, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    selectedDeployment !== 'all' ||
    selectedTier !== 'all' ||
    selectedIndustry !== 'all';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDeployment('all');
    setSelectedTier('all');
    setSelectedIndustry('all');
    setSortBy('featured');
  };

  const handleActionClick = (solution: EnterpriseSolutionItem) => {
    if (solution.actionType === 'product' && solution.targetSlug && onSelectProduct) {
      const matched = AI_PRODUCTS.find((p) => p.slug === solution.targetSlug);
      if (matched) {
        onSelectProduct(matched);
        return;
      }
    }

    if (solution.actionType === 'industry' && onNavigateToIndustries) {
      onNavigateToIndustries();
      return;
    }

    if (solution.actionType === 'contact') {
      onNavigateToContact();
      return;
    }

    // Default to wizard
    onOpenSolutionBuilder(solution.id);
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#050508] text-zinc-100'
      }`}
    >
      {/* 1. Header & Hero Section */}
      <div className="relative border-b overflow-hidden border-slate-200 dark:border-white/[0.08]">
        {/* Subtle background glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
          {/* Breadcrumb & Identifier */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-mono-code">
            <span className={isLight ? 'text-slate-500' : 'text-zinc-500'}>Home</span>
            <span className={isLight ? 'text-slate-400' : 'text-zinc-600'}>/</span>
            <span className="text-violet-500 dark:text-violet-400 font-semibold">
              Solutions Catalog
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider mb-3 bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Solutions Directory • 24 Modular Systems</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Architected Around Your Business.{' '}
                <span className="text-violet-600 dark:text-violet-400">Built to Adapt.</span>
              </h1>

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                  isLight ? 'text-slate-600' : 'text-zinc-400'
                }`}
              >
                Explore our full spectrum of interconnected enterprise software applications,
                autonomous AI agents, and modular platforms. Filter by functional pillar,
                deployment architecture, or industry vertical to discover your tailored configuration.
              </p>
            </div>

            {/* Quick Strategic Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenSolutionBuilder()}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-violet-600 hover:bg-violet-500 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Solution Builder</span>
              </button>

              <button
                onClick={onOpenConsultant}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all flex items-center gap-2 ${
                  isLight
                    ? 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
                    : 'border-white/[0.1] text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08]'
                }`}
              >
                <Bot className="w-4 h-4 text-violet-400" />
                <span>Ask AI Advisor</span>
              </button>
            </div>
          </div>

          {/* Telemetry / Trust Strip */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl border text-xs font-mono-code ${
              isLight
                ? 'bg-white/80 border-slate-200 shadow-xs text-slate-700'
                : 'bg-white/[0.02] border-white/[0.08] text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2.5 p-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block text-sm">24 Systems</span>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  Modular Enterprise Blocks
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
              <div>
                <span className="font-bold block text-sm">100% Sovereign</span>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  Zero 3P Model Training
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <div>
                <span className="font-bold block text-sm">7 Pillars</span>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  Interlocking Ecosystem
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <div>
                <span className="font-bold block text-sm">14 Sectors</span>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  Pre-Configured Domains
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filtering Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 mb-8">
          {/* Main Search Input */}
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isLight ? 'text-slate-400' : 'text-zinc-500'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions by name, capability, industry, or ecosystem node (e.g. ERP, Payroll, Swarm, SOC2)..."
              className={`w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm font-medium border transition-all outline-none ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                  : 'bg-[#101018] border-white/[0.1] text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-900/30'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATALOG_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                      : isLight
                      ? 'bg-white text-slate-700 border border-slate-200 hover:border-violet-300 hover:bg-slate-100'
                      : 'bg-[#101018] text-zinc-300 border border-white/[0.08] hover:border-violet-500/40 hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-code ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isLight
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-white/[0.08] text-zinc-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters & View Controls */}
          <div
            className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#101018]/80 border-white/[0.08]'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* Deployment Filter */}
              <div className="flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-500' : 'text-zinc-500'}>Deployment:</span>
                <select
                  value={selectedDeployment}
                  onChange={(e) => setSelectedDeployment(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-[#151522] border-white/10 text-zinc-200'
                  }`}
                >
                  <option value="all">All Architecture Types</option>
                  <option value="Sovereign Private Cloud">Sovereign Private Cloud</option>
                  <option value="Hybrid Edge">Hybrid Edge</option>
                  <option value="Air-Gapped On-Premise">Air-Gapped On-Premise</option>
                  <option value="Multi-Agent Mesh">Multi-Agent Mesh</option>
                </select>
              </div>

              {/* Tier Filter */}
              <div className="flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-500' : 'text-zinc-500'}>Tier:</span>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-[#151522] border-white/10 text-zinc-200'
                  }`}
                >
                  <option value="all">All Tiers</option>
                  <option value="Global Enterprise">Global Enterprise</option>
                  <option value="Mid-Market & Up">Mid-Market & Up</option>
                  <option value="Regulated Industries">Regulated Industries</option>
                  <option value="Universal">Universal</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-500' : 'text-zinc-500'}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-[#151522] border-white/10 text-zinc-200'
                  }`}
                >
                  <option value="featured">Featured Priority</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                  <option value="category">Category Family</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1.5 rounded-lg text-violet-500 hover:text-violet-400 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-black/20 dark:bg-white/[0.06] p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Matrix List View"
                aria-label="Matrix List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs">
          <p className={isLight ? 'text-slate-600' : 'text-zinc-400'}>
            Showing <strong className={isLight ? 'text-slate-900' : 'text-white'}>{filteredSolutions.length}</strong> of{' '}
            {ENTERPRISE_SOLUTIONS.length} enterprise solutions
          </p>

          <span className="font-mono-code text-[11px] text-violet-500 dark:text-violet-400">
            Autonomous Interoperability Ready
          </span>
        </div>

        {/* 3. Empty State */}
        {filteredSolutions.length === 0 && (
          <div
            className={`p-12 text-center rounded-3xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#101018] border-white/[0.08]'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">No matching solutions found</h3>
            <p
              className={`text-xs max-w-md mx-auto mb-6 ${
                isLight ? 'text-slate-600' : 'text-zinc-400'
              }`}
            >
              We couldn't find any enterprise solutions matching your current search or filter
              criteria. Try clearing your filters or describing your workflow to our AI consultant.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white"
              >
                Reset All Filters
              </button>
              <button
                onClick={onOpenConsultant}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                  isLight ? 'border-slate-300 text-slate-700' : 'border-white/10 text-white'
                }`}
              >
                Ask AI Advisor
              </button>
            </div>
          </div>
        )}

        {/* 4. Grid View */}
        {viewMode === 'grid' && filteredSolutions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((solution) => {
              const SIcon = ICON_MAP[solution.iconName] || Sparkles;

              return (
                <div
                  key={solution.id}
                  id={`solution-card-${solution.id}`}
                  className={`group rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    isLight
                      ? 'bg-white border-slate-200/90 shadow-md hover:shadow-xl hover:border-violet-400/80 hover:-translate-y-1'
                      : 'bg-[#0c0c14] border-white/[0.08] hover:border-violet-500/50 shadow-xl hover:shadow-[0_12px_36px_rgba(139,92,246,0.22)] hover:-translate-y-1.5'
                  }`}
                >
                  {/* Top Ambient Glow on Hover */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/25 transition-all duration-500 pointer-events-none -mr-16 -mt-16" />

                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                            isLight
                              ? 'bg-violet-100 text-violet-700 border border-violet-200'
                              : 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                          }`}
                        >
                          <SIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider font-mono-code ${
                              isLight ? 'text-violet-700' : 'text-violet-400'
                            }`}
                          >
                            {solution.categoryLabel}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span
                              className={`text-xs font-medium ${
                                isLight ? 'text-slate-500' : 'text-zinc-400'
                              }`}
                            >
                              {solution.deployment}
                            </span>
                          </div>
                        </div>
                      </div>

                      {solution.badge && (
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border tracking-wider shrink-0 ${
                            isLight
                              ? 'bg-violet-50 text-violet-800 border-violet-200'
                              : 'bg-violet-950/60 text-violet-300 border-violet-700/50 shadow-inner'
                          }`}
                        >
                          {solution.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Tagline */}
                    <div className="mb-2">
                      <h3
                        className={`text-lg font-bold transition-colors group-hover:text-violet-500 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {solution.title}
                      </h3>
                      <p
                        className={`text-xs font-medium mt-1 line-clamp-1 ${
                          isLight ? 'text-violet-700' : 'text-violet-400'
                        }`}
                      >
                        {solution.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <p
                      className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                        isLight ? 'text-slate-600' : 'text-zinc-400'
                      }`}
                    >
                      {solution.description}
                    </p>

                    {/* Key Capabilities */}
                    <div className="space-y-1.5 mb-4">
                      {solution.capabilities.slice(0, 3).map((cap, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span
                            className={`line-clamp-1 text-xs ${
                              isLight ? 'text-slate-700' : 'text-zinc-300'
                            }`}
                          >
                            {cap}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Ecosystem Syncs */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                          Ecosystem Mesh:
                        </span>
                        <span className={`text-[10px] font-mono-code font-semibold ${isLight ? 'text-violet-600' : 'text-violet-400'}`}>
                          Tier: {solution.tier}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {solution.ecosystemNodes.map((node) => (
                          <span
                            key={node}
                            className={`text-[10px] font-mono-code px-2 py-0.5 rounded-md border ${
                              isLight
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-white/[0.04] text-zinc-300 border-white/[0.06]'
                            }`}
                          >
                            {node}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Strip */}
                    <div
                      className={`grid grid-cols-3 gap-2 p-2.5 rounded-xl mb-4 text-center border text-[10px] font-mono-code ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-white/[0.02] border-white/[0.04] text-zinc-400'
                      }`}
                    >
                      {solution.metrics.map((m, idx) => (
                        <div key={idx} className="truncate">
                          <span className={`block font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {m.value}
                          </span>
                          <span className="truncate">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t flex items-center justify-between gap-3 border-slate-200 dark:border-white/[0.06]">
                    <button
                      onClick={() => setActiveDossier(solution)}
                      id={`inspect-dossier-${solution.id}`}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                          : 'bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 border-white/[0.08]'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5 text-violet-400" />
                      <span>Inspect Dossier</span>
                    </button>

                    <button
                      onClick={() => handleActionClick(solution)}
                      id={`action-btn-${solution.id}`}
                      className="text-xs font-semibold px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-violet-600/25 active:scale-95 group-hover:shadow-violet-600/40"
                    >
                      <span>
                        {solution.actionType === 'product'
                          ? 'Product Spec'
                          : solution.actionType === 'contact'
                          ? 'Request Brief'
                          : 'Configure'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Matrix / List View */}
        {viewMode === 'matrix' && filteredSolutions.length > 0 && (
          <div
            className={`rounded-2xl border overflow-hidden ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#101018] border-white/[0.08]'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b font-mono-code uppercase tracking-wider ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-500'
                        : 'bg-white/[0.03] border-white/[0.08] text-zinc-400'
                    }`}
                  >
                    <th className="py-3.5 px-4">Solution Name</th>
                    <th className="py-3.5 px-4">Category & Tier</th>
                    <th className="py-3.5 px-4">Deployment Model</th>
                    <th className="py-3.5 px-4">Key Metrics</th>
                    <th className="py-3.5 px-4">Ecosystem Nodes</th>
                    <th className="py-3.5 px-4">Compliance</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06]">
                  {filteredSolutions.map((solution) => {
                    const SIcon = ICON_MAP[solution.iconName] || Sparkles;

                    return (
                      <tr
                        key={solution.id}
                        className={`transition-colors ${
                          isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium">
                          <div className="flex items-center gap-2.5">
                            <SIcon className="w-4 h-4 text-violet-500 shrink-0" />
                            <div>
                              <span className="font-bold block text-sm">{solution.title}</span>
                              <span
                                className={`text-[11px] line-clamp-1 ${
                                  isLight ? 'text-slate-500' : 'text-zinc-500'
                                }`}
                              >
                                {solution.tagline}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="block font-semibold">{solution.categoryLabel}</span>
                          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                            {solution.tier}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono-code text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400">
                            {solution.deployment}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono-code text-[11px]">
                          <span className="font-bold text-violet-400">
                            {solution.metrics[0]?.value}
                          </span>{' '}
                          <span className={isLight ? 'text-slate-500' : 'text-zinc-500'}>
                            ({solution.metrics[0]?.label})
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {solution.ecosystemNodes.slice(0, 3).map((node) => (
                              <span
                                key={node}
                                className="text-[9.5px] font-mono-code px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/5 border border-white/5"
                              >
                                {node}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono-code text-[10px]">
                          <span className="text-emerald-500 dark:text-emerald-400">
                            {solution.compliance[0]}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setActiveDossier(solution)}
                              className={`p-1.5 rounded-lg border text-xs ${
                                isLight
                                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                                  : 'border-white/10 text-zinc-300 hover:bg-white/5'
                              }`}
                              title="Inspect Architecture"
                            >
                              <Activity className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleActionClick(solution)}
                              className="px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                            >
                              <span>Explore</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Strategic Bottom Callout */}
        <div
          className={`mt-14 p-8 rounded-3xl border relative overflow-hidden text-center max-w-4xl mx-auto ${
            isLight
              ? 'bg-gradient-to-br from-violet-50 via-white to-indigo-50 border-violet-200'
              : 'bg-gradient-to-br from-[#121020] via-[#0d0d16] to-[#0a0a10] border-violet-500/20'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-600/30">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold mb-3">
            Need a Customized Enterprise Architecture Assessment?
          </h3>

          <p
            className={`text-sm max-w-xl mx-auto mb-6 leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}
          >
            Our software engineers and enterprise architects conduct deep-dive workflow audits to
            map your proprietary business logic into an interoperable, sovereign software fabric.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenSolutionBuilder()}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-violet-600 hover:bg-violet-500 transition-all flex items-center gap-2 shadow-md shadow-violet-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Configure Custom Architecture</span>
            </button>

            <button
              onClick={onNavigateToContact}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
                isLight
                  ? 'border-slate-300 text-slate-800 bg-white hover:bg-slate-50'
                  : 'border-white/10 text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              Request Architecture Assessment &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 7. Slide-over / Modal: Architecture Dossier */}
      {activeDossier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveDossier(null)}
        >
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 relative shadow-2xl ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#0f0f18] border-white/[0.1] text-zinc-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveDossier(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              aria-label="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dossier Header */}
            <div className="flex items-center gap-2 mb-2 font-mono-code text-xs text-violet-500 dark:text-violet-400 font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Enterprise Architecture Dossier</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-1">{activeDossier.title}</h2>
            <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {activeDossier.tagline}
            </p>

            {/* Architectural Tags Strip */}
            <div className="flex flex-wrap gap-2 mb-6 text-xs font-mono-code">
              <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                Deployment: {activeDossier.deployment}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Tier: {activeDossier.tier}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                Status: General Availability
              </span>
            </div>

            {/* Overview & Problem Solved */}
            <div className="space-y-4 mb-6 text-xs leading-relaxed">
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <h4 className="font-bold text-sm mb-1">Architecture Overview</h4>
                <p className={isLight ? 'text-slate-700' : 'text-zinc-300'}>
                  {activeDossier.description}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-rose-950/20 border-rose-500/20'
                }`}
              >
                <h4 className="font-bold text-sm text-rose-600 dark:text-rose-400 mb-1">
                  Core Inefficiency Eliminated
                </h4>
                <p className={isLight ? 'text-slate-700' : 'text-zinc-300'}>
                  {activeDossier.problemSolved}
                </p>
              </div>
            </div>

            {/* Core Capabilities */}
            <div className="mb-6">
              <h4 className="font-bold text-sm mb-3">Deterministic Capabilities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeDossier.capabilities.map((cap, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.05]'
                    }`}
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-700' : 'text-zinc-300'}>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Ecosystem Nodes */}
            <div className="mb-6">
              <h4 className="font-bold text-sm mb-2">Connected Ecosystem Communication</h4>
              <p
                className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}
              >
                This modular solution streams events and synchronizes ledgers directly with these
                ecosystem pillars:
              </p>
              <div className="flex flex-wrap gap-2">
                {activeDossier.ecosystemNodes.map((node) => (
                  <span
                    key={node}
                    className="px-3 py-1 rounded-xl text-xs font-mono-code font-semibold bg-violet-600 text-white"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics & SLA Specs */}
            <div className="mb-8">
              <h4 className="font-bold text-sm mb-2">Telemetry Benchmarks & Compliance</h4>
              <div
                className={`grid grid-cols-3 gap-3 p-3 rounded-2xl border text-center font-mono-code text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                {activeDossier.metrics.map((m, idx) => (
                  <div key={idx}>
                    <span className="block font-bold text-sm text-violet-400">{m.value}</span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {activeDossier.compliance.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
              <button
                onClick={() => setActiveDossier(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border ${
                  isLight ? 'border-slate-300 text-slate-700' : 'border-white/10 text-zinc-300'
                }`}
              >
                Close Dossier
              </button>

              <button
                onClick={() => {
                  const solution = activeDossier;
                  setActiveDossier(null);
                  handleActionClick(solution);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-2 shadow-md shadow-violet-600/20"
              >
                <span>Deploy / Configure System</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
