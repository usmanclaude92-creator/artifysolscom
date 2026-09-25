import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  LayoutDashboard,
  LogIn,
  LogOut,
  ChevronDown,
  Search,
  Layers,
  Cpu,
  Bot,
  ShieldCheck,
  Building2,
  HardHat,
  BadgeDollarSign,
  Briefcase,
  Users,
  FileText,
  Boxes,
  Workflow,
  Sparkles,
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

type DropdownKey = 'ecosystem' | 'solutions' | 'ai' | 'architecture' | 'systems' | null;

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
  onOpenGlobalSearch,
  onOpenAuditSpec,
  activeRoute = 'home',
  theme,
  onToggleTheme,
}) => {
  const { user, openPortal, openAuthModal, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRouteClick = (e: React.MouseEvent, routeAction?: () => void) => {
    if (routeAction) {
      e.preventDefault();
      routeAction();
      setSideMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveDropdown(null);
    setSideMenuOpen(false);
    if (activeRoute !== 'home' && onNavigateToHome) {
      onNavigateToHome();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isLight
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm py-3'
            : 'bg-[#06060a]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-xl py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-[4%] xl:px-[5%] max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <a
          href="/"
          onClick={(e) => handleRouteClick(e, onNavigateToHome)}
          className="flex items-center gap-2 group focus:outline-none shrink-0"
          id="brand-logo"
        >
          <div className="text-xl sm:text-2xl font-black tracking-widest text-foreground font-display flex items-center gap-1 select-none">
            <span>ARTIFY</span>
          </div>
        </a>

        {/* Center: Desktop Navigation Bar with Dropdowns */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-foreground-secondary"
        >
          {/* 1. Ecosystem Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('ecosystem')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => scrollToSection('ecosystem')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-foreground ${
                activeDropdown === 'ecosystem' ? 'text-[#0066FF]' : ''
              }`}
            >
              <span>Ecosystem</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {activeDropdown === 'ecosystem' && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl surface-card border border-card-border shadow-2xl animate-in fade-in duration-150 z-50">
                <button
                  onClick={() => scrollToSection('ecosystem')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Cpu className="w-4 h-4 text-[#0066FF] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Enterprise Ecosystems</div>
                    <div className="text-[10px] text-foreground-muted">Connected digital environments</div>
                  </div>
                </button>
                <button
                  onClick={() => scrollToSection('approach')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Boxes className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">The Artify Approach</div>
                    <div className="text-[10px] text-foreground-muted">Software adapting to business</div>
                  </div>
                </button>
                <button
                  onClick={() => scrollToSection('journey')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Workflow className="w-4 h-4 text-purple-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">How We Build</div>
                    <div className="text-[10px] text-foreground-muted">7-phase engineering journey</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 2. Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={(e) => handleRouteClick(e, onNavigateToSolutionsCatalog)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-foreground ${
                activeDropdown === 'solutions' ? 'text-[#0066FF]' : ''
              }`}
            >
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {activeDropdown === 'solutions' && (
              <div className="absolute top-full left-0 mt-1 w-72 p-2 rounded-2xl surface-card border border-card-border shadow-2xl animate-in fade-in duration-150 z-50">
                <button
                  onClick={(e) => handleRouteClick(e, onNavigateToSolutionsCatalog)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Layers className="w-4 h-4 text-[#0066FF] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Enterprise Solutions Catalog</div>
                    <div className="text-[10px] text-foreground-muted">Explore all 24 modular blueprints</div>
                  </div>
                </button>
                <button
                  onClick={(e) => handleRouteClick(e, onNavigateToIndustries)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-cyan-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Industry Solutions</div>
                    <div className="text-[10px] text-foreground-muted">Construction, BFSI, Healthcare, Retail</div>
                  </div>
                </button>
                <button
                  onClick={(e) => handleRouteClick(e, onNavigateToCaseStudies)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Case Studies &amp; Blueprints</div>
                    <div className="text-[10px] text-foreground-muted">Real-world operational transformations</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. AI Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('ai')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => scrollToSection('ai')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-foreground ${
                activeDropdown === 'ai' ? 'text-[#0066FF]' : ''
              }`}
            >
              <span>AI</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {activeDropdown === 'ai' && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl surface-card border border-card-border shadow-2xl animate-in fade-in duration-150 z-50">
                <button
                  onClick={() => scrollToSection('ai')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Bot className="w-4 h-4 text-purple-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">AI That Understands Your Business</div>
                    <div className="text-[10px] text-foreground-muted">Understand • Decide • Act • Learn</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenConsultant();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#0066FF] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Interactive AI Advisor</div>
                    <div className="text-[10px] text-foreground-muted">Consult architecture reasoning model</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. Architecture Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('architecture')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => scrollToSection('architecture')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-foreground ${
                activeDropdown === 'architecture' ? 'text-[#0066FF]' : ''
              }`}
            >
              <span>Architecture</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {activeDropdown === 'architecture' && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl surface-card border border-card-border shadow-2xl animate-in fade-in duration-150 z-50">
                <button
                  onClick={() => scrollToSection('architecture')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Sovereign Data Architecture</div>
                    <div className="text-[10px] text-foreground-muted">Control, encryption, and auditability</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    if (onOpenAuditSpec) onOpenAuditSpec();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#0066FF] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Technical &amp; SEO Audit Spec</div>
                    <div className="text-[10px] text-foreground-muted">Master architecture specification</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 5. Systems Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('systems')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => scrollToSection('systems')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-foreground ${
                activeDropdown === 'systems' ? 'text-[#0066FF]' : ''
              }`}
            >
              <span>Systems</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {activeDropdown === 'systems' && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl surface-card border border-card-border shadow-2xl animate-in fade-in duration-150 z-50">
                <button
                  onClick={() => scrollToSection('systems')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Users className="w-4 h-4 text-teal-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Human Capital Management (HCMS)</div>
                    <div className="text-[10px] text-foreground-muted">Employees, Payroll, WPS</div>
                  </div>
                </button>
                <button
                  onClick={() => scrollToSection('systems')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <HardHat className="w-4 h-4 text-[#0066FF] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Construction BuildOS</div>
                    <div className="text-[10px] text-foreground-muted">Projects, Procurement, Finance</div>
                  </div>
                </button>
                <button
                  onClick={() => scrollToSection('systems')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <BadgeDollarSign className="w-4 h-4 text-sky-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Financial Operations &amp; ERP</div>
                    <div className="text-[10px] text-foreground-muted">Ledgers, 3-way matching, audit</div>
                  </div>
                </button>
                <button
                  onClick={() => scrollToSection('systems')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-background-subtle flex items-start gap-2.5 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-cyan-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground">CRM &amp; Client Operations</div>
                    <div className="text-[10px] text-foreground-muted">Commercial pipeline &amp; portals</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 6. Insights */}
          <a
            href="/blog"
            onClick={(e) => handleRouteClick(e, onNavigateToBlog)}
            className={`px-3 py-2 rounded-lg transition-colors hover:text-foreground ${
              activeRoute === 'blog' ? 'text-[#0066FF]' : ''
            }`}
          >
            Insights
          </a>

          {/* 7. Company */}
          <a
            href="/about"
            onClick={(e) => handleRouteClick(e, onNavigateToAbout)}
            className={`px-3 py-2 rounded-lg transition-colors hover:text-foreground ${
              activeRoute === 'about' ? 'text-[#0066FF]' : ''
            }`}
          >
            Company
          </a>
        </nav>

        {/* Right: Search, Theme Toggle, and Blue Pill CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Icon Button */}
          <button
            onClick={onOpenGlobalSearch}
            className={`p-2 sm:p-2.5 rounded-full border transition-all text-foreground-muted hover:text-foreground ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
            title="Search (⌘K)"
            aria-label="Global Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={(e) => onToggleTheme(e)}
            className={`p-2 sm:p-2.5 rounded-full border transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Client Portal Quick Button (if logged in) */}
          {user && (
            <button
              onClick={() => openPortal('overview')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full surface-card border border-border text-xs font-semibold text-foreground hover:bg-background-subtle"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Portal</span>
            </button>
          )}

          {/* Master CTA Pill Button: Build Your Ecosystem → */}
          <button
            onClick={onOpenSolutionBuilder}
            id="nav-build-ecosystem-btn"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <span>Build Your Ecosystem</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setSideMenuOpen(true)}
            id="mobile-nav-hamburger"
            className="lg:hidden p-2 rounded-xl border border-border text-foreground hover:bg-background-subtle"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div
            className={`w-[85vw] max-w-sm h-full flex flex-col justify-between p-6 surface-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-200 ${
              isLight ? 'bg-white' : 'bg-[#09090f]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xl font-black tracking-widest text-foreground font-display">
                  ARTIFY
                </span>
                <button
                  onClick={() => setSideMenuOpen(false)}
                  className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <div className="pt-4 pb-2">
                <button
                  onClick={() => {
                    setSideMenuOpen(false);
                    onOpenGlobalSearch?.();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border bg-background-subtle text-xs text-foreground-muted font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#0066FF]" />
                    <span>Search solutions &amp; agents...</span>
                  </div>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/5">⌘K</kbd>
                </button>
              </div>

              {/* Mobile Links */}
              <div className="space-y-1 py-3 text-sm font-semibold">
                <button
                  onClick={() => scrollToSection('ecosystem')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  Ecosystem
                </button>
                <button
                  onClick={() => scrollToSection('approach')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  The Artify Approach
                </button>
                <button
                  onClick={(e) => handleRouteClick(e, onNavigateToSolutionsCatalog)}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  Solutions
                </button>
                <button
                  onClick={() => scrollToSection('systems')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  Enterprise Systems
                </button>
                <button
                  onClick={() => scrollToSection('ai')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  AI Architecture
                </button>
                <button
                  onClick={() => scrollToSection('architecture')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  Sovereign Architecture
                </button>
                <button
                  onClick={(e) => handleRouteClick(e, onNavigateToBlog)}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  Insights &amp; Research
                </button>
                <button
                  onClick={(e) => handleRouteClick(e, onNavigateToAbout)}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-background-subtle text-foreground"
                >
                  Company (About Us)
                </button>
              </div>
            </div>

            {/* Mobile Footer Drawer Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setSideMenuOpen(false);
                  onOpenSolutionBuilder();
                }}
                className="w-full py-3 rounded-full bg-[#0066FF] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Build Your Ecosystem</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSideMenuOpen(false);
                  onNavigateToContact();
                }}
                className="w-full py-3 rounded-full surface-card border border-border text-foreground text-xs font-bold"
              >
                Talk to Our Experts
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
