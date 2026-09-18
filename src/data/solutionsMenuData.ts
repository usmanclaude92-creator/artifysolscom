export interface SolutionMenuItem {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
  badge?: string;
  targetType: 'product' | 'route' | 'wizard' | 'contact' | 'industry';
  targetSlug?: string;
  targetRoute?: string;
}

export interface SolutionCategory {
  id: string;
  title: string;
  subtitle?: string;
  items: SolutionMenuItem[];
}

export interface IntelligenceCapability {
  title: string;
  description: string;
  iconName: string;
}

export const SOLUTIONS_CATEGORIES: SolutionCategory[] = [
  {
    id: 'platform',
    title: 'ENTERPRISE PLATFORM',
    subtitle: 'Connected foundation for enterprise scale',
    items: [
      {
        id: 'enterprise-platform',
        name: 'Artify Enterprise Platform',
        tagline: 'The connected foundation for managing the entire organization.',
        iconName: 'Layers',
        badge: 'Core Fabric',
        targetType: 'wizard',
        targetSlug: 'enterprise-platform',
      },
      {
        id: 'adaptive-erp',
        name: 'Adaptive ERP',
        tagline: 'Finance, procurement, sales, inventory, projects, operations and enterprise workflows.',
        iconName: 'Database',
        targetType: 'product',
        targetSlug: 'artify-erp',
      },
      {
        id: 'business-intelligence',
        name: 'Business Intelligence',
        tagline: 'Real-time dashboards, analytics, reporting and management insights.',
        iconName: 'BarChart3',
        targetType: 'product',
        targetSlug: 'artify-bi',
      },
    ],
  },
  {
    id: 'workforce',
    title: 'PEOPLE & WORKFORCE',
    subtitle: 'Human capital & dynamic workforce management',
    items: [
      {
        id: 'human-capital',
        name: 'Human Capital Management',
        tagline: 'Employee lifecycle, HR, payroll, attendance and workforce administration.',
        iconName: 'Users',
        targetType: 'product',
        targetSlug: 'artify-hr',
      },
      {
        id: 'workforce-management',
        name: 'Workforce Management',
        tagline: 'Mobile workforce, deployment, attendance, geolocation, field operations and productivity.',
        iconName: 'Smartphone',
        targetType: 'product',
        targetSlug: 'artify-workforce',
      },
      {
        id: 'payroll-intelligence',
        name: 'Payroll & Workforce Intelligence',
        tagline: 'Payroll processing, workforce analytics, controls and intelligent payroll workflows.',
        iconName: 'DollarSign',
        badge: 'Compliant',
        targetType: 'wizard',
        targetSlug: 'payroll-intelligence',
      },
    ],
  },
  {
    id: 'finance',
    title: 'FINANCE & BUSINESS',
    subtitle: 'Financial control, trade & commercial relations',
    items: [
      {
        id: 'finance-accounting',
        name: 'Finance & Accounting',
        tagline: 'Financial management, accounting, treasury, budgeting and reporting.',
        iconName: 'CreditCard',
        targetType: 'product',
        targetSlug: 'artify-finance',
      },
      {
        id: 'procurement-supply',
        name: 'Procurement & Supply Chain',
        tagline: 'Purchasing, suppliers, inventory and connected supply-chain operations.',
        iconName: 'Truck',
        targetType: 'wizard',
        targetSlug: 'supply-chain',
      },
      {
        id: 'sales-customer',
        name: 'Sales & Customer Management',
        tagline: 'CRM, sales processes, customer relationships and commercial operations.',
        iconName: 'Briefcase',
        targetType: 'product',
        targetSlug: 'artify-crm',
      },
    ],
  },
  {
    id: 'operations',
    title: 'OPERATIONS & INDUSTRY',
    subtitle: 'Execution, operational governance & domain models',
    items: [
      {
        id: 'projects-construction',
        name: 'Projects & Construction',
        tagline: 'Project management, resources, costs, contracts and field operations.',
        iconName: 'Boxes',
        targetType: 'product',
        targetSlug: 'artify-projects',
      },
      {
        id: 'operations-management',
        name: 'Operations Management',
        tagline: 'Business workflows, approvals, tasks, assets and operational control.',
        iconName: 'Workflow',
        targetType: 'product',
        targetSlug: 'artify-operations',
      },
      {
        id: 'industry-solutions',
        name: 'Industry Solutions',
        tagline: 'Solutions adapted to the specific requirements of different industries and business models.',
        iconName: 'Building2',
        badge: '14 Sectors',
        targetType: 'industry',
        targetRoute: '/industries',
      },
    ],
  },
  {
    id: 'custom-adaptive',
    title: 'CUSTOM & ADAPTIVE',
    subtitle: 'Tailored architecture built around your unique operations',
    items: [
      {
        id: 'adaptive-solutions',
        name: 'Adaptive Enterprise Solutions',
        tagline: 'Software designed around unique business requirements.',
        iconName: 'Sliders',
        badge: 'Bespoke',
        targetType: 'wizard',
      },
      {
        id: 'custom-applications',
        name: 'Custom Applications',
        tagline: 'Purpose-built enterprise applications and workflows.',
        iconName: 'Code2',
        targetType: 'wizard',
      },
      {
        id: 'integrations-apis',
        name: 'Integrations & APIs',
        tagline: 'Connect existing systems, applications, data and external platforms.',
        iconName: 'Network',
        targetType: 'wizard',
      },
      {
        id: 'digital-transformation',
        name: 'Digital Transformation',
        tagline: 'Modernize fragmented business processes into one connected ecosystem.',
        iconName: 'RefreshCw',
        targetType: 'contact',
      },
    ],
  },
];

export const ARTIFY_INTELLIGENCE_CAPABILITIES: IntelligenceCapability[] = [
  {
    title: 'Intelligent Document Processing',
    description: 'Ingests invoices, contracts, bills of lading, and forms with sub-second OCR and verified field extraction.',
    iconName: 'FileSearch',
  },
  {
    title: 'Business Data Analysis',
    description: 'Correlates historic operational baselines and live ledgers to identify margin leaks and performance drift.',
    iconName: 'BarChart3',
  },
  {
    title: 'Automated Workflows',
    description: 'Deterministic state-machine executions across ledgers, logistics, and approval queues without manual handoffs.',
    iconName: 'Workflow',
  },
  {
    title: 'Intelligent Recommendations',
    description: 'Contextual suggestions for inventory reorder points, staffing allocations, and pricing optimizations.',
    iconName: 'Sparkles',
  },
  {
    title: 'Natural-Language Interaction',
    description: 'Query enterprise data in plain language; generate real-time reports and drill-downs instantly.',
    iconName: 'MessageSquare',
  },
  {
    title: 'Anomaly Detection',
    description: 'Continuous background sentinels identifying duplicate payments, fraudulent claims, and inventory discrepancies.',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Predictive Insights',
    description: 'Multi-horizon cashflow, sales, and demand projections calibrated continuously against live operational inputs.',
    iconName: 'TrendingUp',
  },
  {
    title: 'AI-Assisted Reporting',
    description: 'Auto-synthesizes board-ready executive summaries, audit dossiers, and compliance filings.',
    iconName: 'FileText',
  },
  {
    title: 'Intelligent Business Agents',
    description: 'Specialized domain agents executing reconciliation, supplier verification, and compliance checks.',
    iconName: 'Cpu',
  },
  {
    title: 'Decision-Support Capabilities',
    description: 'Scenario simulation and impact modelling supporting executive leadership with data-grounded options.',
    iconName: 'Zap',
  },
];

export interface EcosystemNodeDefinition {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  connections: string[];
  relationship: string;
  capability: string;
  color: string;
  isHighlight?: boolean;
}

export const ECOSYSTEM_NODES: EcosystemNodeDefinition[] = [
  {
    id: 'finance',
    label: 'Finance',
    icon: 'DollarSign',
    tagline: 'Treasury & Ledgers',
    connections: ['Projects', 'Supply Chain', 'Customers'],
    relationship: 'Auto-reconciles project costs, vendor procurement invoices, and customer billing into a continuous general ledger.',
    capability: 'Real-time multi-entity cash flow and automated closing cycles.',
    color: '#10B981',
  },
  {
    id: 'people',
    label: 'People',
    icon: 'Users',
    tagline: 'Workforce & Talent',
    connections: ['Operations', 'Projects'],
    relationship: 'Aligns skill matrices and shift availability with operational demand and project milestone delivery.',
    capability: 'Adaptive scheduling, unified payroll, and dynamic labor costing.',
    color: '#8B5CF6',
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: 'Workflow',
    tagline: 'Workflows & SLAs',
    connections: ['Supply Chain', 'Customers', 'People'],
    relationship: 'Orchestrates field workflows, facility assets, and client SLAs while streaming inventory demand upstream.',
    capability: 'Zero-latency event execution and automated escalation policies.',
    color: '#3B82F6',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'Briefcase',
    tagline: 'CRM & Engagement',
    connections: ['Finance', 'Operations'],
    relationship: 'Converts signed client commitments directly into operational tickets, billing terms, and customer success telemetry.',
    capability: 'Omnichannel B2B relationship tracking and automated quotation gates.',
    color: '#F59E0B',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'Boxes',
    tagline: 'Delivery & Governance',
    connections: ['Finance', 'People'],
    relationship: 'Translates deliverable progression directly into revenue recognition and resource burn calculations.',
    capability: 'Milestone governance, phase gating, and real-time margin tracking.',
    color: '#EC4899',
  },
  {
    id: 'supply-chain',
    label: 'Supply Chain',
    icon: 'Truck',
    tagline: 'Procure & Stock',
    connections: ['Operations', 'Finance'],
    relationship: 'Synchronizes multi-site warehouse inventory with vendor purchase orders, freight status, and AP reconciliation.',
    capability: 'Predictive replenishment, vendor SLA tracking, and dynamic buffer sizing.',
    color: '#06B6D4',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: 'Sparkles',
    tagline: 'Cross-Ecosystem Fabric',
    connections: ['Finance', 'People', 'Operations', 'Customers', 'Projects', 'Supply Chain'],
    relationship: 'The unifying cognitive substrate that detects anomalies, predicts bottlenecks, and auto-dispatches tasks across all 6 operational nodes.',
    capability: 'Autonomous multi-agent orchestration, cognitive document parsing, and natural-language enterprise querying.',
    color: '#8B5CF6',
    isHighlight: true,
  },
];
