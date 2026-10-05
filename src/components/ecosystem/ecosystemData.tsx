import React from 'react';
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


export const CATEGORY_THEME_MAP: Record<
  EcosystemModule['category'],
  {
    label: string;
    iconStroke: string;
    textColor: string;
    bgSubtle: string;
    borderSubtle: string;
    activeGradient: string;
    activeText: string;
    tagClass: string;
  }
> = {
  core: {
    label: 'Core Backbone',
    iconStroke: 'var(--eco-icon-core)',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgSubtle: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    borderSubtle: 'border-emerald-500/25 dark:border-emerald-500/30',
    activeGradient: 'from-emerald-600 to-teal-600 text-white',
    activeText: 'text-white',
    tagClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
  },
  operations: {
    label: 'Operations & Supply',
    iconStroke: 'var(--eco-icon-ops)',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgSubtle: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    borderSubtle: 'border-indigo-500/25 dark:border-indigo-500/30',
    activeGradient: 'from-indigo-600 to-blue-600 text-white',
    activeText: 'text-white',
    tagClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 border-indigo-500/25',
  },
  intelligence: {
    label: 'AI & Intelligence',
    iconStroke: 'var(--eco-icon-intel)',
    textColor: 'text-violet-600 dark:text-violet-400',
    bgSubtle: 'bg-violet-500/10 dark:bg-violet-500/15',
    borderSubtle: 'border-violet-500/25 dark:border-violet-500/30',
    activeGradient: 'from-violet-600 to-purple-600 text-white',
    activeText: 'text-white',
    tagClass: 'text-violet-700 dark:text-violet-300 bg-violet-500/10 border-violet-500/25',
  },
  experience: {
    label: 'Digital Experience',
    iconStroke: 'var(--eco-icon-exp)',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    bgSubtle: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    borderSubtle: 'border-cyan-500/25 dark:border-cyan-500/30',
    activeGradient: 'from-cyan-600 to-sky-600 text-white',
    activeText: 'text-white',
    tagClass: 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border-cyan-500/25',
  },
};

/**
 * ThemeAwareEcosystemIcon
 * Renders Lucide SVG icons with dynamic SVG stroke and fill styling that smoothly adjusts
 * between Light mode (high-contrast WCAG AAA compliant tone) and Dark mode (luminous glowing tone).
 */
export const ThemeAwareEcosystemIcon: React.FC<{
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  category: EcosystemModule['category'];
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ icon: Icon, category, isSelected = false, size = 'sm', className = '' }) => {
  const theme = CATEGORY_THEME_MAP[category] || CATEGORY_THEME_MAP.core;

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-all duration-300 ${sizeClasses[size]} ${
        isSelected
          ? `bg-gradient-to-br ${theme.activeGradient} shadow-md shadow-violet-500/25`
          : `${theme.bgSubtle} border ${theme.borderSubtle} ${theme.textColor} group-hover:scale-105`
      } ${className}`}
    >
      <Icon
        className={`${iconSizes[size]} eco-svg-icon transition-transform duration-300 ${
          isSelected ? 'text-white scale-110' : 'group-hover:scale-110'
        }`}
        style={{
          stroke: isSelected ? '#FFFFFF' : theme.iconStroke,
          filter: isSelected ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' : undefined,
        }}
      />
    </div>
  );
};

