export interface PremiumTheme {
  id: string;
  name: string;
  codename: string;
  tagline: string;
  domain: string;
  targetIndustry: string;
  description: string;
  accentHex: string;
  secondaryHex: string;
  bgHex: string;
  surfaceHex: string;
  isLightMode?: boolean;
  typography: {
    display: string;
    body: string;
    mono: string;
  };
  metrics: {
    label: string;
    value: string;
    trend: string;
  }[];
  palette: {
    name: string;
    hex: string;
    role: string;
    wcagContrast: string;
  }[];
  characteristics: string[];
  mockData: {
    kpiTitle: string;
    kpiValue: string;
    kpiSubtitle: string;
    chartLabel: string;
    chartPoints: number[];
    activeAgent: string;
    consensusRate: string;
    securityProtocol: string;
    streamThroughput: string;
    recentActions: {
      timestamp: string;
      title: string;
      detail: string;
      status: 'verified' | 'executing' | 'queued';
    }[];
  };
  cssVariables: Record<string, string>;
}

export const PREMIUM_THEMES: PremiumTheme[] = [
  {
    id: 'obsidian-gold',
    name: 'Obsidian & Champagne Gold',
    codename: 'SOVEREIGN_C_SUITE',
    tagline: 'Ultra-deep carbon canvas with 24k brushed gold accents and Bloomberg-caliber prestige',
    domain: 'Private Equity & Family Offices',
    targetIndustry: 'Sovereign Wealth, C-Suite, Executive Boardrooms & Private Asset Portals',
    description:
      'Engineered for top-tier executive leadership who demand understated editorial luxury. Combines ultra-deep obsidian tones with warm champagne gold hairline borders and precision financial typography.',
    accentHex: '#D4AF37',
    secondaryHex: '#E6B349',
    bgHex: '#08080A',
    surfaceHex: '#101016',
    isLightMode: false,
    typography: {
      display: 'Cinzel / Editorial Display Serif',
      body: 'Inter / Helvetica Neue',
      mono: 'JetBrains Mono Precision',
    },
    metrics: [
      { label: 'Asset Under Management', value: '$4.2B', trend: '+14.2% YoY' },
      { label: 'Autonomous Settlement SLA', value: '1.2s', trend: 'Sub-second' },
      { label: 'Governance Consensus', value: '100%', trend: 'Multi-Sig Validated' },
    ],
    palette: [
      { name: 'Obsidian Canvas', hex: '#08080A', role: 'Base Background', wcagContrast: '21.0:1' },
      { name: 'Elevated Slate', hex: '#101016', role: 'Container Surface', wcagContrast: '18.4:1' },
      { name: 'Champagne Gold', hex: '#D4AF37', role: 'Primary Accent & CTAs', wcagContrast: '7.8:1' },
      { name: 'Brushed Brass', hex: '#E6B349', role: 'Active State & Badges', wcagContrast: '8.4:1' },
      { name: 'Warm Ivory', hex: '#F5F3ED', role: 'Display Typography', wcagContrast: '19.2:1' },
    ],
    characteristics: [
      'Razor-thin 1px brass hairline borders',
      'Warm metallic radial lighting shaders',
      'High-contrast board-ready data density',
      'Executive digest & signing workflow priority',
    ],
    mockData: {
      kpiTitle: 'Sovereign Portfolio Net Asset Value',
      kpiValue: '$4,281,950,000',
      kpiSubtitle: 'Real-time multi-currency liquidation liquidity: $892M',
      chartLabel: 'Treasury Yield & Alpha vs. Benchmark (Q3)',
      chartPoints: [42, 48, 55, 59, 64, 71, 78, 85, 92],
      activeAgent: 'Autonomous Treasury Sentinel #07',
      consensusRate: '0.998 Cosine Index',
      securityProtocol: 'Zero-Knowledge Multi-Party Vault (MPC)',
      streamThroughput: '18.4k Ledger Mutations/sec',
      recentActions: [
        {
          timestamp: '14:28:01 EST',
          title: 'Cross-Entity Intercompany Settlement',
          detail: 'Auto-reconciled £42.5M GBP to USD with zero slippage',
          status: 'verified',
        },
        {
          timestamp: '14:26:44 EST',
          title: 'Board Resolution Auto-Signature Request',
          detail: 'Dispatched encrypted hardware token prompt to 4 directors',
          status: 'executing',
        },
        {
          timestamp: '14:22:10 EST',
          title: 'Private Equity Debt Covenant Sentinel',
          detail: 'Audited 12 quarterly subsidiary filings: zero violations',
          status: 'verified',
        },
      ],
    },
    cssVariables: {
      '--color-background': '#08080a',
      '--color-background-subtle': '#0d0d12',
      '--color-background-deep': '#040406',
      '--color-surface': '#101016',
      '--color-surface-elevated': '#161620',
      '--color-foreground': '#F5F3ED',
      '--color-foreground-secondary': '#E6E2D8',
      '--color-foreground-muted': '#C8C2B3',
      '--color-primary': '#D4AF37',
      '--color-primary-hover': '#E6B349',
      '--color-primary-foreground': '#08080A',
      '--color-primary-subtle': 'rgba(212, 175, 55, 0.15)',
      '--color-border': 'rgba(212, 175, 55, 0.22)',
      '--color-card': '#0e0e14',
      '--color-card-border': 'rgba(212, 175, 55, 0.25)',
    },
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Matrix Emerald',
    codename: 'DEEP_TECH_TACTICAL',
    tagline: 'Terminal neon phosphor and bioluminescent mint for mission-critical defense and robotics',
    domain: 'Defense, Robotics & Bio-Informatics',
    targetIndustry: 'Critical Infrastructure, Autonomous Drone Logistics, Genetic Sequencing & Industrial IoT',
    description:
      'Built for engineering commands and high-frequency operational sentinels. Features sub-surface matrix grid styling, phosphor radar glows, and ultra-high density monospace telemetry streams.',
    accentHex: '#10B981',
    secondaryHex: '#34D399',
    bgHex: '#020805',
    surfaceHex: '#06160e',
    isLightMode: false,
    typography: {
      display: 'Space Grotesk Bold',
      body: 'Inter Display',
      mono: 'Fira Code / JetBrains Mono',
    },
    metrics: [
      { label: 'Active Edge Node Swarm', value: '1,420', trend: '100% Operational' },
      { label: 'Event Transit Latency', value: '4.8ms', trend: 'mTLS Zero-Copy' },
      { label: 'Threat Interception Rate', value: '99.99%', trend: 'Autonomous Defense' },
    ],
    palette: [
      { name: 'Terminal Abyss', hex: '#020805', role: 'Base Background', wcagContrast: '21.0:1' },
      { name: 'Bio-Silicon Surface', hex: '#06160e', role: 'Container Surface', wcagContrast: '19.1:1' },
      { name: 'Neon Emerald', hex: '#10B981', role: 'Primary Accent & Action', wcagContrast: '8.6:1' },
      { name: 'Bioluminescent Mint', hex: '#34D399', role: 'Active State & Ticker', wcagContrast: '12.4:1' },
      { name: 'Phosphor White', hex: '#ECFDF5', role: 'Display Typography', wcagContrast: '19.8:1' },
    ],
    characteristics: [
      'Phosphor radar telemetry and pulse badges',
      'Dense sub-surface grid mesh background',
      'Sub-millisecond latency & stream monitors',
      'Tactical command line & hotkey triggers',
    ],
    mockData: {
      kpiTitle: 'Global Autonomous Drone Swarm Fleet',
      kpiValue: '1,420 Active Units',
      kpiSubtitle: 'Zero communication dropouts across 14 sovereign air corridors',
      chartLabel: 'Real-Time Edge Sensor Packets (10k pkts/sec)',
      chartPoints: [60, 68, 65, 82, 79, 91, 88, 96, 99],
      activeAgent: 'Sentinel Drone Mesh Orchestrator v4.2',
      consensusRate: '0.999 BFT Quorum',
      securityProtocol: 'Hardware Security Module (HSM) + Post-Quantum mTLS',
      streamThroughput: '48.2 MB/s Ingest Stream',
      recentActions: [
        {
          timestamp: '22:19:04 UTC',
          title: 'Air Corridor Collision Vector Deflected',
          detail: 'Autonomous route recalculation executed in 6.2 milliseconds',
          status: 'verified',
        },
        {
          timestamp: '22:18:41 UTC',
          title: 'Satellite Uplink Failover Triggered',
          detail: 'Seamlessly switched 84 drones from terrestrial to LEO constellation',
          status: 'verified',
        },
        {
          timestamp: '22:15:12 UTC',
          title: 'Firmware Attestation Verification',
          detail: 'Cryptographic SHA-512 enclave signature verified on all nodes',
          status: 'verified',
        },
      ],
    },
    cssVariables: {
      '--color-background': '#020805',
      '--color-background-subtle': '#04100a',
      '--color-background-deep': '#010403',
      '--color-surface': '#06160e',
      '--color-surface-elevated': '#0a1f15',
      '--color-foreground': '#ECFDF5',
      '--color-foreground-secondary': '#D1FAE5',
      '--color-foreground-muted': '#A7F3D0',
      '--color-primary': '#10B981',
      '--color-primary-hover': '#059669',
      '--color-primary-foreground': '#020805',
      '--color-primary-subtle': 'rgba(16, 185, 129, 0.16)',
      '--color-border': 'rgba(16, 185, 129, 0.22)',
      '--color-card': '#05140d',
      '--color-card-border': 'rgba(16, 185, 129, 0.26)',
    },
  },
  {
    id: 'cobalt-titanium',
    name: 'Cobalt Titanium & Midnight Blue',
    codename: 'FINTECH_HYPERSCALE',
    tagline: 'Supersonic cobalt electric blue and titanium grey for high-velocity global fintech and clearing',
    domain: 'Institutional FinTech & Global Clearing',
    targetIndustry: 'Cross-Border Settlements, FX Prime Brokerage, High-Frequency Trading & Banking APIs',
    description:
      'Engineered for global transaction processors and liquidity brokers who require absolute crispness and visual velocity. Combines aerospace titanium hairline structures with vivid supersonic cobalt.',
    accentHex: '#2563EB',
    secondaryHex: '#38BDF8',
    bgHex: '#040814',
    surfaceHex: '#0a1226',
    isLightMode: false,
    typography: {
      display: 'Plus Jakarta Sans Bold',
      body: 'Inter',
      mono: 'IBM Plex Mono',
    },
    metrics: [
      { label: 'Settlement Throughput', value: '420k/s', trend: '+28% Peak Load' },
      { label: 'FX Slippage Mitigation', value: '0.002 bps', trend: 'Smart Order Router' },
      { label: 'System Uptime SLA', value: '99.999%', trend: 'Multi-Region Active' },
    ],
    palette: [
      { name: 'Midnight Oceanic', hex: '#040814', role: 'Base Background', wcagContrast: '21.0:1' },
      { name: 'Deep Cobalt Core', hex: '#0a1226', role: 'Container Surface', wcagContrast: '18.7:1' },
      { name: 'Supersonic Cobalt', hex: '#2563EB', role: 'Primary Accent & Action', wcagContrast: '6.4:1' },
      { name: 'Electric Sky', hex: '#38BDF8', role: 'Active State & Curves', wcagContrast: '9.2:1' },
      { name: 'Titanium Ice', hex: '#F0F6FF', role: 'Display Typography', wcagContrast: '19.4:1' },
    ],
    characteristics: [
      'Real-time streaming ledger ticker and depth curves',
      'Brushed titanium borders with micro-bevels',
      'Sub-10ms transaction confirmation animations',
      'Multi-currency balance matrix and liquidity heatmaps',
    ],
    mockData: {
      kpiTitle: 'Global Interbank Settlement Volume',
      kpiValue: '$18.42 Billion / 24h',
      kpiSubtitle: 'Settled via private liquidity mesh with automated ISO 20022 compliance',
      chartLabel: 'Clearing Engine Velocity (Transactions / Millisecond)',
      chartPoints: [50, 62, 58, 74, 80, 85, 82, 94, 98],
      activeAgent: 'Cross-Border Arbitrage Arbiter #14',
      consensusRate: '0.999 Raft State Quorum',
      securityProtocol: 'Zero-Knowledge Rollup Settlement (ZK-Proof)',
      streamThroughput: '240,000 Tx/sec Peak',
      recentActions: [
        {
          timestamp: '19:42:01.042',
          title: 'EUR/USD Multi-Pool Instant Arbitrage',
          detail: 'Synthesized 4 institutional liquidity pools: saved $48,200 in spreads',
          status: 'verified',
        },
        {
          timestamp: '19:41:58.210',
          title: 'Automated AML & FinCEN Rule Evaluation',
          detail: '14,200 transactions scored in 12ms: zero false positives',
          status: 'verified',
        },
        {
          timestamp: '19:40:12.800',
          title: 'Real-Time Collateral Rebalancing',
          detail: 'Adjusted margin position across Frankfurt and New York exchanges',
          status: 'verified',
        },
      ],
    },
    cssVariables: {
      '--color-background': '#040814',
      '--color-background-subtle': '#070d1e',
      '--color-background-deep': '#02040a',
      '--color-surface': '#0a1226',
      '--color-surface-elevated': '#0e1935',
      '--color-foreground': '#F0F6FF',
      '--color-foreground-secondary': '#DBEAFE',
      '--color-foreground-muted': '#BFDBFE',
      '--color-primary': '#2563EB',
      '--color-primary-hover': '#1D4ED8',
      '--color-primary-foreground': '#FFFFFF',
      '--color-primary-subtle': 'rgba(37, 99, 235, 0.18)',
      '--color-border': 'rgba(56, 189, 248, 0.22)',
      '--color-card': '#081022',
      '--color-card-border': 'rgba(56, 189, 248, 0.25)',
    },
  },
  {
    id: 'nordic-stark',
    name: 'Nordic Stark & Architectural Slate',
    codename: 'MODERNIST_LIGHT',
    tagline: 'High-contrast monochrome ivory, jet black typography, and Swiss structural grid precision',
    domain: 'Architectural Tech & Strategic Advisory',
    targetIndustry: 'Top-Tier Management Consultancies, Legal Tech, Design Systems & High-End Advisory',
    description:
      'Inspired by the International Typographic Style and Dieter Rams principles. Replaces decorative eye-candy with pristine spatial discipline, stark typographic contrast, and pure intellectual gravitas.',
    accentHex: '#18181B',
    secondaryHex: '#52525B',
    bgHex: '#F9F9FB',
    surfaceHex: '#FFFFFF',
    isLightMode: true,
    typography: {
      display: 'Inter Tight / Neue Haas Grotesk Bold',
      body: 'Inter Pro',
      mono: 'Space Mono',
    },
    metrics: [
      { label: 'Cognitive Readability Score', value: '100%', trend: 'WCAG AAA Gold' },
      { label: 'Interface Noise Ratio', value: '0.0%', trend: 'Distraction Free' },
      { label: 'Strategic Alignment', value: '99.4%', trend: 'Bylaw Verification' },
    ],
    palette: [
      { name: 'Warm Marble Canvas', hex: '#F9F9FB', role: 'Base Background', wcagContrast: '19.8:1' },
      { name: 'Pristine Surface', hex: '#FFFFFF', role: 'Elevated Cards', wcagContrast: '20.4:1' },
      { name: 'Jet Black Ink', hex: '#09090B', role: 'Display & Primary Action', wcagContrast: '20.4:1' },
      { name: 'Architectural Slate', hex: '#52525B', role: 'Secondary Metadata', wcagContrast: '7.8:1' },
      { name: 'Structural Hairline', hex: '#E4E4E7', role: 'Borders & Dividers', wcagContrast: '3.4:1' },
    ],
    characteristics: [
      'Strict geometric hairline grid alignment',
      'Zero garish pills or distracting gradients',
      'High-impact typographic scale and editorial hierarchy',
      'Document comparison diff and redline viewer',
    ],
    mockData: {
      kpiTitle: 'Enterprise Legal & M&A Due Diligence Suite',
      kpiValue: '4,820 Contracts Synthesized',
      kpiSubtitle: 'Complete semantic risk classification across 12 jurisdictions in 48 hours',
      chartLabel: 'Document Extraction & Risk Discovery Throughput',
      chartPoints: [45, 52, 60, 68, 75, 84, 89, 93, 98],
      activeAgent: 'Contractual Indemnity & Risk Sentinel #03',
      consensusRate: '100% Deterministic Rule Proof',
      securityProtocol: 'Isolated Private VPC Tenant (Zero Cloud Leakage)',
      streamThroughput: '1,200 Legal Pages / Minute',
      recentActions: [
        {
          timestamp: '16:04 CET',
          title: 'Cross-Border M&A Indemnity Clause Audit',
          detail: 'Discovered uncapped liability clause in Annex 4B; flagged for General Counsel',
          status: 'verified',
        },
        {
          timestamp: '15:58 CET',
          title: 'GDPR Article 28 DPA Alignment Verification',
          detail: 'Audited 120 sub-processor agreements; certified compliance dossier ready',
          status: 'verified',
        },
        {
          timestamp: '15:42 CET',
          title: 'Patent Portfolio Prior-Art Cross-Reference',
          detail: 'Analyzed 240 claims against USPTO database; 0 infringement risks found',
          status: 'verified',
        },
      ],
    },
    cssVariables: {
      '--color-background': '#F9F9FB',
      '--color-background-subtle': '#F1F2F6',
      '--color-background-deep': '#E4E5EB',
      '--color-surface': '#FFFFFF',
      '--color-surface-elevated': '#FFFFFF',
      '--color-foreground': '#09090B',
      '--color-foreground-secondary': '#18181B',
      '--color-foreground-muted': '#3F3F46',
      '--color-primary': '#18181B',
      '--color-primary-hover': '#09090B',
      '--color-primary-foreground': '#FFFFFF',
      '--color-primary-subtle': '#F4F4F5',
      '--color-border': '#D4D4D8',
      '--color-card': '#FFFFFF',
      '--color-card-border': '#E4E4E7',
    },
  },
  {
    id: 'nebula-violet',
    name: 'Nebula Deep Violet',
    codename: 'COGNITIVE_SWARM_ORIGIN',
    tagline: 'Artify flagship cognitive architecture with ethereal ultraviolet shaders and neural synaptic mesh',
    domain: 'Enterprise AI & Multi-Agent Swarms',
    targetIndustry: 'Autonomous Enterprise Orchestration, Cognitive Microservices & Neural Data Fabrics',
    description:
      'The signature aesthetic of Artify Labs. Balances deep cosmic obsidian with energetic electric purple and indigo gradients, communicating biological and neural intelligence.',
    accentHex: '#8B5CF6',
    secondaryHex: '#A78BFA',
    bgHex: '#07070B',
    surfaceHex: '#0e0e16',
    isLightMode: false,
    typography: {
      display: 'Plus Jakarta Sans Extrabold',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    metrics: [
      { label: 'Autonomous Agent Fleet', value: '64 Swarms', trend: 'Consensus Synchronized' },
      { label: 'Neural Recall Latency', value: '< 12ms', trend: 'Hybrid RAG pgvector' },
      { label: 'Deterministic Accuracy', value: '99.98%', trend: 'Consensus Filter' },
    ],
    palette: [
      { name: 'Cosmic Obsidian', hex: '#07070B', role: 'Base Background', wcagContrast: '20.2:1' },
      { name: 'Neural Surface', hex: '#0e0e16', role: 'Container Surface', wcagContrast: '18.1:1' },
      { name: 'Electric Violet', hex: '#8B5CF6', role: 'Primary Accent & Action', wcagContrast: '6.2:1' },
      { name: 'Soft Amethyst', hex: '#C4B5FD', role: 'Active State & Highlights', wcagContrast: '11.8:1' },
      { name: 'Pure White Light', hex: '#FFFFFF', role: 'Display Typography', wcagContrast: '20.2:1' },
    ],
    characteristics: [
      'Multi-agent consensus visualization with live heartbeat',
      'Ethereal cosmic glowing shaders and energy conduits',
      'Sub-second natural language cognitive synthesis',
      'Deterministic rule engine + neural model hybrid routing',
    ],
    mockData: {
      kpiTitle: 'Enterprise Cognitive Nervous System Throughput',
      kpiValue: '14,200 Events / Sec',
      kpiSubtitle: 'Autonomous deterministic resolution across People, Systems, and Data',
      chartLabel: 'Agent Consensus Index & Real-Time Agreement Score',
      chartPoints: [58, 64, 72, 80, 86, 92, 95, 98, 99],
      activeAgent: 'Lead Cognitive Orchestration Core #01',
      consensusRate: '0.999 Agreement Metric',
      securityProtocol: 'Row-Level Tenant Isolation + Cryptographic Audit Trail',
      streamThroughput: '64 Active Agent Swarms',
      recentActions: [
        {
          timestamp: '11:14:02 UTC',
          title: '3-Way Vendor Invoice Autonomous Settlement',
          detail: 'Matched PO in NetSuite, checked Jira approval, released $184,000 disbursement',
          status: 'verified',
        },
        {
          timestamp: '11:12:35 UTC',
          title: 'Multi-Modal Document Extraction Pipeline',
          detail: 'Parsed 450 customs declarations with 99.94% OCR extraction confidence',
          status: 'verified',
        },
        {
          timestamp: '11:09:18 UTC',
          title: 'Dynamic Multi-Model Router Invoked',
          detail: 'Routed high-risk financial task to 3-model voting consensus',
          status: 'verified',
        },
      ],
    },
    cssVariables: {
      '--color-background': '#07070b',
      '--color-background-subtle': '#0a0a10',
      '--color-background-deep': '#040407',
      '--color-surface': '#0e0e16',
      '--color-surface-elevated': '#13131e',
      '--color-foreground': '#FFFFFF',
      '--color-foreground-secondary': '#F1F5F9',
      '--color-foreground-muted': '#E2E8F0',
      '--color-primary': '#8B5CF6',
      '--color-primary-hover': '#7C3AED',
      '--color-primary-foreground': '#FFFFFF',
      '--color-primary-subtle': 'rgba(139, 92, 246, 0.16)',
      '--color-border': 'rgba(255, 255, 255, 0.14)',
      '--color-card': '#0d0d16',
      '--color-card-border': 'rgba(255, 255, 255, 0.12)',
    },
  },
];
