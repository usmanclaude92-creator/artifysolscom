import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Palette,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  Layers,
  ExternalLink,
  Laptop,
  Maximize2,
  RefreshCw,
  Eye,
  Sliders,
  Terminal,
} from 'lucide-react';
import { PREMIUM_THEMES, PremiumTheme } from '../data/premiumThemesData';
import { playHoverSound } from '../utils/soundEffects';

interface PremiumThemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onApplyTheme: (themeId: string) => void;
  onOpenSolutionBuilder?: () => void;
  onNavigateToContact?: () => void;
}

export const PremiumThemesModal: React.FC<PremiumThemesModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onApplyTheme,
  onOpenSolutionBuilder,
  onNavigateToContact,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(currentThemeId || 'obsidian-gold');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'tokens' | 'specs'>('dashboard');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1D' | '7D' | '30D' | '1Y'>('7D');
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const activeTheme = PREMIUM_THEMES.find((t) => t.id === selectedThemeId) || PREMIUM_THEMES[0];

  const handleCopyCssVariables = () => {
    playHoverSound(0.04);
    const cssText = Object.entries(activeTheme.cssVariables)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
    const fullBlock = `/* ${activeTheme.name} Design System Tokens */\n:root {\n${cssText}\n}`;
    navigator.clipboard.writeText(fullBlock);
    setCopiedKey('css');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopyJsonTokens = () => {
    playHoverSound(0.04);
    navigator.clipboard.writeText(JSON.stringify(activeTheme, null, 2));
    setCopiedKey('json');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyToApp = (themeId: string) => {
    playHoverSound(0.05);
    setIsApplying(true);
    onApplyTheme(themeId);
    setTimeout(() => setIsApplying(false), 600);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-studio-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/80 backdrop-blur-xl animate-fade-in"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-7xl h-[92vh] max-h-[920px] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden bg-[#07070b] text-zinc-100"
      >
        {/* Top Header Bar */}
        <header className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0a0a10]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold shadow-md"
              style={{ backgroundColor: activeTheme.accentHex }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="text-violet-400 uppercase font-semibold">Artify Studio System</span>
                <span aria-hidden="true">·</span>
                <span>Bespoke Enterprise Theme Architecture</span>
              </div>
              <h1 id="theme-studio-title" className="text-base sm:text-lg font-bold font-display text-white">
                Premium Themes & Architectural Templates
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleApplyToApp(activeTheme.id)}
              disabled={isApplying}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md active:scale-95"
              style={{
                backgroundColor: activeTheme.accentHex,
                color: activeTheme.isLightMode ? '#000000' : '#FFFFFF',
              }}
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Applying Theme...</span>
                </>
              ) : currentThemeId === activeTheme.id ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active in Application</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Apply Theme to Live App</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Close Studio Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Studio Body: Left Sidebar (Theme List) & Right Main Workspace (Live Preview) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Panel: Curated Premium Themes List */}
          <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-3 sm:p-4 overflow-y-auto space-y-2.5 bg-[#09090f]/70">
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Enterprise Aesthetic Profiles</span>
              <span>{PREMIUM_THEMES.length} Curated</span>
            </div>

            {PREMIUM_THEMES.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              const isLiveActive = currentThemeId === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    playHoverSound(0.02);
                    setSelectedThemeId(theme.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs group relative overflow-hidden ${
                    isSelected
                      ? 'bg-white/[0.07] border-white/20 shadow-lg'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10 text-zinc-300'
                  }`}
                >
                  {/* Active Border Accent */}
                  {isSelected && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: theme.accentHex }}
                    />
                  )}

                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.accentHex }}
                      />
                      <span className="font-bold text-sm text-white font-display">
                        {theme.name}
                      </span>
                    </div>

                    {isLiveActive && (
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-zinc-400 mb-1.5">
                    {theme.domain}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2.5">
                    {theme.tagline}
                  </p>

                  {/* Micro Swatch Strip */}
                  <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                    {theme.palette.map((p, i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 rounded-sm border border-black/30"
                        style={{ backgroundColor: p.hex }}
                        title={`${p.name}: ${p.hex}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}

            {/* Bespoke Advisory Box */}
            <div className="p-3.5 rounded-2xl border border-violet-500/20 bg-violet-950/20 text-xs mt-4">
              <div className="font-semibold text-violet-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Need a Custom Enterprise Design System?</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                Artify architects craft bespoke, white-labeled design tokens and high-frequency UI components to match your exact corporate brand guidelines.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToContact) onNavigateToContact();
                }}
                className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Consult Lead UI Architect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>

          {/* Right Panel: Interactive Theme Preview & Live Canvas */}
          <main className="lg:col-span-8 flex flex-col min-h-0 bg-[#050508] p-4 sm:p-6 overflow-y-auto">
            
            {/* Theme Meta Kicker & Sub-Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10 shrink-0">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                  <span
                    className="font-bold uppercase tracking-wider"
                    style={{ color: activeTheme.accentHex }}
                  >
                    {activeTheme.codename}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTheme.targetIndustry}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {activeTheme.name}
                </h2>
              </div>

              {/* Viewport Modes */}
              <div className="inline-flex items-center p-1 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium self-start sm:self-auto">
                <button
                  onClick={() => {
                    playHoverSound(0.02);
                    setActiveTab('dashboard');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Executive UI</span>
                </button>

                <button
                  onClick={() => {
                    playHoverSound(0.02);
                    setActiveTab('agents');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'agents'
                      ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Swarm Mesh</span>
                </button>

                <button
                  onClick={() => {
                    playHoverSound(0.02);
                    setActiveTab('tokens');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'tokens'
                      ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Design Tokens</span>
                </button>

                <button
                  onClick={() => {
                    playHoverSound(0.02);
                    setActiveTab('specs');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'specs'
                      ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Token Code</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Executive UI Preview Frame */}
            {activeTab === 'dashboard' && (
              <div
                className="rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-2xl relative overflow-hidden"
                style={{
                  backgroundColor: activeTheme.surfaceHex,
                  borderColor: activeTheme.isLightMode ? '#E4E4E7' : 'rgba(255, 255, 255, 0.12)',
                  color: activeTheme.isLightMode ? '#09090B' : '#FFFFFF',
                }}
              >
                {/* Simulated Enterprise App Header */}
                <div
                  className="flex items-center justify-between pb-4 mb-5 border-b"
                  style={{ borderColor: activeTheme.isLightMode ? '#E4E4E7' : 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeTheme.accentHex }}
                    />
                    <div className="text-xs font-mono font-bold tracking-tight">
                      ARTIFY OS // {activeTheme.codename}
                    </div>
                  </div>

                  {/* Time Range Selector */}
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {(['1D', '7D', '30D', '1Y'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          playHoverSound(0.02);
                          setTimeRange(r);
                        }}
                        className={`px-2 py-0.5 rounded transition-all ${
                          timeRange === r
                            ? 'font-bold'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor:
                            timeRange === r
                              ? activeTheme.accentHex
                              : 'transparent',
                          color:
                            timeRange === r
                              ? activeTheme.isLightMode
                                ? '#FFFFFF'
                                : '#000000'
                              : 'inherit',
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Executive Metric Banner */}
                <div className="mb-6">
                  <div className="text-xs font-mono uppercase tracking-wider opacity-60 mb-1">
                    {activeTheme.mockData.kpiTitle}
                  </div>
                  <div
                    className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight mb-2"
                    style={{ color: activeTheme.accentHex }}
                  >
                    {activeTheme.mockData.kpiValue}
                  </div>
                  <p className="text-xs opacity-75 max-w-xl">
                    {activeTheme.mockData.kpiSubtitle}
                  </p>
                </div>

                {/* Mini SVG Velocity Curve */}
                <div
                  className="p-4 rounded-xl border mb-6"
                  style={{
                    backgroundColor: activeTheme.isLightMode
                      ? '#F9F9FB'
                      : 'rgba(0, 0, 0, 0.3)',
                    borderColor: activeTheme.isLightMode
                      ? '#E4E4E7'
                      : 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-mono opacity-70 mb-3">
                    <span>{activeTheme.mockData.chartLabel}</span>
                    <span style={{ color: activeTheme.accentHex }}>
                      ▲ {activeTheme.metrics[0].trend}
                    </span>
                  </div>
                  <div className="h-20 w-full flex items-end gap-2 pt-2">
                    {activeTheme.mockData.chartPoints.map((pt, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full rounded-t transition-all duration-500 hover:brightness-125"
                          style={{
                            height: `${pt}%`,
                            backgroundColor: activeTheme.accentHex,
                            opacity: 0.35 + (i / activeTheme.mockData.chartPoints.length) * 0.65,
                          }}
                        />
                        <span className="text-[9px] font-mono opacity-50">T-{9 - i}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Metric Summary Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {activeTheme.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border"
                      style={{
                        backgroundColor: activeTheme.isLightMode
                          ? '#F9F9FB'
                          : 'rgba(0, 0, 0, 0.25)',
                        borderColor: activeTheme.isLightMode
                          ? '#E4E4E7'
                          : 'rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="text-[11px] font-mono opacity-60 mb-0.5">{m.label}</div>
                      <div
                        className="text-xl font-bold font-display"
                        style={{ color: activeTheme.accentHex }}
                      >
                        {m.value}
                      </div>
                      <div className="text-[10px] font-mono opacity-75 mt-0.5">{m.trend}</div>
                    </div>
                  ))}
                </div>

                {/* Live Activity Stream */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2 flex items-center justify-between">
                    <span>Real-Time Autonomous Action Stream</span>
                    <span className="text-[10px]">{activeTheme.mockData.streamThroughput}</span>
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
                          <div className="text-[11px] opacity-70">{action.detail}</div>
                        </div>
                        <span className="font-mono text-[10px] opacity-50 shrink-0">
                          {action.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Swarm Mesh View */}
            {activeTab === 'agents' && (
              <div
                className="rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-2xl relative overflow-hidden"
                style={{
                  backgroundColor: activeTheme.surfaceHex,
                  borderColor: activeTheme.isLightMode ? '#E4E4E7' : 'rgba(255, 255, 255, 0.12)',
                  color: activeTheme.isLightMode ? '#09090B' : '#FFFFFF',
                }}
              >
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="text-xs font-mono font-bold tracking-tight">
                    MULTI-AGENT SWARM CONSENSUS TOPOLOGY
                  </div>
                  <div
                    className="text-xs font-mono font-semibold"
                    style={{ color: activeTheme.accentHex }}
                  >
                    {activeTheme.mockData.consensusRate}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: activeTheme.isLightMode ? '#F4F4F5' : 'rgba(0, 0, 0, 0.4)',
                      borderColor: activeTheme.isLightMode ? '#E4E4E7' : 'rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div className="text-xs font-mono opacity-60 mb-1">Active Cluster Agent</div>
                    <div className="text-base font-bold mb-1" style={{ color: activeTheme.accentHex }}>
                      {activeTheme.mockData.activeAgent}
                    </div>
                    <div className="text-xs opacity-75">
                      Security Protocol: <span className="font-mono">{activeTheme.mockData.securityProtocol}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTheme.characteristics.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border flex items-center gap-2.5 text-xs"
                        style={{
                          borderColor: activeTheme.isLightMode ? '#E4E4E7' : 'rgba(255, 255, 255, 0.08)',
                          backgroundColor: activeTheme.isLightMode ? '#FFFFFF' : 'rgba(255, 255, 255, 0.02)',
                        }}
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: activeTheme.accentHex }} />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Design Tokens & Palette */}
            {activeTab === 'tokens' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeTheme.palette.map((p, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0"
                          style={{ backgroundColor: p.hex }}
                        />
                        <div>
                          <div className="font-bold text-sm text-white">{p.name}</div>
                          <div className="text-xs text-zinc-400 font-mono">{p.role}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <div className="font-bold text-white">{p.hex}</div>
                        <div className="text-[10px] text-emerald-400">WCAG {p.wcagContrast}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Typography Specification
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-zinc-500 font-mono text-[10px]">DISPLAY HEADLINE</div>
                      <div className="font-bold text-white mt-0.5">{activeTheme.typography.display}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 font-mono text-[10px]">BODY PARAGRAPH</div>
                      <div className="font-bold text-white mt-0.5">{activeTheme.typography.body}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 font-mono text-[10px]">MONOSPACE TELEMETRY</div>
                      <div className="font-bold text-white mt-0.5">{activeTheme.typography.mono}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Code Export */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-zinc-400 uppercase">
                    CSS Custom Properties Specification
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCssVariables}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono transition-all flex items-center gap-1.5 text-zinc-200"
                    >
                      {copiedKey === 'css' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied CSS!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy CSS Tokens</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopyJsonTokens}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono transition-all flex items-center gap-1.5 text-zinc-200"
                    >
                      {copiedKey === 'json' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied JSON!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy JSON Spec</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{`/* ${activeTheme.name} (:root / Tailwind CSS Variables) */
:root {
${Object.entries(activeTheme.cssVariables)
  .map(([k, v]) => `  ${k}: ${v};`)
  .join('\n')}
}`}</code>
                </pre>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-zinc-400 font-mono">
                Theme ID: <span className="text-white font-bold">{activeTheme.id}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleApplyToApp(activeTheme.id)}
                  disabled={isApplying}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  style={{
                    backgroundColor: activeTheme.accentHex,
                    color: activeTheme.isLightMode ? '#000000' : '#FFFFFF',
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview in Live Site</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenSolutionBuilder) onOpenSolutionBuilder();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Build Solution with This Theme</span>
                </button>
              </div>
            </div>

          </main>
        </div>
      </motion.div>
    </div>
  );
};
