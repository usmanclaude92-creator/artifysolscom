import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Network, Sparkles } from 'lucide-react';
import { CATEGORY_THEME_MAP, ECOSYSTEM_MODULES, ThemeAwareEcosystemIcon } from './ecosystemData';

interface EcosystemExplorerProps {
  onOpenSolutionBuilder?: () => void;
  onNavigateToContact?: () => void;
}

export const EcosystemExplorer: React.FC<EcosystemExplorerProps> = ({
  onOpenSolutionBuilder,
  onNavigateToContact,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('erp');
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'operations' | 'intelligence' | 'experience'>('all');

  const activeModule = ECOSYSTEM_MODULES.find((m) => m.id === activeModuleId) || ECOSYSTEM_MODULES[0];
  const activeCategoryTheme = CATEGORY_THEME_MAP[activeModule.category] || CATEGORY_THEME_MAP.core;

  const filteredModules = ECOSYSTEM_MODULES.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.category === activeFilter;
  });

  return (
    <section id="ecosystem-explorer" aria-label="Explore every ecosystem node" className="scroll-mt-28 py-16 sm:py-24 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Embedded SVG Defs for Theme-Aware SVG Filter Gradients */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="ecoMeshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--eco-icon-intel)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--eco-icon-ops)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--eco-icon-exp)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full px-[7.5%] relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Network className="w-3.5 h-3.5 text-primary eco-svg-icon" style={{ stroke: 'var(--color-primary)' }} />
              <span>EXPLORE EVERY NODE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
              Look Inside{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500">
                Each Connected Node.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
              Every business area operates as a specialized node in a unified intelligence mesh. Modules function independently while sharing live data, context, and autonomous coordination without integration friction.
            </p>
          </div>

          {/* Category Filter Tabs with theme-aware active highlights */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl surface-card-subtle border border-border self-start md:self-end">
            {(['all', 'core', 'operations', 'intelligence', 'experience'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-semibold capitalize px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === cat
                    ? 'btn-theme-primary shadow-md shadow-primary/25'
                    : 'text-foreground-muted hover:text-foreground hover:bg-secondary'
                }`}
              >
                {cat === 'all' ? 'All 15 Nodes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 15 Module Nodes Bento Selector */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredModules.map((mod) => {
              const isSelected = mod.id === activeModule.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  id={`eco-node-${mod.id}`}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[110px] group ${
                    isSelected
                      ? 'surface-card border-2 border-primary shadow-lg scale-[1.02]'
                      : 'surface-card-subtle border-card-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    {/* Theme-Aware SVG Ecosystem Icon */}
                    <ThemeAwareEcosystemIcon
                      icon={mod.icon}
                      category={mod.category}
                      isSelected={isSelected}
                      size="sm"
                    />
                    <span className="text-[10px] font-mono-code font-semibold px-1.5 py-0.5 rounded surface-card border border-border text-foreground-muted">
                      {mod.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-foreground group-hover:text-primary line-clamp-1 leading-snug">
                      {mod.name}
                    </h3>
                    <p className="text-[11px] text-foreground-muted font-mono-code capitalize mt-0.5">
                      {mod.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Active Node Telemetry Card */}
          <div className="lg:col-span-5 sticky top-28 p-7 rounded-2xl surface-card border border-card-border shadow-2xl relative overflow-hidden">
            {/* Ambient accent top bar with theme-aware gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400" />

            <div className="flex items-center justify-between pb-5 mb-5 border-b border-border">
              <div className="flex items-center gap-3">
                {/* Large Theme-Aware SVG Icon */}
                <ThemeAwareEcosystemIcon
                  icon={activeModule.icon}
                  category={activeModule.category}
                  isSelected={false}
                  size="lg"
                  className="shadow-sm"
                />
                <div>
                  <span className="text-[10px] uppercase font-mono-code font-bold tracking-wider text-primary">
                    ECOSYSTEM NODE
                  </span>
                  <h3 className="text-xl font-bold text-foreground font-display">
                    {activeModule.name}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono-code px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                ● {activeModule.status}
              </span>
            </div>

            <p className="text-sm text-foreground-secondary leading-relaxed mb-6 font-normal">
              {activeModule.summary}
            </p>

            {/* Core Capabilities */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-mono-code block mb-3">
                Core Capabilities & Architecture:
              </span>
              <div className="space-y-2">
                {activeModule.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-foreground-secondary">
                    <CheckCircle2
                      className="w-3.5 h-3.5 shrink-0 mt-0.5 eco-svg-icon"
                      style={{ stroke: activeCategoryTheme.iconStroke }}
                    />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Autonomous Action */}
            <div className="p-3.5 rounded-xl surface-container-accent border border-primary/25 mb-6">
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-1 font-mono-code uppercase">
                <Sparkles className="w-3.5 h-3.5 text-primary eco-svg-icon" style={{ stroke: 'var(--color-primary)' }} />
                <span>Autonomous Layer Action:</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed font-medium">
                {activeModule.autonomousActions}
              </p>
            </div>

            {/* Mesh Interconnects */}
            <div className="mb-6 pb-6 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-mono-code block mb-2">
                Real-Time Data Interconnects:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeModule.integratesWith.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg surface-card-subtle border border-border text-foreground-secondary font-medium"
                  >
                    ↔ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {onOpenSolutionBuilder && (
                <button
                  onClick={onOpenSolutionBuilder}
                  id="eco-configure-btn"
                  className="flex-1 py-2.5 px-4 rounded-xl btn-theme-primary text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                >
                  <span>Configure In Wizard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onNavigateToContact && (
                <button
                  onClick={onNavigateToContact}
                  id="eco-consult-btn"
                  className="py-2.5 px-4 rounded-xl btn-theme-secondary text-xs font-semibold transition-colors"
                >
                  Consult Engineers
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
