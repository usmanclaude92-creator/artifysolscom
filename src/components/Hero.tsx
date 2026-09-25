import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
  Users,
  Cog,
  Database,
  Briefcase,
  BadgeDollarSign,
  Cpu,
  Sparkles,
  Building2,
  CheckCircle2,
  Workflow,
  Compass,
} from 'lucide-react';

interface HeroProps {
  onOpenSolutionBuilder: () => void;
  onOpenConsultant: () => void;
  onNavigateToCapabilities?: () => void;
  onNavigateToContact: () => void;
}

type ArchitectureNodeId =
  | 'business'
  | 'people'
  | 'processes'
  | 'data'
  | 'artify'
  | 'erp'
  | 'crm'
  | 'hcms'
  | 'finance'
  | 'ai'
  | 'operations';

interface NodeInfo {
  id: ArchitectureNodeId;
  label: string;
  category: 'BUSINESS' | 'CORE' | 'SYSTEM' | 'OUTCOME';
  description: string;
  metric: string;
  color: string;
  badge: string;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSolutionBuilder,
  onOpenConsultant,
  onNavigateToCapabilities,
  onNavigateToContact,
}) => {
  const [activeNode, setActiveNode] = useState<ArchitectureNodeId>('artify');

  const NODE_DETAILS: Record<ArchitectureNodeId, NodeInfo> = {
    business: {
      id: 'business',
      label: 'YOUR BUSINESS',
      category: 'BUSINESS',
      description: 'Your distinct business model, operating cadence, organizational DNA, and strategic goals.',
      metric: 'Source of Truth & Strategic Purpose',
      color: 'text-blue-500',
      badge: 'Enterprise Foundation',
    },
    people: {
      id: 'people',
      label: 'PEOPLE',
      category: 'BUSINESS',
      description: 'Teams, executives, field specialists, clients, and partners interacting seamlessly across intuitive interfaces.',
      metric: 'Stakeholder Experience & Adoption',
      color: 'text-cyan-500',
      badge: 'Workforce & Clients',
    },
    processes: {
      id: 'processes',
      label: 'PROCESSES',
      category: 'BUSINESS',
      description: 'Real-world business rules, operational handoffs, compliance requirements, and custom approval hierarchies.',
      metric: 'Zero-Workaround Choreography',
      color: 'text-indigo-500',
      badge: 'Operational Logic',
    },
    data: {
      id: 'data',
      label: 'DATA',
      category: 'BUSINESS',
      description: 'Sovereign transactional records, documents, telemetry, and business intelligence retained under your absolute control.',
      metric: 'Cryptographic Sovereign Storage',
      color: 'text-emerald-500',
      badge: 'Infrastructure Asset',
    },
    artify: {
      id: 'artify',
      label: 'ARTIFY ECOSYSTEM',
      category: 'CORE',
      description: 'The intelligent operating fabric designed specifically around your business — synchronizing systems, automating flows, and eliminating data silos.',
      metric: 'Custom Orchestration Layer',
      color: 'text-[#0066FF]',
      badge: 'Unified Architecture',
    },
    erp: {
      id: 'erp',
      label: 'ERP',
      category: 'SYSTEM',
      description: 'Bespoke enterprise resource planning covering multi-entity supply chain, asset inventory, and operational milestones.',
      metric: 'Real-Time Inventory & Procurement',
      color: 'text-blue-600',
      badge: 'Core Resources',
    },
    crm: {
      id: 'crm',
      label: 'CRM',
      category: 'SYSTEM',
      description: 'Commercial pipelines, custom client onboarding journeys, SLA management, and unified contract tracking.',
      metric: 'Pipeline & Client Engagement',
      color: 'text-sky-600',
      badge: 'Client Engine',
    },
    hcms: {
      id: 'hcms',
      label: 'HCMS',
      category: 'SYSTEM',
      description: 'Human capital management, automated attendance, WPS statutory compliance, biometrics, and payroll calculation.',
      metric: 'Workforce & Statutory Compliance',
      color: 'text-teal-600',
      badge: 'Human Capital',
    },
    finance: {
      id: 'finance',
      label: 'FINANCE',
      category: 'SYSTEM',
      description: 'General ledgers, automated 3-way invoice matching, banking integration, tax reporting, and cash telemetry.',
      metric: 'Automated Ledger Reconciliation',
      color: 'text-amber-600',
      badge: 'Financial Operations',
    },
    ai: {
      id: 'ai',
      label: 'AI',
      category: 'SYSTEM',
      description: 'Deep cognitive models operating inside the workflow — parsing documents, identifying anomalies, and executing approved tasks.',
      metric: 'Autonomous Coworkers in Logic',
      color: 'text-purple-600',
      badge: 'Cognitive Engine',
    },
    operations: {
      id: 'operations',
      label: 'INTELLIGENT OPERATIONS',
      category: 'OUTCOME',
      description: 'A connected, self-optimizing business environment where humans make high-value decisions and technology eliminates friction.',
      metric: 'Autonomous Real-Time Business',
      color: 'text-emerald-500',
      badge: 'Operational Outcome',
    },
  };

  const currentInfo = NODE_DETAILS[activeNode] || NODE_DETAILS.artify;

  const handleExploreEcosystem = () => {
    if (onNavigateToCapabilities) {
      onNavigateToCapabilities();
    } else {
      const el = document.getElementById('ecosystem');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onOpenSolutionBuilder();
      }
    }
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden bg-background">
      {/* Ambient background soft glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-blue-500/[0.04] dark:bg-blue-500/[0.07] rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-[4%] xl:px-[5%] max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Authoritative Positioning Copy */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code">
              <span>ARTIFY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12] font-display">
              Your business is unique.{' '}
              <span className="block text-[#0066FF]">
                Your technology should be too.
              </span>
            </h1>

            {/* Subheadline / Paragraph */}
            <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal max-w-xl">
              We design enterprise ecosystems around the way your business actually works — connecting people, processes, data, software, AI and operations into one intelligent environment.
            </p>

            {/* 3 Pillars / Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl surface-card border border-card-border shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#0066FF] shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground leading-tight">
                  Bespoke Enterprise Systems
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl surface-card border border-card-border shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground leading-tight">
                  Autonomous AI Workflows
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl surface-card border border-card-border shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground leading-tight">
                  Sovereign Data Architecture
                </span>
              </div>
            </div>

            {/* Hero CTA Buttons - Exactly as requested */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={handleExploreEcosystem}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-95 group"
              >
                <span>Explore the Artify Ecosystem</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenSolutionBuilder}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full surface-card border border-border text-foreground hover:bg-background-subtle font-semibold text-sm transition-all active:scale-95"
              >
                <span>Build Your Ecosystem</span>
                <ArrowRight className="w-4 h-4 text-[#0066FF]" />
              </button>
            </div>
          </div>

          {/* Right Column: Signature Interactive Enterprise Ecosystem Architecture Visual */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            <div className="relative w-full max-w-[620px] mx-auto select-none surface-card rounded-3xl border border-card-border shadow-2xl shadow-blue-500/10 p-5 sm:p-7 backdrop-blur-sm">
              
              {/* Header inside Architecture Panel */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF] animate-pulse" />
                  <span className="text-xs font-bold font-mono-code uppercase tracking-wider text-foreground">
                    ENTERPRISE ECOSYSTEM ARCHITECTURE
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-foreground-muted">
                  Interactive Model • Click Node
                </span>
              </div>

              {/* The Architecture Schematic Visual */}
              <div className="space-y-4 relative">

                {/* Level 1: YOUR BUSINESS */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveNode('business')}
                    className={`px-5 py-2.5 rounded-xl border font-mono-code font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-xs ${
                      activeNode === 'business'
                        ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-lg shadow-blue-500/25 scale-105 ring-2 ring-[#0066FF]/30'
                        : 'surface-card border-border hover:border-[#0066FF]/50 text-foreground'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>YOUR BUSINESS</span>
                  </button>
                </div>

                {/* Central Connector 1 -> 3 Split */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-[#0066FF] to-border" />
                </div>

                {/* Level 2: PEOPLE | PROCESSES | DATA */}
                <div className="relative">
                  {/* Horizontal T-bar Connector */}
                  <div className="hidden sm:block absolute -top-2 left-[15%] right-[15%] h-2 border-t-2 border-x-2 border-border/90 rounded-t-lg pointer-events-none" />

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                      onClick={() => setActiveNode('people')}
                      className={`p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                        activeNode === 'people'
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold scale-105 shadow-md'
                          : 'surface-card border-border hover:border-cyan-500/40 text-foreground-secondary'
                      }`}
                    >
                      <Users className="w-4 h-4 text-cyan-500" />
                      <span className="text-[11px] font-mono-code font-bold tracking-tight">PEOPLE</span>
                    </button>

                    <button
                      onClick={() => setActiveNode('processes')}
                      className={`p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                        activeNode === 'processes'
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold scale-105 shadow-md'
                          : 'surface-card border-border hover:border-indigo-500/40 text-foreground-secondary'
                      }`}
                    >
                      <Cog className="w-4 h-4 text-indigo-500" />
                      <span className="text-[11px] font-mono-code font-bold tracking-tight">PROCESSES</span>
                    </button>

                    <button
                      onClick={() => setActiveNode('data')}
                      className={`p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                        activeNode === 'data'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold scale-105 shadow-md'
                          : 'surface-card border-border hover:border-emerald-500/40 text-foreground-secondary'
                      }`}
                    >
                      <Database className="w-4 h-4 text-emerald-500" />
                      <span className="text-[11px] font-mono-code font-bold tracking-tight">DATA</span>
                    </button>
                  </div>
                </div>

                {/* Converging Connector into Artify Ecosystem */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-border to-[#0066FF]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-ping" />
                </div>

                {/* Level 3: Central Node — ARTIFY ECOSYSTEM */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveNode('artify')}
                    className={`w-full max-w-[340px] py-3.5 px-6 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-md ${
                      activeNode === 'artify'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xl shadow-blue-500/25 scale-[1.02] ring-2 ring-blue-400/40'
                        : 'surface-card border-[#0066FF]/40 text-foreground hover:border-[#0066FF]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-mono-code uppercase font-bold tracking-wider leading-none">
                          ARTIFY ECOSYSTEM
                        </div>
                        <span className="text-[10px] opacity-80 font-mono-code">
                          Central Orchestration Fabric
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/80 shrink-0" />
                  </button>
                </div>

                {/* Diverging Connector to 5 Operational Systems */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-[#0066FF] to-border" />
                </div>

                {/* Level 4: The 5 Enterprise Engines: ERP | CRM | HCMS | FINANCE | AI */}
                <div className="relative">
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {[
                      { id: 'erp' as ArchitectureNodeId, label: 'ERP', icon: Layers, color: 'text-blue-500' },
                      { id: 'crm' as ArchitectureNodeId, label: 'CRM', icon: Briefcase, color: 'text-sky-500' },
                      { id: 'hcms' as ArchitectureNodeId, label: 'HCMS', icon: Users, color: 'text-teal-500' },
                      { id: 'finance' as ArchitectureNodeId, label: 'FINANCE', icon: BadgeDollarSign, color: 'text-amber-500' },
                      { id: 'ai' as ArchitectureNodeId, label: 'AI', icon: Bot, color: 'text-purple-500' },
                    ].map((sys) => {
                      const Icon = sys.icon;
                      const isSelected = activeNode === sys.id;
                      return (
                        <button
                          key={sys.id}
                          onClick={() => setActiveNode(sys.id)}
                          className={`py-2 px-1 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-[#0066FF]/15 border-[#0066FF] text-[#0066FF] font-bold scale-105 shadow-md ring-1 ring-[#0066FF]'
                              : 'surface-card border-border hover:border-[#0066FF]/30 text-foreground-secondary'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${sys.color}`} />
                          <span className="text-[10px] font-mono-code font-bold tracking-tight">
                            {sys.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Connector into Intelligent Operations */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-border to-emerald-500" />
                </div>

                {/* Level 5: Outcome — INTELLIGENT OPERATIONS */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveNode('operations')}
                    className={`px-5 py-2 rounded-xl border font-mono-code font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-xs ${
                      activeNode === 'operations'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/25 scale-105'
                        : 'surface-card border-border hover:border-emerald-500/50 text-foreground'
                    }`}
                  >
                    <Workflow className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>INTELLIGENT OPERATIONS</span>
                  </button>
                </div>

              </div>

              {/* Dynamic Interactive Node Inspection HUD */}
              <div className="mt-5 pt-4 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-background-subtle/70 rounded-2xl p-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code font-bold uppercase text-[#0066FF] px-2 py-0.5 rounded bg-blue-500/10">
                      {currentInfo.badge}
                    </span>
                    <span className="text-xs font-bold text-foreground font-display">
                      {currentInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-secondary leading-snug">
                    {currentInfo.description}
                  </p>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-1.5 self-stretch sm:self-auto justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                  <span className="text-[9px] font-mono-code text-foreground-muted">
                    Telemetry Focus
                  </span>
                  <span className="text-[10px] font-bold text-foreground font-mono-code text-right">
                    {currentInfo.metric}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
