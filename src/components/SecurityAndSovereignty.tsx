import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Server,
  KeyRound,
  FileCheck2,
  Database,
  CloudOff,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const SecurityAndSovereignty: React.FC<{ onNavigateToContact?: () => void }> = ({
  onNavigateToContact,
}) => {
  const pillars = [
    {
      title: 'Zero Third-Party Model Training',
      badge: 'Confidentiality',
      icon: CloudOff,
      description: 'Your proprietary company documents, operational data, and customer records are never used to train public foundational AI models.',
    },
    {
      title: 'Dedicated Tenant Isolation',
      badge: 'Architecture',
      icon: Server,
      description: 'Every client operates within a strictly isolated, ring-fenced virtual database and compute environment with row-level security policies.',
    },
    {
      title: 'End-to-End Cryptographic Encryption',
      badge: 'Encryption',
      icon: Lock,
      description: 'Enterprise AES-256 encryption at rest and TLS 1.3 in-transit, with optional Customer-Managed Encryption Keys (CMEK).',
    },
    {
      title: 'Immutable Audit Logging & Versioning',
      badge: 'Compliance',
      icon: FileCheck2,
      description: 'Every autonomous agent recommendation, execution, and human approval is cryptographically logged for external audit readiness.',
    },
    {
      title: 'Granular Role-Based Access Control',
      badge: 'Governance',
      icon: UserCheck,
      description: 'Enforce principle-of-least-privilege across departments, allowing employees to access only the telemetry relevant to their verified role.',
    },
    {
      title: 'Hybrid & On-Premises Deployment',
      badge: 'Sovereignty',
      icon: Database,
      description: 'Deploy on your choice of sovereign cloud (UAE, KSA, EU, US regions) or within your private corporate on-premises data center.',
    },
  ];

  return (
    <section id="security" className="py-14 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>SOVEREIGN ENTERPRISE GOVERNANCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
              Enterprise Security, Compliance & Data Sovereignty.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500">
                Your Data Remains Strictly Yours.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed font-normal">
              Enterprise technology adoption demands uncompromising security. Artify’s architecture is built around the highest international standards of confidential compute, zero-trust access, and immutable auditability.
            </p>
          </div>

          {onNavigateToContact && (
            <button
              onClick={onNavigateToContact}
              className="px-5 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-2 self-start md:self-end"
            >
              <span>Request Security Whitepaper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 6 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl surface-card border border-card-border hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono-code text-foreground-muted uppercase tracking-wider">
                      {pil.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground font-display mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {pil.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed font-normal">
                    {pil.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono-code font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enforced by Default</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
