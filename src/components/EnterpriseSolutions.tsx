import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Boxes,
  Briefcase,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export interface SolutionCategory {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  color: string;
  description: string;
  modules: string[];
  metrics: string;
  outcomes: string[];
}

export const ENTERPRISE_SOLUTION_CATEGORIES: SolutionCategory[] = [
  {
    id: 'financial',
    name: 'Financial Ecosystem',
    tagline: 'Precision treasury, accounting, statutory compliance & automated GL',
    icon: DollarSign,
    color: '#10B981',
    description: 'Transform financial operations from a backward-looking compliance burden into a real-time strategic command center with continuous auditing and liquidity modeling.',
    modules: ['General Ledger & Multi-Entity Consolidation', 'Accounts Payable & 3-Way Auto-Match', 'Accounts Receivable & Collection Intelligence', 'Treasury & Cash Flow Projections', 'Tax Compliance & Statutory Filing'],
    metrics: '99.4% Touchless Reconciliation',
    outcomes: ['Close monthly books in 2 days instead of 18 days', 'Zero duplicate invoice disbursements with automated sentinel', 'Real-time multi-currency consolidated balance sheets'],
  },
  {
    id: 'people',
    name: 'People & Workforce Ecosystem',
    tagline: 'HR, intelligent workforce deployment, payroll, WPS & mobile check-ins',
    icon: Users,
    color: '#8B5CF6',
    description: 'Seamlessly coordinate human capital from corporate executive desks to distributed field and industrial shifts with automated labor compliance and biometric verification.',
    modules: ['Core HR & Organizational Topology', 'Workforce Scheduling & Rota Optimization', 'Payroll & Wage Protection System (WPS)', 'Biometric & Geofenced Mobile Attendance', 'Employee Self-Service & Talent Matrix'],
    metrics: '100% Wage Protection Compliance',
    outcomes: ['Eliminate shift scheduling friction and overtime penalties', 'Auto-generate verified WPS / SIF bank files in 1 click', 'Real-time labor cost visibility against project budgets'],
  },
  {
    id: 'operations',
    name: 'Operations Ecosystem',
    tagline: 'Projects, procurement, multi-warehouse inventory & supply chain logistics',
    icon: Boxes,
    color: '#38BDF8',
    description: 'Connect procurement, warehouse logistics, project milestones, and physical asset lifecycles into a single operational mesh with predictive lead-time tracking.',
    modules: ['Multi-Warehouse Inventory & Lot Tracking', 'Strategic Procurement & Auto-RFQ', 'Project Profitability & Critical Path Gantt', 'Manufacturing & Bill of Materials (BOM)', 'Asset Maintenance & Depreciation Lifecycles'],
    metrics: '35% Reduction in Supply Lead Times',
    outcomes: ['Prevent production stockouts with dynamic buffer thresholds', 'Track project burn rates against contract billing gates', 'Automate supplier quote comparisons across 10+ vendors'],
  },
  {
    id: 'customer',
    name: 'Customer Ecosystem',
    tagline: 'Enterprise CRM, pipeline telemetry, CPQ proposals & client engagement',
    icon: Briefcase,
    color: '#F59E0B',
    description: 'Empower sales and account leadership with full historical context, automated quotation engines, customer satisfaction radar, and relationship intelligence.',
    modules: ['Enterprise Pipeline & Opportunity Matrix', 'Configure, Price, Quote (CPQ) Engine', 'Contract Lifecycle Management', 'Client Success & SLA Escalation Radar', 'Omnichannel B2B Customer Portal'],
    metrics: '3.2x Faster Proposal Turnaround',
    outcomes: ['Generate bespoke client proposals in 90 seconds', 'Identify stalled enterprise negotiations before deals slip', 'Unify sales commitments directly with delivery capacity'],
  },
  {
    id: 'ai-automation',
    name: 'Autonomous Workflow & Intelligence',
    tagline: 'Autonomous agent swarms, document parsing & decision support',
    icon: Bot,
    color: '#EC4899',
    description: 'Deploy specialized digital coworkers that execute repetitive cross-system tasks, extract unstructured documents, and surface predictive recommendations.',
    modules: ['Autonomous Multi-Agent Orchestration', 'Cognitive Document & Invoice Parser', 'Conversational Executive Intelligence', 'Event Integration Mesh & Webhook Buses', 'Continuous Anomaly Sentinel'],
    metrics: '85%+ Repetitive Friction Eliminated',
    outcomes: ['Process multi-page vendor invoices end-to-end in 1.4 seconds', 'Ask conversational questions against live operational data', 'Human leadership remains in total control of critical gates'],
  },
  {
    id: 'custom-enterprise',
    name: 'Custom Enterprise Ecosystem',
    tagline: 'Bespoke applications designed around unique proprietary business requirements',
    icon: Sparkles,
    color: '#14B8A6',
    description: 'When off-the-shelf software fails your proprietary workflows, Artify engineers bespoke software architectures, custom algorithms, and sovereign databases strictly around you.',
    modules: ['Tailored Micro-Services & Event Meshes', 'Proprietary Industry Workflows', 'Private VPC & High-Throughput Clusters', 'Legacy System Bridges & Two-Way Sync', 'Bespoke Mobile & Web Operational Tools'],
    metrics: '100% Tailored to Your Workflows',
    outcomes: ['Zero forced alterations to your winning business processes', 'Full intellectual property and data sovereignty', 'Scales seamlessly from 50 to 50,000+ daily enterprise users'],
  },
];

interface EnterpriseSolutionsProps {
  onOpenSolutionBuilder?: () => void;
  onNavigateToContact?: () => void;
}

export const EnterpriseSolutions: React.FC<EnterpriseSolutionsProps> = ({
  onOpenSolutionBuilder,
  onNavigateToContact,
}) => {
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>('financial');

  const activeSolution = ENTERPRISE_SOLUTION_CATEGORIES.find((s) => s.id === selectedSolutionId) || ENTERPRISE_SOLUTION_CATEGORIES[0];
  const ActiveIcon = activeSolution.icon;

  return (
    <section id="enterprise-solutions" className="py-14 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/4 w-[650px] h-[650px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>ENTERPRISE SOLUTIONS ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            Specialized Ecosystems.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-sky-400 to-indigo-500">
              Architected Around Your Entire Business.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
            We do not present Artify as a monolithic, rigid ERP product. We engineer six interconnected solution ecosystems that fit your exact commercial reality, each capable of standalone deployment or unified cross-organization scale.
          </p>
        </div>

        {/* 6 Category Selection Pills */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {ENTERPRISE_SOLUTION_CATEGORIES.map((sol) => {
            const Icon = sol.icon;
            const isSelected = sol.id === activeSolution.id;
            return (
              <button
                key={sol.id}
                onClick={() => setSelectedSolutionId(sol.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'surface-card border-2 border-violet-600 dark:border-violet-500 dark:bg-gradient-to-br dark:from-violet-950/50 dark:to-card shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20 scale-[1.03]'
                    : 'surface-card-subtle border-card-border hover:border-primary/40 hover:bg-surface-hover/70'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${sol.color}20`,
                    color: sol.color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xs font-bold line-clamp-1 leading-snug transition-colors ${
                    isSelected ? 'text-foreground' : 'text-foreground group-hover:text-primary'
                  }`}>
                    {sol.name}
                  </h3>
                  <span className="text-[10px] text-foreground-muted font-mono-code block mt-1">
                    {sol.metrics}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Solution Deep-Dive Bento Display */}
        <div className="p-8 sm:p-10 rounded-3xl surface-card border border-primary/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Solution Overview & Modules */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${activeSolution.color}20`,
                    borderColor: `${activeSolution.color}50`,
                    color: activeSolution.color,
                  }}
                >
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase font-mono-code tracking-wider text-primary">
                    SOLUTION DOMAIN
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                    {activeSolution.name}
                  </h3>
                </div>
              </div>

              <p className="text-base text-foreground-muted leading-relaxed font-normal">
                {activeSolution.description}
              </p>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-mono-code block mb-3">
                  Included Sub-Modules & Data Engines:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSolution.modules.map((mod, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl surface-card-subtle border border-card-border flex items-center gap-2.5 text-xs text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-medium">{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Verified Outcomes & Call to Action */}
            <div className="lg:col-span-5 p-7 rounded-2xl surface-card-subtle border border-card-border shadow-xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                  <span className="text-xs font-bold uppercase font-mono-code text-foreground-muted">
                    Performance Benchmark
                  </span>
                  <span className="text-xs font-bold font-mono-code text-emerald-600 dark:text-emerald-400">
                    {activeSolution.metrics}
                  </span>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono-code block mb-3">
                  Measurable Operational Outcomes:
                </span>

                <div className="space-y-3 mb-6">
                  {activeSolution.outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground-secondary leading-relaxed">
                      <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-border space-y-3">
                {onOpenSolutionBuilder && (
                  <button
                    onClick={onOpenSolutionBuilder}
                    className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30"
                  >
                    <span>Configure {activeSolution.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onNavigateToContact && (
                  <button
                    onClick={onNavigateToContact}
                    className="w-full py-2.5 px-4 rounded-xl surface-card hover:bg-surface-hover text-foreground text-xs font-semibold border border-border transition-colors"
                  >
                    Schedule Enterprise Demo
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
