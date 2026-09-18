import React, { useState } from 'react';
import {
  SlidersHorizontal,
  XCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeMode, setActiveMode] = useState<'slider' | 'toggle'>('slider');
  const [viewState, setViewState] = useState<'before' | 'after'>('after');

  const beforePoints = [
    'Employees manually collect and copy data across spreadsheets',
    'Reports are prepared manually over several days or weeks',
    'Information is scattered across disconnected SaaS tools & inboxes',
    'Approvals happen through chaotic chat messages and emails',
    'Repetitive operational tasks consume thousands of human hours',
    'Management waits weeks for outdated monthly BI reports',
    'Critical decisions depend on incomplete or fragmented information',
  ];

  const afterPoints = [
    'AI autonomously collects, cleans, and harmonizes data in real time',
    'Systems process end-to-end workflows with sub-second execution',
    'Data becomes a unified, queryable enterprise knowledge graph',
    'Approvals become intelligent, automated workflows with policy guardrails',
    'Autonomous agents handle 85%+ of repetitive operational work',
    'Executive reports are generated on demand in natural language (~3s)',
    'Management interacts directly with conversational business intelligence',
  ];

  return (
    <section className="py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Glow */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full px-[5%] relative z-10">
        
        {/* Header */}
        <div className="w-full max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>OPERATIONAL TRANSFORMATION</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            Imagine the Difference.
          </h2>
          <p className="text-lg text-foreground-muted leading-relaxed font-normal">
            Drag the comparison slider below to see how Artify transforms fragmented legacy operations into an intelligent, self-driving business platform.
          </p>
        </div>

        {/* Interactive Comparison Slider Container */}
        <div className="relative rounded-3xl surface-card border border-card-border shadow-2xl p-6 sm:p-10 overflow-hidden mb-12">
          
          {/* Slider Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-red-500 font-mono-code uppercase">
                FRAGMENTED LEGACY
              </span>
              <span className="text-foreground-muted">vs</span>
              <span className="text-xs font-bold text-primary font-mono-code uppercase">
                ARTIFY AI-NATIVE
              </span>
            </div>

            {/* Slider Input */}
            <div className="flex items-center gap-4 w-full sm:w-72">
              <span className="text-[10px] font-mono-code text-foreground-muted">Before</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                id="before-after-range-slider"
                className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg"
              />
              <span className="text-[10px] font-mono-code text-primary font-bold">After</span>
            </div>
          </div>

          {/* Side by Side Contrast Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: BEFORE Legacy Operations */}
            <div
              className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 ${
                sliderPos < 50
                  ? 'bg-red-500/10 border-2 border-red-500/40 opacity-100 shadow-xl'
                  : 'surface-card-subtle border border-card-border-subtle opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-bold text-foreground font-display">
                    Before Artify
                  </h3>
                </div>
                <span className="text-[10px] font-bold font-mono-code text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded">
                  FRAGMENTED TOIL
                </span>
              </div>

              <div className="space-y-4">
                {beforePoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-foreground-muted leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✕
                    </span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AFTER Artify AI-Native Intelligence */}
            <div
              className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 ${
                sliderPos >= 50
                  ? 'surface-card border-2 border-primary shadow-xl opacity-100'
                  : 'surface-card-subtle border border-card-border-subtle opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-xl font-bold text-foreground font-display">
                    After Artify
                  </h3>
                </div>
                <span className="text-[10px] font-bold font-mono-code text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded">
                  AI-NATIVE ENGINE
                </span>
              </div>

              <div className="space-y-4">
                {afterPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-foreground-secondary leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{pt}</span>
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
