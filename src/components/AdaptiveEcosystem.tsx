import React from 'react';
import { ArrowRight, Network } from 'lucide-react';
import { ECOSYSTEM_MODULES, ThemeAwareEcosystemIcon } from './ecosystem/ecosystemData';

// Re-exported so existing imports of these names keep working.
export { ECOSYSTEM_MODULES, CATEGORY_THEME_MAP, ThemeAwareEcosystemIcon } from './ecosystem/ecosystemData';
export type { EcosystemModule } from './ecosystem/ecosystemData';

interface AdaptiveEcosystemProps {
  onNavigateToEcosystem?: () => void;
  onOpenSolutionBuilder?: () => void;
  onNavigateToContact?: () => void;
}

/** Homepage teaser for the dedicated /ecosystem page: a concise preview, not the full explorer. */
export const AdaptiveEcosystem: React.FC<AdaptiveEcosystemProps> = ({ onNavigateToEcosystem }) => {
  const preview = ECOSYSTEM_MODULES.slice(0, 8);

  return (
    <section className="py-14 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-5">
            <Network className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>THE ADAPTIVE ENTERPRISE ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            Not Isolated Software.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500">
              An Interconnected Living Ecosystem.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
            People, processes, data, systems and AI working as one. Every business area is a connected node that shares live data and context with the rest.
          </p>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8" role="list">
          {preview.map((mod) => (
            <li key={mod.id} className="p-4 rounded-xl surface-card-subtle border border-card-border flex items-center gap-3">
              <ThemeAwareEcosystemIcon icon={mod.icon} category={mod.category} size="sm" />
              <span className="text-xs font-bold text-foreground leading-snug">{mod.name}</span>
            </li>
          ))}
        </ul>

        <a
          href="/ecosystem"
          onClick={(e) => {
            if (onNavigateToEcosystem) {
              e.preventDefault();
              onNavigateToEcosystem();
            }
          }}
          id="eco-explore-btn"
          className="btn-theme-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold min-h-[44px]"
        >
          <span>Explore Our Ecosystem</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};
