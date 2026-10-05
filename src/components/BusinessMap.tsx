import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Users,
  Workflow,
  Database,
  Server,
  Bot,
  Network,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Compass,
} from 'lucide-react';
import { playHoverSound } from '../utils/soundEffects';

interface BusinessMapProps {
  onOpenSolutionBuilder?: () => void;
  onOpenConsultant?: () => void;
  onNavigateToContact?: () => void;
  theme?: 'dark' | 'light';
}

interface LayerItem {
  id: string;
  number: string;
  name: string;
  badge: string;
  headline: string;
  summary: string;
  icon: React.ElementType;
  accentColor: string;
  gradientBorder: string;
  glowColor: string;
  traditional: {
    title: string;
    points: string[];
  };
  transformed: {
    title: string;
    points: string[];
    capabilities: string[];
  };
  metrics: { value: string; label: string }[];
  entities: string[];
  telemetryStream: { label: string; rate: string; protocol: string };
}

const LAYERS: LayerItem[] = [
  {
    id: 'layer-people',
    number: '01',
    name: 'People',
    badge: 'Human Agency & Role-Aware Portals',
    headline: 'Amplifying Human Agency with Context-Aware Copilots',
    summary:
      'Empower leadership, frontline operators, and knowledge specialists with tailored, role-governed natural language interfaces that eliminate repetitive drudgery.',
    icon: Users,
    accentColor: 'from-amber-500 to-orange-500',
    gradientBorder: 'border-amber-500/30 hover:border-amber-500/60',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    traditional: {
      title: 'Traditional Operational Friction',
      points: [
        'Context switching across 15+ disconnected web portals and legacy terminals',
        'Manual spreadsheet transcription prone to human clerical errors',
        'Tribal institutional knowledge trapped in employee silos and informal chats',
      ],
    },
    transformed: {
      title: 'Artify Unified State',
      points: [
        'Role-aware executive digests delivered via web, mobile, and secure chat',
        'Sub-second natural language answers grounded strictly in verified corporate truth',
        'Human-in-the-loop validation queues for all sensitive financial and legal decisions',
      ],
      capabilities: ['Field Operator Apps', 'C-Suite Briefing Scribes', 'Voice & Chat Gateways', 'Granular RBAC'],
    },
    metrics: [
      { value: '3.4×', label: 'Faster Decision Velocity' },
      { value: '< 2s', label: 'Briefing Synthesis' },
      { value: '100%', label: 'Human Approval Gates' },
    ],
    entities: ['Executive Leadership', 'Operations Managers', 'Field Crews', 'Finance Analysts', 'Support Specialists'],
    telemetryStream: { label: 'Active Operator Sessions', rate: '2,480 msgs/min', protocol: 'Secure WebSocket' },
  },
  {
    id: 'layer-processes',
    number: '02',
    name: 'Processes',
    badge: 'Adaptive State Machines & Governance',
    headline: 'Replacing Brittle Linear SOPs with Self-Guiding State Machines',
    summary:
      'Transform rigid, static procedural checklists into dynamic, event-driven state machines that automatically adapt to edge cases while enforcing corporate bylaws.',
    icon: Workflow,
    accentColor: 'from-rose-500 to-pink-500',
    gradientBorder: 'border-rose-500/30 hover:border-rose-500/60',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    traditional: {
      title: 'Traditional Operational Friction',
      points: [
        'Linear approval hierarchies that stall whenever key signers are away',
        'Paperwork bottlenecks crossing department borders with zero visibility',
        'Brittle custom scripts that crash silently when exception states arise',
      ],
    },
    transformed: {
      title: 'Artify Unified State',
      points: [
        'Event-driven deterministic state machines with automatic SLA escalation',
        'Cryptographic audit trails recording every workflow transition and rule evaluation',
        'Self-healing fallbacks that reroute pending tasks to authorized secondary approvers',
      ],
      capabilities: ['Deterministic Logic', 'Automated SLA Escalation', 'Policy Verification', 'Audit Trail Ledger'],
    },
    metrics: [
      { value: '99.4%', label: 'Zero-Exception Processing' },
      { value: '0', label: 'Untracked Bottlenecks' },
      { value: '100%', label: 'Immutable Auditability' },
    ],
    entities: ['Procurement Approval', 'Vendor Onboarding', 'Invoice Reconciliation', 'Cross-Border VAT', 'HR Offboarding'],
    telemetryStream: { label: 'State Transitions', rate: '14,200 events/sec', protocol: 'Kafka Mesh' },
  },
  {
    id: 'layer-data',
    number: '03',
    name: 'Data',
    badge: 'Unified Neural Fabric & Knowledge Graph',
    headline: 'Synthesizing Relational DBs, Documents & Real-Time Streams',
    summary:
      'Break open institutional data silos. Unify structured PostgreSQL/Snowflake data, raw PDF attachments, contracts, and IoT telemetry into a single semantic knowledge graph.',
    icon: Database,
    accentColor: 'from-emerald-500 to-teal-500',
    gradientBorder: 'border-emerald-500/30 hover:border-emerald-500/60',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    traditional: {
      title: 'Traditional Operational Friction',
      points: [
        'Dark data trapped in scanned PDFs, invoices, and unstructured email chains',
        'Nightly batch CSV syncs that leave business decisions 24 hours behind reality',
        'Conflicting duplicate records across multiple departmental database instances',
      ],
    },
    transformed: {
      title: 'Artify Unified State',
      points: [
        'Continuous Change Data Capture (CDC) streaming state mutations in sub-10ms',
        'High-dimensional vector embeddings with hybrid semantic & keyword indexing',
        'Strict tenant-isolated cryptographic row-level security with zero data leakage',
      ],
      capabilities: ['Hybrid pgvector RAG', 'Cognitive OCR Parsers', 'CDC Real-Time Sync', 'Row-Level Security'],
    },
    metrics: [
      { value: '< 12ms', label: 'Semantic Recall' },
      { value: 'Zero', label: 'Data Leakage Risk' },
      { value: '100%', label: 'Sovereign Ownership' },
    ],
    entities: ['Master Relational DB', 'Vector Knowledge Embeddings', 'Document Archives', 'Telemetry Logs', 'Semantic Graph'],
    telemetryStream: { label: 'CDC Ingestion Stream', rate: '48.2 MB/s', protocol: 'TLS 1.3 / gRPC' },
  },
  {
    id: 'layer-systems',
    number: '04',
    name: 'Systems',
    badge: 'Enterprise Core & Legacy Infrastructure',
    headline: 'Bridging Legacy ERPs, Modern CRMs & Custom Microservices',
    summary:
      'Connect mission-critical legacy monoliths (SAP, NetSuite, Oracle) with modern cloud platforms without risky, multi-year rip-and-replace overhauls.',
    icon: Server,
    accentColor: 'from-sky-500 to-cyan-500',
    gradientBorder: 'border-sky-500/30 hover:border-sky-500/60',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    traditional: {
      title: 'Traditional Operational Friction',
      points: [
        'Fragile point-to-point SOAP/REST integrations that break on software updates',
        'Costly vendor lock-in with proprietary ERP platforms charging for every API call',
        'Custom internal tools that require dedicated engineering upkeep and manual restarts',
      ],
    },
    transformed: {
      title: 'Artify Unified State',
      points: [
        'Standardized bi-directional protocol adapters with automated schema mapping',
        'Low-overhead event polling with graceful degradation during backend maintenance',
        'Isolated private VPC microservices running on enterprise-grade Kubernetes',
      ],
      capabilities: ['ERP Native Adapters', 'CRM Mesh Bridges', 'Private Kubernetes', 'Canary Rollouts'],
    },
    metrics: [
      { value: '120+', label: 'Pre-Engineered Connectors' },
      { value: '99.99%', label: 'Engineered SLA Uptime' },
      { value: 'Zero', label: 'Forced Monolith Rewrites' },
    ],
    entities: ['SAP / NetSuite ERP', 'Salesforce / HubSpot CRM', 'Custom SQL Warehouses', 'Stripe Vaults', 'Legacy Mainframes'],
    telemetryStream: { label: 'Core System Health', rate: '99.999% SLA', protocol: 'mTLS Mesh' },
  },
  {
    id: 'layer-ai',
    number: '05',
    name: 'AI',
    badge: 'Autonomous Multi-Agent Swarms',
    headline: 'Deploying Coordinated Agent Swarms with Deterministic Consensus',
    summary:
      'Move beyond simple chatbots. Deploy fleets of specialized autonomous digital workers that reason, verify facts across multiple sources, and execute verified actions.',
    icon: Bot,
    accentColor: 'from-violet-500 to-indigo-500',
    gradientBorder: 'border-violet-500/30 hover:border-violet-500/60',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    traditional: {
      title: 'Traditional Operational Friction',
      points: [
        'Generic public chatbot wrappers that hallucinate facts and leak confidential IP',
        'Isolated AI pilots that cannot execute actual read/write operations on system ledgers',
        'No cross-verification mechanism to catch statistical model anomalies or drifts',
      ],
    },
    transformed: {
      title: 'Artify Unified State',
      points: [
        'Multi-agent consensus architecture where independent agents cross-verify logic',
        'Strict tool-calling contracts that only mutate system state after policy validation',
        'Dynamic multi-model routing matching the right latency and cost to each task',
      ],
      capabilities: ['Consensus Gatekeepers', 'Multi-Model Routing', 'Deterministic Guardrails', 'LangGraph Networks'],
    },
    metrics: [
      { value: '> 0.99', label: 'Cosine Agreement Index' },
      { value: 'Sub-40ms', label: 'Local Model Latency' },
      { value: 'Zero', label: 'Unverified Hallucinations' },
    ],
    entities: ['Reconciliation Sentinels', 'Policy Audit Bots', 'Predictive Forecasters', 'Document Ingestion Swarms', 'Task Orchestrators'],
    telemetryStream: { label: 'Active Agent Swarms', rate: '64 autonomous bots', protocol: 'A2A Protocol' },
  },
  {
    id: 'layer-integrations',
    number: '06',
    name: 'Integrations',
    badge: 'Sovereign Event Mesh & Webhooks',
    headline: 'Orchestrating Sub-Millisecond Event Streaming Across the Enterprise',
    summary:
      'The central nervous system: a distributed, fault-tolerant event mesh ensuring guaranteed at-least-once delivery, transactional rollback, and real-time observability.',
    icon: Network,
    accentColor: 'from-purple-500 to-fuchsia-500',
    gradientBorder: 'border-purple-500/30 hover:border-purple-500/60',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    traditional: {
      title: 'Traditional Operational Friction',
      points: [
        'Unmonitored webhooks that fail silently when third-party servers drop offline',
        'Spaghetti architectures with no single pane of glass for transaction traceability',
        'Security compliance gaps where unencrypted payloads traverse public networks',
      ],
    },
    transformed: {
      title: 'Artify Unified State',
      points: [
        'Sub-10ms distributed event bus with dead-letter queueing and exponential backoff',
        'End-to-end cryptographic payload verification using ephemeral asymmetric keys',
        'Comprehensive live telemetry giving immediate visibility into every distributed trace',
      ],
      capabilities: ['Sub-10ms Event Bus', 'Guaranteed At-Least-Once', 'Dead-Letter Queues', 'Trace Telemetry'],
    },
    metrics: [
      { value: '< 10ms', label: 'Bus Transit Latency' },
      { value: '100%', label: 'Cryptographic Verification' },
      { value: '99.999%', label: 'Delivery Guarantee' },
    ],
    entities: ['Kafka Event Mesh', 'Secure Webhook Ingress', 'Real-Time WebSockets', 'Zero-Trust Gateways', 'Audit Event Sinks'],
    telemetryStream: { label: 'Event Mesh Throughput', rate: '250k msgs/sec', protocol: 'Zero-Copy Quorum' },
  },
];

export const BusinessMap: React.FC<BusinessMapProps> = ({
  onOpenSolutionBuilder,
  onOpenConsultant,
  onNavigateToContact,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const containerRef = useRef<HTMLDivElement>(null);

  // Active layer selection for interactive tab/comparison
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-people');
  
  const [viewModes, setViewModes] = useState<Record<string, 'transformed' | 'traditional'>>({
    'layer-people': 'transformed',
    'layer-processes': 'transformed',
    'layer-data': 'transformed',
    'layer-systems': 'transformed',
    'layer-ai': 'transformed',
    'layer-integrations': 'transformed',
  });

  // Scroll Progress across entire BusinessMap section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Animated transforms based on overall scroll
  const conduitHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const progressPercent = useTransform(smoothProgress, (v) => `${Math.min(100, Math.max(0, Math.round(v * 100)))}%`);

  const toggleLayerMode = (layerId: string) => {
    playHoverSound(0.04);
    setViewModes((prev) => ({
      ...prev,
      [layerId]: prev[layerId] === 'transformed' ? 'traditional' : 'transformed',
    }));
  };

  const scrollToBottom = () => {
    playHoverSound(0.05);
    const element = document.getElementById('business-map-bottom');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="business-map"
      className={`relative py-24 lg:py-32 overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#050508] text-zinc-100'
      }`}
      aria-label="The Business Map: Enterprise Transformation Architecture"
    >
      {/* Background Ambient Illumination Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] rounded-full blur-[160px] ${
            isLight ? 'bg-violet-200/40' : 'bg-violet-600/10'
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full blur-[140px] ${
            isLight ? 'bg-indigo-200/35' : 'bg-indigo-600/10'
          }`}
        />
        <div
          className={`absolute top-2/3 left-0 w-[500px] h-[500px] rounded-full blur-[140px] ${
            isLight ? 'bg-emerald-200/30' : 'bg-emerald-600/08'
          }`}
        />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Zero-Pill Monospace Kicker & Typographic Hierarchy */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20">
          <div className="text-xs font-mono font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3 flex items-center justify-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            <span>The Enterprise Architecture Continuum</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.1] mb-5">
            The Business Map.{' '}
            <span className="block mt-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              From Disparate Layers to One Intelligent Business.
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}
          >
            Every modern organization operates across six fundamental layers. Follow the animated logical flow as Artify's
            cognitive architecture synthesizes disparate operations into a singular, synchronized enterprise organism.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. THE 6 LAYERS WITH SIGNATURE CONTINUOUS SCROLL CONDUIT */}
        {/* ========================================================================= */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-[80vw] max-w-none left-1/2 -translate-x-1/2">

          {/* Sticky Left Telemetry Rail (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-4">
            <div
              className={`p-5 rounded-2xl border text-xs ${
                isLight ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-[#0d0d16]/90 border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                <span className="font-mono font-bold uppercase text-[11px] text-violet-500 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Architecture Rail</span>
                </span>
                <motion.span className="font-mono text-[11px] font-bold text-emerald-500">
                  {progressPercent}
                </motion.span>
              </div>

              {/* Progress Stepper Links */}
              <div className="space-y-1.5">
                {LAYERS.map((layer) => {
                  const isActive = activeLayerId === layer.id;
                  const Icon = layer.icon;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => {
                        playHoverSound(0.04);
                        setActiveLayerId(layer.id);
                      }}
                      onMouseEnter={() => playHoverSound(0.02)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                          : isLight
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-violet-400'}`} />
                        <span className="truncate">
                          {layer.number}. {layer.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {layer.metrics[0].value}
                      </span>
                    </button>
                  );
                })}

                <div className="h-px bg-border my-1" />

                <button
                  onClick={scrollToBottom}
                  className={`w-full text-left px-3 py-1.5 rounded-lg font-mono text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isLight
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-emerald-400 hover:bg-emerald-950/30'
                  }`}
                >
                  <span>▼ ONE INTELLIGENT BIZ</span>
                  <span className="text-[10px] text-emerald-500">Synthesis</span>
                </button>
              </div>

              {/* Bottom Quick Action */}
              <div className="mt-4 pt-3 border-t border-border">
                <button
                  onClick={onOpenSolutionBuilder}
                  className="w-full py-2 px-3 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-600 dark:text-violet-400 border border-violet-500/30 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Build Custom Solution</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile layer selector (the rail is desktop-only) */}
          <div className="lg:hidden flex flex-wrap gap-2 text-xs font-mono">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  playHoverSound(0.04);
                  setActiveLayerId(l.id);
                }}
                className={`px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  activeLayerId === l.id
                    ? 'bg-violet-600 text-white border-violet-500 font-semibold'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-white/[0.04] border-white/[0.08] text-zinc-300'
                }`}
              >
                {l.number}. {l.name}
              </button>
            ))}
          </div>

          {/* Right Column: stacked layer cards (selected card slides up in front) */}
          <div id="layers-continuous-stream" className="lg:col-span-9 relative">
            
            {/* The Animated Signature Vertical Conduit Line */}
            <div
              className="absolute left-4 sm:left-8 top-4 bottom-4 w-1 hidden sm:block pointer-events-none"
              aria-hidden="true"
            >
              {/* Background guide rail */}
              <div className="w-full h-full bg-slate-200 dark:bg-white/[0.06] rounded-full" />

              {/* Animated active energy beam */}
              <motion.div
                style={{ height: conduitHeight }}
                className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-amber-500 via-violet-500 to-emerald-400 shadow-[0_0_14px_rgba(139,92,246,0.6)]"
              />

              {/* Pulsing conduit head */}
              <motion.div
                style={{ top: conduitHeight }}
                className="absolute -left-1.5 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-500 border-2 border-white shadow-[0_0_16px_rgba(139,92,246,0.9)]"
              />
            </div>

            {/* Only the selected layer card is shown; the others stay hidden behind it */}
            <AnimatePresence mode="popLayout" initial={false}>
            {LAYERS.filter((layer) => layer.id === activeLayerId).map((layer) => {
              const Icon = layer.icon;
              const mode = viewModes[layer.id] || 'transformed';
              const isTraditional = mode === 'traditional';

              return (
                <motion.article
                  key={layer.id}
                  id={layer.id}
                  initial={{ opacity: 0, y: 160 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, zIndex: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                  style={{ zIndex: 10 }}
                  className={`relative sm:pl-16 sm:ml-2 rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-violet-300'
                      : 'bg-[#0c0c14] border-white/[0.08] shadow-2xl hover:border-white/[0.2]'
                  }`}
                >
                  {/* Layer Connection Node Marker on Rail */}
                  <div
                    className={`absolute -left-2 sm:-left-3.5 top-8 hidden sm:flex w-7 h-7 rounded-full items-center justify-center font-mono text-[11px] font-bold border-2 transition-all ${
                      isLight
                        ? 'bg-white border-violet-500 text-violet-700 shadow-md'
                        : 'bg-[#08080d] border-violet-400 text-violet-300 shadow-lg'
                    }`}
                  >
                    {layer.number}
                  </div>

                  {/* Header Row: Layer Index, Unboxed Metadata & Interactive Mode Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${layer.accentColor} text-white shadow-md`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        {/* Unboxed metadata without pills */}
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-0.5">
                          <span className="font-semibold text-violet-500">Layer {layer.number}</span>
                          <span aria-hidden="true" className="text-zinc-500">·</span>
                          <span>{layer.badge}</span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold font-display text-foreground">
                          {layer.name}
                        </h4>
                      </div>
                    </div>

                    {/* Interactive Comparison Toggle: Friction vs Transformed */}
                    <div
                      className={`inline-flex items-center p-1 rounded-xl border text-xs font-medium self-start sm:self-auto ${
                        isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/[0.08]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleLayerMode(layer.id)}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                          !isTraditional
                            ? 'bg-violet-600 text-white shadow-sm'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-900'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Artify Unified State</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleLayerMode(layer.id)}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                          isTraditional
                            ? 'bg-amber-600 text-white shadow-sm'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-900'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Traditional Friction</span>
                      </button>
                    </div>
                  </div>

                  {/* Headline & Summary */}
                  <div className="mb-6">
                    <h5 className="text-base sm:text-lg font-bold text-foreground mb-2">
                      {layer.headline}
                    </h5>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      {layer.summary}
                    </p>
                  </div>

                  {/* Dynamic View State (Friction vs Transformed) */}
                  <AnimatePresence mode="wait">
                    {isTraditional ? (
                      <motion.div
                        key="traditional"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`p-5 rounded-2xl border mb-6 ${
                          isLight
                            ? 'bg-amber-50/70 border-amber-200 text-slate-800'
                            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider font-mono text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{layer.traditional.title}</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm">
                          {layer.traditional.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="text-amber-500 font-bold shrink-0 mt-0.5">✕</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="transformed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`p-5 rounded-2xl border mb-6 ${
                          isLight
                            ? 'bg-violet-50/70 border-violet-200 text-slate-800'
                            : 'bg-violet-950/20 border-violet-500/30 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider font-mono text-violet-600 dark:text-violet-400">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{layer.transformed.title}</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm mb-4">
                          {layer.transformed.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Capabilities Strip: Clean unboxed text list */}
                        <div className="pt-3 border-t border-border flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="font-mono text-foreground-muted">
                            Capabilities:
                          </span>
                          {layer.transformed.capabilities.map((cap, capIdx) => (
                            <React.Fragment key={cap}>
                              <span className="text-foreground font-medium">{cap}</span>
                              {capIdx < layer.transformed.capabilities.length - 1 && (
                                <span aria-hidden="true" className="text-zinc-500">·</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Connected Entities & Quantified Metrics Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4 border-t border-border">
                    <div className="md:col-span-7">
                      <div className="text-[11px] font-mono text-foreground-muted mb-1 flex items-center justify-between">
                        <span>Synchronized Layer Entities:</span>
                        <span className="text-zinc-500">{layer.telemetryStream.protocol}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                        {layer.entities.map((ent, entIdx) => (
                          <React.Fragment key={ent}>
                            <span>{ent}</span>
                            {entIdx < layer.entities.length - 1 && (
                              <span aria-hidden="true" className="text-zinc-600">/</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center">
                      {layer.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.04]'
                          }`}
                        >
                          <div className="text-sm sm:text-base font-bold font-mono text-violet-500">
                            {m.value}
                          </div>
                          <div className="text-[10px] text-foreground-muted truncate mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
            </AnimatePresence>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DESTINATION CONVERGENCE: ONE INTELLIGENT BUSINESS */}
        {/* ========================================================================= */}
        <div id="business-map-bottom" className="relative mt-20 lg:mt-28 max-w-4xl mx-auto">
          {/* Connecting converging light beam */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]"
              />
              <div className="h-10 w-0.5 bg-gradient-to-b from-emerald-400 to-violet-500" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-3xl p-8 sm:p-12 text-center border overflow-hidden shadow-2xl ${
              isLight
                ? 'bg-gradient-to-b from-white via-violet-50/60 to-emerald-50/40 border-violet-300 shadow-violet-200/50'
                : 'bg-gradient-to-b from-[#0e0c1a] via-[#090812] to-[#060b10] border-violet-500/40 shadow-[0_20px_60px_rgba(139,92,246,0.18)]'
            }`}
          >
            {/* Ambient Radial Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-violet-600/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Unboxed convergence kicker */}
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Signature Convergence · The Artify Synthesis</span>
              </div>

              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight mb-4 text-foreground">
                ONE INTELLIGENT BUSINESS
              </h3>

              <p
                className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8 ${
                  isLight ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                All six layers—People, Processes, Data, Systems, AI, and Integrations—now communicate through a single,
                real-time event and cognitive mesh. Decisions happen in milliseconds, manual handoffs disappear, and
                your technology evolves continuously with your market.
              </p>

              {/* 3 Outcome Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                <div
                  className={`p-4 rounded-2xl border ${
                    isLight ? 'bg-white/80 border-slate-200 shadow-xs' : 'bg-white/[0.03] border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-violet-500 uppercase font-mono mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Real-Time Coherence</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Zero data lag between field actions, ledger mutations, and executive decisions.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isLight ? 'bg-white/80 border-slate-200 shadow-xs' : 'bg-white/[0.03] border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-500 uppercase font-mono mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Total Sovereignty</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Private cloud and on-premise execution with zero third-party training on your data.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    isLight ? 'bg-white/80 border-slate-200 shadow-xs' : 'bg-white/[0.03] border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-sky-500 uppercase font-mono mb-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Fluid Adaptability</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    New software and regulations integrate into the mesh in days rather than quarters.
                  </p>
                </div>
              </div>

              {/* Conversion Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={onOpenSolutionBuilder}
                  onMouseEnter={() => playHoverSound(0.04)}
                  id="business-map-cta-wizard"
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-violet-600 hover:bg-violet-500 transition-all flex items-center gap-2 shadow-xl shadow-violet-600/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Your Architecture Blueprint</span>
                </button>

                <button
                  onClick={onNavigateToContact}
                  onMouseEnter={() => playHoverSound(0.04)}
                  id="business-map-cta-contact"
                  className={`px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm border transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                    isLight
                      ? 'border-slate-300 text-slate-800 bg-white hover:bg-slate-100 shadow-xs'
                      : 'border-white/[0.12] text-zinc-200 bg-white/[0.05] hover:bg-white/[0.1]'
                  }`}
                >
                  <span>Talk to Principal Architect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onOpenConsultant && (
                  <button
                    onClick={onOpenConsultant}
                    onMouseEnter={() => playHoverSound(0.04)}
                    className={`px-5 py-3.5 rounded-xl font-medium text-xs sm:text-sm border transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      isLight
                        ? 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                        : 'border-white/[0.08] text-zinc-400 bg-transparent hover:text-white'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 text-violet-400" />
                    <span>Ask AI Advisor</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
