import React, { useState } from 'react';
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
  Layers,
  Sparkles,
  Bot,
  FileText,
  Building2,
  HelpCircle,
  Shield,
  Zap,
} from 'lucide-react';
import { getAiProductBySlug } from '../data/aiProductsData';
import { playHoverSound } from '../utils/soundEffects';

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
  isCurrent?: boolean;
}

export interface BreadcrumbNavProps {
  activeRoute: string;
  productSlug?: string;
  pageSlug?: string;
  theme?: 'dark' | 'light';
  customCrumbs?: BreadcrumbCrumb[];
  onNavigateHome?: () => void;
  onNavigateToSolutions?: () => void;
  onNavigateToAiSolutions?: () => void;
  onNavigateToIndustries?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToCaseStudies?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToUpdates?: () => void;
  onNavigateToContact?: () => void;
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  activeRoute,
  productSlug,
  pageSlug,
  theme = 'dark',
  customCrumbs,
  onNavigateHome,
  onNavigateToSolutions,
  onNavigateToAiSolutions,
  onNavigateToIndustries,
  onNavigateToServices,
  onNavigateToCaseStudies,
  onNavigateToAbout,
  onNavigateToBlog,
  onNavigateToUpdates,
  onNavigateToContact,
  className = '',
}) => {
  const isLight = theme === 'light';
  const [copied, setCopied] = useState(false);

  // If on home landing page and no custom crumbs, breadcrumbs are not displayed
  if (activeRoute === 'home' && !customCrumbs) {
    return null;
  }

  // Construct dynamic breadcrumb trail based on current activeRoute
  const getCrumbs = (): BreadcrumbCrumb[] => {
    if (customCrumbs && customCrumbs.length > 0) {
      return customCrumbs;
    }

    const root: BreadcrumbCrumb = {
      label: 'Home',
      href: '/',
      onClick: onNavigateHome,
      icon: Home,
    };

    switch (activeRoute) {
      case 'solutions-catalog':
        return [
          root,
          {
            label: 'Solutions',
            href: '/solutions',
            onClick: onNavigateToSolutions,
            icon: Layers,
            isCurrent: true,
          },
        ];

      case 'ai-solutions':
        return [
          root,
          {
            label: 'Solutions',
            href: '/solutions',
            onClick: onNavigateToSolutions,
            icon: Layers,
          },
          {
            label: 'AI Solutions Catalog',
            href: '/ai-solutions',
            onClick: onNavigateToAiSolutions,
            icon: Sparkles,
            isCurrent: true,
          },
        ];

      case 'product-detail': {
        const product = productSlug ? getAiProductBySlug(productSlug) : undefined;
        const productName =
          product?.name ||
          (productSlug
            ? productSlug
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')
            : 'Product Details');

        return [
          root,
          {
            label: 'Solutions',
            href: '/solutions',
            onClick: onNavigateToSolutions,
            icon: Layers,
          },
          {
            label: 'AI Solutions',
            href: '/ai-solutions',
            onClick: onNavigateToAiSolutions,
            icon: Sparkles,
          },
          {
            label: productName,
            icon: Bot,
            isCurrent: true,
          },
        ];
      }

      case 'services':
        return [
          root,
          {
            label: 'Solutions',
            href: '/solutions',
            onClick: onNavigateToSolutions,
            icon: Layers,
          },
          {
            label: 'Engineering Services',
            href: '/services',
            onClick: onNavigateToServices,
            icon: Sparkles,
            isCurrent: true,
          },
        ];

      case 'industries':
        return [
          root,
          {
            label: 'Industries',
            href: '/industries',
            onClick: onNavigateToIndustries,
            icon: Building2,
            isCurrent: true,
          },
        ];

      case 'case-studies':
        return [
          root,
          {
            label: 'Documentation',
            icon: FileText,
          },
          {
            label: 'Case Studies & Architectures',
            href: '/case-studies',
            onClick: onNavigateToCaseStudies,
            isCurrent: true,
          },
        ];

      case 'about':
        return [
          root,
          {
            label: 'Core Belief',
            href: '/about',
            onClick: onNavigateToAbout,
            icon: Sparkles,
            isCurrent: true,
          },
        ];

      case 'contact':
        return [
          root,
          {
            label: 'Contact & Advisory',
            href: '/contact',
            onClick: onNavigateToContact,
            isCurrent: true,
          },
        ];

      case 'blog': {
        const isUpdates =
          typeof window !== 'undefined' &&
          (window.location.pathname === '/updates' || window.location.pathname.startsWith('/updates'));

        if (isUpdates) {
          return [
            root,
            {
              label: 'Documentation',
              icon: FileText,
            },
            {
              label: 'Product Updates & Changelog',
              href: '/updates',
              onClick: onNavigateToUpdates || onNavigateToBlog,
              icon: Zap,
              isCurrent: true,
            },
          ];
        }

        return [
          root,
          {
            label: 'Insights & Research',
            href: '/blog',
            onClick: onNavigateToBlog,
            icon: FileText,
            isCurrent: true,
          },
        ];
      }

      case 'cms-page': {
        const pageTitle = pageSlug
          ? pageSlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
          : 'Documentation';

        return [
          root,
          {
            label: 'Documentation',
            icon: FileText,
          },
          {
            label: pageTitle,
            isCurrent: true,
          },
        ];
      }

      case 'privacy':
        return [
          root,
          {
            label: 'Legal',
            icon: Shield,
          },
          {
            label: 'Privacy Policy',
            href: '/privacy',
            isCurrent: true,
          },
        ];

      case 'terms':
        return [
          root,
          {
            label: 'Legal',
            icon: Shield,
          },
          {
            label: 'Terms of Service',
            href: '/terms',
            isCurrent: true,
          },
        ];

      default:
        return [
          root,
          {
            label: activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1),
            isCurrent: true,
          },
        ];
    }
  };

  const crumbs = getCrumbs();

  const handleCopyPath = () => {
    if (typeof window !== 'undefined') {
      playHoverSound(0.04);
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBack = () => {
    playHoverSound(0.04);
    if (crumbs.length >= 2) {
      const prevCrumb = crumbs[crumbs.length - 2];
      if (prevCrumb.onClick) {
        prevCrumb.onClick();
        return;
      }
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <nav
      aria-label="Breadcrumb Navigation"
      className={`sticky top-[58px] sm:top-[68px] z-40 w-full border-b backdrop-blur-xl transition-all duration-300 ${
        isLight
          ? 'bg-white/92 border-slate-200/80 text-slate-700 shadow-xs'
          : 'bg-[#08080d]/92 border-white/[0.08] text-zinc-300 shadow-sm shadow-black/50'
      } ${className}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-[4%] xl:px-[5%] py-2.5 flex items-center justify-between gap-3 min-h-[44px]">
        {/* Left: Quick Back Button + Breadcrumbs List */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-x-auto no-scrollbar py-0.5">
          {/* Quick Back arrow */}
          <button
            type="button"
            onClick={handleBack}
            className={`p-1.5 rounded-lg border transition-all shrink-0 active:scale-95 cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-400 hover:text-white'
            }`}
            title="Navigate to previous level"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          {/* Breadcrumb List with Schema.org Microdata */}
          <ol
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium min-w-0"
          >
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1 || crumb.isCurrent;
              const Icon = crumb.icon;

              return (
                <li
                  key={`${crumb.label}-${idx}`}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                  className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0"
                >
                  {idx > 0 && (
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 select-none ${
                        isLight ? 'text-slate-400' : 'text-zinc-600'
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {isLast ? (
                    <span
                      itemProp="name"
                      aria-current="page"
                      className={`flex items-center gap-1.5 font-semibold truncate max-w-[200px] sm:max-w-md ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {Icon && (
                        <Icon className="w-3.5 h-3.5 shrink-0 text-violet-500" aria-hidden="true" />
                      )}
                      <span className="truncate">{crumb.label}</span>
                    </span>
                  ) : (
                    <a
                      itemProp="item"
                      href={crumb.href || '#'}
                      onClick={(e) => {
                        if (crumb.onClick) {
                          e.preventDefault();
                          playHoverSound(0.02);
                          crumb.onClick();
                        }
                      }}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer truncate ${
                        isLight
                          ? 'text-slate-600 hover:text-violet-600'
                          : 'text-zinc-400 hover:text-violet-400'
                      }`}
                    >
                      {Icon && (
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                      )}
                      <span itemProp="name" className="truncate">
                        {crumb.label}
                      </span>
                    </a>
                  )}

                  <meta itemProp="position" content={String(idx + 1)} />
                </li>
              );
            })}
          </ol>
        </div>

        {/* Right: Path Telemetry & Quick Link Sharing */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyPath}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all active:scale-95 cursor-pointer ${
              copied
                ? isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : isLight
                ? 'bg-slate-100/80 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
            }`}
            title="Copy path to clipboard"
            aria-label="Copy page link"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span className="hidden md:inline">Share Path</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
