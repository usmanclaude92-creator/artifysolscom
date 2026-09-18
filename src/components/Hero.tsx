import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Sparkles,
  Database,
  Cpu,
  Workflow,
  LineChart,
  Network,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react';

interface HeroProps {
  onOpenSolutionBuilder: () => void;
  onOpenConsultant: () => void;
  onNavigateToCapabilities: () => void;
  onNavigateToContact: () => void;
}

interface OrbitNode {
  id: string;
  name: string;
  category: string;
  icon: any;
  angle: number;
  distance: number;
  telemetry: string;
  status: string;
  color: string;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSolutionBuilder,
  onOpenConsultant,
  onNavigateToCapabilities,
  onNavigateToContact,
}) => {
  const [activeNode, setActiveNode] = useState<string | null>('agents');
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const nodes: OrbitNode[] = [
    {
      id: 'agents',
      name: 'AUTONOMOUS AGENTS',
      category: 'Autonomous Workforce',
      icon: Bot,
      angle: 0,
      distance: 175,
      telemetry: '7 Specialized Agents Active • 4,200 Ops/sec',
      status: 'Synchronized',
      color: '#8B5CF6',
    },
    {
      id: 'data',
      name: 'DATA',
      category: 'Unified Knowledge Graph',
      icon: Database,
      angle: 51,
      distance: 180,
      telemetry: 'Vector Embeddings Live • 12 DB Bridges Active',
      status: 'Real-Time Sync',
      color: '#38BDF8',
    },
    {
      id: 'automation',
      name: 'AUTOMATION',
      category: 'Zero-Touch Execution',
      icon: Cpu,
      angle: 102,
      distance: 175,
      telemetry: '99.4% Touchless Processing • Zero Lag',
      status: 'Optimized',
      color: '#10B981',
    },
    {
      id: 'software',
      name: 'SOFTWARE',
      category: 'Adaptive Enterprise Platforms',
      icon: Zap,
      angle: 154,
      distance: 185,
      telemetry: 'Full-Stack Web & Mobile • Enterprise Architecture',
      status: 'High Availability',
      color: '#F59E0B',
    },
    {
      id: 'workflows',
      name: 'WORKFLOWS',
      category: 'Self-Healing Pipelines',
      icon: Workflow,
      angle: 205,
      distance: 175,
      telemetry: 'Cross-Department Orchestration Active',
      status: 'Active Flow',
      color: '#EC4899',
    },
    {
      id: 'analytics',
      name: 'ANALYTICS',
      category: 'Predictive Intelligence',
      icon: LineChart,
      angle: 257,
      distance: 180,
      telemetry: 'Conversational BI • Instant Root-Cause Analysis',
      status: 'Live Stream',
      color: '#6366F1',
    },
    {
      id: 'integrations',
      name: 'INTEGRATIONS',
      category: 'Connected Ecosystem',
      icon: Network,
      angle: 308,
      distance: 175,
      telemetry: 'ERP, CRM, Banking, Cloud & APIs Linked',
      status: 'Continuous Link',
      color: '#14B8A6',
    },
  ];

  const selectedNodeData = nodes.find((n) => n.id === activeNode) || nodes[0];

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] sm:min-h-[92vh] pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 flex items-center justify-center overflow-hidden bg-[#050505] bg-grid-pattern"
    >
      {/* Glow aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-violet-700/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-[10%] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Message & Hero Copy */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-violet-950/60 border border-violet-600/40 text-violet-200 text-xs sm:text-sm md:text-base font-semibold tracking-wide mb-3 sm:mb-5 shadow-inner">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
              <span className="truncate">We Design Solutions, not just Software...</span>
            </div>

            {/* Main Headline - beautifully scaled for mobile to prevent line-wrapping clutter */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.18] sm:leading-[1.1] md:leading-[1.08] mb-3.5 sm:mb-5 font-display">
              Your Business is Unique.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-200 to-sky-400 pb-1 sm:pb-[6px]">
                Your Software should be Too.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-base lg:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl mb-4 sm:mb-6">
              Fully Customized and Adaptive Eco-System designed around your Business enhanced by Next-generation AI, Intelligent Automation and connected Technology.
            </p>

            {/* Prominent Focal Statement Card */}
            <div className="relative w-full max-w-2xl p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-950/50 via-indigo-950/30 to-zinc-900/60 border border-violet-500/30 shadow-lg shadow-violet-950/40 mb-6 sm:mb-8 backdrop-blur-sm">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-violet-600/25 border border-violet-400/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-300" />
                </div>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-zinc-300 tracking-tight leading-snug">
                  Software should adapt to your Business.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-sky-500 font-bold">
                    Not your Business adapt to Software.
                  </span>
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onNavigateToContact}
                id="hero-primary-cta"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Build Your Adaptive Solution</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateToCapabilities}
                id="hero-secondary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white bg-[#101015] hover:bg-[#181820] border border-white/[0.12] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all shadow-sm"
              >
                <span>Explore Capabilities</span>
              </button>

              <button
                onClick={onOpenSolutionBuilder}
                id="hero-wizard-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-violet-300 hover:text-violet-200 bg-violet-950/40 hover:bg-violet-900/50 border border-violet-800/40 px-4 py-2.5 sm:py-3 rounded-xl transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Launch Solution Wizard</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 sm:pt-10 mt-6 sm:mt-10 border-t border-white/[0.08] w-full max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display">100%</div>
                <div className="text-[10px] sm:text-xs text-zinc-400 font-medium">Custom Engineered</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-violet-400 font-display">24/7</div>
                <div className="text-[10px] sm:text-xs text-zinc-400 font-medium">Autonomous Execution</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-sky-400 font-display">0-Legacy</div>
                <div className="text-[10px] sm:text-xs text-zinc-400 font-medium">Zero-Lockin Architecture</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Neural Ecosystem Visual */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center justify-center relative w-full"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[506px] aspect-square flex items-center justify-center scale-[0.88] xs:scale-95 sm:scale-100 origin-center">
              
              {/* Concentric subtle rings */}
              <div className="absolute inset-4 rounded-full border border-violet-500/15 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full border border-sky-500/15 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-28 rounded-full border border-indigo-500/20" />

              {/* Dynamic SVG Connection Lines & Data Pulses */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 460 460">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {nodes.map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const centerX = 230;
                  const centerY = 230;
                  const targetX = centerX + Math.cos(rad) * (node.distance * 0.95);
                  const targetY = centerY + Math.sin(rad) * (node.distance * 0.95);
                  const isSelected = activeNode === node.id;

                  return (
                    <g key={`connection-${node.id}`}>
                      {/* Connection Line */}
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={targetX}
                        y2={targetY}
                        stroke={isSelected ? '#8B5CF6' : 'currentColor'}
                        strokeWidth={isSelected ? '2' : '1'}
                        strokeDasharray={isSelected ? 'none' : '3 3'}
                        className={`transition-all duration-300 ${
                          isSelected ? 'text-violet-500' : 'text-slate-400/60 dark:text-white/20'
                        }`}
                      />
                      {/* Animated traveling data packet */}
                      <circle
                        r={isSelected ? '3.5' : '2'}
                        fill={node.color}
                        opacity={isSelected ? 0.9 : 0.5}
                      >
                        <animateMotion
                          path={`M ${centerX} ${centerY} L ${targetX} ${targetY}`}
                          dur={`${2.2 + (i % 3) * 0.6}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* Center Node: YOUR BUSINESS */}
              <div className="relative z-20 flex flex-col items-center justify-center w-28 h-28 rounded-full bg-gradient-to-b from-[#181822] to-[#0d0d12] border-2 border-violet-500/60 shadow-[0_0_40px_rgba(139,92,246,0.35)] cursor-pointer group">
                <div className="absolute inset-0 rounded-full bg-violet-600/10 animate-ping opacity-30" />
                <div className="w-3 h-3 rounded-full bg-violet-400 mb-1.5 shadow-sm shadow-violet-300 animate-pulse" />
                <span className="text-[12px] uppercase tracking-widest text-violet-300 font-bold font-mono-code">
                  NEXUS
                </span>
                <span className="text-[14.5px] font-black tracking-tight text-white font-display text-center leading-tight">
                  YOUR<br />BUSINESS
                </span>
              </div>

              {/* Orbiting Nodes */}
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const top = 50 + (Math.sin(rad) * node.distance * 100) / 460;
                const left = 50 + (Math.cos(rad) * node.distance * 100) / 460;
                const isSelected = activeNode === node.id;
                const IconComponent = node.icon;

                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    id={`hero-node-${node.id}`}
                    style={{
                      top: `${top}%`,
                      left: `${left}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute z-20 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group focus:outline-none ${
                      isSelected
                        ? 'bg-[#151520] border-2 border-violet-400 shadow-[0_0_25px_rgba(139,92,246,0.5)] scale-110'
                        : 'bg-[#0d0d12]/90 border border-white/[0.12] hover:border-violet-500/40 hover:bg-[#14141c]'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center mb-1"
                      style={{
                        backgroundColor: `${node.color}20`,
                        color: node.color,
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider text-zinc-200 whitespace-nowrap font-mono-code">
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Node Telemetry Card */}
            <div className="w-full max-w-[420px] mt-4 p-4 rounded-xl bg-[#0c0c10]/90 border border-white/[0.1] backdrop-blur-md shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: selectedNodeData.color }}
                  />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
                    {selectedNodeData.name}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded">
                  {selectedNodeData.status}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                {selectedNodeData.telemetry}
              </p>
              <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                <span>Intelligence Layer Sync</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono-code">
                  <Activity className="w-3 h-3" /> 99.98% Coherence
                </span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
