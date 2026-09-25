import React from 'react';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

interface EcosystemCtaBannerProps {
  onNavigateToContact?: () => void;
  onNavigateToSolutions?: () => void;
}

export const EcosystemCtaBanner: React.FC<EcosystemCtaBannerProps> = ({
  onNavigateToContact,
  onNavigateToSolutions,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto">
        
        {/* Banner Card */}
        <div className="p-8 sm:p-14 lg:p-16 rounded-3xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF] font-mono-code block">
              READY TO BUILD YOUR ENTERPRISE ECOSYSTEM?
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-[1.2] font-display">
              Your business already has a way of working.{' '}
              <span className="block text-[#0066FF]">
                Let's build the system around it.
              </span>
            </h2>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={onNavigateToContact}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/25 active:scale-95"
            >
              <span>Start a Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToSolutions}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full surface-card border border-border text-foreground hover:bg-background-subtle font-semibold text-sm transition-all active:scale-95"
            >
              <span>Explore Our Solutions</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
