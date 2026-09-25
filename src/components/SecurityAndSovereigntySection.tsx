import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  KeyRound,
  Link2,
  Server,
  Database,
  Bot,
  ArrowRight,
  HardDrive,
  Shield,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface SecurityAndSovereigntySectionProps {
  onNavigateToArchitecture?: () => void;
  onOpenConsultant?: () => void;
}

export const SecurityAndSovereigntySection: React.FC<SecurityAndSovereigntySectionProps> = ({
  onNavigateToArchitecture,
  onOpenConsultant,
}) => {
  const SECURITY_ATTRIBUTES = [
    {
      title: 'Data Ownership & Sovereignty',
      desc: 'Your business retains 100% legal, logical & cryptographic ownership over all corporate records and schemas.',
      icon: Database,
    },
    {
      title: 'Zero Third-Party AI Training',
      desc: 'Your operational data and documents are never ingested into external public LLM training corpuses.',
      icon: Bot,
    },
    {
      title: 'Immutable Audit Trails',
      desc: 'Tamper-evident cryptographic logs trace every query, record mutation, and executive approval.',
      icon: FileCheck2,
    },
    {
      title: 'Tenant Isolation & Privacy',
      desc: 'Strict logical and physical database boundaries prevent any possibility of multi-tenant data bleed.',
      icon: Server,
    },
    {
      title: 'Enterprise Encryption',
      desc: 'AES-256 encryption at rest and TLS 1.3 in transit with client-managed cryptographic keys.',
      icon: KeyRound,
    },
    {
      title: 'Granular Role-Based Access',
      desc: 'Field-level permission matrices govern exactly who can view, edit, or approve transactions.',
      icon: Lock,
    },
    {
      title: 'Flexible Deployment Topology',
      desc: 'Deploy on sovereign private cloud, in-country local data centers, or secure on-premises clusters.',
      icon: HardDrive,
    },
    {
      title: 'Clean API Data Mobility',
      desc: 'Full data portability with standards-compliant REST and event-stream exports anytime without penalties.',
      icon: Link2,
    },
  ];

  return (
    <section id="architecture" className="py-20 sm:py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: 3D Server & Shield Graphic */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center select-none">
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl" />

              {/* 3D Isometric Server Stack Graphic */}
              <div className="relative z-10 w-64 h-64 flex flex-col items-center justify-center">
                {/* Top Server Blade */}
                <div className="w-48 h-14 rounded-2xl surface-card border-2 border-blue-500/40 shadow-xl flex items-center justify-between px-4 mb-2.5 transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono-code font-bold text-foreground">NODE_01 • PRIMARY</span>
                  </div>
                  <Server className="w-4 h-4 text-[#0066FF]" />
                </div>

                {/* Middle Server Blade */}
                <div className="w-52 h-14 rounded-2xl surface-card border-2 border-blue-500/30 shadow-xl flex items-center justify-between px-4 mb-2.5 transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono-code font-bold text-foreground">NODE_02 • REPLICA</span>
                  </div>
                  <Database className="w-4 h-4 text-cyan-500" />
                </div>

                {/* Bottom Server Blade */}
                <div className="w-56 h-14 rounded-2xl surface-card border-2 border-blue-500/20 shadow-xl flex items-center justify-between px-4 transform -rotate-0.5 hover:rotate-0 transition-transform">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono-code font-bold text-foreground">NODE_03 • VAULT</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                </div>

                {/* Overlaid Sovereign Shield Badge */}
                <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-700 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 border-2 border-white/20">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sovereign Data Architecture Positioning */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code">
              <span>SOVEREIGN DATA ARCHITECTURE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] font-display">
              Your data is part of your business infrastructure.
            </h2>

            <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal">
              Artify builds systems where your business data remains under your absolute control — private, sovereign, and structured. Zero vendor lock-in, zero third-party AI training, and full regulatory compliance.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenConsultant}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0066FF] hover:text-blue-700 transition-colors"
              >
                <span>Speak with a Security &amp; Compliance Architect</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 8-Grid Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              {SECURITY_ATTRIBUTES.map((attr, idx) => {
                const Icon = attr.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl surface-card border border-card-border flex items-start gap-3 hover:border-[#0066FF]/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#0066FF] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {attr.title}
                      </h4>
                      <p className="text-[11px] text-foreground-secondary leading-relaxed mt-0.5">
                        {attr.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
