import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  LayoutDashboard,
  LogIn,
  LogOut,
  FileText,
  ChevronRight,
  Info,
  BookOpen,
  Network,
  Building2,
  Bot,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AiProductItem } from '../types';

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
  onOpenGlobalSearch?: () => void;
  onOpenAuditSpec?: () => void;
  activeRoute?: string;
  theme: 'dark' | 'light';
  onToggleTheme: (event?: React.MouseEvent) => void;
}

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
  onOpenGlobalSearch,
  onOpenAuditSpec,
  activeRoute = 'home',
  theme,
  onToggleTheme,
}) => {
  const { user, openPortal, openAuthModal, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const isLight = theme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    }
  };

  // Section smooth-scroll or route fallback
  const handleSectionClick = (e: React.MouseEvent, sectionId: string, fallbackRoute?: () => void) => {
    e.preventDefault();
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

        {/* Desktop Primary Navigation (Our Solutions | Industries | Ecosystem | Insights | About Artify) */}
        <nav
          aria-label="Main Navigation"
          className={`hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 border rounded-full px-2.5 sm:px-3 lg:px-4 py-1.5 backdrop-blur-md shadow-inner transition-all duration-200 ${
            isLight
              ? 'bg-slate-100/90 border-slate-200/90 text-slate-800'
              : 'bg-[#0d0d14]/80 border-white/[0.08] text-zinc-300'
          }`}
        >
          {/* 1. Our Solutions Link */}
          <a
            href="/solutions"
            onClick={(e) =>
              handleRouteClick(e, onNavigateToSolutionsCatalog || onNavigateToAiSolutions)
            }
            id="nav-link-solutions"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeRoute === 'solutions-catalog' ||
              activeRoute === 'ai-solutions' ||
              activeRoute === 'product-detail'
                ? 'bg-violet-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Our Solutions
          </a>

          {/* 2. Industries Link */}
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

          {/* 3. Ecosystem Link */}
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

          {/* 4. Insights Link (Blog & Whitepapers) */}
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

          {/* 5. About Artify Link */}
          <a
            href="/about"
            onClick={(e) => handleRouteClick(e, onNavigateToAbout)}
            id="nav-link-about-artify"
            className={`text-xs lg:text-[13px] font-medium px-2.5 lg:px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeRoute === 'about'
                ? 'bg-violet-600 text-white shadow-sm'
                : isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            About Artify
          </a>
        </nav>

        {/* Global Search Bar - Positioned directly between Menu Bar and Theme Toggle */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onOpenGlobalSearch}
            id="nav-global-search-btn"
            className={`group flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-200 shadow-sm w-44 xl:w-56 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
              isLight
                ? 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-200 text-slate-500 hover:text-slate-800'
                : 'bg-[#0f0f18]/80 hover:bg-[#161622] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
            }`}
            title="Search solutions, agents, and insights (Press ⌘K or /)"
            aria-label="Open Global Search"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 shrink-0 text-violet-400" />
              <span className="truncate text-[11px] xl:text-xs">Search solutions, agents...</span>
            </div>
            <kbd
              className={`hidden xl:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-zinc-400'
              }`}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Desktop Right Controls (>= 768px) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
          {/* Tablet/Medium Screen Search Icon Trigger */}
          <button
            onClick={onOpenGlobalSearch}
            id="nav-global-search-compact-btn"
            className={`lg:hidden flex items-center justify-center p-2 rounded-lg border transition-all duration-200 shadow-sm focus:outline-none ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-[#131318] hover:bg-[#1c1c24] border-white/[0.08] text-zinc-300 hover:text-white'
            }`}
            title="Search solutions & agents (⌘K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-violet-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={(e) => onToggleTheme(e)}
            id="nav-theme-toggle-btn"
            className={`relative flex items-center justify-center p-2 rounded-lg border transition-all duration-300 shadow-sm focus:outline-none overflow-hidden ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-[#131318] hover:bg-[#1c1c24] border-white/[0.08] text-zinc-300 hover:text-white'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              <Sun
                className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 transform ${
                  theme === 'dark'
                    ? 'rotate-0 scale-100 opacity-100'
                    : 'rotate-90 scale-0 opacity-0 pointer-events-none'
                }`}
              />
              <Moon
                className={`w-4 h-4 text-violet-600 absolute transition-all duration-300 transform ${
                  theme === 'light'
                    ? 'rotate-0 scale-100 opacity-100'
                    : '-rotate-90 scale-0 opacity-0 pointer-events-none'
                }`}
              />
            </div>
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

          {/* Client Portal & Sign-out Controls (Sign-out restricted strictly to authorized sessions) */}
          {user ? (
            <div className="flex items-center gap-1.5" id="nav-authorized-session-controls">
              <button
                onClick={() => openPortal('overview')}
                id="nav-client-portal-btn"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all group ${
                  isLight
                    ? 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-slate-900 shadow-violet-100'
                    : 'bg-[#151522] hover:bg-violet-950/70 border-violet-500/30 text-white shadow-violet-950/20 hover:border-violet-400/50'
                }`}
                title="Open Client Portal & Dashboard"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-inner">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className={`text-[11px] font-bold truncate max-w-[85px] ${
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

              <button
                onClick={logout}
                id="nav-client-logout-btn"
                className={`p-2 rounded-lg border transition-all shadow-sm active:scale-95 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200 hover:border-rose-200'
                    : 'bg-[#131318] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border-white/[0.08] hover:border-rose-500/30'
                }`}
                title="Sign Out of Authorized Session"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
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
            <div className="flex items-center gap-1.5" id="mobile-authorized-session-controls">
              <button
                onClick={() => openPortal('overview')}
                id="mobile-nav-quick-portal"
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border shadow-sm ${
                  isLight
                    ? 'bg-violet-50 border-violet-200 text-violet-800'
                    : 'bg-violet-950/70 border-violet-500/40 text-white'
                }`}
                title="Open Client Portal"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[11px]">Portal</span>
              </button>

              <button
                onClick={logout}
                id="mobile-nav-quick-logout"
                className={`p-1.5 rounded-lg border shadow-sm ${
                  isLight
                    ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                    : 'bg-[#151522] text-zinc-400 border-white/[0.08] hover:text-rose-300'
                }`}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
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

          {/* Mobile Global Search Button */}
          <button
            onClick={onOpenGlobalSearch}
            id="mobile-nav-search-btn"
            className={`p-2 rounded-xl border transition-all active:scale-95 focus:outline-none ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-[#121217] hover:bg-[#1a1a24] border-white/[0.1] text-zinc-200 hover:text-white'
            }`}
            aria-label="Open Global Search"
            title="Search solutions & agents (⌘K)"
          >
            <Search className="w-4 h-4 text-violet-400" />
          </button>

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
              {/* Mobile Quick Search Bar Button */}
              <button
                onClick={() => {
                  setSideMenuOpen(false);
                  if (onOpenGlobalSearch) onOpenGlobalSearch();
                }}
                id="mobile-drawer-search-btn"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-[#151522] hover:bg-[#1e1e2d] border-white/10 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-violet-400" />
                  <span>Search solutions & agents...</span>
                </div>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-500/15 text-zinc-400">⌘K</kbd>
              </button>

              {/* Navigation Items: Our Solutions | Industries | Ecosystem | Insights | About Artify */}
              <div className="space-y-1">
                {/* 1. Our Solutions */}
                <a
                  href="/solutions"
                  onClick={(e) => {
                    setSideMenuOpen(false);
                    handleRouteClick(e, onNavigateToSolutionsCatalog || onNavigateToAiSolutions);
                  }}
                  id="mobile-nav-link-solutions"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeRoute === 'solutions-catalog' ||
                    activeRoute === 'ai-solutions' ||
                    activeRoute === 'product-detail'
                      ? 'bg-violet-600 text-white'
                      : isLight
                      ? 'text-slate-800 hover:bg-slate-100'
                      : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span>Our Solutions</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                </a>

                {/* 2. Industries */}
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

                {/* 3. Ecosystem */}
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

                {/* 4. Insights */}
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

                {/* 5. About Artify */}
                <a
                  href="/about"
                  onClick={(e) => handleRouteClick(e, onNavigateToAbout)}
                  id="mobile-nav-link-about-artify"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-violet-400" />
                    <span>About Artify</span>
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

                {/* Audit & Rebuild Spec */}
                {onOpenAuditSpec && (
                  <button
                    onClick={() => {
                      setSideMenuOpen(false);
                      onOpenAuditSpec();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-zinc-200 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Audit &amp; Rebuild Spec</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      Ready
                    </span>
                  </button>
                )}
              </div>

              {/* Account / Authentication State in Drawer */}
              <div className="pt-2">
                {user ? (
                  <div className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 ${
                    isLight ? 'bg-violet-50/80 border-violet-200' : 'bg-violet-950/30 border-violet-500/20'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {user.name}
                        </p>
                        <p className="text-[10px] text-violet-500 dark:text-violet-400 font-mono-code truncate">
                          {user.company || 'Enterprise Account'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setSideMenuOpen(false);
                          openPortal('overview');
                        }}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-violet-600 text-white hover:bg-violet-500"
                      >
                        Portal
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setSideMenuOpen(false);
                        }}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${
                          isLight
                            ? 'border-slate-300 hover:bg-slate-200 text-slate-700'
                            : 'border-white/[0.1] hover:bg-white/[0.08] text-zinc-300'
                        }`}
                        title="Sign Out"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSideMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                      isLight
                        ? 'border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100'
                        : 'border-violet-500/30 bg-violet-950/40 text-violet-200 hover:bg-violet-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LogIn className="w-4 h-4 text-violet-400" />
                      <span>Sign In to Account</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-400" />
                  </button>
                )}
              </div>

              {/* Theme Toggle */}
              <div className="pt-2">
                <button
                  onClick={(e) => onToggleTheme(e)}
                  id="drawer-theme-toggle-btn"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors duration-300 ${
                    isLight
                      ? 'border-slate-200 bg-slate-100 text-slate-800'
                      : 'border-white/[0.08] bg-[#12121a] text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <Sun
                        className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 transform ${
                          theme === 'dark'
                            ? 'rotate-0 scale-100 opacity-100'
                            : 'rotate-90 scale-0 opacity-0 pointer-events-none'
                        }`}
                      />
                      <Moon
                        className={`w-4 h-4 text-violet-600 absolute transition-all duration-300 transform ${
                          theme === 'light'
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-0 opacity-0 pointer-events-none'
                        }`}
                      />
                    </div>
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
