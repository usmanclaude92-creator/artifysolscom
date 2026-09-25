import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileText,
  BadgeDollarSign,
  Users,
  ShieldCheck,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface FeaturedEcosystemShowcaseProps {
  onNavigateToCaseStudies?: () => void;
  onOpenSolutionBuilder?: () => void;
}

export const FeaturedEcosystemShowcase: React.FC<FeaturedEcosystemShowcaseProps> = ({
  onNavigateToCaseStudies,
  onOpenSolutionBuilder,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'overview' | 'procurement' | 'financials'>('overview');

  const FEATURES = [
    { label: 'Projects & Contracts', desc: 'Subcontractor master agreements, RFIs, and change-order tracking' },
    { label: 'Procurement', desc: 'Automated 3-way PO matching and supplier dispatch approvals' },
    { label: 'Finance & Accounting', desc: 'Job-costing ledgers, retention reserves, and progress billings' },
    { label: 'Workforce & HR', desc: 'Site biometrics, statutory labor limits, and WPS payroll' },
    { label: 'Documents & Compliance', desc: 'Drawing version control, safety audits, and municipal permits' },
    { label: 'Reporting & Analytics', desc: 'Real-time project burn rate and executive margin forecasting' },
  ];

  return (
    <section className="py-20 sm:py-28 bg-background-subtle/50 border-t border-border relative overflow-hidden transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code mb-3">
            <span>FEATURED ECOSYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] font-display mb-4">
            Construction Management Ecosystem
          </h2>

          <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal">
            End-to-end project management with integrated finance, procurement, HR and document control — built for real-world construction operations.
          </p>

          <div className="pt-3">
            <button
              onClick={onNavigateToCaseStudies}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0066FF] hover:text-blue-700 transition-colors"
            >
              <span>View Case Study</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Interactive Feature Visual + Feature Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left / Center: Interactive Application Dashboard Preview */}
          <div className="lg:col-span-8">
            <div className="p-5 sm:p-7 rounded-3xl surface-card border border-card-border shadow-2xl shadow-blue-500/5 overflow-hidden">
              
              {/* App Mockup Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold font-display text-foreground ml-2">
                    Artify BuildOS • Muscat Marina Tower
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-background-subtle p-1 rounded-xl border border-border text-xs">
                  <button
                    onClick={() => setSelectedSubTab('overview')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      selectedSubTab === 'overview'
                        ? 'surface-card text-foreground shadow-xs font-bold'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setSelectedSubTab('procurement')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      selectedSubTab === 'procurement'
                        ? 'surface-card text-foreground shadow-xs font-bold'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    Procurement
                  </button>
                  <button
                    onClick={() => setSelectedSubTab('financials')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      selectedSubTab === 'financials'
                        ? 'surface-card text-foreground shadow-xs font-bold'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    Financials
                  </button>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-xl surface-container-sunken border border-border">
                  <span className="text-[10px] font-mono-code uppercase font-semibold text-foreground-muted block mb-1">
                    Progress
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-foreground font-display">
                    68%
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-[#0066FF] h-1.5 rounded-full w-[68%]" />
                  </div>
                </div>

                <div className="p-4 rounded-xl surface-container-sunken border border-border">
                  <span className="text-[10px] font-mono-code uppercase font-semibold text-foreground-muted block mb-1">
                    Allocated Budget
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-foreground font-display">
                    $12.4M
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    On track (94% utilized)
                  </span>
                </div>

                <div className="p-4 rounded-xl surface-container-sunken border border-border">
                  <span className="text-[10px] font-mono-code uppercase font-semibold text-foreground-muted block mb-1">
                    Logged Labor
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-foreground font-display">
                    121K hrs
                  </div>
                  <span className="text-[10px] text-[#0066FF] font-medium">
                    100% WPS compliant
                  </span>
                </div>
              </div>

              {/* Recent Activity Live Stream */}
              <div className="p-4 rounded-xl surface-card border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-mono-code">
                    Real-Time Operational Activity
                  </span>
                  <span className="text-[10px] text-emerald-500 font-mono-code flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE MESH
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-foreground-secondary">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background-subtle">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>PO #8942 Structural Steel batch verified against delivery slip</span>
                    </div>
                    <span className="text-[10px] font-mono-code text-foreground-muted">2m ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background-subtle">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#0066FF]" />
                      <span>Shift roster updated: 42 technicians assigned to Zone C concrete pour</span>
                    </div>
                    <span className="text-[10px] font-mono-code text-foreground-muted">14m ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background-subtle">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span>Municipal MEP Inspection certificate attached to Project Vault</span>
                    </div>
                    <span className="text-[10px] font-mono-code text-foreground-muted">1h ago</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Features List matching Image 2 */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-base font-bold text-foreground font-display mb-2">
              Integrated Architectural Capabilities:
            </h3>

            <div className="space-y-3">
              {FEATURES.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl surface-card border border-card-border flex items-start gap-3 hover:border-[#0066FF]/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-[#0066FF] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      {feat.label}
                    </h4>
                    <p className="text-[11px] text-foreground-muted leading-relaxed mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenSolutionBuilder}
                className="w-full py-2.5 px-4 rounded-xl border border-[#0066FF]/30 text-[#0066FF] hover:bg-[#0066FF]/10 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>Design My Custom Ecosystem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
