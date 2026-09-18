import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Workflow,
  Briefcase,
  Boxes,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Bot,
  Zap,
  Activity,
  Layers,
  Database,
  ArrowUpRight,
  TrendingUp,
  FileText,
  BarChart3,
  Network,
} from 'lucide-react';
import {
  ECOSYSTEM_NODES,
  ARTIFY_INTELLIGENCE_CAPABILITIES,
  EcosystemNodeDefinition,
} from '../../data/solutionsMenuData';

interface EcosystemArchitectureExplorerProps {
  onOpenSolutionBuilder?: () => void;
  onNavigateToContact?: () => void;
  onOpenConsultant?: () => void;
  theme?: 'dark' | 'light';
}

const ICON_MAP: Record<string, React.ElementType> = {
  DollarSign,
  Users,
  Workflow,
  Briefcase,
  Boxes,
  Truck,
  Sparkles,
  Layers,
  Database,
  TrendingUp,
  FileText,
  BarChart3,
  Network,
  Cpu,
  Bot,
  Zap,
  Activity,
  ShieldCheck,
};

export const EcosystemArchitectureExplorer: React.FC<EcosystemArchitectureExplorerProps> = ({
  onOpenSolutionBuilder,
  onNavigateToContact,
  onOpenConsultant,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [selectedPillarId, setSelectedPillarId] = useState<string>('intelligence');

  const activeNode: EcosystemNodeDefinition =
    ECOSYSTEM_NODES.find((n) => n.id === selectedPillarId) || ECOSYSTEM_NODES[6];
  const ActiveIcon = ICON_MAP[activeNode.icon] || Sparkles;

  return (
    <section id="ecosystem-architecture" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[92%] sm:w-[88%] max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4 font-mono-code">
            <Network className="w-3.5 h-3.5 text-violet-400" />
            <span>The Artify Ecosystem • 7 Interconnected Pillars</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight leading-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            One Connected Platform. Seven Interlocking Capabilities.
          </h2>

          <p className={`mt-3 text-base sm:text-lg leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            Click or select any pillar below to inspect how data and autonomous agents communicate across your enterprise in real time.
          </p>
        </div>

        {/* 7 Pillars Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {ECOSYSTEM_NODES.map((node) => {
            const PIcon = ICON_MAP[node.icon] || Sparkles;
            const isSelected = selectedPillarId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedPillarId(node.id)}
                id={`ecosystem-pillar-${node.id}`}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-200 group cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? isLight
                      ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-600/25 -translate-y-1'
                      : 'bg-violet-600 text-white border-violet-500 shadow-xl shadow-violet-600/35 -translate-y-1'
                    : isLight
                    ? 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-slate-50'
                    : 'bg-[#101018] text-zinc-300 border-white/[0.08] hover:border-violet-500/40 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-110 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isLight
                      ? 'bg-violet-50 text-violet-600 border border-violet-100'
                      : 'bg-violet-950/40 text-violet-400 border border-violet-500/20'
                  }`}
                >
                  <PIcon className="w-5 h-5" />
                </div>

                <span className="text-xs sm:text-sm font-bold tracking-tight">
                  {node.label}
                </span>
                <span className={`text-[10px] font-mono-code mt-0.5 ${
                  isSelected ? 'text-violet-100' : isLight ? 'text-slate-500' : 'text-zinc-500'
                }`}>
                  {node.tagline}
                </span>

                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1.5 left-1/2 -translate-x-1/2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Inspection Card */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden mb-12 transition-all duration-300 ${
            isLight
              ? 'bg-gradient-to-br from-violet-50 via-white to-indigo-50/70 border-violet-200 shadow-xl shadow-slate-200/50'
              : 'bg-gradient-to-br from-[#121124] via-[#0d0c18] to-[#090812] border-violet-500/30 shadow-2xl shadow-black/80'
          }`}
        >
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-violet-500/15 mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
                  isLight
                    ? 'bg-violet-600 text-white shadow-violet-600/30'
                    : 'bg-violet-600 text-white shadow-violet-600/40'
                }`}
              >
                <ActiveIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-xl sm:text-2xl font-bold font-display ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {activeNode.label}
                  </h3>
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    Active Pillar
                  </span>
                </div>
                <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {activeNode.tagline}
                </p>
              </div>
            </div>

            {/* Synced with tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                SYNCS IN REAL TIME WITH:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeNode.connections.map((conn) => (
                  <span
                    key={conn}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-white/[0.06] border-white/[0.1] text-zinc-200'
                    }`}
                  >
                    {conn}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Details 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              className={`p-5 rounded-2xl border ${
                isLight ? 'bg-white/90 border-slate-200' : 'bg-white/[0.03] border-white/[0.06]'
              }`}
            >
              <span className="text-xs font-mono-code uppercase font-bold text-violet-500 dark:text-violet-400 tracking-wider block mb-1.5">
                Operational Relationship
              </span>
              <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                {activeNode.relationship}
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                isLight ? 'bg-white/90 border-slate-200' : 'bg-white/[0.03] border-white/[0.06]'
              }`}
            >
              <span className="text-xs font-mono-code uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider block mb-1.5">
                Core Autonomous Capability
              </span>
              <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                {activeNode.capability}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {onOpenSolutionBuilder && (
              <button
                onClick={onOpenSolutionBuilder}
                id="pillar-build-solution-btn"
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Adaptive Solution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onNavigateToContact && (
              <button
                onClick={onNavigateToContact}
                id="pillar-full-architecture-btn"
                className={`px-6 py-3 rounded-xl font-bold text-sm border transition-all active:scale-95 ${
                  isLight
                    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                    : 'bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.1]'
                }`}
              >
                Request Architecture Assessment
              </button>
            )}

            {onOpenConsultant && (
              <button
                onClick={onOpenConsultant}
                id="pillar-consultant-btn"
                className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  isLight
                    ? 'text-violet-700 hover:bg-violet-50'
                    : 'text-violet-300 hover:bg-violet-950/40'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Advisor About This Pillar</span>
              </button>
            )}
          </div>
        </div>

        {/* Cross-Platform Intelligence Fabric Card */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border ${
            isLight
              ? 'bg-white border-slate-200 shadow-lg'
              : 'bg-[#0f0e1a] border-white/[0.08] shadow-2xl'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-violet-500/15 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/15 text-violet-400 border border-violet-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-lg sm:text-xl font-bold font-display ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Artify Intelligence: Cross-Platform Fabric
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  Cross-ecosystem autonomous intelligence layer powering continuous operational learning
                </p>
              </div>
            </div>

            <span className="text-xs font-mono-code px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 self-start md:self-auto">
              Autonomous Layer
            </span>
          </div>

          <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            Intelligence works across the entire Artify ecosystem rather than as a standalone chatbot. It continuously reasons over operational records to power:
          </p>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {ARTIFY_INTELLIGENCE_CAPABILITIES.map((cap) => {
              const CapIcon = ICON_MAP[cap.iconName] || Sparkles;
              return (
                <div
                  key={cap.title}
                  className={`p-4 rounded-2xl border transition-all hover:border-violet-400/50 ${
                    isLight
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-white/[0.03] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/15 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CapIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {cap.title}
                      </h5>
                      <p className={`text-xs leading-relaxed mt-1 ${
                        isLight ? 'text-slate-600' : 'text-zinc-400'
                      }`}>
                        {cap.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification / Security badges */}
          <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code ${
            isLight ? 'border-slate-200 text-slate-500' : 'border-white/[0.06] text-zinc-400'
          }`}>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                SOC2 Type II Aligned
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                Sovereign Private Cloud
              </span>
              <span>•</span>
              <span>Continuous Workflow Adaptability</span>
            </div>

            <span className="text-violet-400 font-semibold">
              Zero Third-Party Model Training
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
