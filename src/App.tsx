import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStatement } from './components/TrustStatement';
import { AdaptiveEcosystem } from './components/AdaptiveEcosystem';
import { NextGenAiLayer } from './components/NextGenAiLayer';
import { AdaptiveIntelligence } from './components/AdaptiveIntelligence';
import { EnterpriseSolutions } from './components/EnterpriseSolutions';
import { IndustryShowcase } from './components/IndustryShowcase';
import { LiveScenarios } from './components/LiveScenarios';
import { EnterpriseArchitecture } from './components/EnterpriseArchitecture';
import { SecurityAndSovereignty } from './components/SecurityAndSovereignty';
import { DeploymentMethodology } from './components/DeploymentMethodology';
import { WhatWeBuild } from './components/WhatWeBuild';
import { AiAgentsSection } from './components/AiAgentsSection';
import { AiOrchestration } from './components/AiOrchestration';
import { IndustryExplorer } from './components/IndustryExplorer';
import { SolutionsByFunction } from './components/SolutionsByFunction';
import { ArtifyDifference } from './components/ArtifyDifference';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { AiCommandCenter } from './components/AiCommandCenter';
import { IntegrationsEcosystem } from './components/IntegrationsEcosystem';
import { SecurityAndGovernance } from './components/SecurityAndGovernance';
import { HumanPlusAi } from './components/HumanPlusAi';
import { CustomizationShowcase } from './components/CustomizationShowcase';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { TechnologyStack } from './components/TechnologyStack';
import { AboutAndVision } from './components/AboutAndVision';
import { ContactAndBrief } from './components/ContactAndBrief';
import { Footer } from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/portal/AuthModal';
import { BlogPreviewSection } from './components/BlogPreviewSection';
import { Bot, Sparkles, ArrowRight, MessageSquare, Zap, Cpu, Layers } from 'lucide-react';
import { playHoverSound } from './utils/soundEffects';
import { safeGetLocalStorage, safeSetLocalStorage } from './utils/storage';
import { ConsultantMessage, AiProductItem, AppRoute } from './types';
import { AI_PRODUCTS, getAiProductBySlug } from './data/aiProductsData';
import { updatePageSeo } from './utils/seo';
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  ScrollProgressBar,
} from './components/AnimatedSection';
import { motion } from 'framer-motion';

// Code-splitting: the home route is the only one eagerly bundled. Every other
// route, the client portal (which pulls in the chart library) and the modal
// overlays are fetched on demand, keeping them out of the initial payload.
const AiSolutionsPage = lazy(() =>
  import('./components/solutions/AiSolutionsPage').then((m) => ({ default: m.AiSolutionsPage }))
);
const AiProductDetailPage = lazy(() =>
  import('./components/solutions/AiProductDetailPage').then((m) => ({ default: m.AiProductDetailPage }))
);
const ServicesPage = lazy(() =>
  import('./components/pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const IndustriesPage = lazy(() =>
  import('./components/pages/IndustriesPage').then((m) => ({ default: m.IndustriesPage }))
);
const CaseStudiesPage = lazy(() =>
  import('./components/pages/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage }))
);
const AboutPage = lazy(() =>
  import('./components/pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./components/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const LegalPage = lazy(() =>
  import('./components/pages/LegalPage').then((m) => ({ default: m.LegalPage }))
);
const BlogPage = lazy(() =>
  import('./components/blog/BlogPage').then((m) => ({ default: m.BlogPage }))
);
const ClientPortal = lazy(() =>
  import('./components/portal/ClientPortal').then((m) => ({ default: m.ClientPortal }))
);
const InteractiveAiConsultant = lazy(() =>
  import('./components/InteractiveAiConsultant').then((m) => ({ default: m.InteractiveAiConsultant }))
);
const SolutionBuilderWizard = lazy(() =>
  import('./components/SolutionBuilderWizard').then((m) => ({ default: m.SolutionBuilderWizard }))
);
const SitemapModal = lazy(() =>
  import('./components/SitemapModal').then((m) => ({ default: m.SitemapModal }))
);

// Reserves viewport height so a route swap never causes layout shift.
const RouteFallback = () => <div className="min-h-screen" aria-hidden="true" />;

// Maps a real, crawlable pathname to the app's internal route state.
// Keeping this as a single source of truth means every nav entry point
// (initial load, back/forward, programmatic navigation) resolves the same way.
function getRouteFromPath(pathname: string): { route: AppRoute; slug?: string } {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';

  if (path.startsWith('/ai-solutions/')) {
    return { route: 'product-detail', slug: decodeURIComponent(path.replace('/ai-solutions/', '')) };
  }
  if (path === '/ai-solutions') return { route: 'ai-solutions' };
  if (path === '/services') return { route: 'services' };
  if (path === '/industries') return { route: 'industries' };
  if (path === '/case-studies') return { route: 'case-studies' };
  if (path === '/about') return { route: 'about' };
  if (path === '/contact') return { route: 'contact' };
  if (path === '/privacy') return { route: 'privacy' };
  if (path === '/terms') return { route: 'terms' };
  if (path === '/blog' || path.startsWith('/blog/')) return { route: 'blog' };

  return { route: 'home' };
}

function MainAppContent() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = safeGetLocalStorage('artify_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  // Dynamic Route State — derived from the real pathname so every route has
  // a distinct, crawlable, bookmarkable URL instead of a hash fragment.
  const [activeRoute, setActiveRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname).route;
    }
    return 'home';
  });

  const [activeProductSlug, setActiveProductSlug] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const { route, slug } = getRouteFromPath(window.location.pathname);
      if (route === 'product-detail' && slug) return slug;
    }
    return AI_PRODUCTS[0].slug;
  });

  const { isPortalOpen, isAuthModalOpen } = useAuth();

  // Listen for browser back/forward navigation (popstate fires for
  // history.pushState-driven route changes, not hashchange).
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const { route, slug } = getRouteFromPath(window.location.pathname);

      if (route === 'product-detail' && slug) {
        setActiveProductSlug(slug);
        setActiveRoute('product-detail');
      } else if (route === 'ai-solutions') {
        setActiveRoute('ai-solutions');
        updatePageSeo({
          title: 'AI Solutions Built for the Next Generation of Business',
          description: 'Explore the full Artify Solutions AI product suite, autonomous agent swarms, and enterprise neural RAG engines.',
          canonicalUrl: 'https://artifysols.com/ai-solutions',
        });
      } else if (route === 'home') {
        setActiveRoute('home');
        updatePageSeo({
          title: 'Artify Solutions - Enterprise AI Products & Autonomous Systems Architecture',
          description: 'Artify Solutions transforms business operations with autonomous AI agent swarms, hybrid neural RAG engines, and real-time enterprise event meshes.',
          canonicalUrl: 'https://artifysols.com',
        });
      } else {
        setActiveRoute(route);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme synchronization with atomic DOM updates
  const applyThemeToDOM = (newTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (newTheme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
      safeSetLocalStorage('artify_theme', 'light');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
      safeSetLocalStorage('artify_theme', 'dark');
    }
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme: 'light' | 'dark' = theme === 'dark' ? 'light' : 'dark';

    // Trigger smooth atomic transition across all surface elements (nav, modals, cards)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transitioning');
      
      const updateDOM = () => {
        applyThemeToDOM(nextTheme);
        setTheme(nextTheme);
      };

      // Use View Transitions API if supported for seamless atomic cross-fade
      if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
        (document as any).startViewTransition(() => {
          updateDOM();
        });
      } else {
        updateDOM();
      }

      // Clean up transitioning class once styles have settled
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 350);
    } else {
      setTheme(nextTheme);
    }
  };

  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [builderInitialIndustry, setBuilderInitialIndustry] = useState<string | undefined>(undefined);
  const [prefilledBrief, setPrefilledBrief] = useState<any>(null);
  const [isHoveringLauncher, setIsHoveringLauncher] = useState(false);
  const [consultantMessages, setConsultantMessages] = useState<ConsultantMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        "Hello! I am the Artify AI Architectural Advisor. Tell me about your organization, your most time-consuming operational workflows, or what you'd like to automate—and I'll synthesize a custom AI-native architecture blueprint for you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How can AI automate our multi-entity invoice approval and reconciliation workflow?',
        'We manage 400 real estate properties—how can AI coordinate maintenance and tenant requests?',
        'How would an AI agent workforce connect our NetSuite ERP and Salesforce CRM?',
        'We want an executive conversational BI dashboard to query revenue and inventory in real time.',
      ],
    },
  ]);

  const handleOpenSolutionBuilder = (industryId?: string) => {
    setBuilderInitialIndustry(industryId);
    setIsBuilderOpen(true);
  };

  // Navigates using real History API paths (not hash fragments) so every
  // route is a distinct, crawlable, shareable URL.
  const navigateToRoute = (route: AppRoute, path: string) => {
    setActiveRoute(route);
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: AiProductItem) => {
    setActiveProductSlug(product.slug);
    setActiveRoute('product-detail');
    const path = `/ai-solutions/${product.slug}`;
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProductBySlug = (slug: string) => {
    const prod = getAiProductBySlug(slug);
    if (prod) {
      handleSelectProduct(prod);
    } else {
      setActiveProductSlug(slug);
      setActiveRoute('product-detail');
      const path = `/ai-solutions/${slug}`;
      if (typeof window !== 'undefined' && window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToContact = (customBrief?: any) => {
    if (customBrief) {
      setPrefilledBrief(customBrief);
    }
    if (activeRoute === 'home') {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigateToRoute('contact', '/contact');
  };

  const handleNavigateToCapabilities = () => {
    navigateToRoute('ai-solutions', '/ai-solutions');
  };

  const handleCompleteBrief = (brief: any) => {
    setPrefilledBrief(brief);
    handleNavigateToContact();
  };

  // If Client Portal is open, display the Client Portal
  if (isPortalOpen) {
    return (
      <div className={theme === 'light' ? 'theme-light' : 'theme-dark'}>
        <Suspense fallback={<RouteFallback />}>
          <ClientPortal theme={theme} onToggleTheme={handleToggleTheme} />
        </Suspense>
        {isAuthModalOpen && <AuthModal theme={theme} />}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === 'light'
          ? 'theme-light bg-[#F8FAFC] text-slate-900'
          : 'theme-dark bg-[#050505] text-[#F5F5F5]'
      } selection:bg-violet-600 selection:text-white relative transition-colors duration-300`}
    >
      {/* Viewport Scroll Progress Bar powered by Framer Motion */}
      <ScrollProgressBar />

      {/* Global Sticky Navigation with Mega-Menu */}
      <Navbar
        onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onNavigateToContact={handleNavigateToContact}
        onNavigateToHome={() => navigateToRoute('home', '/')}
        onNavigateToAiSolutions={() => navigateToRoute('ai-solutions', '/ai-solutions')}
        onNavigateToServices={() => navigateToRoute('services', '/services')}
        onNavigateToIndustries={() => navigateToRoute('industries', '/industries')}
        onNavigateToCaseStudies={() => navigateToRoute('case-studies', '/case-studies')}
        onNavigateToAbout={() => navigateToRoute('about', '/about')}
        onNavigateToBlog={() => navigateToRoute('blog', '/blog')}
        onSelectProduct={handleSelectProduct}
        activeRoute={activeRoute}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Multi-Page Dynamic Switch */}
      <main>
        <Suspense fallback={<RouteFallback />}>
        {activeRoute === 'ai-solutions' && (
          <AiSolutionsPage
            onSelectProduct={handleSelectProduct}
            onOpenConsultant={() => setIsConsultantOpen(true)}
            onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
            onNavigateToContact={handleNavigateToContact}
            theme={theme}
          />
        )}

        {activeRoute === 'product-detail' && (
          <AiProductDetailPage
            productSlug={activeProductSlug}
            onBackToSolutions={() => navigateToRoute('ai-solutions', '/ai-solutions')}
            onSelectProduct={handleSelectProduct}
            onOpenConsultant={() => setIsConsultantOpen(true)}
            onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
            onNavigateToContact={handleNavigateToContact}
            theme={theme}
          />
        )}

        {activeRoute === 'services' && (
          <ServicesPage
            onOpenConsultant={() => setIsConsultantOpen(true)}
            onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
            onNavigateToContact={handleNavigateToContact}
            onNavigateToAiSolutions={() => navigateToRoute('ai-solutions', '/ai-solutions')}
            theme={theme}
          />
        )}

        {activeRoute === 'industries' && (
          <IndustriesPage
            onOpenSolutionBuilder={(id) => handleOpenSolutionBuilder(id)}
            onNavigateToContact={handleNavigateToContact}
            theme={theme}
          />
        )}

        {activeRoute === 'case-studies' && (
          <CaseStudiesPage
            onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
            onNavigateToContact={handleNavigateToContact}
            theme={theme}
          />
        )}

        {activeRoute === 'about' && (
          <AboutPage
            onNavigateToContact={handleNavigateToContact}
            onNavigateToAiSolutions={() => navigateToRoute('ai-solutions', '/ai-solutions')}
            theme={theme}
          />
        )}

        {activeRoute === 'contact' && (
          <ContactPage
            prefilledBrief={prefilledBrief}
            onOpenConsultant={() => setIsConsultantOpen(true)}
            theme={theme}
          />
        )}

        {activeRoute === 'privacy' && <LegalPage type="privacy" theme={theme} />}

        {activeRoute === 'terms' && <LegalPage type="terms" theme={theme} />}

        {activeRoute === 'blog' && (
          <BlogPage
            theme={theme}
            onBackToHome={() => navigateToRoute('home', '/')}
            onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
            onOpenConsultant={() => setIsConsultantOpen(true)}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {activeRoute === 'home' && (
          <>
            {/* 1. Hero: Adaptive Software & Intelligent Ecosystems */}
            <AnimatedSection variant="fade" duration={0.8}>
              <Hero
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onOpenConsultant={() => setIsConsultantOpen(true)}
                onNavigateToCapabilities={handleNavigateToCapabilities}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* Subtle, professional horizontal separator between Hero and Problem Section */}
            <div className="relative w-full max-w-7xl mx-auto px-6 py-4 overflow-hidden" aria-hidden="true">
              <div className="relative flex items-center justify-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
                <div className="absolute flex items-center gap-2 px-3 py-1 rounded-full bg-[#050508] border border-white/[0.08] shadow-sm text-[10px] font-mono-code text-zinc-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80 animate-pulse" />
                  <span>The Paradigm Shift</span>
                </div>
              </div>
            </div>

            {/* 2. Core Philosophy: Technology Adapts to Business */}
            <AnimatedSection variant="fade-up">
              <TrustStatement />
            </AnimatedSection>

            {/* 3. The Adaptive Enterprise Ecosystem (16 Integrated Nodes) */}
            <AnimatedSection variant="fade-up">
              <AdaptiveEcosystem
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 4. Enterprise Intelligence Layer: Next-Gen AI Fabric */}
            <AnimatedSection variant="fade-up">
              <NextGenAiLayer onOpenConsultant={() => setIsConsultantOpen(true)} />
            </AnimatedSection>

            {/* 5. Continuous Enterprise Adaptability: Software That Evolves With You */}
            <AnimatedSection variant="fade-up">
              <AdaptiveIntelligence onNavigateToContact={handleNavigateToContact} />
            </AnimatedSection>

            {/* 6. Specialized Enterprise Solutions: 6 Core Business Ecosystems */}
            <AnimatedSection variant="fade-up">
              <EnterpriseSolutions
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 7. Domain-Specific Solutions: Industry Architecture */}
            <AnimatedSection variant="fade-up">
              <IndustryShowcase
                onSelectIndustry={(id) => handleOpenSolutionBuilder(id)}
                onNavigateToContact={handleNavigateToContact}
                onNavigateToAllIndustries={() => navigateToRoute('industries', '/industries')}
              />
            </AnimatedSection>

            {/* 8. Live Real-World Enterprise Scenarios */}
            <AnimatedSection variant="fade-up">
              <LiveScenarios
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 9. Cross-Agent Orchestration Engine */}
            <AnimatedSection variant="fade-up">
              <AiOrchestration />
            </AnimatedSection>

            {/* 10. Operational Transformation: Before vs. After */}
            <AnimatedSection variant="scale-up">
              <BeforeAfterSlider />
            </AnimatedSection>

            {/* 11. Conversational Business Intelligence: AI Command Center */}
            <AnimatedSection variant="blur-up">
              <AiCommandCenter />
            </AnimatedSection>

            {/* 12. Enterprise Architecture: 5-Layer Production Blueprint */}
            <AnimatedSection variant="fade-up">
              <EnterpriseArchitecture onNavigateToContact={handleNavigateToContact} />
            </AnimatedSection>

            {/* 13. Security, Compliance & Data Sovereignty */}
            <AnimatedSection variant="fade-up">
              <SecurityAndSovereignty onNavigateToContact={handleNavigateToContact} />
            </AnimatedSection>

            {/* 14. Rapid Deployment Methodology: From Audit to Production */}
            <AnimatedSection variant="fade-up">
              <DeploymentMethodology onNavigateToContact={handleNavigateToContact} />
            </AnimatedSection>

            {/* 15. The Human + AI Symbiotic Enterprise */}
            <AnimatedSection variant="fade-up">
              <HumanPlusAi />
            </AnimatedSection>

            {/* 16. Technical Contact & Solution Brief */}
            <AnimatedSection variant="fade-up">
              <ContactAndBrief prefilledBrief={prefilledBrief} />
            </AnimatedSection>
          </>
        )}
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer
        onNavigateToBlog={() => navigateToRoute('blog', '/blog')}
        onNavigateToAiSolutions={() => navigateToRoute('ai-solutions', '/ai-solutions')}
        onNavigateToServices={() => navigateToRoute('services', '/services')}
        onNavigateToIndustries={() => navigateToRoute('industries', '/industries')}
        onNavigateToCaseStudies={() => navigateToRoute('case-studies', '/case-studies')}
        onNavigateToAbout={() => navigateToRoute('about', '/about')}
        onNavigateToContact={handleNavigateToContact}
        onNavigateToLegal={(type) => navigateToRoute(type, `/${type === 'privacy' ? 'privacy' : 'terms'}`)}
        onSelectProduct={handleSelectProduct}
        onOpenSitemap={() => setIsSitemapOpen(true)}
      />

      {/* Overlay modals. Each is mounted only while open so its chunk is
          fetched on first use rather than shipped in the initial bundle.
          All three already returned null when closed, so gating the mount
          here preserves their existing behaviour. */}
      <Suspense fallback={null}>
        {/* Dynamic XML Sitemap Inspector Modal */}
        {isSitemapOpen && (
          <SitemapModal
            isOpen={isSitemapOpen}
            onClose={() => setIsSitemapOpen(false)}
            theme={theme}
            onNavigateToProduct={(slug) => {
              setIsSitemapOpen(false);
              handleSelectProductBySlug(slug);
            }}
            onNavigateToBlog={(slug) => {
              setIsSitemapOpen(false);
              setActiveRoute('blog');
              const path = `/blog/${slug}`;
              if (typeof window !== 'undefined' && window.location.pathname !== path) {
                window.history.pushState({}, '', path);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Interactive AI Consultant Modal */}
        {isConsultantOpen && (
          <InteractiveAiConsultant
            isOpen={isConsultantOpen}
            onClose={() => setIsConsultantOpen(false)}
            messages={consultantMessages}
            onMessagesChange={setConsultantMessages}
            theme={theme}
          />
        )}

        {/* Solution Builder Wizard Modal */}
        {isBuilderOpen && (
          <SolutionBuilderWizard
            isOpen={isBuilderOpen}
            onClose={() => setIsBuilderOpen(false)}
            initialIndustryId={builderInitialIndustry}
            onCompleteBrief={handleCompleteBrief}
            theme={theme}
          />
        )}
      </Suspense>

      {/* Auth Modal */}
      <AuthModal theme={theme} />

      {/* Floating Quick Action Launcher */}
      <div
        className="fixed bottom-6 right-6 z-40 flex items-center"
        onMouseEnter={() => {
          setIsHoveringLauncher(true);
          playHoverSound();
        }}
        onMouseLeave={() => setIsHoveringLauncher(false)}
      >
        {isHoveringLauncher && !isConsultantOpen && (
          <div
            onClick={() => setIsConsultantOpen(true)}
            className="absolute bottom-full right-0 mb-3.5 w-80 sm:w-[340px] p-4 rounded-2xl bg-[#0c0c14]/95 border border-violet-500/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(139,92,246,0.2)] text-left cursor-pointer transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 z-50 group/card"
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white font-display">Artify AI Advisor</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{consultantMessages.length > 1 ? 'Active Session' : 'Ready'}</span>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              {consultantMessages.length > 1 ? (
                <>
                  <div className="text-[10px] uppercase font-mono-code tracking-wider text-violet-300/90 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-violet-400" />
                    <span>Latest AI Blueprint Response</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-normal line-clamp-3 leading-relaxed">
                    {[...consultantMessages].reverse().find((m) => m.role === 'assistant')?.content ||
                      consultantMessages[0].content}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                    Describe your business workflow to synthesize a custom AI-native architecture in seconds.
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-violet-300 bg-violet-950/40 border border-violet-700/30 px-2.5 py-1 rounded-lg font-mono-code w-full">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="truncate">"Automate multi-entity reconciliation"</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] font-medium text-violet-300 group-hover/card:text-violet-200">
              <span>{consultantMessages.length > 1 ? 'Resume conversation' : 'Launch interactive demo'}</span>
              <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover/card:translate-x-1" />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsConsultantOpen(true)}
          id="floating-ai-demo-btn"
          className="group flex items-center gap-2.5 hover:gap-3 px-4 hover:px-5 py-3 rounded-full bg-[#111118]/90 hover:bg-[#181824] border border-violet-500/40 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-violet-400"
          title="Open Artify AI Demo"
        >
          <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-600/40 shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Bot className="w-[17px] h-[17px]" />
          </div>
          <span className="text-xs font-bold font-display whitespace-nowrap tracking-tight group-hover:tracking-wide transition-all duration-300">
            Test AI Demo
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse -ml-0.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
