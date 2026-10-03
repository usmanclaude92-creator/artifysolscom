import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Sliders,
  Eye,
  RefreshCw,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { PREMIUM_THEMES, PremiumTheme } from '../data/premiumThemesData';
import { playHoverSound } from '../utils/soundEffects';

interface PremiumThemesSectionProps {
  onOpenThemesModal: () => void;
  onApplyTheme: (themeId: string) => void;
  currentThemeId: string;
  onOpenSolutionBuilder?: () => void;
  theme?: 'dark' | 'light';
}

export const PremiumThemesSection: React.FC<PremiumThemesSectionProps> = ({
  onOpenThemesModal,
  onApplyTheme,
  currentThemeId,
  onOpenSolutionBuilder,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [selectedThemeId, setSelectedThemeId] = useState<string>('obsidian-gold');
  const [isApplying, setIsApplying] = useState(false);

  const activeTheme = PREMIUM_THEMES.find((t) => t.id === selectedThemeId) || PREMIUM_THEMES[0];

  const handleApplyTheme = (themeId: string) => {
    playHoverSound(0.05);
    setIsApplying(true);
    onApplyTheme(themeId);
    setTimeout(() => setIsApplying(false), 500);
  };

  return (
    <section
      id="premium-themes"
      className={`relative py-20 lg:py-28 overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#050508] text-zinc-100'
      }`}
      aria-label="Enterprise Aesthetics & Bespoke Theme Architecture"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] opacity-25"
          style={{ backgroundColor: activeTheme.accentHex }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 lg:mb-16">
          <div className="text-xs font-mono font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3 flex items-center justify-center gap-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Enterprise Visual Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight leading-[1.1] mb-5">
            Bespoke Enterprise Themes & Templates.{' '}
            <span
              className="block mt-1 transition-colors duration-500"
              style={{ color: activeTheme.accentHex }}
            >
              Engineered for Your Industry's Gravitas.
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}
          >
            No generic SaaS templates. Explore five curated architectural design systems—each meticulously calibrated for
            high-stakes boardrooms, mission-critical robotics, institutional fintech, or deep cognitive intelligence.
          </p>
        </div>

        {/* 5 Theme Interactive Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {PREMIUM_THEMES.map((themeItem) => {
            const isSelected = selectedThemeId === themeItem.id;
            const isLive = currentThemeId === themeItem.id;

            return (
              <button
                key={themeItem.id}
                onClick={() => {
                  playHoverSound(0.02);
                  setSelectedThemeId(themeItem.id);
                }}
                className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  isSelected
                    ? isLight
                      ? 'bg-white border-slate-400 shadow-md text-slate-900 font-bold'
                      : 'bg-white/[0.08] border-white/30 shadow-lg text-white font-bold'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: themeItem.accentHex }}
                />
                <span>{themeItem.name}</span>
                {isLive && (
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    (Live)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Interactive Preview Card for Selected Theme */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all duration-300 relative overflow-hidden ${
              isLight
                ? 'bg-white border-slate-200 shadow-slate-200/80'
                : 'bg-[#0d0d16] border-white/10 shadow-2xl'
            }`}
          >
            {/* Top Bar of Theme Preview Container */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-border">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-foreground-muted">
                  <span className="font-bold" style={{ color: activeTheme.accentHex }}>
                    {activeTheme.codename}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTheme.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTheme.targetIndustry}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
                  {activeTheme.name}
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                  {activeTheme.description}
                </p>
              </div>

              {/* Action Buttons for this Theme */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleApplyTheme(activeTheme.id)}
                  disabled={isApplying}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 flex items-center gap-2"
                  style={{
                    backgroundColor: activeTheme.accentHex,
                    color: activeTheme.isLightMode ? '#000000' : '#FFFFFF',
                  }}
                >
                  {isApplying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : currentThemeId === activeTheme.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied to Active Site</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview in Live App</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onOpenThemesModal}
                  onMouseEnter={() => playHoverSound(0.02)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isLight
                      ? 'border-slate-300 text-slate-800 bg-slate-50 hover:bg-slate-100'
                      : 'border-white/10 text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-violet-400" />
                  <span>Open Theme Studio</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Viewport Mockup */}
            <div
              className="rounded-2xl border p-5 sm:p-7 mb-8 transition-colors duration-300 relative shadow-xl overflow-hidden"
              style={{
                backgroundColor: activeTheme.surfaceHex,
                borderColor: activeTheme.isLightMode ? '#E4E4E7' : 'rgba(255, 255, 255, 0.12)',
                color: activeTheme.isLightMode ? '#09090B' : '#FFFFFF',
              }}
            >
              {/* Mockup Header Strip */}
              <div
                className="flex items-center justify-between pb-3.5 mb-5 border-b text-xs font-mono"
                style={{ borderColor: activeTheme.isLightMode ? '#E4E4E7' : 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activeTheme.accentHex }}
                  />
                  <span className="font-bold tracking-tight">
                    ENTERPRISE CONTROL SURFACE // {activeTheme.codename}
                  </span>
                </div>
                <div className="opacity-60 hidden sm:block">
                  {activeTheme.mockData.streamThroughput}
                </div>
              </div>

              {/* Grid: Left Big Metric & Curve, Right Live Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left 7 cols: Primary KPI + Velocity Visualizer */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider opacity-60 mb-1">
                      {activeTheme.mockData.kpiTitle}
                    </div>
                    <div
                      className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight"
                      style={{ color: activeTheme.accentHex }}
                    >
                      {activeTheme.mockData.kpiValue}
                    </div>
                    <p className="text-xs opacity-75 mt-1">
                      {activeTheme.mockData.kpiSubtitle}
                    </p>
                  </div>

                  {/* 3 Metric Summary Blocks */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    {activeTheme.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border text-center"
                        style={{
                          backgroundColor: activeTheme.isLightMode
                            ? '#F9F9FB'
                            : 'rgba(0, 0, 0, 0.3)',
                          borderColor: activeTheme.isLightMode
                            ? '#E4E4E7'
                            : 'rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <div className="text-[10px] font-mono opacity-60 truncate">{m.label}</div>
                        <div
                          className="text-base sm:text-lg font-bold font-display mt-0.5"
                          style={{ color: activeTheme.accentHex }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[9px] font-mono opacity-75 mt-0.5 truncate">{m.trend}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mini Visualizer Bars */}
                  <div
                    className="p-3.5 rounded-xl border"
                    style={{
                      backgroundColor: activeTheme.isLightMode
                        ? '#F9F9FB'
                        : 'rgba(0, 0, 0, 0.25)',
                      borderColor: activeTheme.isLightMode
                        ? '#E4E4E7'
                        : 'rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono opacity-70 mb-2">
                      <span>{activeTheme.mockData.chartLabel}</span>
                      <span style={{ color: activeTheme.accentHex }}>
                        Quorum: {activeTheme.mockData.consensusRate}
                      </span>
                    </div>
                    <div className="h-14 flex items-end gap-1.5 pt-1">
                      {activeTheme.mockData.chartPoints.map((pt, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all duration-300"
                          style={{
                            height: `${pt}%`,
                            backgroundColor: activeTheme.accentHex,
                            opacity: 0.4 + (i / 9) * 0.6,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Live Stream + Swatch Chips */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider opacity-60 flex items-center justify-between">
                    <span>Autonomous Actions</span>
                    <span className="text-emerald-500 font-bold">● Active</span>
                  </div>

                  <div className="space-y-2">
                    {activeTheme.mockData.recentActions.map((action, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border flex items-start justify-between gap-3 text-xs"
                        style={{
                          backgroundColor: activeTheme.isLightMode
                            ? '#FFFFFF'
                            : 'rgba(255, 255, 255, 0.03)',
                          borderColor: activeTheme.isLightMode
                            ? '#E4E4E7'
                            : 'rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold flex items-center gap-1.5">
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: activeTheme.accentHex }}
                            />
                            <span>{action.title}</span>
                          </div>
                          <div className="text-[11px] opacity-70 line-clamp-1">{action.detail}</div>
                        </div>
                        <span className="font-mono text-[9px] opacity-50 shrink-0">
                          {action.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Palette Swatch Row */}
                  <div className="pt-2">
                    <div className="text-[10px] font-mono text-foreground-muted mb-1.5">
                      DESIGN PALETTE & CONTRAST RATIOS:
                    </div>
                    <div className="flex items-center gap-1.5">
                      {activeTheme.palette.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-6 rounded-md border border-black/20 flex items-center justify-center text-[9px] font-mono font-bold"
                          style={{
                            backgroundColor: p.hex,
                            color: idx > 1 ? '#000000' : '#FFFFFF',
                          }}
                          title={`${p.name} (${p.hex}) - WCAG ${p.wcagContrast}`}
                        >
                          {p.hex.slice(1, 4)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Strip: Key Architectural Traits */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted font-mono">
                <span className="font-semibold text-foreground">Characteristics:</span>
                {activeTheme.characteristics.map((char, charIdx) => (
                  <React.Fragment key={char}>
                    <span>{char}</span>
                    {charIdx < activeTheme.characteristics.length - 1 && (
                      <span aria-hidden="true" className="text-zinc-500">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {onOpenSolutionBuilder && (
                <button
                  onClick={onOpenSolutionBuilder}
                  onMouseEnter={() => playHoverSound(0.02)}
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                >
                  <span>Build Architecture with this Theme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
