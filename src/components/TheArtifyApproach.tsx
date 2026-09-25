import React, { useState } from 'react';
import {
  ArrowRight,
  Boxes,
  Cpu,
  Layers,
  Network,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  GitBranch,
  Bot,
  Database,
  Sliders,
  Check,
} from 'lucide-react';

interface TheArtifyApproachProps {
  onOpenSolutionBuilder?: () => void;
  onNavigateToAbout?: () => void;
}

export const TheArtifyApproach: React.FC<TheArtifyApproachProps> = ({
  onOpenSolutionBuilder,
  onNavigateToAbout,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'philosophy'>('comparison');

  const COMPARISON_ROWS = [
    {
      conventional: 'Choose software',
      artify: 'Understand the business',
      detail: 'Traditional IT forces a tool selection first; Artify starts with your business model, operations, and objectives.',
    },
    {
      conventional: 'Adapt processes',
      artify: 'Design around processes',
      detail: 'Off-the-shelf software makes your team work around constraints; Artify shapes software to your exact workflow.',
    },
    {
      conventional: 'Multiple disconnected tools',
      artify: 'Connected ecosystem',
      detail: 'Replacing 10+ disjointed SaaS subscriptions with one synchronized, coherent digital environment.',
    },
    {
      conventional: 'Software-centric',
      artify: 'Business-centric',
      detail: 'Technology built as an instrument of business execution rather than generic feature sets.',
    },
    {
      conventional: 'Data scattered across systems',
      artify: 'Unified data architecture',
      detail: 'No duplicate entry or shadow spreadsheets — one sovereign, structured source of truth.',
    },
    {
      conventional: 'Human-driven repetitive work',
      artify: 'AI-assisted workflows',
      detail: 'Autonomous digital coworkers handle cognitive document ingestion, matching, and routine actions.',
    },
    {
      conventional: 'Vendor-defined limitations',
      artify: 'Business-defined architecture',
      detail: 'Zero artificial seat limits, feature paywalls, or forced roadmaps. You control the software.',
    },
    {
      conventional: 'Application',
      artify: 'Enterprise ecosystem',
      detail: 'Not another isolated tool to manage, but an intelligent foundation that scales with enterprise growth.',
    },
  ];

  return (
    <section id="approach" className="py-20 sm:py-28 bg-background relative overflow-hidden transition-colors duration-200">
      {/* Background subtle gradient */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/[0.03] dark:bg-blue-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Section 02 Header: Challenging the Conventional Software Model */}
        <div className="max-w-4xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code mb-3">
            <span>THE PHILOSOPHICAL FOUNDATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.12] font-display mb-6">
            Software should adapt to your business.{' '}
            <span className="block text-[#0066FF] mt-1">
              Not your business to software.
            </span>
          </h2>

          {/* The Core Challenge Copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-foreground-secondary leading-relaxed">
            <div className="space-y-3.5 surface-card-subtle p-5 sm:p-6 rounded-2xl border border-border">
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-rose-500 block">
                The Conventional Software Trap
              </span>
              <p className="text-sm font-medium text-foreground">
                Most businesses adapt to software.
              </p>
              <ul className="space-y-2 text-xs text-foreground-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-mono-code">✕</span>
                  <span>They change their workflows to match tool limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-mono-code">✕</span>
                  <span>They change their processes to fit rigid vendor fields</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-mono-code">✕</span>
                  <span>They create manual workarounds and duplicate steps</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-mono-code">✕</span>
                  <span>They maintain fragile spreadsheets alongside systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-mono-code">✕</span>
                  <span>They connect disconnected applications with duct-tape</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500 font-mono-code">✕</span>
                  <span>They train people to work around software limitations</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3.5 surface-card p-5 sm:p-6 rounded-2xl border-2 border-[#0066FF]/30 shadow-lg shadow-blue-500/5 bg-gradient-to-br from-blue-500/[0.02] to-transparent">
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#0066FF] block">
                The Artify Ecosystem Difference
              </span>
              <p className="text-sm font-bold text-foreground">
                We believe it should be the other way around.
              </p>
              <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                Artify starts with your business model, processes, people, data and objectives. Then we design the ecosystem around them.
              </p>
              <div className="pt-2 border-t border-border space-y-2 text-xs text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold">Bespoke Enterprise Systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="font-semibold">Autonomous AI Workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-semibold">Sovereign Data Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Architecture Philosophy Pillars */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF] font-mono-code block mb-2">
              ARCHITECTURE PHILOSOPHY
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
              Built around your business. Not around a software template.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Adaptive */}
            <div className="p-7 rounded-2xl surface-card border border-card-border hover:border-[#0066FF]/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center text-[#0066FF] mb-5 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono-code uppercase font-bold text-[#0066FF] block mb-1">
                PILLAR 01
              </span>
              <h4 className="text-xl font-bold text-foreground font-display mb-2">
                Adaptive
              </h4>
              <p className="text-sm font-semibold text-foreground mb-2">
                Your system follows your processes.
              </p>
              <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                As your company scales, acquires entities, or updates operational SOPs, the software evolves seamlessly without vendor bottlenecks.
              </p>
            </div>

            {/* Pillar 2: Integrated */}
            <div className="p-7 rounded-2xl surface-card border border-card-border hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 group-hover:scale-105 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono-code uppercase font-bold text-indigo-500 block mb-1">
                PILLAR 02
              </span>
              <h4 className="text-xl font-bold text-foreground font-display mb-2">
                Integrated
              </h4>
              <p className="text-sm font-semibold text-foreground mb-2">
                Your business doesn't operate through disconnected islands of software.
              </p>
              <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                All data, permissions, inventory, and transactions flow across one unified nervous system with real-time operational synchronization.
              </p>
            </div>

            {/* Pillar 3: Intelligent */}
            <div className="p-7 rounded-2xl surface-card border border-card-border hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono-code uppercase font-bold text-purple-500 block mb-1">
                PILLAR 03
              </span>
              <h4 className="text-xl font-bold text-foreground font-display mb-2">
                Intelligent
              </h4>
              <p className="text-sm font-semibold text-foreground mb-2">
                AI and automation operate within the ecosystem.
              </p>
              <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                Not a standalone novelty chatbot, but embedded intelligence reading documents, verifying ledger items, and automating decision loops.
              </p>
            </div>
          </div>
        </div>

        {/* Section 05: Visual Conceptual Comparison Table — Traditional Software vs. Artify */}
        <div className="pt-10 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF] font-mono-code block mb-1">
                CONCEPTUAL COMPARISON
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                Traditional Software vs. Artify
              </h3>
              <p className="text-xs sm:text-sm text-foreground-secondary mt-1">
                Not a competitor comparison, but a fundamental philosophical difference in how technology serves enterprise operations.
              </p>
            </div>

            <button
              onClick={onOpenSolutionBuilder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all self-start md:self-auto"
            >
              <span>Build With Our Approach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Conventional Approach */}
            <div className="p-6 sm:p-7 rounded-2xl surface-card-subtle border border-border">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <XCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider font-mono-code text-foreground-muted">
                  Conventional Approach
                </span>
              </div>

              <div className="space-y-4">
                {COMPARISON_ROWS.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                    <span className="text-rose-500 font-mono-code text-xs mt-0.5">✕</span>
                    <div>
                      <span className="text-sm font-semibold text-foreground-secondary block">
                        {row.conventional}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Artify Approach */}
            <div className="p-6 sm:p-7 rounded-2xl surface-card border-2 border-[#0066FF]/40 shadow-xl shadow-blue-500/5 bg-gradient-to-br from-blue-500/[0.03] to-transparent">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-[#0066FF]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider font-mono-code text-[#0066FF]">
                  Artify Approach
                </span>
              </div>

              <div className="space-y-4">
                {COMPARISON_ROWS.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-bold text-foreground block">
                        {row.artify}
                      </span>
                      <span className="text-xs text-foreground-secondary leading-snug">
                        {row.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
