import React from 'react';
import {
  Bot,
  Sparkles,
  ArrowUp,
  Globe,
  Mail,
  ShieldCheck,
  Activity,
  Layers,
  LayoutDashboard,
  Lock,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AI_PRODUCTS } from '../data/aiProductsData';
import { AiProductItem } from '../types';

interface FooterProps {
  theme?: 'dark' | 'light';
  onNavigateToHome?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToSolutionsCatalog?: () => void;
  onNavigateToAiSolutions?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToIndustries?: () => void;
  onNavigateToCaseStudies?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToLegal?: (type: 'privacy' | 'terms') => void;
  onSelectProduct?: (product: AiProductItem) => void;
  onOpenSitemap?: () => void;
  onOpenConsultant?: () => void;
  onOpenSolutionBuilder?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  onNavigateToHome,
  onNavigateToBlog,
  onNavigateToSolutionsCatalog,
  onNavigateToAiSolutions,
  onNavigateToServices,
  onNavigateToIndustries,
  onNavigateToCaseStudies,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToLegal,
  onSelectProduct,
  onOpenSitemap,
  onOpenConsultant,
  onOpenSolutionBuilder,
}) => {
  const { user, openPortal, openAuthModal } = useAuth();
  const isLight =
    theme === 'light' ||
    (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light'));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        if (onNavigateToHome) onNavigateToHome();
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-background border-t border-border pt-16 sm:pt-20 pb-12 text-subtle-text text-xs transition-colors duration-200">
      <div className="w-full px-[5%] max-w-7xl mx-auto">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-border">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            {/* Artify Brand Logo matching Dark / Light mode */}
            <div className="flex items-center">
              <a
                href="/"
                onClick={(e) => {
                  if (onNavigateToHome) {
                    e.preventDefault();
                    onNavigateToHome();
                  }
                }}
                className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
                id="footer-brand-logo"
                aria-label="Artify Solutions Home"
              >
                <picture key={isLight ? 'footer-logo-light' : 'footer-logo-dark'}>
                  <source
                    srcSet={isLight ? '/logo-header-light.webp' : '/logo-header-dark.webp'}
                    type="image/webp"
                  />
                  <img
                    key={isLight ? 'img-light' : 'img-dark'}
                    src={isLight ? '/logo-header-light.png' : '/logo-header-dark.png'}
                    alt="Artify Solutions"
                    width={418}
                    height={132}
                    className="h-10 sm:h-11 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
                  />
                </picture>
              </a>
            </div>

            <p className="text-sm font-semibold text-foreground leading-snug">
              Adaptive Software. Intelligent Ecosystems. Built Around Your Business.
            </p>

            <p className="text-xs text-subtle-text leading-relaxed">
              Artify Solutions engineers fully customized, adaptive enterprise software ecosystems enhanced by foundational intelligence, autonomous agent swarms, event-driven pipelines, and sovereign data architecture.
            </p>

            {/* Strategic Value Attributes */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono-code bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                Zero Rigid SaaS
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono-code bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                SOC2 VPC Sovereign
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono-code bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                AI Agent Swarms
              </span>
            </div>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <span className="flex items-center gap-2 text-foreground font-mono-code">
                <Globe className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                <a
                  href="https://artifysols.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline underline-offset-2"
                >
                  artifysols.com
                </a>
              </span>
              <span className="flex items-center gap-2 text-foreground font-mono-code">
                <Mail className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                <a
                  href="mailto:contact@artifysols.com"
                  className="hover:underline underline-offset-2"
                >
                  contact@artifysols.com
                </a>
              </span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              Our Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              {AI_PRODUCTS.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <a
                    href={`/ai-solutions/${p.slug}`}
                    onClick={(e) => {
                      if (onSelectProduct) {
                        e.preventDefault();
                        onSelectProduct(p);
                      }
                    }}
                    className="text-left text-subtle-text hover:text-foreground transition-colors flex items-center justify-between w-full group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">{p.name}</span>
                  </a>
                </li>
              ))}
              <li className="pt-1.5">
                <a
                  href="/solutions"
                  onClick={(e) => {
                    const nav = onNavigateToSolutionsCatalog || onNavigateToAiSolutions;
                    if (nav) {
                      e.preventDefault();
                      nav();
                    }
                  }}
                  className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold flex items-center gap-1 group"
                >
                  <span>Solutions Catalog (24 Systems)</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/solutions"
                  onClick={(e) => {
                    if (onNavigateToSolutionsCatalog) {
                      e.preventDefault();
                      onNavigateToSolutionsCatalog();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Enterprise Solutions
                </a>
              </li>
              <li>
                <a
                  href="/industries"
                  onClick={(e) => {
                    if (onNavigateToIndustries) {
                      e.preventDefault();
                      onNavigateToIndustries();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Industries Matrix
                </a>
              </li>
              <li>
                <a
                  href="#ecosystem"
                  onClick={(e) => handleSectionScroll(e, 'ecosystem')}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Adaptive Ecosystem
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  onClick={(e) => {
                    if (onNavigateToServices) {
                      e.preventDefault();
                      onNavigateToServices();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Enterprise Services
                </a>
              </li>
              <li>
                <a
                  href="/case-studies"
                  onClick={(e) => {
                    if (onNavigateToCaseStudies) {
                      e.preventDefault();
                      onNavigateToCaseStudies();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Case Studies & Blueprints
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    if (onNavigateToAbout) {
                      e.preventDefault();
                      onNavigateToAbout();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  About Artify
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => {
                    if (onNavigateToBlog) {
                      e.preventDefault();
                      onNavigateToBlog();
                    }
                  }}
                  className="text-left text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Insights & Research</span>
                  <span className="text-[9px] bg-violet-500/20 text-violet-700 dark:text-violet-300 px-1 py-0.5 rounded font-mono-code font-bold">New</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    if (onNavigateToContact) {
                      e.preventDefault();
                      onNavigateToContact();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Talk to Artify Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Client Portal & Advisory Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              Client & Advisory
            </h4>
            <ul className="space-y-2 text-xs">
              {user ? (
                <>
                  <li>
                    <button
                      onClick={() => openPortal('overview')}
                      className="text-left text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Portal Dashboard</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openPortal('subscriptions')}
                      className="text-left text-subtle-text hover:text-foreground transition-colors"
                    >
                      Subscriptions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openPortal('products')}
                      className="text-left text-subtle-text hover:text-foreground transition-colors"
                    >
                      Deployed Products
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openPortal('invoices')}
                      className="text-left text-subtle-text hover:text-foreground transition-colors"
                    >
                      Billing & Invoices
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="text-left text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Client Login</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="text-left text-subtle-text hover:text-foreground transition-colors"
                    >
                      Register Organization
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        if (onNavigateToAbout) onNavigateToAbout();
                        setTimeout(() => {
                          const el = document.getElementById('partner-access-policy');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-left text-subtle-text hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span>Partner Access Policy</span>
                    </button>
                  </li>
                </>
              )}

              {/* Architectural Tools */}
              {onOpenConsultant && (
                <li className="pt-1.5 border-t border-border">
                  <button
                    onClick={onOpenConsultant}
                    className="text-left text-subtle-text hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                    <span>AI Architectural Advisor</span>
                  </button>
                </li>
              )}
              {onOpenSolutionBuilder && (
                <li>
                  <button
                    onClick={onOpenSolutionBuilder}
                    className="text-left text-subtle-text hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>Solution Blueprint Builder</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Architecture & Telemetry */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              System Telemetry
            </h4>
            <div className="p-3.5 rounded-xl surface-card-subtle border border-border space-y-2.5 text-[11px] font-mono-code">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="text-foreground font-semibold">Nodes: Active</span>
              </div>
              <div className="text-subtle-text flex items-center justify-between">
                <span>Production SLA:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.99%</span>
              </div>
              <div className="text-subtle-text flex items-center justify-between">
                <span>Isolation:</span>
                <span className="text-violet-600 dark:text-violet-400 font-bold">SOC2 VPC</span>
              </div>
              <div className="text-subtle-text flex items-center justify-between pt-1 border-t border-border">
                <span>Architecture:</span>
                <span className="text-foreground font-bold">Adaptive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-subtle-text">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} Artify Solutions. All rights reserved.</span>
            <span>•</span>
            <a
              href="/privacy"
              onClick={(e) => {
                if (onNavigateToLegal) {
                  e.preventDefault();
                  onNavigateToLegal('privacy');
                }
              }}
              className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms"
              onClick={(e) => {
                if (onNavigateToLegal) {
                  e.preventDefault();
                  onNavigateToLegal('terms');
                }
              }}
              className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Terms of Service
            </a>
            <span>•</span>
            <button
              onClick={() => {
                if (onNavigateToAbout) onNavigateToAbout();
                setTimeout(() => {
                  const el = document.getElementById('partner-access-policy');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Partner Access
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenSitemap && onOpenSitemap()}
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors underline-offset-2 hover:underline font-mono-code flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Sitemap (XML)
            </button>
          </div>

          <button
            onClick={scrollToTop}
            id="footer-scroll-top-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg surface-card border border-border text-foreground hover:bg-surface transition-colors shrink-0"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
