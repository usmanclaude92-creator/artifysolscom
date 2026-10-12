import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenSolutionBuilder: () => void;
  onOpenConsultant: () => void;
  onNavigateToCapabilities: () => void;
  onNavigateToContact: () => void;
}


const DevicesPicture: React.FC<{ className: string }> = ({ className }) => (
  <picture>
    <source srcSet="/hero-devices.webp" type="image/webp" />
    <img
      src="/hero-devices.jpg"
      alt="The Artify platform running on a laptop, a tablet and a phone"
      width={1483}
      height={670}
      fetchPriority="high"
      draggable={false}
      className={className}
    />
  </picture>
);

const PlatformsPicture: React.FC<{ className: string }> = ({ className }) => (
  <picture>
    <source srcSet="/hero-platforms.webp" type="image/webp" />
    <img
      src="/hero-platforms.png"
      alt="Works on macOS, Windows, Android and iOS"
      width={484}
      height={59}
      draggable={false}
      className={className}
    />
  </picture>
);

const HeroMetrics: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`grid grid-cols-3 gap-2 sm:gap-6 pt-6 sm:pt-10 border-t border-border w-full ${className}`}>
    <div>
      <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground font-display">100%</div>
      <div className="text-[10px] sm:text-xs text-foreground-muted font-medium">Custom Engineered</div>
    </div>
    <div>
      <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary font-display">24/7</div>
      <div className="text-[10px] sm:text-xs text-foreground-muted font-medium">Autonomous Execution</div>
    </div>
    <div>
      <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-sky-500 font-display">0-Legacy</div>
      <div className="text-[10px] sm:text-xs text-foreground-muted font-medium">Zero-Lockin Architecture</div>
    </div>
  </div>
);

export const Hero: React.FC<HeroProps> = ({
  onOpenSolutionBuilder,
  onOpenConsultant,
  onNavigateToCapabilities,
  onNavigateToContact,
}) => {

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] sm:min-h-[92vh] pt-20 sm:pt-28 lg:pt-32 pb-4 sm:pb-8 lg:pb-10 flex items-center lg:items-start justify-center overflow-hidden bg-background bg-grid-pattern transition-colors duration-200"
    >
      {/* Glow aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-violet-700/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-3.5 sm:px-6 lg:pl-[4.5%] lg:pr-[10%] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center lg:items-start">
          
          {/* Left Column: Brand Message & Hero Copy */}
          <motion.div
            className="lg:col-span-12 lg:max-w-[50vw] flex flex-col items-start text-left relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] sm:text-sm md:text-base font-semibold tracking-wide mb-3 sm:mb-5 shadow-inner max-w-full">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="truncate">We Design Solutions, not just Software...</span>
            </div>

            {/* Main Headline - beautifully scaled for mobile to prevent line-wrapping clutter */}
            <h1 className="text-[clamp(1.15rem,5.1vw,1.65rem)] sm:text-4xl md:text-5xl lg:text-[clamp(1.7rem,3.6vw,4.4rem)] font-extrabold tracking-tight text-foreground leading-[1.2] sm:leading-[1.15] md:leading-[1.15] lg:leading-[1.4] mb-3 sm:mb-6 font-display">
              <span className="block sm:inline whitespace-nowrap sm:whitespace-normal lg:whitespace-nowrap">
                Your Business is Unique.
              </span>{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 pb-1 sm:pb-[6px] whitespace-nowrap sm:whitespace-normal lg:whitespace-nowrap">
                Your Software Should Be Too.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-base lg:text-xl text-foreground-muted font-normal leading-relaxed lg:leading-[1.85] max-w-2xl lg:max-w-none mb-3.5 sm:mb-7">
              Fully Customized and Adaptive Eco-System designed around your Business enhanced by Next-generation AI, Intelligent Automation and connected Technology.
            </p>

            {/* Phones and tablets: the platform image right after the intro, full width */}
            <div className="lg:hidden self-stretch -mx-3.5 sm:-mx-6 mb-5 sm:mb-8">
              <DevicesPicture className="hero-devices-m w-full h-auto select-none" />
              <PlatformsPicture className="hero-platforms-m -mt-1 mx-auto w-[270px] sm:w-[340px] max-w-[78%] h-auto select-none" />
            </div>

            {/* Core Capability Callout */}
            <div className="relative w-fit max-w-full p-3 sm:p-5 rounded-xl sm:rounded-2xl surface-card-subtle border border-primary/25 shadow-lg mb-5 sm:mb-8 backdrop-blur-sm">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-foreground-secondary tracking-tight leading-snug">
                  Bespoke Enterprise Systems • Autonomous AI Workflows • Sovereign Data Architecture
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onNavigateToContact}
                id="hero-primary-cta"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold btn-theme-primary px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-xl shadow-violet-600/30 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Build Your Adaptive Solution</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateToCapabilities}
                id="hero-secondary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold btn-theme-secondary px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all shadow-sm"
              >
                <span>Explore Capabilities</span>
              </button>

              <button
                onClick={onOpenSolutionBuilder}
                id="hero-wizard-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 py-2.5 sm:py-3 rounded-xl transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Launch Solution Wizard</span>
              </button>
            </div>

            {/* Quick Metrics Bar: under the left copy on phones/tablets; on desktop it sits under the devices, centred on the same axis */}
            <div className="lg:hidden w-full max-w-xl mt-6 sm:mt-10"><HeroMetrics /></div>
          </motion.div>

          {/* Right: platform shown across laptop, tablet and phone. A large layer on desktop (text stays on top), a normal block on mobile. */}
          <div className="hidden lg:block lg:absolute lg:right-[1%] lg:top-[49px] lg:w-[44%] lg:z-0 lg:pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <DevicesPicture className="hero-devices w-full h-auto select-none" />
              <PlatformsPicture className="hero-platforms -mt-4 mx-auto w-[380px] max-w-[80%] h-auto select-none" />
              <HeroMetrics className="mt-8 max-w-xl mx-auto" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
