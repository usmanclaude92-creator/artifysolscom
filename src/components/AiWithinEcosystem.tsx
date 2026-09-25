import React, { useState } from 'react';
import {
  FileSearch,
  BrainCircuit,
  Workflow,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bot,
} from 'lucide-react';

interface AiWithinEcosystemProps {
  onOpenConsultant?: () => void;
  onNavigateToAi?: () => void;
}

export const AiWithinEcosystem: React.FC<AiWithinEcosystemProps> = ({
  onOpenConsultant,
  onNavigateToAi,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    {
      title: 'Understand',
      desc: 'AI reads documents, transactions, records and business information.',
      fullDesc: 'Cognitive models extract structured line items, VAT numbers, contracts, and supplier credentials directly from raw PDFs, emails, and transaction feeds without manual data entry.',
      icon: FileSearch,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-200 dark:border-purple-900/40',
      badge: 'Cognitive Perception',
    },
    {
      title: 'Decide',
      desc: 'AI identifies patterns, exceptions and opportunities.',
      fullDesc: 'Evaluates enterprise policy, identifies budget variances, verifies 3-way PO matches, flags fraud anomalies, and scores operational risk in real time.',
      icon: BrainCircuit,
      color: 'text-[#0066FF]',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      badge: 'Reasoning Engine',
    },
    {
      title: 'Act',
      desc: 'AI initiates approved workflows and operational actions.',
      fullDesc: 'Automatically stages general ledger entries, balances schedules, dispatches shifts, and routes high-impact exceptions to human executives for one-click approval.',
      icon: Workflow,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
      borderColor: 'border-cyan-200 dark:border-cyan-900/40',
      badge: 'Autonomous Action',
    },
    {
      title: 'Learn',
      desc: 'The ecosystem continuously becomes more useful as business data grows.',
      fullDesc: 'The ecosystem continuously refines decision boundaries, learns seasonal workforce cycles, and optimizes routing as your proprietary business data compounds.',
      icon: Sparkles,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-200 dark:border-indigo-900/40',
      badge: 'Continuous Evolution',
    },
  ];

  return (
    <section id="ai" className="py-20 sm:py-28 bg-background-subtle/50 border-t border-border relative overflow-hidden transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header: AI becomes more powerful when it understands your business */}
        <div className="max-w-4xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code mb-3">
            <span>AI WITHIN YOUR ECOSYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] font-display mb-4">
            AI becomes more powerful{' '}
            <span className="text-[#0066FF] block">
              when it understands your business.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal max-w-3xl mb-4">
            Artify doesn't simply attach an AI chatbot to existing software. We design AI into the ecosystem itself — operating directly within your data pipelines, approvals, and business rules.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenConsultant || onNavigateToAi}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0066FF] hover:text-blue-700 transition-colors"
            >
              <span>Explore Embedded AI Workflows</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 4-Step Pipeline Flow: Understand -> Decide -> Act -> Learn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.title}
                onClick={() => setActiveStep(idx)}
                className={`p-6 sm:p-7 rounded-3xl surface-card border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0066FF] shadow-xl shadow-blue-500/10 scale-[1.02] ring-1 ring-[#0066FF]'
                    : 'border-card-border hover:border-[#0066FF]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {idx < STEPS.length - 1 && (
                      <span className="hidden lg:block text-foreground-muted text-sm font-bold font-mono">
                        →
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#0066FF] block mb-1">
                    0{idx + 1} • {step.badge}
                  </span>

                  <h3 className="text-xl font-bold text-foreground font-display mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-border text-[11px] text-foreground-muted leading-relaxed">
                  {step.fullDesc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Supporting Statement Banner: AI should operate inside your business — not beside it */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl surface-card border-2 border-[#0066FF]/30 shadow-lg shadow-blue-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-blue-500/[0.02] to-transparent">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#0066FF] shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono-code font-bold uppercase text-[#0066FF] block">
                THE ARTIFY AI PRINCIPLE
              </span>
              <p className="text-base sm:text-lg font-bold text-foreground font-display">
                AI should operate inside your business — not beside it.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenConsultant}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all shrink-0 active:scale-95"
          >
            <span>Talk to AI Strategist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
