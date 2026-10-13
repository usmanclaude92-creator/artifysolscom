import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { Hero } from './Hero';

const noop = () => {};

/**
 * Build-time only: the hero exactly as App.tsx renders it on "/" (same wrapper chain, light theme),
 * rendered to static HTML by vite-plugins/heroShell.ts and embedded in the HTML shell.
 */
export const HeroShell: React.FC = () => (
  <div
    data-hero-shell
    className="min-h-screen theme-light bg-[#F8FAFC] text-slate-900 selection:bg-violet-600 selection:text-white relative transition-colors duration-300"
  >
    <main data-home-layout="true">
      <AnimatedSection variant="fade" duration={0.8} instant>
        <Hero onOpenSolutionBuilder={noop} onOpenConsultant={noop} onNavigateToCapabilities={noop} onNavigateToContact={noop} />
      </AnimatedSection>
    </main>
  </div>
);
