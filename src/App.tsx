import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStatement } from './components/TrustStatement';
import { WhatWeBuild } from './components/WhatWeBuild';
import { AiAgentsSection } from './components/AiAgentsSection';
import { AiOrchestration } from './components/AiOrchestration';
import { IndustryExplorer } from './components/IndustryExplorer';
import { SolutionsByFunction } from './components/SolutionsByFunction';
import { ArtifyDifference } from './components/ArtifyDifference';
import { DevelopmentMethodology } from './components/DevelopmentMethodology';
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

  // Theme synchronization
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
        document.documentElement.classList.remove('theme-dark');
        safeSetLocalStorage('artify_theme', 'light');
      } else {
        document.documentElement.classList.add('theme-dark');
        document.documentElement.classList.remove('theme-light');
        safeSetLocalStorage('artify_theme', 'dark');
      }
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
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
            {/* 1. Hero Section */}
            <AnimatedSection variant="fade" duration={0.8}>
              <Hero
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onOpenConsultant={() => setIsConsultantOpen(true)}
                onNavigateToCapabilities={handleNavigateToCapabilities}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 2. Featured AI Products Showcase Ribbon on Homepage */}
            <AnimatedSection variant="fade-up">
              <section className="py-20 border-b border-white/[0.06] bg-black/40">
                <div className="w-[92%] sm:w-[88%] max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Enterprise Product Suite</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
                        Featured AI Solutions
                      </h2>
                      <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl">
                        Explore our top enterprise-ready autonomous AI products engineered for mission-critical operations.
                      </p>
                    </div>

                    <button
                      onClick={() => navigateToRoute('ai-solutions', '/ai-solutions')}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 self-start md:self-auto transition-all"
                    >
                      <span>View All 8 AI Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {AI_PRODUCTS.slice(0, 4).map((product) => (
                      <StaggerItem key={product.id}>
                        <motion.div
                          onClick={() => handleSelectProduct(product)}
                          whileHover={{ y: -6, borderColor: 'rgba(139, 92, 246, 0.6)' }}
                          transition={{ duration: 0.2 }}
                          className="h-full p-6 rounded-2xl bg-[#0c0c14] border border-white/[0.08] cursor-pointer flex flex-col justify-between group shadow-lg"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 font-mono-code">
                                {product.categoryLabel}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-400 font-mono-code">
                                {product.uptime}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-white font-display group-hover:text-violet-300 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs text-violet-400/90 font-mono-code mt-1">
                              {product.tagline}
                            </p>
                            <p className="text-xs text-zinc-400 mt-3 line-clamp-3 leading-relaxed">
                              {product.shortDescription}
                            </p>
                          </div>

                          <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                            <span className="font-bold text-zinc-300 font-mono-code">
                              {product.metrics[0]?.value}
                            </span>
                            <span className="text-violet-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              <span>Explore</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </section>
            </AnimatedSection>

            {/* 3. Trust Statement */}
            <AnimatedSection variant="fade-up">
              <TrustStatement />
            </AnimatedSection>

            {/* 4. What We Build */}
            <AnimatedSection variant="fade-up">
              <WhatWeBuild
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 5. AI Agents */}
            <AnimatedSection variant="blur-up">
              <AiAgentsSection />
            </AnimatedSection>

            {/* 6. AI Orchestration */}
            <AnimatedSection variant="fade-up">
              <AiOrchestration />
            </AnimatedSection>

            {/* 7. Industries Matrix */}
            <AnimatedSection variant="fade-up">
              <IndustryExplorer
                onOpenSolutionBuilder={(id) => handleOpenSolutionBuilder(id)}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 8. Solutions by Business Function */}
            <AnimatedSection variant="fade-up">
              <SolutionsByFunction
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 9. The Artify Difference */}
            <AnimatedSection variant="fade-up">
              <ArtifyDifference />
            </AnimatedSection>

            {/* 10. Development Methodology */}
            <AnimatedSection variant="fade-up">
              <DevelopmentMethodology onNavigateToContact={handleNavigateToContact} />
            </AnimatedSection>

            {/* 11. Before / After Comparison */}
            <AnimatedSection variant="scale-up">
              <BeforeAfterSlider />
            </AnimatedSection>

            {/* 12. AI Command Center */}
            <AnimatedSection variant="blur-up">
              <AiCommandCenter />
            </AnimatedSection>

            {/* 13. Integrations Ecosystem */}
            <AnimatedSection variant="fade-up">
              <IntegrationsEcosystem />
            </AnimatedSection>

            {/* 14. Security & Governance */}
            <AnimatedSection variant="fade-up">
              <SecurityAndGovernance />
            </AnimatedSection>

            {/* 15. Human + AI Collaboration */}
            <AnimatedSection variant="fade-up">
              <HumanPlusAi />
            </AnimatedSection>

            {/* 16. Customization Showcase */}
            <AnimatedSection variant="fade-up">
              <CustomizationShowcase />
            </AnimatedSection>

            {/* 17. Case Studies */}
            <AnimatedSection variant="fade-up">
              <CaseStudiesSection
                onOpenSolutionBuilder={() => handleOpenSolutionBuilder()}
                onNavigateToContact={handleNavigateToContact}
              />
            </AnimatedSection>

            {/* 18. Technology Stack */}
            <AnimatedSection variant="fade-up">
              <TechnologyStack />
            </AnimatedSection>

            {/* 19. Blog Preview */}
            <AnimatedSection variant="fade-up">
              <BlogPreviewSection
                onNavigateToBlog={() => navigateToRoute('blog', '/blog')}
              />
            </AnimatedSection>

            {/* 20. About & Vision */}
            <AnimatedSection variant="fade-up">
              <AboutAndVision onNavigateToContact={handleNavigateToContact} />
            </AnimatedSection>

            {/* 21. Contact & Brief */}
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
          />
        )}

        {/* Solution Builder Wizard Modal */}
        {isBuilderOpen && (
          <SolutionBuilderWizard
            isOpen={isBuilderOpen}
            onClose={() => setIsBuilderOpen(false)}
            initialIndustryId={builderInitialIndustry}
            onCompleteBrief={handleCompleteBrief}
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
