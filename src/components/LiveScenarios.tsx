import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  DollarSign,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  BarChart3,
  Bot,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  category: string;
  icon: any;
  prompt: string;
  triggerEvent: string;
  agentsInvolved: string[];
  executionSteps: { step: string; outcome: string; duration: string }[];
  totalTime: string;
  businessImpact: string;
}

export const WORKFLOW_SCENARIOS: Scenario[] = [
  {
    id: 'invoice-recon',
    title: 'Autonomous Supplier Invoice Matching & Settlement',
    category: 'Finance & Treasury',
    icon: FileText,
    prompt: '50-page complex PDF supplier invoice arrives with varying VAT and item codes.',
    triggerEvent: 'Vendor sends PDF invoice via email / EDI / WhatsApp gateway',
    agentsInvolved: ['Cognitive Document Parser', 'Tax & Currency Normalizer', '3-Way ERP Matcher', 'Treasury Sentinel'],
    executionSteps: [
      { step: 'Document Ingestion & OCR', outcome: 'Extracted 142 line items, tax numbers, and bank account credentials.', duration: '410ms' },
      { step: '3-Way Match Verification', outcome: 'Cross-checked PO #4891 and Warehouse Receiving Note #112. Confirmed 100% quantity and unit rate alignment.', duration: '320ms' },
      { step: 'Tax & Compliance Audit', outcome: 'Verified supplier VAT registration and recalculated withholding tax accurately.', duration: '180ms' },
      { step: 'Draft Journal Entry', outcome: 'Staged balanced double-entry accounting batch for Accounts Payable ledger.', duration: '140ms' },
      { step: 'Executive Sign-off Dispatch', outcome: 'Pushed notification with one-click approval to CFO mobile device.', duration: '90ms' },
    ],
    totalTime: '1.14 seconds total runtime',
    businessImpact: 'Eliminates 4 hours of manual data entry; prevents duplicate disbursements.',
  },
  {
    id: 'workforce-shift',
    title: 'Predictive Workforce Scheduling & Overtime Guard',
    category: 'Workforce & HR',
    icon: Users,
    prompt: 'Surge in production orders requires 30% additional labor capacity next weekend.',
    triggerEvent: 'ERP flags production schedule acceleration in assembly plant B',
    agentsInvolved: ['Production Demand Sensor', 'Labor Compliance Guard', 'Smart Rota Allocator', 'SMS/WhatsApp Dispatcher'],
    executionSteps: [
      { step: 'Demand Spike Detection', outcome: 'Detected 450 machine-hour deficit for incoming Friday-Sunday production runs.', duration: '280ms' },
      { step: 'Overtime Policy Audit', outcome: 'Filtered 180 available technicians against weekly statutory maximum hours.', duration: '210ms' },
      { step: 'Optimal Rota Synthesis', outcome: 'Generated balanced 3-shift roster minimizing overtime premium costs.', duration: '340ms' },
      { step: 'Automated Shift Request', outcome: 'Dispatched automated shift invitations via WhatsApp to eligible technicians.', duration: '250ms' },
      { step: 'Attendance Roster Updated', outcome: 'Confirmed 28 technician acceptances and updated biometric gate sync.', duration: '420ms' },
    ],
    totalTime: '1.50 seconds execution mesh',
    businessImpact: 'Maintains 100% labor law compliance; eliminates production bottleneck.',
  },
  {
    id: 'anomaly-sentinel',
    title: 'Continuous Anomaly Detection & Fraud Prevention',
    category: 'Risk & Operations',
    icon: AlertTriangle,
    prompt: 'Sudden vendor bank account change submitted moments before payment cycle.',
    triggerEvent: 'Incoming update request on vendor profile banking credentials',
    agentsInvolved: ['Profile Audit Sentinel', 'Fraud & Risk Scorer', 'Payment Intercept Gateway', 'Security Desk Dispath'],
    executionSteps: [
      { step: 'Heuristic Risk Scoring', outcome: 'Identified that banking jurisdiction differs from registered incorporation country.', duration: '120ms' },
      { step: 'Disbursement Intercept', outcome: 'Placed temporary automated hold on $84,500 ACH scheduled for processing.', duration: '80ms' },
      { step: 'Out-of-Band Verification', outcome: 'Generated secondary challenge request via registered corporate phone number.', duration: '150ms' },
      { step: 'Executive Alert Generated', outcome: 'Alerted Head of Internal Audit with cryptographic audit trail of the event.', duration: '110ms' },
    ],
    totalTime: '460ms inline interception',
    businessImpact: 'Prevents business email compromise (BEC) and unauthorized fund transfer.',
  },
  {
    id: 'c-suite-query',
    title: 'Instant Natural Language Business Intelligence',
    category: 'Executive Intelligence',
    icon: Sparkles,
    prompt: 'CEO asks: "What caused our gross margin dip in regional retail this month?"',
    triggerEvent: 'Spoken or typed natural-language query in CEO Mobile App',
    agentsInvolved: ['Semantic Intent Parser', 'Multi-Ledger Query Engine', 'Variance Attribution Model', 'Executive Briefing Scribe'],
    executionSteps: [
      { step: 'Query Decomposition', outcome: 'Identified metrics: Gross Margin, Region: West, Timeframe: Current MTD.', duration: '190ms' },
      { step: 'Multi-Source Aggregation', outcome: 'Queried POS transaction feeds, inventory COGS updates, and shipping demurrage fees.', duration: '480ms' },
      { step: 'Variance Root Cause', outcome: 'Isolated $32,000 emergency airfreight logistics charge on 2 high-volume SKUs.', duration: '310ms' },
      { step: 'Chart & Briefing Delivery', outcome: 'Returned conversational answer with interactive waterfall breakdown in 1.4s.', duration: '420ms' },
    ],
    totalTime: '1.40 seconds conversational reply',
    businessImpact: 'Replaces 3-day manual BI analyst report turnaround with instant clarity.',
  },
];

interface LiveScenariosProps {
  onOpenSolutionBuilder?: () => void;
  onNavigateToContact?: () => void;
}

export const LiveScenarios: React.FC<LiveScenariosProps> = ({
  onOpenSolutionBuilder,
  onNavigateToContact,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectScenario = (idx: number) => {
    if (idx === selectedScenarioIndex && !isLoading) return;
    setIsLoading(true);
    setSelectedScenarioIndex(idx);
    setTimeout(() => {
      setIsLoading(false);
    }, 380);
  };

  const handleReRunSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 420);
  };

  const activeScenario = WORKFLOW_SCENARIOS[selectedScenarioIndex] || WORKFLOW_SCENARIOS[0];
  const Icon = activeScenario.icon;

  return (
    <section id="scenarios" className="py-14 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background illumination */}
      <div className="absolute top-1/3 right-1/4 w-[650px] h-[650px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Workflow className="w-3.5 h-3.5 text-primary" />
            <span>REAL-WORLD ENTERPRISE SCENARIOS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            See How the Ecosystem Works in Real Life.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500">
              Autonomous, Fast, and Completely Governed.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
            Select a common enterprise scenario below to watch how Artify's multi-agent intelligence mesh coordinates documents, compliance, ledger entries, and human approvals end-to-end.
          </p>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {WORKFLOW_SCENARIOS.map((sc, idx) => {
            const ScIcon = sc.icon;
            const isSelected = idx === selectedScenarioIndex;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(idx)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'surface-card border-2 border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'surface-card-subtle border-card-border hover:border-primary/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-mono-code font-bold px-2 py-0.5 rounded surface-card border border-border text-primary">
                      {sc.category}
                    </span>
                    <ScIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2 mb-2">
                    {sc.title}
                  </h3>
                </div>

                <div className="text-[11px] font-mono-code text-emerald-600 dark:text-emerald-400 font-semibold">
                  ⚡ {sc.totalTime}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Execution Walkthrough */}
        <div className="p-8 sm:p-10 rounded-3xl surface-card border border-primary/30 shadow-2xl relative min-h-[480px]">
          {isLoading ? (
            /* Skeleton Loader */
            <div className="animate-pulse space-y-8" aria-label="Loading scenario choreography..." role="status">
              {/* Header Skeleton */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-border gap-4">
                <div className="space-y-3 w-full max-w-xl">
                  <div className="h-4 w-48 bg-primary/20 rounded-full" />
                  <div className="h-7 w-3/4 bg-foreground/15 rounded-lg" />
                </div>
                <div className="h-8 w-32 bg-primary/10 rounded-lg self-start lg:self-auto" />
              </div>

              {/* Context Box Skeleton */}
              <div className="p-4 rounded-xl surface-container-accent border border-primary/20 space-y-2">
                <div className="h-3.5 w-32 bg-primary/20 rounded" />
                <div className="h-3.5 w-5/6 bg-foreground/10 rounded" />
              </div>

              {/* Stepped Choreography Skeleton */}
              <div className="space-y-3">
                <div className="h-3.5 w-48 bg-foreground/15 rounded mb-3" />
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className="p-4 rounded-xl surface-container-sunken border border-container-sunken-border flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-6 h-6 rounded-full bg-primary/20 shrink-0" />
                      <div className="space-y-1.5 w-3/4">
                        <div className="h-3.5 w-1/3 bg-foreground/15 rounded" />
                        <div className="h-3 w-4/5 bg-foreground/10 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-16 bg-primary/15 rounded shrink-0" />
                  </div>
                ))}
              </div>

              {/* Footer Skeleton */}
              <div className="p-5 rounded-2xl surface-card-subtle border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 bg-foreground/10 rounded" />
                    <div className="h-3.5 w-56 bg-foreground/15 rounded" />
                  </div>
                </div>
                <div className="h-9 w-32 bg-primary/20 rounded-xl" />
              </div>
            </div>
          ) : (
            <>
              {/* Scenario Overview Banner */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
                <div>
                  <div className="flex items-center gap-2 text-primary text-xs font-mono-code font-bold uppercase mb-1">
                    <Icon className="w-4 h-4" />
                    <span>Trigger Event: {activeScenario.triggerEvent}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground font-display">
                    {activeScenario.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReRunSimulation}
                    className="p-2 rounded-xl border border-border hover:border-primary/40 text-foreground-muted hover:text-foreground text-xs font-mono-code flex items-center gap-1.5 transition-colors"
                    title="Re-run live scenario simulation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Simulate Run</span>
                  </button>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono-code text-foreground-muted block">Total Runtime</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono-code">
                      {activeScenario.totalTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prompt / Context */}
              <div className="p-4 rounded-xl surface-container-accent border border-primary/25 mb-8 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed font-normal">
                  <strong className="text-foreground">Commercial Context: </strong>
                  {activeScenario.prompt}
                </p>
              </div>

              {/* Stepped Choreography Grid */}
              <div className="space-y-3 mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-mono-code block mb-3">
                  Autonomous Stepped Orchestration:
                </span>
                {activeScenario.executionSteps.map((st, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl surface-container-sunken border border-container-sunken-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="text-xs font-mono-code font-bold w-6 h-6 rounded-full bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">
                          {st.step}
                        </h4>
                        <p className="text-xs text-foreground-muted mt-0.5">
                          {st.outcome}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <span className="text-[11px] font-mono-code text-foreground-muted surface-card border border-border px-2 py-0.5 rounded">
                        {st.duration}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Business Impact & Action */}
              <div className="p-5 rounded-2xl surface-card-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-foreground-muted font-bold block">
                      Commercial Business Outcome
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {activeScenario.businessImpact}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenSolutionBuilder && (
                    <button
                      onClick={onOpenSolutionBuilder}
                      className="px-4 py-2.5 rounded-xl btn-theme-primary text-xs font-bold transition-all shadow-md shadow-primary/25"
                    >
                      Configure In Wizard
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
};
