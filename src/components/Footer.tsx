import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
  Sparkles,
  Lock,
  Search,
  FileText,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  onOpenAuditSpec?: () => void;
  onOpenGlobalSearch?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  onNavigateToHome,
  onNavigateToBlog,
  onNavigateToSolutionsCatalog,
  onNavigateToCaseStudies,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToLegal,
  onOpenSitemap,
  onOpenConsultant,
  onOpenSolutionBuilder,
  onOpenAuditSpec,
  onOpenGlobalSearch,
}) => {
  const { user, openPortal, openAuthModal } = useAuth();
  const isLight =
    theme === 'light' ||
    (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light'));

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateToHome) {
      onNavigateToHome();
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <footer className="border-t border-border bg-background transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto py-12 sm:py-16">
        
        {/* Top Section matching Image 2 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-border">
          {/* Brand Identity & Tagline */}
          <div className="space-y-2 max-w-md">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToHome?.();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl font-black tracking-widest text-foreground font-display flex items-center gap-1.5"
            >
              <span>ARTIFY</span>
            </a>
            <p className="text-xs sm:text-sm text-foreground-muted font-medium">
              Enterprise Ecosystems • Autonomous AI Workflows • Sovereign Data Architecture
            </p>
          </div>

          {/* Clean Navigation Links Row matching Image 2 */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm font-semibold text-foreground-secondary">
            <button
              onClick={() => scrollToSection('ecosystem')}
              className="hover:text-[#0066FF] transition-colors"
            >
              Ecosystem
            </button>
            <button
              onClick={() => {
                if (onNavigateToSolutionsCatalog) onNavigateToSolutionsCatalog();
                else scrollToSection('systems');
              }}
              className="hover:text-[#0066FF] transition-colors"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection('ai')}
              className="hover:text-[#0066FF] transition-colors"
            >
              AI
            </button>
            <button
              onClick={() => scrollToSection('architecture')}
              className="hover:text-[#0066FF] transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection('systems')}
              className="hover:text-[#0066FF] transition-colors"
            >
              Systems
            </button>
            <button
              onClick={onNavigateToBlog}
              className="hover:text-[#0066FF] transition-colors"
            >
              Insights
            </button>
            <button
              onClick={onNavigateToAbout}
              className="hover:text-[#0066FF] transition-colors"
            >
              Company
            </button>
          </div>
        </div>

        {/* Secondary Utility Links (Portal, Spec, Sitemap, Legal) */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-foreground-muted border-b border-border">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {onOpenAuditSpec && (
              <button
                onClick={onOpenAuditSpec}
                className="hover:text-[#0066FF] transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Technical &amp; SEO Audit Spec</span>
              </button>
            )}

            {onOpenGlobalSearch && (
              <button
                onClick={onOpenGlobalSearch}
                className="hover:text-[#0066FF] transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Global Search (⌘K)</span>
              </button>
            )}

            {onOpenSitemap && (
              <button
                onClick={onOpenSitemap}
                className="hover:text-[#0066FF] transition-colors"
              >
                XML Sitemap
              </button>
            )}

            {onNavigateToLegal && (
              <>
                <button
                  onClick={() => onNavigateToLegal('privacy')}
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => onNavigateToLegal('terms')}
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => openPortal('overview')}
                className="text-xs font-semibold text-[#0066FF] hover:underline"
              >
                Enterprise Portal: {user.name}
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs font-semibold text-foreground hover:text-[#0066FF] transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-[#0066FF]" />
                <span>Client Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Copyright matching Image 2 */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-foreground-muted">
          <p>© 2025 Artify Solutions. All rights reserved.</p>
          <p className="font-mono-code text-[11px]">
            Enterprise Autonomous Ecosystems • Zero Vendor Lock-in
          </p>
        </div>

      </div>
    </footer>
  );
};
