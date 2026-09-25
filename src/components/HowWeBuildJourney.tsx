import React, { useState } from 'react';
import {
  Search,
  Network,
  Compass,
  Cpu,
  Link2,
  Bot,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HowWeBuildJourneyProps {
  onOpenSolutionBuilder?: () => void;
}

export const HowWeBuildJourney: React.FC<HowWeBuildJourneyProps> = ({
  onOpenSolutionBuilder,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const STAGES = [
    {
      num: '01',
      title: 'Discover',
      tagline: 'We understand your business.',
      desc: 'We conduct deep operational discovery — interviewing stakeholders, auditing existing software pain points, and analyzing transaction flows.',
      icon: Search,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      num: '02',
      title: 'Model',
      tagline: 'We map people, processes, information and dependencies.',
      desc: 'We map every operational workflow, dependency, data entity, and organizational permission into a clear architectural model.',
      icon: Network,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      num: '03',
      title: 'Architect',
      tagline: 'We design the ecosystem.',
      desc: 'We engineer the unified ecosystem blueprint — defining data schemas, sovereign storage boundaries, API interfaces, and user journeys.',
      icon: Compass,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      num: '04',
      title: 'Engineer',
      tagline: 'We build the required systems.',
      desc: 'We build bespoke enterprise applications with clean TypeScript, scalable modular services, and zero technical debt or SaaS template constraints.',
      icon: Cpu,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#0066FF]/10',
    },
    {
      num: '05',
      title: 'Integrate',
      tagline: 'We connect existing platforms and data.',
      desc: 'We connect legacy ERPs, banking endpoints, external supplier EDI, and government portals into one unified real-time event bus.',
      icon: Link2,
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
    },
    {
      num: '06',
      title: 'Automate',
      tagline: 'We introduce AI and autonomous workflows.',
      desc: 'We deploy autonomous digital coworkers that handle cognitive document parsing, automated 3-way matching, and anomaly intervention.',
      icon: Bot,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      num: '07',
      title: 'Evolve',
      tagline: 'Your ecosystem evolves with your business.',
      desc: 'Your ecosystem scales alongside company expansions, acquisitions, and new market regulations with continuous architectural support.',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  const currentStage = STAGES[activeStepIndex];

  return (
    <section id="journey" className="py-20 sm:py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header: From business complexity to intelligent operations */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code mb-3">
            <span>THE ECOSYSTEM JOURNEY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] font-display mb-4">
            From business complexity{' '}
            <span className="text-[#0066FF] block">
              to intelligent operations.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal">
            A disciplined consulting and software engineering methodology built around your business reality — not software templates.
          </p>
        </div>

        {/* 7-Stage Pipeline */}
        <div className="relative mb-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-7 left-8 right-8 h-0.5 bg-border -z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 relative z-10">
            {STAGES.map((st, idx) => {
              const Icon = st.icon;
              const isSelected = activeStepIndex === idx;

              return (
                <button
                  key={st.num}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                    isSelected
                      ? 'surface-card border-[#0066FF] shadow-lg shadow-blue-500/15 ring-2 ring-[#0066FF]/30 scale-105'
                      : 'surface-card-subtle border-border hover:border-[#0066FF]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl ${st.bgColor} flex items-center justify-center ${st.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono-code font-bold text-foreground-muted">
                        {st.num}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground font-display mb-1 group-hover:text-[#0066FF] transition-colors">
                      {st.title}
                    </h4>

                    <p className="text-[11px] text-foreground-secondary leading-snug font-medium line-clamp-2">
                      {st.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[9px] font-mono-code text-foreground-muted">Step {idx + 1}/7</span>
                    {idx < 6 && (
                      <span className="hidden lg:inline text-xs text-foreground-muted font-mono">↓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Highlight Deep Dive Card */}
        <div className="p-6 sm:p-8 rounded-3xl surface-card border-2 border-card-border shadow-xl shadow-blue-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono-code font-bold text-[#0066FF] px-2.5 py-0.5 rounded-full bg-blue-500/10">
                PHASE {currentStage.num} • {currentStage.title.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {currentStage.tagline}
              </span>
            </div>
            <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed font-normal">
              {currentStage.desc}
            </p>
          </div>

          <button
            onClick={onOpenSolutionBuilder}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 active:scale-95"
          >
            <span>Start Your Discovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
