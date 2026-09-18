import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ArrowRight,
  Sparkles,
  Building,
  Building2,
  Truck,
  HardHat,
  Factory,
  ShoppingBag,
  Stethoscope,
  Briefcase,
  Hotel,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface IndustryData {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  challenges: string;
  solution: string;
  keyWorkflows: string[];
}

export const INDUSTRIES_SHOWCASE: IndustryData[] = [
  {
    id: 'contracting',
    name: 'Construction & Contracting',
    tagline: 'Project retainage, sub-contractor billing, IPC certificates & field manpower',
    icon: HardHat,
    challenges: 'Disorganized site variation claims, delayed client progress billings, subcontractor retention tracking errors.',
    solution: 'Automates Interim Payment Certificates (IPC), subcontractor retention ledgers, and site labor biometric attendance in real time.',
    keyWorkflows: ['BOQ variance tracking', 'Subcontractor retention auto-matching', 'Site workforce biometric sync', 'Equipment utilization log'],
  },
  {
    id: 'trading',
    name: 'Trading & Distribution',
    tagline: 'Multi-currency import/export, landed cost calculations, L/C & container tracking',
    icon: Truck,
    challenges: 'Unclear landed cost margins due to shipping demurrage, customs clearance fees, and multi-currency exchange fluctuations.',
    solution: 'Auto-calculates landed cost down to the individual SKU, tracks Letter of Credit (L/C) milestones, and syncs container customs status.',
    keyWorkflows: ['Multi-currency landed cost engine', 'L/C and bank guarantee tracking', 'Container logistics radar', 'Dynamic price book per channel'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Processing',
    tagline: 'Multi-level Bill of Materials (BOM), scrap tracking, machine runtime & batch tracing',
    icon: Factory,
    challenges: 'Raw material wastage, hidden downtime on manufacturing lines, and batch recall risks.',
    solution: 'Tracks multi-level BOM consumption, automates machine shift logs, and enforces end-to-end batch genealogy from raw input to finished pallet.',
    keyWorkflows: ['Dynamic BOM with scrap factors', 'Batch & lot serialization', 'Shop-floor tablet terminal', 'Preventative maintenance scheduler'],
  },
  {
    id: 'services',
    name: 'Professional & Business Services',
    tagline: 'Project burn rates, timesheets, milestone billing & talent utilization',
    icon: Briefcase,
    challenges: 'Scope creep, unbilled consultant hours, and delayed milestone client approvals.',
    solution: 'Real-time project margin telemetry linking consultant timesheets directly to contract milestones and automated progress invoicing.',
    keyWorkflows: ['Timesheet-to-invoice auto-bridge', 'Consultant utilization analytics', 'Fixed-fee burn rate radar', 'Client project portal'],
  },
  {
    id: 'retail',
    name: 'Retail & Multi-Branch Chains',
    tagline: 'Omnichannel POS, central warehouse replenishment, loyalty & cash drawer reconciliation',
    icon: ShoppingBag,
    challenges: 'Discrepancies between physical shop stock and online orders, manual end-of-day register balancing.',
    solution: 'Sub-second inventory synchronization across all branches and e-commerce, with automated POS drawer audit reconciliations.',
    keyWorkflows: ['Omnichannel unified catalog', 'Inter-branch stock transfers', 'Automated POS cash drawer audit', 'Customer reward ledger'],
  },
  {
    id: 'logistics',
    name: 'Logistics, Fleet & Transport',
    tagline: 'Fleet fuel telemetry, driver trip allowances, route optimization & proof-of-delivery',
    icon: Truck,
    challenges: 'Spiraling fuel costs, lost paper Delivery Notes (DN), and chaotic driver trip settlement.',
    solution: 'GPS-synced driver mobile app with digital signoff, fuel card reconciliation, and automated trip allowance processing.',
    keyWorkflows: ['Digital Proof of Delivery (e-POD)', 'Fleet maintenance telemetry', 'Trip expense auto-settlement', 'Waybill generation engine'],
  },
];

interface IndustryShowcaseProps {
  onSelectIndustry?: (industryId: string) => void;
  onNavigateToContact?: () => void;
  onNavigateToAllIndustries?: () => void;
}

export const IndustryShowcase: React.FC<IndustryShowcaseProps> = ({
  onSelectIndustry,
  onNavigateToContact,
  onNavigateToAllIndustries,
}) => {
  const handleViewAllIndustries = () => {
    // If an element with id="industry-explorer" exists on the page, smoothly scroll to it
    const explorerEl = document.getElementById('industry-explorer');
    if (explorerEl) {
      explorerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Otherwise, invoke the route handler to navigate to the dedicated Industry Explorer
    if (onNavigateToAllIndustries) {
      onNavigateToAllIndustries();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/industries';
    }
  };

  return (
    <section id="industries" className="py-28 bg-[#040407] border-t border-white/[0.06] relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-700/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Building className="w-3.5 h-3.5 text-violet-400" />
              <span>DOMAIN-SPECIFIC ENTERPRISE ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display mb-4">
              Tailored for Your Industry.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-sky-300 to-indigo-300">
                Engineered for Your Reality.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Every vertical has unyielding operational nuances. We don’t force a construction contractor to fit into a retail mold, or a multi-currency distributor into a simple e-commerce setup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <button
              onClick={handleViewAllIndustries}
              id="btn-view-all-industries-header"
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-violet-600/30"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>View All Industries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onNavigateToContact && (
              <button
                onClick={onNavigateToContact}
                className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.1] text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>Request Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 6 Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES_SHOWCASE.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                className="p-7 rounded-3xl bg-[#09090f] border border-white/[0.08] hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-violet-950/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-700/40 text-violet-300 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono-code text-zinc-400 uppercase tracking-wider">
                      Specialized
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display mb-1.5 group-hover:text-violet-200 transition-colors">
                    {ind.name}
                  </h3>

                  <p className="text-xs text-zinc-400 font-mono-code mb-4 leading-relaxed">
                    {ind.tagline}
                  </p>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-4">
                    <span className="text-[10px] uppercase font-mono-code text-zinc-400 block mb-1">
                      Target Solution:
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                      {ind.solution}
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] uppercase font-mono-code text-violet-400/90 font-bold block mb-2">
                      Key Tailored Workflows:
                    </span>
                    {ind.keyWorkflows.map((wf, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{wf}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-mono-code">100% Bespoke Data Model</span>
                  {onSelectIndustry && (
                    <button
                      onClick={() => onSelectIndustry(ind.id)}
                      className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Workflows</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner to Detailed Industry Explorer */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#0a0a14] to-[#0d0d18] border border-violet-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-mono-code font-bold uppercase mb-2.5">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>14+ Deep Domain Blueprints Available</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Need deep architecture for your specific vertical?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 leading-relaxed">
              Browse our complete interactive Industry Explorer covering Financial Services, Healthcare, Logistics, Precision Manufacturing, Construction, Energy, Legal, Hospitality, and more.
            </p>
          </div>
          <button
            onClick={handleViewAllIndustries}
            id="btn-view-all-industries-banner"
            className="px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-violet-600/30 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Building2 className="w-4 h-4" />
            <span>View All Industries</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
