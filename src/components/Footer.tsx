import React from 'react';
import {
  Bot,
  ArrowUp,
  Globe,
  Mail,
  ShieldCheck,
  LayoutDashboard,
  Lock,
  ArrowRight,
  Facebook,
  Instagram,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { publicApi, PublicProduct } from '../lib/publicApi';

interface FooterProps {
  theme?: 'dark' | 'light';
  onNavigateToHome?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToUpdates?: () => void;
  onNavigateToSolutionsCatalog?: () => void;
  onNavigateToAiSolutions?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToIndustries?: () => void;
  onNavigateToCaseStudies?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToEcosystem?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToLegal?: (type: 'privacy' | 'terms' | 'data-deletion') => void;
  onSelectProduct?: (product: { slug: string }) => void;
  onOpenSitemap?: () => void;
  onOpenConsultant?: () => void;
}

const SOCIAL_LINKS = [
  { label: 'Artify Solutions on Facebook', href: 'https://www.facebook.com/1429069786945855', Icon: Facebook },
  { label: 'Artify Solutions on Instagram', href: 'https://www.instagram.com/artifysols/', Icon: Instagram },
] as const;

export const Footer: React.FC<FooterProps> = ({
  theme,
  onNavigateToHome,
  onNavigateToBlog,
  onNavigateToUpdates,
  onNavigateToSolutionsCatalog,
  onNavigateToAiSolutions,
  onNavigateToServices,
  onNavigateToIndustries,
  onNavigateToCaseStudies,
  onNavigateToAbout,
  onNavigateToEcosystem,
  onNavigateToContact,
  onNavigateToLegal,
  onSelectProduct,
  onOpenSitemap,
  onOpenConsultant,
}) => {
  const { user, openPortal, openAuthModal } = useAuth();
  const [footerProducts, setFooterProducts] = React.useState<PublicProduct[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    publicApi
      .listProducts({ limit: 5 })
      .then(({ products }) => {
        if (!cancelled) setFooterProducts(products);
      })
      .catch(() => {
        // Honest empty state — the quick-links list just doesn't render.
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const isLight =
    theme === 'light' ||
    (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light'));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border pt-12 sm:pt-16 pb-12 text-subtle-text text-xs transition-colors duration-200">
      <div className="w-full px-[5%]">
        {/* Brand Logo Row - Placed above columns per specification */}
        <div className="mb-6 sm:mb-8">
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
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
              />
            </picture>
          </a>
        </div>

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 pb-16 border-b border-border">
          {/* Col 1: Brand Info & Positioning */}
          <div className="lg:col-span-4 space-y-4 max-w-sm sm:max-w-md">
            <h3 className="text-[15px] sm:text-base font-bold text-foreground leading-snug">
              Adaptive Software. Intelligent Ecosystems. Built Around Your Business.
            </h3>

            <p className="text-xs sm:text-[13px] text-subtle-text leading-relaxed">
              Artify Solutions builds custom software around how your business works, with AI built in where it helps. Tell us what you need and we will design it with you.
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs">
              <span className="flex items-center gap-2 text-foreground font-mono-code">
                <Globe className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 shrink-0" />
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
                <Mail className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 shrink-0" />
                <a
                  href="mailto:contact@artifysols.com"
                  className="hover:underline underline-offset-2"
                >
                  contact@artifysols.com
                </a>
              </span>
              <span className="flex items-center gap-3 pt-1">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border text-subtle-text hover:text-foreground hover:bg-surface transition-colors"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </span>
            </div>
          </div>

          {/* Col 2: OUR SOLUTIONS */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              OUR SOLUTIONS
            </h4>
            <ul className="space-y-2.5 text-xs">
              {footerProducts.map((p) => (
                <li key={p.slug}>
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
            </ul>
            <div className="pt-3 sm:pt-4">
              <a
                href="/solutions"
                onClick={(e) => {
                  const nav = onNavigateToSolutionsCatalog || onNavigateToAiSolutions;
                  if (nav) {
                    e.preventDefault();
                    nav();
                  }
                }}
                className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold flex items-center justify-between text-xs group"
              >
                <span>Solutions Catalog</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1.5" />
              </a>
            </div>
          </div>

          {/* Col 3: NAVIGATION */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs">
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
                  Our Core Belief
                </a>
              </li>
              <li>
                <a
                  href="/ecosystem"
                  onClick={(e) => {
                    if (onNavigateToEcosystem) {
                      e.preventDefault();
                      onNavigateToEcosystem();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Ecosystem
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
                  Industries
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
                  Services
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
                  className="text-left text-subtle-text hover:text-foreground transition-colors block whitespace-nowrap"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="/updates"
                  onClick={(e) => {
                    if (onNavigateToUpdates || onNavigateToBlog) {
                      e.preventDefault();
                      (onNavigateToUpdates || onNavigateToBlog)?.();
                    }
                  }}
                  className="text-left text-subtle-text hover:text-foreground transition-colors block"
                >
                  Updates
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
                  <span>Insights</span>
                  <span className="text-[9px] bg-violet-500/20 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded font-mono-code font-bold">New</span>
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
                  Talk to Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: CLIENT & ADVISORY */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-foreground uppercase font-mono-code tracking-wider">
              CLIENT & ADVISORY
            </h4>
            <ul className="space-y-2.5 text-xs">
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
                      <Lock className="w-3.5 h-3.5" />
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
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <span>Partner Access Policy</span>
                    </button>
                  </li>
                </>
              )}

              {/* Architectural Tools */}
              {onOpenConsultant && (
                <li className="pt-2 border-t border-border">
                  <button
                    onClick={onOpenConsultant}
                    className="text-left text-subtle-text hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 shrink-0" />
                    <span>AI Advisor</span>
                  </button>
                </li>
              )}
            </ul>
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
            <a
              href="/data-deletion"
              onClick={(e) => {
                if (onNavigateToLegal) {
                  e.preventDefault();
                  onNavigateToLegal('data-deletion');
                }
              }}
              className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Data Deletion
            </a>
            <span>•</span>
            <button
              onClick={() => onOpenSitemap && onOpenSitemap()}
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors underline-offset-2 hover:underline font-mono-code flex items-center gap-1"
            >
              Sitemap
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
