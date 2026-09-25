import React, { useState } from 'react';
import {
  Users,
  Cog,
  Database,
  Layers,
  Bot,
  Link2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Workflow,
  Cpu,
  BarChart3,
  Compass,
  Building2,
  Eye,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface ArtifyEcosystemDiagramProps {
  onOpenSolutionBuilder?: () => void;
  onNavigateToSolutions?: () => void;
}

export const ArtifyEcosystemDiagram: React.FC<ArtifyEcosystemDiagramProps> = ({
  onOpenSolutionBuilder,
  onNavigateToSolutions,
}) => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const ECOSYSTEM_LAYERS = [
    {
      num: '01',
      title: 'Business Architecture',
      tagline: 'Understand how your business actually operates.',
      description: 'We audit your operating models, profit centers, entity hierarchies, statutory obligations, and real-world stakeholder bottlenecks before writing a single line of code.',
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      deliverables: ['Operating model analysis', 'Stakeholder interviews', 'Bottleneck & ROI mapping'],
    },
    {
      num: '02',
      title: 'Digital Architecture',
      tagline: 'Design the ecosystem connecting your operations.',
      description: 'We construct the unified blueprint connecting all facets of your company — defining the event bus, authorization matrices, data contracts, and operational state machines.',
      icon: Compass,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      deliverables: ['System boundary maps', 'Event-driven mesh design', 'High-availability infrastructure topology'],
    },
    {
      num: '03',
      title: 'Enterprise Software',
      tagline: 'Build the systems your business actually needs.',
      description: 'Software is an instrument inside the ecosystem — bespoke ERP, CRM, HCMS, supply chain, and specialized operating engines engineered without SaaS template limitations.',
      icon: Layers,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#0066FF]/10',
      borderColor: 'border-[#0066FF]/30',
      deliverables: ['Tailored ERP & HCMS modules', 'Zero seat licensing costs', '100% bespoke business logic'],
    },
    {
      num: '04',
      title: 'AI & Autonomous Workflows',
      tagline: 'Automate repetitive decisions and operational processes.',
      description: 'Deploy cognitive workers deep inside operational pipelines — reading incoming invoices, performing 3-way reconciliation, flagging compliance risks, and automating approvals.',
      icon: Bot,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      deliverables: ['Document understanding engines', 'Autonomous policy validation', 'Human-in-the-loop exception queues'],
    },
    {
      num: '05',
      title: 'Data Architecture',
      tagline: 'Create one reliable foundation for your business data.',
      description: 'Eliminate fragmented spreadsheets and isolated databases. Establish sovereign, structured, cryptographic data repositories where your enterprise retains total ownership.',
      icon: Database,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      deliverables: ['Single enterprise source of truth', 'Sovereign on-prem / cloud storage', 'Audit-proof cryptographic logs'],
    },
    {
      num: '06',
      title: 'Integration Architecture',
      tagline: 'Connect internal systems, external platforms, APIs and services.',
      description: 'Unify banking rails, supplier EDI gateways, government compliance portals, IoT telemetry, and legacy systems into one synchronous, real-time message backbone.',
      icon: Link2,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      deliverables: ['Bank & gateway direct connectors', 'Government WPS & tax integrations', 'Real-time WebSocket & webhook relays'],
    },
    {
      num: '07',
      title: 'Experience Layer',
      tagline: 'Give employees, management, clients and partners the right interfaces.',
      description: 'Every stakeholder gets an interface tailored to their exact responsibilities — from field technician mobile PWAs to CFO executive control decks and client portals.',
      icon: Eye,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      deliverables: ['Role-specific executive decks', 'Mobile field inspection PWAs', 'Branded client self-service portals'],
    },
  ];

  const currentLayer = ECOSYSTEM_LAYERS[activeLayer];

  return (
    <section id="ecosystem" className="py-20 sm:py-28 bg-background-subtle/50 border-t border-border relative overflow-hidden transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Section 03: Explaining "Enterprise Ecosystem" */}
        <div className="max-w-4xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code mb-3">
            <span>WHAT IS AN ARTIFY ENTERPRISE ECOSYSTEM?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.12] font-display mb-6">
            An integrated digital environment{' '}
            <span className="text-[#0066FF] block">
              designed around your business.
            </span>
          </h2>

          {/* Clarification Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl surface-card border border-border flex items-center gap-3">
              <span className="text-rose-500 font-mono-code font-bold text-sm">✕</span>
              <span className="text-xs sm:text-sm font-semibold text-foreground-secondary">
                Not one application.
              </span>
            </div>
            <div className="p-4 rounded-xl surface-card border border-border flex items-center gap-3">
              <span className="text-rose-500 font-mono-code font-bold text-sm">✕</span>
              <span className="text-xs sm:text-sm font-semibold text-foreground-secondary">
                Not another SaaS subscription.
              </span>
            </div>
            <div className="p-4 rounded-xl surface-card border border-border flex items-center gap-3">
              <span className="text-rose-500 font-mono-code font-bold text-sm">✕</span>
              <span className="text-xs sm:text-sm font-semibold text-foreground-secondary">
                Not a collection of disconnected tools.
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal">
            An Artify Enterprise Ecosystem connects your entire operation into one intelligent, unified organism. Software is an instrument inside the ecosystem, not the product definition itself.
          </p>
        </div>

        {/* Signature Artify Visual: Business Strategy to Intelligent Business */}
        <div className="mb-20 p-6 sm:p-8 rounded-3xl surface-card border-2 border-card-border shadow-xl shadow-blue-500/5">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#0066FF] block mb-1">
              THE SIGNATURE ARTIFY VISUAL
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground font-display">
              From Strategy to Intelligent Business
            </h3>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="max-w-3xl mx-auto flex flex-col items-center space-y-3 sm:space-y-4">
            
            {/* Step 1: Business Strategy */}
            <div className="px-6 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono-code font-bold text-xs sm:text-sm uppercase tracking-wider">
              BUSINESS STRATEGY
            </div>

            <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-border" />

            {/* Step 2: Business Processes */}
            <div className="px-6 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-mono-code font-bold text-xs sm:text-sm uppercase tracking-wider">
              BUSINESS PROCESSES
            </div>

            <div className="w-0.5 h-4 bg-gradient-to-b from-indigo-500 to-border" />

            {/* Step 3: Triad: People | Data | Operations */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
              <div className="py-2.5 px-2 rounded-xl surface-card-subtle border border-cyan-500/40 text-center">
                <span className="text-[11px] sm:text-xs font-mono-code font-bold text-cyan-600 dark:text-cyan-400">
                  PEOPLE
                </span>
              </div>
              <div className="py-2.5 px-2 rounded-xl surface-card-subtle border border-emerald-500/40 text-center">
                <span className="text-[11px] sm:text-xs font-mono-code font-bold text-emerald-600 dark:text-emerald-400">
                  DATA
                </span>
              </div>
              <div className="py-2.5 px-2 rounded-xl surface-card-subtle border border-purple-500/40 text-center">
                <span className="text-[11px] sm:text-xs font-mono-code font-bold text-purple-600 dark:text-purple-400">
                  OPERATIONS
                </span>
              </div>
            </div>

            <div className="w-0.5 h-4 bg-gradient-to-b from-border to-[#0066FF]" />

            {/* Step 4: Artify Ecosystem Core */}
            <div className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-[#0066FF] text-white shadow-lg shadow-blue-500/25 text-center">
              <div className="text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider">
                ARTIFY ECOSYSTEM
              </div>
              <span className="text-[10px] text-white/80 font-mono-code">
                Custom Orchestration & Unified Nervous System
              </span>
            </div>

            <div className="w-0.5 h-4 bg-gradient-to-b from-[#0066FF] to-border" />

            {/* Step 5: 5 Components: Software | AI | APIs | Analytics | Automation */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-2xl">
              <div className="py-2 px-1 rounded-xl surface-card border border-border text-center">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-foreground">Software</span>
              </div>
              <div className="py-2 px-1 rounded-xl surface-card border border-border text-center">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-purple-500">AI</span>
              </div>
              <div className="py-2 px-1 rounded-xl surface-card border border-border text-center">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-cyan-500">APIs</span>
              </div>
              <div className="py-2 px-1 rounded-xl surface-card border border-border text-center">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-blue-500">Analytics</span>
              </div>
              <div className="col-span-2 sm:col-span-1 py-2 px-1 rounded-xl surface-card border border-border text-center">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-emerald-500">Automation</span>
              </div>
            </div>

            <div className="w-0.5 h-4 bg-gradient-to-b from-border to-emerald-500" />

            {/* Step 6: Intelligent Business */}
            <div className="px-7 py-3 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-mono-code font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md">
              INTELLIGENT BUSINESS
            </div>

          </div>
        </div>

        {/* Section 04: The 7 Ecosystem Layers */}
        <div>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF] font-mono-code block mb-2">
              THE 7 ECOSYSTEM LAYERS
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground font-display">
              We engineer every layer of your digital business.
            </h3>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-2">
              Rather than generic isolated services, Artify designs each interdependent layer for complete architectural coherence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive 7 Layers List */}
            <div className="lg:col-span-5 space-y-2.5">
              {ECOSYSTEM_LAYERS.map((layer, idx) => {
                const Icon = layer.icon;
                const isSelected = activeLayer === idx;
                return (
                  <button
                    key={layer.num}
                    onClick={() => setActiveLayer(idx)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? 'surface-card border-[#0066FF] shadow-lg shadow-blue-500/10 ring-1 ring-[#0066FF]'
                        : 'surface-card-subtle border-border hover:border-[#0066FF]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${layer.bgColor} border ${layer.borderColor} flex items-center justify-center ${layer.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-code font-bold text-[#0066FF]">
                            {layer.num}
                          </span>
                          <span className={`text-sm font-bold font-display ${isSelected ? 'text-foreground' : 'text-foreground-secondary group-hover:text-foreground'}`}>
                            {layer.title}
                          </span>
                        </div>
                        <p className="text-xs text-foreground-muted line-clamp-1">
                          {layer.tagline}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#0066FF] translate-x-1' : 'text-foreground-muted opacity-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Layer Detail Card */}
            <div className="lg:col-span-7">
              <div className="p-7 sm:p-8 rounded-3xl surface-card border-2 border-[#0066FF]/30 shadow-2xl shadow-blue-500/5 relative">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${currentLayer.bgColor} border ${currentLayer.borderColor} flex items-center justify-center ${currentLayer.color}`}>
                      {React.createElement(currentLayer.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono-code font-bold uppercase text-[#0066FF]">
                        LAYER {currentLayer.num} • ARCHITECTURE
                      </span>
                      <h4 className="text-xl font-bold text-foreground font-display">
                        {currentLayer.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono-code text-foreground-muted px-2.5 py-1 rounded-full surface-card border border-border">
                    Engineered by Artify
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-foreground mb-3 font-display">
                  {currentLayer.tagline}
                </p>

                <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed mb-6">
                  {currentLayer.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-border">
                  <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-foreground-muted block">
                    Core Architectural Deliverables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentLayer.deliverables.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl surface-card-subtle border border-border text-xs text-foreground font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <span className="text-xs text-foreground-muted">
                    Ready to engineer this layer for your business?
                  </span>
                  <button
                    onClick={onOpenSolutionBuilder}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Configure This Layer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
