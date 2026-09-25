import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  GitBranch,
  Layers,
  Cpu,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface EvolutionStep {
  step: string;
  title: string;
  badge: string;
  description: string;
  metric: string;
}

export const AdaptiveIntelligence: React.FC<{ onNavigateToContact?: () => void }> = ({
  onNavigateToContact,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: EvolutionStep[] = [
    {
      step: '01',
      title: 'Business Changes',
      badge: 'Operational Trigger',
      description: 'You launch a new international subsidiary, acquire a competitor, restructure payroll policy, or introduce a new product line.',
      metric: 'Zero downtime impact',
    },
    {
      step: '02',
      title: 'Artify Understands',
      badge: 'Semantic Discovery',
      description: 'Our system ingests new regulatory schemas, organizational charts, accounting dimensions, and custom operational protocols.',
      metric: 'Context captured in hours',
    },
    {
      step: '03',
      title: 'System Adapts',
      badge: 'Dynamic Re-Architecting',
      description: 'Workflows, approvals, data validation gates, and database indices update dynamically without brittle code migrations or ERP lock-in.',
      metric: 'Zero vendor hostage fees',
    },
    {
      step: '04',
      title: 'AI Assists',
      badge: 'Autonomous Guidance',
      description: 'Autonomous agents calibrate their decision policies, alerting staff to edge cases and preparing custom dashboards automatically.',
      metric: 'Adaptive prompt & tool tuning',
    },
    {
      step: '05',
      title: 'Organization Evolves',
      badge: 'Unconstrained Scale',
      description: 'Your enterprise moves with startup agility at global scale—growing revenue, maintaining margin clarity, and out-executing rigid rivals.',
      metric: 'Continuous enterprise evolution',
    },
  ];

  return (
    <section className="py-14 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>CONTINUOUS ENTERPRISE ADAPTABILITY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            Software That Evolves With You.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-sky-400 to-indigo-500">
              Never Trapped in Rigid Structures.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
            Traditional software forces companies into a painful choice: freeze their business model to fit legacy code, or spend millions on 18-month ERP upgrades. Artify is built from the ground up for continuous structural evolution.
          </p>
        </div>

        {/* 5-Step Continuous Flow Banner */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mb-16">
          {steps.map((st, i) => {
            const isSelected = activeStepIndex === i;
            return (
              <button
                key={i}
                onClick={() => setActiveStepIndex(i)}
                className={`p-5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'surface-card border-2 border-violet-600 dark:border-violet-500 dark:bg-gradient-to-b dark:from-violet-950/40 dark:to-card shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20 scale-[1.02]'
                    : 'surface-card-subtle border-card-border hover:border-primary/40 hover:bg-surface-hover/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded border transition-colors ${
                      isSelected
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'surface-card border-border text-foreground-muted'
                    }`}>
                      PHASE {st.step}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isSelected ? 'bg-primary ring-2 ring-primary/20 animate-pulse' : 'bg-foreground-muted/30'
                    }`} />
                  </div>
                  <h3 className={`text-sm font-bold font-display mb-1.5 transition-colors ${
                    isSelected ? 'text-foreground' : 'text-foreground group-hover:text-primary'
                  }`}>
                    {st.title}
                  </h3>
                  <span className="text-[10px] text-foreground-muted font-mono-code block mb-3">
                    {st.badge}
                  </span>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-mono-code text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>✓</span>
                  <span>{st.metric}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Evolution Showcase Box */}
        <div className="p-8 sm:p-10 rounded-3xl surface-card border border-primary/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary text-xs font-mono-code font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>THE ADAPTIVE ADVANTAGE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-display mb-3">
              Software that evolves dynamically alongside your operating model.
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              When market conditions change, customer demands shift, or regulations update, Artify reconfigures validation rules, telemetry models, and system integrations on demand—giving you perpetual competitive velocity.
            </p>
          </div>

          {onNavigateToContact && (
            <button
              onClick={onNavigateToContact}
              className="px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-violet-600/30 shrink-0"
            >
              <span>Discuss Your System Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
