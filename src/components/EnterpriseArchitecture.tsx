import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Lock,
  Workflow,
  Sparkles,
  Server,
  Cloud,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const EnterpriseArchitecture: React.FC<{ onNavigateToContact?: () => void }> = ({
  onNavigateToContact,
}) => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const architectureLayers = [
    {
      level: 'Layer 01',
      name: 'User Experience & Edge Interfaces',
      tagline: 'Multi-device portals, mobile apps, WhatsApp gateways & executive dashboards',
      icon: Zap,
      components: ['Native iOS & Android Mobile Apps', 'Ultra-Responsive Web Dashboards', 'Conversational WhatsApp & Telegram Bots', 'Voice & Natural Language Gateways', 'Role-Governed Executive Portals'],
      description: 'Delivers instantaneous, friction-free interactions for field crews, shop-floor operators, managers, and the C-suite with sub-second feedback loops and offline resilience.',
      security: 'Biometric MFA, WebAuthn & Granular Role-Based Access Control (RBAC)',
    },
    {
      level: 'Layer 02',
      name: 'Autonomous Intelligence & Multi-Agent Swarms',
      tagline: 'Cognitive reasoning, document parsers, policy guardrails & predictive engines',
      icon: Cpu,
      components: ['LangGraph / Multi-Agent Networks', 'Zero-Shot Cognitive Document OCR', 'Predictive Cash & Inventory Forecasters', 'Real-Time Financial Anomaly Sentinels', 'Executive Briefing Scribes'],
      description: 'Domain-trained AI agents execute specialized tasks across multiple systems, verifying policies, checking compliance, and drafting operational artifacts automatically.',
      security: 'Isolated Agent Sandbox, Prompt Injection Shields & Strict Operational Boundaries',
    },
    {
      level: 'Layer 03',
      name: 'Business Logic & Adaptive Workflow Orchestration',
      tagline: 'Event-driven state machines, approval gates & integration buses',
      icon: Workflow,
      components: ['Deterministic State Machine Engine', 'Human-in-the-Loop Approval Queues', 'Webhook & Event Streaming Mesh', 'Cross-System Transaction Managers', 'Statutory Policy Validation Gates'],
      description: 'Guarantees that every autonomous agent action conforms strictly to your corporate bylaws, financial regulations, and executive approval chains without brittle code lock-in.',
      security: 'Cryptographic Audit Trails & Immutable Action Versioning',
    },
    {
      level: 'Layer 04',
      name: 'Unified Data Fabric & Knowledge Graph',
      tagline: 'Relational masters, vector embeddings, time-series telemetry & caches',
      icon: Database,
      components: ['High-Throughput PostgreSQL / pgvector', 'Enterprise Vector Knowledge Stores', 'Redis Semantic & Analytical Caches', 'Change Data Capture (CDC) Real-Time Sync', 'Strict Multi-Tenant Row-Level Security'],
      description: 'Unifies fragmented enterprise data into a coherent, queryable knowledge graph—eliminating siloed spreadsheets and enabling cross-department conversational intelligence.',
      security: 'AES-256 Encryption at Rest & In-Transit, Sovereign Tenant Isolation',
    },
    {
      level: 'Layer 05',
      name: 'Cloud, Infrastructure & Sovereign Security',
      tagline: 'Private VPCs, Kubernetes clusters, hybrid on-premises & zero-trust networks',
      icon: Cloud,
      components: ['Private Cloud (GCP, AWS, Azure)', 'On-Premises Hybrid Deployment Ready', 'Docker & Automated Kubernetes Clusters', 'Zero-Trust Network Architecture', 'Continuous Automated Backup & Recovery'],
      description: 'Engineered for 99.99% high availability, sub-10ms intra-region latency, and full customer data sovereignty with zero third-party model training on your proprietary data.',
      security: 'SOC2 Compliant Architecture, Zero-Trust Ingress & Egress',
    },
  ];

  const current = architectureLayers[activeLayer];
  const CurrentIcon = current.icon;

  return (
    <section id="platform" data-section="architecture" className="py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Server className="w-3.5 h-3.5 text-primary" />
            <span>ENTERPRISE ARCHITECTURE BLUEPRINT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            Engineered for Scale, Security & Resilience.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500">
              A 5-Layer Production-Grade Foundation.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
            Every Artify deployment is structured across five decoupled, fault-tolerant architectural layers. This guarantees sub-second response times, complete data sovereignty, and limitless operational scalability.
          </p>
        </div>

        {/* 5-Layer Stack Interactive Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Stack Layers Selector */}
          <div className="lg:col-span-5 space-y-3">
            {architectureLayers.map((layer, idx) => {
              const Icon = layer.icon;
              const isSelected = activeLayer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveLayer(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'surface-card border-2 border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'surface-card-subtle border-card-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'surface-card text-foreground-muted group-hover:text-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code font-bold uppercase text-primary block">
                        {layer.level}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary leading-tight">
                        {layer.name}
                      </h3>
                    </div>
                  </div>

                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Layer Deep-Dive Blueprint Card */}
          <div className="lg:col-span-7 p-8 rounded-3xl surface-card border border-primary/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/25">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-primary">
                    {current.level} DEEP-DIVE
                  </span>
                  <h3 className="text-xl font-bold text-foreground font-display">
                    {current.name}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-sm text-foreground-secondary leading-relaxed mb-6">
              {current.description}
            </p>

            {/* Architecture Components */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-mono-code block mb-3">
                Architectural Components:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.components.map((comp, i) => (
                  <div key={i} className="p-2.5 rounded-xl surface-container-sunken border border-container-sunken-border flex items-center gap-2 text-xs text-foreground-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Guardrail */}
            <div className="p-4 rounded-xl surface-container-accent border border-primary/25 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase font-mono-code text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">
                  Security & Isolation Standard:
                </span>
                <p className="text-xs text-foreground-secondary leading-relaxed font-normal">
                  {current.security}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
