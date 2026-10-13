import React from 'react';
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Layers,
  Sparkles,
  Bot,
  FileText,
  Building2,
  HelpCircle,
  Shield,
  Zap,
} from 'lucide-react';
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

  // The built-in product list is large and only needed to name a product breadcrumb, so it loads on demand.
  const [productName, setProductName] = React.useState<{ slug: string; name?: string } | null>(null);
  React.useEffect(() => {
    if (activeRoute !== 'product-detail' || !productSlug) return;
    let cancelled = false;
    void import('../data/aiProductsData').then((m) => {
      if (!cancelled) setProductName({ slug: productSlug, name: m.getAiProductBySlug(productSlug)?.name });
    });
    return () => {
      cancelled = true;
    };
  }, [activeRoute, productSlug]);

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
        const knownName = productName && productName.slug === productSlug ? productName.name : undefined;
        const resolvedName =
          knownName ||
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
            label: resolvedName,
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

      </div>
    </nav>
  );
};
