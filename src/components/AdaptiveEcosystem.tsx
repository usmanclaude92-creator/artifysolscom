import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ArrowRight,
  Database,
  Cpu,
  Bot,
  DollarSign,
  Users,
  Briefcase,
  ShoppingCart,
  Boxes,
  Workflow,
  BarChart3,
  Smartphone,
  Sparkles,
  FileCheck2,
  LayoutGrid,
  CheckCircle2,
  Network,
  Share2,
} from 'lucide-react';

export interface EcosystemModule {
  id: string;
  name: string;
  category: 'core' | 'operations' | 'intelligence' | 'experience';
  icon: any;
  summary: string;
  capabilities: string[];
  autonomousActions: string;
  integratesWith: string[];
  status: string;
}

export const ECOSYSTEM_MODULES: EcosystemModule[] = [
  {
    id: 'erp',
    name: 'Enterprise Resource Planning',
    category: 'core',
    icon: LayoutGrid,
    summary: 'Unified central ledger, multi-entity master data, and operational backbone.',
    capabilities: ['Multi-company consolidations', 'Real-time chart of accounts', 'Audit trails & versioned ledgers', 'Configurable dimension tagging'],
    autonomousActions: 'Reconciles cross-entity balances and detects ledger variances continuously.',
    integratesWith: ['Finance', 'Procurement', 'Inventory', 'Payroll'],
    status: 'Live Sync',
  },
  {
    id: 'hcm',
    name: 'Human Capital Management',
    category: 'core',
    icon: Users,
    summary: 'End-to-end talent lifecycle, organizational topology, and executive succession.',
    capabilities: ['Dynamic org charts', 'Skill matrix tracking', 'Onboarding/offboarding pipelines', 'Performance calibration'],
    autonomousActions: 'Matches internal talent to project demands and automates onboarding verification.',
    integratesWith: ['Workforce', 'Payroll', 'BI'],
    status: 'Active Mesh',
  },
  {
    id: 'workforce',
    name: 'Workforce Management',
    category: 'core',
    icon: Users,
    summary: 'Shift scheduling, dynamic rota management, attendance, and compliance monitoring.',
    capabilities: ['Predictive rota allocation', 'Overtime threshold guards', 'Geo-verified time clock', 'Leave & shift swap desk'],
    autonomousActions: 'Forecasts staffing shortages 14 days in advance and recommends balanced shift schedules.',
    integratesWith: ['HCM', 'Payroll & WPS', 'Mobile Workforce'],
    status: 'Active Mesh',
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    category: 'core',
    icon: DollarSign,
    summary: 'Automated general ledger, accounts payable/receivable, treasury, and tax.',
    capabilities: ['Autonomous invoice matching', 'Bank statement reconciliation', 'Cash runway projections', 'Tax & statutory compliance'],
    autonomousActions: 'Pre-verifies 3-way matching and drafts GAAP/IFRS-compliant journal entries.',
    integratesWith: ['ERP', 'Procurement', 'Sales & CRM', 'BI'],
    status: 'Zero-Touch',
  },
  {
    id: 'payroll',
    name: 'Payroll & WPS',
    category: 'core',
    icon: DollarSign,
    summary: 'Statutory compliance, direct bank transfers, deductions, and WPS generation.',
    capabilities: ['Automated SIF / WPS file generation', 'Variable pay & commission computing', 'Tax withholding tables', 'End-of-service gratuity calc'],
    autonomousActions: 'Validates wage protection compliance and flags discrepancies prior to payroll disbursement.',
    integratesWith: ['Workforce', 'HCM', 'Finance'],
    status: 'Guarded Flow',
  },
  {
    id: 'procurement',
    name: 'Procurement',
    category: 'operations',
    icon: ShoppingCart,
    summary: 'Strategic sourcing, RFQ orchestration, vendor scorecards, and purchase contracts.',
    capabilities: ['Vendor SLA evaluation', 'Auto-RFQ distribution', 'Contract term tracking', 'Catalog management'],
    autonomousActions: 'Compares supplier price quotes semantically and recommends optimal purchase splits.',
    integratesWith: ['Inventory', 'Finance', 'Operations'],
    status: 'Active Mesh',
  },
  {
    id: 'sales-crm',
    name: 'Sales & CRM',
    category: 'operations',
    icon: Briefcase,
    summary: 'Pipeline intelligence, relationship telemetry, CPQ, and contract lifecycles.',
    capabilities: ['Conversational pipeline inspection', 'Dynamic deal scoring', 'Automated proposal drafting', 'Customer retention radar'],
    autonomousActions: 'Identifies deal stall signals and generates bespoke win-back strategies.',
    integratesWith: ['ERP', 'Finance', 'BI'],
    status: 'Real-Time Sync',
  },
  {
    id: 'inventory',
    name: 'Inventory & Supply Chain',
    category: 'operations',
    icon: Boxes,
    summary: 'Multi-warehouse logistics, batch/lot tracking, lead-time forecasting, and fulfillment.',
    capabilities: ['Safety stock auto-replenishment', 'Serial & lot tracking', 'Multi-echelon distribution', 'Transit visibility'],
    autonomousActions: 'Adjusts reorder thresholds automatically based on demand shifts and seasonal trends.',
    integratesWith: ['Procurement', 'ERP', 'Operations'],
    status: 'Live Stream',
  },
  {
    id: 'projects',
    name: 'Projects & Operations',
    category: 'operations',
    icon: Workflow,
    summary: 'Resource allocation, milestone profitability, critical-path monitoring, and SLAs.',
    capabilities: ['Gantt & Kanban state machines', 'Burn rate vs budget tracking', 'Deliverable gate approvals', 'Contractor billing sync'],
    autonomousActions: 'Detects scope creep and schedule bottlenecks before they impact project margins.',
    integratesWith: ['Workforce', 'Finance', 'Procurement'],
    status: 'Active Flow',
  },
  {
    id: 'bi',
    name: 'Business Intelligence',
    category: 'intelligence',
    icon: BarChart3,
    summary: 'Cross-functional operational intelligence, instant root-cause analysis, and analytics.',
    capabilities: ['Conversational natural language querying', 'Automated anomaly detection', 'Predictive cohort models', 'Self-generating dashboards'],
    autonomousActions: 'Synthesizes multi-department KPIs and surfaces hidden root causes within seconds.',
    integratesWith: ['All Ecosystem Modules'],
    status: 'Continuous Link',
  },
  {
    id: 'mobile',
    name: 'Mobile Workforce',
    category: 'experience',
    icon: Smartphone,
    summary: 'Native iOS & Android apps for field technicians, floor operators, and executive signoffs.',
    capabilities: ['Offline-first sync engine', 'Biometric signoff & geolocation', 'Instant mobile ticket dispatch', 'Camera receipt & barcode capture'],
    autonomousActions: 'Caches local states securely and auto-merges transaction logs when reconnected.',
    integratesWith: ['Workforce', 'Projects', 'Inventory'],
    status: 'Edge Connected',
  },
  {
    id: 'ai-automation',
    name: 'Autonomous Orchestration',
    category: 'intelligence',
    icon: Bot,
    summary: 'Self-orchestrating agent swarms executing repetitive multi-system operations with zero lag.',
    capabilities: ['Multi-agent tool orchestration', 'Deterministic policy enforcement', 'Natural-language event triggers', 'Human-in-the-loop review queues'],
    autonomousActions: 'Choreographs multi-system workflows end-to-end with verified compliance and audit logging.',
    integratesWith: ['All Ecosystem Modules'],
    status: 'Neural Core',
  },
  {
    id: 'doc-intelligence',
    name: 'Document Intelligence',
    category: 'intelligence',
    icon: FileCheck2,
    summary: 'Cognitive parser extracting unstructured invoices, bills of lading, contracts, and permits.',
    capabilities: ['Multi-language OCR & extraction', 'Semantic clause validation', 'Table & line-item parsing', 'Direct ledger entry generation'],
    autonomousActions: 'Parses complex multi-page financial PDFs and auto-populates ERP records with 99.8% precision.',
    integratesWith: ['Finance', 'Procurement', 'Legal'],
    status: 'Cognitive Engine',
  },
  {
    id: 'dashboards',
    name: 'Management Dashboards',
    category: 'experience',
    icon: LayoutGrid,
    summary: 'Role-customized control centers for C-suite, operations directors, and department heads.',
    capabilities: ['Real-time liquidity heatmaps', 'Operational bottleneck radar', 'Live department burn telemetry', 'One-click executive exports'],
    autonomousActions: 'Assembles morning briefings and critical alerts tailored specifically to each executive role.',
    integratesWith: ['BI', 'Finance', 'Workforce', 'Sales'],
    status: 'Live View',
  },
  {
    id: 'industry',
    name: 'Industry-Specific Solutions',
    category: 'core',
    icon: Briefcase,
    summary: 'Specialized business workflows for construction, logistics, trading, manufacturing, and health.',
    capabilities: ['Subcontractor retainage & claims', 'Bill of Materials & batch processing', 'L/C & trade finance modules', 'Equipment maintenance lifecycles'],
    autonomousActions: 'Applies industry-specific regulatory validations without changing core data schemas.',
    integratesWith: ['All Ecosystem Modules'],
    status: 'Tailored',
  },
  {
    id: 'custom-apps',
    name: 'Custom Enterprise Applications',
    category: 'core',
    icon: Sparkles,
    summary: 'Bespoke micro-services, customer portals, and proprietary algorithmic workflows.',
    capabilities: ['Microservices on private VPC', 'Custom data models & schemas', 'External partner API meshes', 'Custom security & RBAC gates'],
    autonomousActions: 'Evolves database structures and API schemas as unique enterprise operations change.',
    integratesWith: ['External Systems & APIs', 'Core Ledger'],
    status: '100% Bespoke',
  },
];

interface AdaptiveEcosystemProps {
  onOpenSolutionBuilder?: () => void;
  onNavigateToContact?: () => void;
}

export const AdaptiveEcosystem: React.FC<AdaptiveEcosystemProps> = ({
  onOpenSolutionBuilder,
  onNavigateToContact,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('erp');
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'operations' | 'intelligence' | 'experience'>('all');

  const activeModule = ECOSYSTEM_MODULES.find((m) => m.id === activeModuleId) || ECOSYSTEM_MODULES[0];

  const filteredModules = ECOSYSTEM_MODULES.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.category === activeFilter;
  });

  return (
    <section id="ecosystem" className="py-28 bg-[#040407] border-t border-white/[0.06] relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-700/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Network className="w-3.5 h-3.5 text-violet-400" />
              <span>THE ADAPTIVE ENTERPRISE ECOSYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display mb-4">
              Not Isolated Software.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-200 to-sky-400">
                An Interconnected Living Ecosystem.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Every business area operates as a specialized node in a unified intelligence mesh. Modules function independently while sharing live data, context, and autonomous coordination without integration friction.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] self-start md:self-end">
            {(['all', 'core', 'operations', 'intelligence', 'experience'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-semibold capitalize px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === cat
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat === 'all' ? 'All 16 Nodes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 16 Module Nodes Bento Selector */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredModules.map((mod) => {
              const Icon = mod.icon;
              const isSelected = mod.id === activeModule.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  id={`eco-node-${mod.id}`}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[110px] group ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-950/60 to-[#0e0e18] border-violet-500/70 shadow-lg shadow-violet-950/50 scale-[1.02]'
                      : 'bg-[#09090f]/80 border-white/[0.07] hover:border-violet-500/30 hover:bg-[#11111a]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/[0.05] text-zinc-400 group-hover:text-violet-300 group-hover:bg-violet-950/30'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono-code font-semibold px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400">
                      {mod.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-violet-200 line-clamp-1 leading-snug">
                      {mod.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono-code capitalize mt-0.5">
                      {mod.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Active Node Telemetry Card */}
          <div className="lg:col-span-5 sticky top-28 p-7 rounded-2xl bg-gradient-to-b from-[#0d0d16] to-[#08080d] border border-violet-500/30 shadow-2xl relative overflow-hidden">
            {/* Ambient accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400" />

            <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center">
                  <activeModule.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono-code font-bold tracking-wider text-violet-400">
                    ECOSYSTEM NODE
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {activeModule.name}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono-code px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                ● {activeModule.status}
              </span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
              {activeModule.summary}
            </p>

            {/* Core Capabilities */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono-code block mb-3">
                Core Capabilities & Architecture:
              </span>
              <div className="space-y-2">
                {activeModule.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Autonomous Action */}
            <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-700/30 mb-6">
              <div className="flex items-center gap-1.5 text-violet-300 text-xs font-bold mb-1 font-mono-code uppercase">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Autonomous Layer Action:</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                {activeModule.autonomousActions}
              </p>
            </div>

            {/* Mesh Interconnects */}
            <div className="mb-6 pb-6 border-b border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono-code block mb-2">
                Real-Time Data Interconnects:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeModule.integratesWith.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-medium"
                  >
                    ↔ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {onOpenSolutionBuilder && (
                <button
                  onClick={onOpenSolutionBuilder}
                  id="eco-configure-btn"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30"
                >
                  <span>Configure In Wizard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onNavigateToContact && (
                <button
                  onClick={onNavigateToContact}
                  id="eco-consult-btn"
                  className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold border border-white/[0.1] transition-colors"
                >
                  Consult Engineers
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
