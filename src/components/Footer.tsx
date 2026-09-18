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
}

export const Footer: React.FC<FooterProps> = ({
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
}) => {
  const { user, openPortal, openAuthModal } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border pt-20 pb-12 text-subtle-text text-xs transition-colors duration-200">
      <div className="w-full px-[5%] max-w-7xl mx-auto">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-border">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 p-[1px]">
                <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-foreground font-display">
                  ARTIFY
                </span>
                <span className="text-base font-bold bg-gradient-to-r from-[#7822ff] via-[#6432f8] to-[#4f46e5] bg-clip-text text-transparent font-display">
                  SOLUTIONS
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-foreground">
              Adaptive Software. Intelligent Ecosystems. Built Around Your Business.
            </p>

            <p className="text-xs text-subtle-text leading-relaxed">
              Artify Solutions engineers fully customized, adaptive enterprise software ecosystems enhanced by foundational intelligence, event-driven pipelines, and sovereign data architecture.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-foreground font-mono-code">
                <Globe className="w-3.5 h-3.5 text-violet-400" /> artifysols.com
              </span>
              <span className="flex items-center gap-1.5 text-foreground font-mono-code">
                <Mail className="w-3.5 h-3.5 text-violet-400" /> contact@artifysols.com
              </span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
                Our Solutions
              </h4>
            </div>
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
                    className="text-left text-subtle-text hover:text-foreground transition-colors flex items-center justify-between w-full"
                  >
                    <span>{p.name}</span>
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <a
                  href="/solutions"
                  onClick={(e) => {
                    const nav = onNavigateToSolutionsCatalog || onNavigateToAiSolutions;
                    if (nav) {
                      e.preventDefault();
                      nav();
                    }
                  }}
                  className="text-violet-500 hover:text-violet-400 dark:text-violet-400 dark:hover:text-violet-300 font-semibold flex items-center gap-1"
                >
                  <span>Solutions Catalog (24 Systems)</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Services & Verticals */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/services"
                  onClick={(e) => {
                    if (onNavigateToServices) {
                      e.preventDefault();
                      onNavigateToServices();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors"
                >
                  Enterprise Services
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
                  className="text-left text-subtle-text hover:text-foreground transition-colors"
                >
                  Industries Matrix
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
                  className="text-left text-subtle-text hover:text-foreground transition-colors"
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
                  className="text-left text-subtle-text hover:text-foreground transition-colors"
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
                  className="text-left text-violet-500 hover:text-violet-400 dark:text-violet-400 dark:hover:text-violet-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Blog & Research</span>
                  <span className="text-[9px] bg-violet-500/20 text-violet-400 dark:text-violet-300 px-1 rounded font-mono-code">New</span>
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
                  className="text-left text-subtle-text hover:text-foreground transition-colors"
                >
                  Talk to Artify Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Client Portal Col */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              Client Portal
            </h4>
            <ul className="space-y-2 text-xs">
              {user ? (
                <>
                  <li>
                    <button
                      onClick={() => openPortal('overview')}
                      className="text-left text-violet-500 hover:text-violet-400 dark:text-violet-400 dark:hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <LayoutDashboard className="w-3 h-3" />
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
                      className="text-left text-violet-500 hover:text-violet-400 dark:text-violet-400 dark:hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors"
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
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Partner Access Policy</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Architecture & Telemetry */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              System Telemetry
            </h4>
            <div className="p-3 rounded-xl surface-card-subtle border border-border space-y-2 text-[11px] font-mono-code">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-foreground">Nodes: <strong>Active</strong></span>
              </div>
              <div className="text-subtle-text">
                SLA: <span className="text-emerald-500 dark:text-emerald-400 font-bold">99.99%</span>
              </div>
              <div className="text-subtle-text">
                Isolation: <span className="text-violet-500 dark:text-violet-400 font-bold">SOC2 VPC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-subtle-text">
          <div className="flex items-center gap-3 flex-wrap">
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
              onClick={() => onOpenSitemap && onOpenSitemap()}
              className="hover:text-violet-400 transition-colors underline-offset-2 hover:underline font-mono-code flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sitemap (XML)
            </button>
          </div>

          <button
            onClick={scrollToTop}
            id="footer-scroll-top-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg surface-card border border-border text-foreground hover:bg-surface transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
