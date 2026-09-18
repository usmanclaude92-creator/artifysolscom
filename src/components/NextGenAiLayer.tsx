import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Bot,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Eye,
  FileSearch,
  Receipt,
  UserCheck,
  AlertTriangle,
  Lightbulb,
  Workflow,
  TrendingUp,
  FileSpreadsheet,
  MessageSquare,
  Network,
  Lock,
} from 'lucide-react';

interface AiWorkflowStep {
  stage: string;
  label: string;
  role: string;
  icon: any;
  description: string;
  isHumanGate?: boolean;
}

export const NextGenAiLayer: React.FC<{ onOpenConsultant?: () => void }> = ({ onOpenConsultant }) => {
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);

  const capabilities = [
    {
      id: 'doc-ai',
      icon: FileSearch,
      title: 'Read & Understand Unstructured Documents',
      badge: 'Cognitive Ingestion',
      description: 'Ingests messy scanned vendor invoices, complex legal contracts, packing slips, customs clearances, and bank guarantees.',
      example: 'Parses a 14-page multi-currency supplier contract, identifies penalty clauses, and matches line-item rates to ERP purchase order.',
      speed: '1.4s parsing time',
      accuracy: '99.85% verified precision',
    },
    {
      id: 'finance-ai',
      icon: Receipt,
      title: 'Extract Financial Data & Prepare Journal Entries',
      badge: 'Autonomous GL',
      description: 'Translates raw invoices, bank statements, and payment receipts into fully balanced double-entry accounting batches.',
      example: 'Extracts VAT amounts, cost center allocations, and prepares GAAP-compliant debit/credit entries for CFO one-click approval.',
      speed: 'Sub-second reconciliation',
      accuracy: 'Deterministic mathematical balance',
    },
    {
      id: 'workforce-ai',
      icon: UserCheck,
      title: 'Analyze Workforce Trends & Attendance Anomalies',
      badge: 'Human Capital Radar',
      description: 'Continuous telemetry on shift rotations, overtime spikes, labor allocation efficiency, and productivity patterns.',
      example: 'Identifies chronic overtime fatigue in the logistics division and dynamically proposes a rebalanced 3-tier shift schedule.',
      speed: 'Continuous real-time stream',
      accuracy: 'Proactive fatigue risk mitigation',
    },
    {
      id: 'anomaly-ai',
      icon: AlertTriangle,
      title: 'Identify Operational & Financial Anomalies',
      badge: 'Risk Sentinel',
      description: 'Performs multi-dimensional statistical variance and fraud checks across millions of transactions in real time.',
      example: 'Flags an unauthorized vendor bank account change request 20 minutes before ACH disbursement, locking the transfer.',
      speed: '12ms inline inspection',
      accuracy: 'Zero false-alarm suppression',
    },
    {
      id: 'insights-ai',
      icon: Lightbulb,
      title: 'Synthesize Cross-Department Management Insights',
      badge: 'Executive Synthesis',
      description: 'Connects sales velocity, supply chain delays, and cash runway into cohesive executive action memos.',
      example: 'Correlates raw material price hikes with product line margins, generating recommended price adjustments per market.',
      speed: 'On-demand conversational BI',
      accuracy: '100% grounded in company data',
    },
    {
      id: 'process-ai',
      icon: Workflow,
      title: 'Automate Complex Multi-System Repetitive Workflows',
      badge: 'Autonomous Execution',
      description: 'Coordinates legacy ERPs, banking portals, government portals (WPS), CRMs, and field apps without brittle screen scrapers.',
      example: 'Takes customer order from WhatsApp, checks warehouse inventory, generates commercial invoice, and books courier pickup.',
      speed: 'End-to-end in 4.2 seconds',
      accuracy: 'Audited deterministic state machine',
    },
    {
      id: 'prediction-ai',
      icon: TrendingUp,
      title: 'Predict Operational Bottlenecks & Cash Trajectories',
      badge: 'Predictive Horizon',
      description: 'Simulates 6, 12, and 18-month scenarios for inventory replenishment, cash runway, and staffing requirements.',
      example: 'Simulates port congestion delays and advises moving 35% of procurement to regional suppliers before stockouts occur.',
      speed: 'Monte Carlo simulations in 800ms',
      accuracy: 'Dynamic continuous calibration',
    },
    {
      id: 'nl-query-ai',
      icon: MessageSquare,
      title: 'Understand Natural-Language Business Requests',
      badge: 'Conversational Enterprise',
      description: 'Allows CEOs, managers, and staff to ask plain-English questions and trigger certified business workflows securely.',
      example: '"Which department exceeded budget by more than 10% this quarter, and why?" — returns root-cause analysis with drill-downs.',
      speed: 'Sub-2s response',
      accuracy: 'Role-based access enforced',
    },
  ];

  const workflowCycle: AiWorkflowStep[] = [
    {
      stage: '01',
      label: 'AI Understands',
      role: 'Contextual Ingestion',
      icon: Brain,
      description: 'Reads data across databases, unstructured documents, live sensors, and conversational requests.',
    },
    {
      stage: '02',
      label: 'AI Analyzes',
      role: 'Cross-Domain Reasoning',
      icon: Cpu,
      description: 'Correlates historic baselines, identifies anomalies, checks compliance rules, and simulates outcomes.',
    },
    {
      stage: '03',
      label: 'AI Recommends',
      role: 'Decision Formulation',
      icon: Sparkles,
      description: 'Drafts exact journal entries, inventory purchase orders, or rota adjustments with verified rationale.',
    },
    {
      stage: '04',
      label: 'Human Approves',
      role: 'Human-in-the-Loop Control',
      icon: ShieldCheck,
      description: 'For all critical financial, operational, or legal actions, human leadership reviews and authorizes with 1 click.',
      isHumanGate: true,
    },
    {
      stage: '05',
      label: 'System Executes',
      role: 'Deterministic Action',
      icon: Workflow,
      description: 'Orchestrates changes across databases, banking channels, ERP ledgers, and notifications instantly.',
    },
    {
      stage: '06',
      label: 'AI Learns',
      role: 'Continuous Evolution',
      icon: TrendingUp,
      description: 'Records outcomes, tunes model weights on internal feedback, and sharpens operational precision.',
    },
  ];

  const activeCap = capabilities[activeCapabilityIndex];

  return (
    <section id="intelligence" data-section="ai-layer" className="py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-sky-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>ENTERPRISE INTELLIGENCE LAYER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            AI is Not a Chatbot.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-sky-400 to-indigo-500">
              It is an Autonomous Intelligence Fabric.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
            We don’t bolt gimmicky widgets onto old software. Artify AI operates as an intelligent nervous system woven across your entire organization—understanding data, detecting risks, automating execution, and elevating human decisions.
          </p>
        </div>

        {/* 6-Stage Core Architecture Loop */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono-code flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              THE ADAPTIVE DECISION & EXECUTION LIFECYCLE
            </span>
            <span className="text-xs text-foreground-muted font-mono-code hidden sm:inline-block">
              Human-Governed • Deterministic Action
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {workflowCycle.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    st.isHumanGate
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg'
                      : 'surface-card border-card-border hover:border-primary/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded ${
                        st.isHumanGate ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'surface-card-subtle text-foreground-muted'
                      }`}>
                        STEP {st.stage}
                      </span>
                      <Icon className={`w-4 h-4 ${st.isHumanGate ? 'text-emerald-500 dark:text-emerald-400' : 'text-primary'}`} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground font-display mb-1">
                      {st.label}
                    </h3>
                    <span className={`text-[10px] font-mono-code block mb-2 ${
                      st.isHumanGate ? 'text-emerald-600 dark:text-emerald-300 font-semibold' : 'text-primary/90'
                    }`}>
                      {st.role}
                    </span>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {st.description}
                    </p>
                  </div>

                  {st.isHumanGate && (
                    <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span>Executive Gate</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Dive Capabilities Showcase */}
        <div className="p-8 sm:p-10 rounded-3xl surface-card border border-card-border shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Capability List */}
            <div className="lg:col-span-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-mono-code block mb-4">
                Core Cognitive Operations:
              </span>
              {capabilities.map((cap, idx) => {
                const Icon = cap.icon;
                const isSelected = activeCapabilityIndex === idx;
                return (
                  <button
                    key={cap.id}
                    onClick={() => setActiveCapabilityIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3.5 group ${
                      isSelected
                        ? 'surface-card-subtle border-2 border-primary shadow-md text-foreground'
                        : 'surface-card border-card-border hover:border-primary/30 text-foreground-secondary'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'surface-card text-foreground-muted group-hover:text-primary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate group-hover:text-primary">
                        {cap.title}
                      </div>
                      <span className="text-[10px] font-mono-code text-foreground-muted">
                        {cap.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Interactive Deep-Dive Preview */}
            <div className="lg:col-span-6 p-7 rounded-2xl surface-card-subtle border border-primary/30 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <activeCap.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground font-mono-code">
                    {activeCap.badge}
                  </span>
                </div>
                <span className="text-xs font-mono-code text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                  {activeCap.speed}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground font-display mb-3">
                {activeCap.title}
              </h3>

              <p className="text-sm text-foreground-secondary leading-relaxed mb-6">
                {activeCap.description}
              </p>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/25 mb-6">
                <span className="text-[11px] font-bold text-primary uppercase font-mono-code block mb-1">
                  Live Enterprise Scenario:
                </span>
                <p className="text-xs text-foreground-secondary leading-relaxed font-normal">
                  "{activeCap.example}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                <span className="text-foreground-muted font-mono-code">Verified Accuracy:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono-code">
                  {activeCap.accuracy}
                </span>
              </div>

              {onOpenConsultant && (
                <button
                  onClick={onOpenConsultant}
                  className="w-full mt-6 py-2.5 px-4 rounded-xl btn-theme-primary text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test In Interactive AI Advisor</span>
                </button>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
