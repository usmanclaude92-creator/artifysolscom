import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Building2,
  Workflow,
  Sun,
  Moon,
  LayoutDashboard,
  LogIn,
  FileText,
  ChevronRight,
  ChevronDown,
  Sliders,
  Terminal,
  Info,
  TrendingUp,
  MessageSquare,
  Scan,
  BookOpen,
  Mail,
  Zap,
  Database,
  Users,
  CreditCard,
  Truck,
  Boxes,
  Smartphone,
  DollarSign,
  Briefcase,
  Code2,
  Network,
  RefreshCw,
  FileSearch,
  ShieldCheck,
  CheckCircle2,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AiProductItem } from '../types';
import { AI_PRODUCTS } from '../data/aiProductsData';
import {
  SOLUTIONS_CATEGORIES,
  ARTIFY_INTELLIGENCE_CAPABILITIES,
  ECOSYSTEM_NODES,
  SolutionMenuItem,
} from '../data/solutionsMenuData';

interface NavbarProps {
  onOpenSolutionBuilder: () => void;
  onOpenConsultant: () => void;
  onNavigateToContact: () => void;
  onNavigateToHome?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToSolutionsCatalog?: () => void;
  onNavigateToAiSolutions?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToIndustries?: () => void;
  onNavigateToCaseStudies?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToPlatform?: () => void;
  onNavigateToIntelligence?: () => void;
  onNavigateToEcosystem?: () => void;
  onSelectProduct?: (product: AiProductItem) => void;
  activeRoute?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Database,
  BarChart3: TrendingUp, // fallback if needed or BarChart3 equivalent
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

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSolutionBuilder,
  onOpenConsultant,
  onNavigateToContact,
  onNavigateToHome,
  onNavigateToBlog,
  onNavigateToSolutionsCatalog,
  onNavigateToAiSolutions,
  onNavigateToServices,
  onNavigateToIndustries,
  onNavigateToCaseStudies,
  onNavigateToAbout,
  onNavigateToPlatform,
  onNavigateToIntelligence,
  onNavigateToEcosystem,
  onSelectProduct,
  activeRoute = 'home',
  theme,
  onToggleTheme,
}) => {
  const { user, openPortal, openAuthModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile side menu is active
  useEffect(() => {
    if (sideMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSideMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [sideMenuOpen]);

  const handleRouteClick = (e: React.MouseEvent, routeAction?: () => void) => {
    if (routeAction) {
      e.preventDefault();
      routeAction();
      setSideMenuOpen(false);
      setSolutionsDropdownOpen(false);
    }
  };

  // Section smooth-scroll or route fallback
  const handleSectionClick = (e: React.MouseEvent, sectionId: string, fallbackRoute?: () => void) => {
    e.preventDefault();
    setSolutionsDropdownOpen(false);
    setSideMenuOpen(false);

    if (activeRoute !== 'home') {
      if (fallbackRoute) {
        fallbackRoute();
      } else if (onNavigateToHome) {
        onNavigateToHome();
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (typeof window !== 'undefined' && window.location.hash !== `#${sectionId}`) {
        window.history.pushState(null, '', `#${sectionId}`);
      }
    } else if (fallbackRoute) {
      fallbackRoute();
    }
  };

  const handleMenuItemClick = (item: SolutionMenuItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSolutionsDropdownOpen(false);
    setSideMenuOpen(false);

    if (item.targetType === 'product' && item.targetSlug) {
      const prod = AI_PRODUCTS.find((p) => p.slug === item.targetSlug);
      if (prod && onSelectProduct) {
        onSelectProduct(prod);
        return;
      }
      if (onNavigateToAiSolutions) {
        onNavigateToAiSolutions();
        return;
      }
    }

    if (item.targetType === 'industry' && onNavigateToIndustries) {
      onNavigateToIndustries();
      return;
    }

    if (item.targetType === 'wizard') {
      onOpenSolutionBuilder();
      return;
    }

    if (item.targetType === 'contact') {
      onNavigateToContact();
      return;
    }

    // Default to solutions overview
    if (onNavigateToAiSolutions) {
      onNavigateToAiSolutions();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isLight
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-lg shadow-slate-900/5 py-2 sm:py-2.5'
            : 'bg-[#050508]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/80 py-2 sm:py-2.5'
          : 'bg-transparent py-3.5 sm:py-4.5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-[4%] xl:px-[5%] flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => handleRouteClick(e, onNavigateToHome)}
          className="flex items-center group focus:outline-none shrink-0"
          id="brand-logo"
        >
          <picture>
            <source
              srcSet={isLight ? '/logo-header-light.webp' : '/logo-header-dark.webp'}
              type="image/webp"
            />
            <img
              src={isLight ? '/logo-header-light.png' : '/logo-header-dark.png'}
              alt="Artify Solutions"
              width={418}
              height={132}
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </picture>
        </a>

        {/* Desktop Primary Navigation (Platform | Our Solutions | Intelligence | Industries | Ecosystem | Insights | Company) */}
        <nav
          aria-label="Main Navigation"
          className={`hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 border rounded-full px-2.5 sm:px-3 lg:px-4 py-1.5 backdrop-blur-md shadow-inner transition-all duration-200 ${
            isLight
              ? 'bg-slate-100/90 border-slate-200/90 text-slate-800'
              : 'bg-[#0d0d14]/80 border-white/[0.08] text-zinc-300'
          }`}
        >
          {/* 1. Platform Link */}
          <a
            href="#platform"
            onClick={(e) => handleSectionClick(e, 'platform', onNavigateToServices)}
            id="nav-link-platform"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeRoute === 'services'
                ? 'bg-violet-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Platform
          </a>

          {/* 2. OUR SOLUTIONS Mega-Menu Dropdown */}
          <div
            className="static"
            ref={dropdownRef}
            onMouseLeave={() => setSolutionsDropdownOpen(false)}
          >
            <div className="flex items-center">
              <a
                href="/solutions"
                onClick={(e) => {
                  setSolutionsDropdownOpen(false);
                  handleRouteClick(e, onNavigateToSolutionsCatalog || onNavigateToAiSolutions);
                }}
                onMouseEnter={() => setSolutionsDropdownOpen(true)}
                id="nav-our-solutions-dropdown-btn"
                aria-expanded={solutionsDropdownOpen}
                aria-haspopup="true"
                className={`text-xs lg:text-[13px] font-semibold px-3 lg:px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeRoute === 'solutions-catalog' || activeRoute === 'ai-solutions' || activeRoute === 'product-detail'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : solutionsDropdownOpen
                    ? isLight
                      ? 'bg-slate-200 text-slate-950'
                      : 'bg-white/[0.12] text-white'
                    : isLight
                    ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/70'
                    : 'text-zinc-200 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <span>Our Solutions</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSolutionsDropdownOpen(!solutionsDropdownOpen);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      setSolutionsDropdownOpen(!solutionsDropdownOpen);
                    }
                  }}
                  className="p-0.5 hover:text-violet-400 transition-colors cursor-pointer"
                  aria-label="Toggle solutions mega menu"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      solutionsDropdownOpen ? 'rotate-180 text-violet-400' : 'text-zinc-400'
                    }`}
                  />
                </span>
              </a>
            </div>

            {/* OUR SOLUTIONS Mega-Menu Container */}
            {solutionsDropdownOpen && (
              <div
                id="our-solutions-mega-menu"
                onMouseEnter={() => setSolutionsDropdownOpen(true)}
                onMouseLeave={() => setSolutionsDropdownOpen(false)}
                className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] md:w-[calc(100vw-4rem)] max-w-7xl max-h-[calc(100vh-5.5rem)] overflow-y-auto p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 z-50 ${
                  isLight
                    ? 'bg-white/98 border-slate-200/90 shadow-slate-900/15 text-slate-900'
                    : 'bg-[#090910]/98 border-white/[0.12] shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white'
                }`}
              >
                {/* Mega Menu Top Header Bar */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b gap-3 ${
                  isLight ? 'border-slate-200' : 'border-white/[0.08]'
                }`}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-semibold font-mono-code uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                      <span>Adaptive Enterprise Ecosystem</span>
                    </div>
                    <span className={`hidden lg:inline text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      Software engineered around how your business actually operates — connected, adaptive, and intelligent.
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <a
                      href="/ai-solutions"
                      onClick={(e) => handleRouteClick(e, onNavigateToAiSolutions)}
                      className="font-bold text-violet-500 hover:text-violet-400 dark:text-violet-400 dark:hover:text-violet-300 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Solutions Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Main Grid: Solutions Families Directory (Full Width, 3 Balanced Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                      {SOLUTIONS_CATEGORIES.map((category) => (
                        <div
                          key={category.id}
                          className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                            isLight
                              ? 'bg-slate-50/80 border-slate-200/80'
                              : 'bg-[#101018]/60 border-white/[0.06]'
                          }`}
                        >
                          <div>
                            {/* Category Header */}
                            <div className={`flex items-center justify-between pb-2 mb-2 border-b ${
                              isLight ? 'border-slate-200' : 'border-white/[0.06]'
                            }`}>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-400 font-mono-code">
                                {category.title}
                              </span>
                              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                                {category.items.length} Solutions
                              </span>
                            </div>

                            {/* Category Items */}
                            <div className="space-y-2">
                              {category.items.map((item) => {
                                const ItemIcon = ICON_MAP[item.iconName] || Layers;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={(e) => handleMenuItemClick(item, e)}
                                    className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 group ${
                                      isLight
                                        ? 'hover:bg-white hover:shadow-xs'
                                        : 'hover:bg-white/[0.06]'
                                    }`}
                                  >
                                    <div className="w-6 h-6 rounded-md bg-violet-600/15 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-violet-600/25 transition-all">
                                      <ItemIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-xs font-semibold transition-colors ${
                                          isLight ? 'text-slate-800 group-hover:text-violet-600' : 'text-zinc-200 group-hover:text-violet-300'
                                        }`}>
                                          {item.name}
                                        </span>
                                        {item.badge && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-mono-code">
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className={`text-[11px] line-clamp-2 leading-relaxed mt-0.5 ${
                                        isLight ? 'text-slate-600' : 'text-zinc-400'
                                      }`}>
                                        {item.tagline}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>

                {/* Dropdown Bottom Bar */}
                <div className={`mt-5 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
                  isLight ? 'border-slate-200' : 'border-white/[0.08]'
                }`}>
                  <div className={`flex items-center gap-3 text-[11px] font-mono-code flex-wrap ${
                    isLight ? 'text-slate-600' : 'text-zinc-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      SOC2 Type II Aligned
                    </span>
                    <span>•</span>
                    <span>Sovereign Private Cloud</span>
                    <span>•</span>
                    <span>Continuous Workflow Adaptability</span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href="/solutions"
                      onClick={(e) => {
                        handleRouteClick(e, onNavigateToSolutionsCatalog || onNavigateToAiSolutions);
                        setSolutionsDropdownOpen(false);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Full Solutions Catalog (24 Systems) &rarr;</span>
                    </a>

                    <a
                      href="/ai-solutions#ecosystem-architecture"
                      onClick={(e) => {
                        handleRouteClick(e, onNavigateToAiSolutions);
                        setSolutionsDropdownOpen(false);
                      }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                        isLight
                          ? 'text-violet-700 bg-violet-50/80 border-violet-200 hover:bg-violet-100'
                          : 'text-violet-300 bg-violet-950/40 border-violet-500/30 hover:bg-violet-900/40'
                      }`}
                    >
                      <span>7 Ecosystem Pillars</span>
                    </a>

                    <button
                      onClick={() => {
                        setSolutionsDropdownOpen(false);
                        onNavigateToContact();
                      }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        isLight
                          ? 'text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-100'
                          : 'text-zinc-300 hover:text-white border-white/[0.1] hover:bg-white/[0.04]'
                      }`}
                    >
                      Request Architecture Assessment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Intelligence Link */}
          <a
            href="#intelligence"
            onClick={(e) => handleSectionClick(e, 'intelligence', onOpenConsultant)}
            id="nav-link-intelligence"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Intelligence
          </a>

          {/* 4. Industries Link */}
          <a
            href="/industries"
            onClick={(e) => handleRouteClick(e, onNavigateToIndustries)}
            id="nav-link-industries"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeRoute === 'industries'
                ? 'bg-violet-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Industries
          </a>

          {/* 5. Ecosystem Link */}
          <a
            href="#ecosystem"
            onClick={(e) => handleSectionClick(e, 'ecosystem')}
            id="nav-link-ecosystem"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Ecosystem
          </a>

          {/* 6. Insights Link (Blog & Whitepapers) */}
          <a
            href="/blog"
            onClick={(e) => handleRouteClick(e, onNavigateToBlog)}
            id="nav-link-insights"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeRoute === 'blog'
                ? 'bg-violet-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <span>Insights</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
          </a>

          {/* 7. Company Link */}
          <a
            href="/about"
            onClick={(e) => handleRouteClick(e, onNavigateToAbout)}
            id="nav-link-company"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeRoute === 'about'
                ? 'bg-violet-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Company
          </a>
        </nav>

        {/* Desktop Right Controls (>= 768px) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            id="nav-theme-toggle-btn"
            className={`flex items-center justify-center p-2 rounded-lg border transition-all shadow-sm focus:outline-none ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-[#131318] hover:bg-[#1c1c24] border-white/[0.08] text-zinc-300 hover:text-white'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-violet-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* AI Interactive Advisor */}
          <button
            onClick={onOpenConsultant}
            id="nav-interactive-ai-btn"
            className={`hidden xl:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all shadow-sm ${
              isLight
                ? 'text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border-slate-200'
                : 'text-zinc-300 hover:text-white bg-[#131318] hover:bg-[#1c1c24] border-white/[0.08]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-violet-400" />
            <span>AI Advisor</span>
          </button>

          {/* Contact / Talk to Us Button */}
          <a
            href="/contact"
            onClick={(e) => handleRouteClick(e, onNavigateToContact)}
            id="nav-talk-to-us-btn"
            className={`group relative inline-flex items-center gap-1.5 text-xs font-semibold px-3 lg:px-3.5 py-2 rounded-lg border shadow-sm transition-all active:scale-[0.98] ${
              activeRoute === 'contact'
                ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                : isLight
                ? 'text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border-slate-200'
                : 'text-zinc-200 hover:text-white bg-[#131318] hover:bg-[#1c1c24] border-white/[0.1]'
            }`}
          >
            <span>Talk to Us</span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Client Portal / Login Button */}
          {user ? (
            <button
              onClick={() => openPortal('overview')}
              id="nav-client-portal-btn"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold shadow-md transition-all group ${
                isLight
                  ? 'bg-violet-50 hover:bg-violet-100 border-violet-300 text-slate-900 shadow-violet-200'
                  : 'bg-[#151522] hover:bg-violet-950/70 border-violet-500/40 text-white shadow-violet-950/30 hover:border-violet-400/60'
              }`}
              title="Open Client Portal & Dashboard"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-inner">
                {user.name.slice(0, 1)}
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`text-[11px] font-bold truncate max-w-[90px] ${
                    isLight ? 'text-slate-800' : 'text-zinc-100 group-hover:text-violet-200'
                  }`}
                >
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-violet-500 dark:text-violet-400 font-mono-code leading-none">
                  Portal
                </span>
              </div>
              <LayoutDashboard className="w-3.5 h-3.5 text-violet-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              id="nav-client-login-btn"
              className="flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/30 px-3.5 py-2 rounded-lg shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Client & Executive Login"
            >
              <LogIn className="w-3.5 h-3.5 text-violet-200" />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Header Controls (< 768px) */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <button
              onClick={() => openPortal('overview')}
              id="mobile-nav-quick-portal"
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border shadow-sm ${
                isLight
                  ? 'bg-violet-50 border-violet-200 text-violet-800'
                  : 'bg-violet-950/70 border-violet-500/40 text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px]">Portal</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              id="mobile-nav-quick-login"
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-2.5 py-1.5 rounded-lg shadow-sm shadow-violet-600/30"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="text-[11px]">Login</span>
            </button>
          )}

          {/* Hamburger Trigger Button */}
          <button
            onClick={() => setSideMenuOpen(true)}
            id="mobile-hamburger-btn"
            className={`p-2 rounded-xl border transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-[#121217] hover:bg-[#1a1a24] border-white/[0.1] text-zinc-200 hover:text-white'
            }`}
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-current" />
          </button>
        </div>
      </div>

      {/* Hamburger-Style Side Navigation Drawer (< 768px) */}
      {sideMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSideMenuOpen(false)}
            aria-hidden="true"
          />

          <aside
            id="mobile-side-nav-drawer"
            className={`fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[380px] flex flex-col justify-between shadow-2xl transition-transform transform translate-x-0 border-l animate-in slide-in-from-right duration-300 ease-out ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#090910] border-white/[0.1] text-zinc-100'
            }`}
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer Header */}
            <div
              className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
                isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/[0.08] bg-[#0d0d16]/50'
              }`}
            >
              <picture>
                <source
                  srcSet={isLight ? '/logo-header-light.webp' : '/logo-header-dark.webp'}
                  type="image/webp"
                />
                <img
                  src={isLight ? '/logo-header-light.png' : '/logo-header-dark.png'}
                  alt="Artify Solutions"
                  width={418}
                  height={132}
                  className="h-9 w-auto object-contain"
                />
              </picture>

              <button
                onClick={() => setSideMenuOpen(false)}
                id="close-side-nav-btn"
                className={`p-2 rounded-xl border transition-all active:scale-95 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-[#151520] hover:bg-[#1f1f2e] border-white/[0.1] text-zinc-300 hover:text-white'
                }`}
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {/* Navigation Items in New Order: Platform | Our Solutions | Intelligence | Industries | Ecosystem | Insights | Company */}
              <div className="space-y-1">
                {/* 1. Platform */}
                <a
                  href="#platform"
                  onClick={(e) => handleSectionClick(e, 'platform', onNavigateToServices)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-violet-400" />
                    <span>Platform & Architecture</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                </a>

                {/* 2. OUR SOLUTIONS Accordion */}
                <div className={`rounded-xl border overflow-hidden ${
                  isLight ? 'border-slate-200 bg-slate-50/60' : 'border-white/[0.08] bg-white/[0.02]'
                }`}>
                  <div className="flex items-center justify-between p-2.5">
                    <a
                      href="/solutions"
                      onClick={(e) => {
                        setSideMenuOpen(false);
                        handleRouteClick(e, onNavigateToSolutionsCatalog || onNavigateToAiSolutions);
                      }}
                      className={`flex-1 flex items-center gap-2.5 text-left font-semibold text-xs cursor-pointer ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span>Our Solutions</span>
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-400">
                        Full Catalog
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                      className="p-1 text-zinc-400 hover:text-white"
                      aria-label="Toggle solutions categories"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isLight ? 'text-slate-500' : 'text-zinc-400'
                        } ${mobileSolutionsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {mobileSolutionsOpen && (
                    <div className={`p-2 pt-0 space-y-2 border-t ${
                      isLight ? 'border-slate-200 bg-white/90' : 'border-white/[0.06] bg-black/40'
                    }`}>
                      <a
                        href="/solutions"
                        onClick={(e) => {
                          setSideMenuOpen(false);
                          handleRouteClick(e, onNavigateToSolutionsCatalog || onNavigateToAiSolutions);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-violet-500 hover:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-600/20 block"
                      >
                        → Solutions Catalog (24 Systems)
                      </a>

                      {/* Solution Families in Mobile Drawer */}
                      {SOLUTIONS_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="pt-1">
                          <button
                            onClick={() =>
                              setMobileActiveCategory(
                                mobileActiveCategory === cat.id ? null : cat.id
                              )
                            }
                            className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-400/90 font-mono-code"
                          >
                            <span>{cat.title}</span>
                            <ChevronDown
                              className={`w-3 h-3 text-zinc-500 transition-transform ${
                                mobileActiveCategory === cat.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {(mobileActiveCategory === cat.id || !mobileActiveCategory) && (
                            <div className="pl-2 space-y-1 mt-1">
                              {cat.items.map((item) => {
                                const ItemIcon = ICON_MAP[item.iconName] || Layers;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={(e) => handleMenuItemClick(item, e)}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                      isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-zinc-300 hover:bg-white/[0.06]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <ItemIcon className="w-3 h-3 text-violet-400 shrink-0" />
                                      <span className="truncate">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                      <span className="text-[9px] font-mono-code px-1 py-0.2 rounded bg-violet-500/20 text-violet-400 dark:text-violet-300 shrink-0">
                                        {item.badge}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Artify Intelligence Mobile Section */}
                      <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
                        <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-400 font-mono-code flex items-center gap-1.5">
                          <Cpu className="w-3 h-3" />
                          <span>Artify Intelligence Fabric</span>
                        </div>
                        <p className={`px-2.5 text-[10.5px] leading-relaxed mb-1.5 ${
                          isLight ? 'text-slate-600' : 'text-zinc-400'
                        }`}>
                          Cross-platform autonomous intelligence layer powering workflows, document parsing, and real-time insights.
                        </p>
                        <button
                          onClick={() => {
                            setSideMenuOpen(false);
                            onOpenConsultant();
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-violet-500 hover:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-600/20 flex items-center gap-1.5 font-semibold"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Open AI Architecture Advisor</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Intelligence */}
                <a
                  href="#intelligence"
                  onClick={(e) => handleSectionClick(e, 'intelligence', onOpenConsultant)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-violet-400" />
                    <span>Intelligence Layer</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                </a>

                {/* 4. Industries */}
                <a
                  href="/industries"
                  onClick={(e) => handleRouteClick(e, onNavigateToIndustries)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-violet-400" />
                    <span>Industry Solutions (14 Sectors)</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                </a>

                {/* 5. Ecosystem */}
                <a
                  href="#ecosystem"
                  onClick={(e) => handleSectionClick(e, 'ecosystem')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Network className="w-4 h-4 text-violet-400" />
                    <span>Adaptive Ecosystem</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                </a>

                {/* 6. Insights */}
                <a
                  href="/blog"
                  onClick={(e) => handleRouteClick(e, onNavigateToBlog)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-violet-600/20 text-violet-300 border border-violet-500/30"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span>Insights & Research</span>
                  </div>
                  <span className="text-[10px] font-mono-code bg-violet-500/40 px-2 py-0.5 rounded">
                    NEW
                  </span>
                </a>

                {/* 7. Company */}
                <a
                  href="/about"
                  onClick={(e) => handleRouteClick(e, onNavigateToAbout)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-violet-400" />
                    <span>Company & Security</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                </a>

                {/* Case Studies */}
                <a
                  href="/case-studies"
                  onClick={(e) => handleRouteClick(e, onNavigateToCaseStudies)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                    <span>Case Studies & Architectures</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                </a>
              </div>

              {/* Theme Toggle */}
              <div className="pt-2">
                <button
                  onClick={onToggleTheme}
                  id="drawer-theme-toggle-btn"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                    isLight
                      ? 'border-slate-200 bg-slate-100 text-slate-800'
                      : 'border-white/[0.08] bg-[#12121a] text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-300" />
                    ) : (
                      <Moon className="w-4 h-4 text-violet-600" />
                    )}
                    <span>{theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className={`p-4 border-t space-y-2.5 ${
              isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.08] bg-[#0d0d16]/70'
            }`}>
              <button
                onClick={() => {
                  setSideMenuOpen(false);
                  onOpenSolutionBuilder();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                  isLight
                    ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
                    : 'border-white/[0.1] bg-[#151520] text-zinc-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Build Your Adaptive Solution</span>
              </button>

              <a
                href="/contact"
                onClick={(e) => handleRouteClick(e, onNavigateToContact)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-violet-600 text-white font-semibold text-xs shadow-lg shadow-violet-600/30"
              >
                <span>Talk to Us</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
