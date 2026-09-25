import React from 'react';
import {
  HardHat,
  Users,
  BadgeDollarSign,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot,
  Building2,
  Sliders,
} from 'lucide-react';

interface EnterpriseSystemsGridProps {
  onOpenSolutionBuilder?: (systemId?: string) => void;
  onNavigateToSolutions?: () => void;
}

export const EnterpriseSystemsGrid: React.FC<EnterpriseSystemsGridProps> = ({
  onOpenSolutionBuilder,
  onNavigateToSolutions,
}) => {
  const ECOSYSTEM_EXAMPLES = [
    {
      id: 'construction',
      title: 'Construction Ecosystem',
      subtitle: 'Multi-site contractor & project infrastructure',
      icon: HardHat,
      color: 'text-[#0066FF]',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      hoverBorder: 'hover:border-[#0066FF]',
      elements: [
        'Projects',
        'Contracts',
        'Procurement',
        'Finance',
        'Workforce',
        'Documents',
        'Clients',
        'Suppliers',
        'AI Operations',
      ],
      aiHighlight: 'Automated 3-way subcontractor invoice reconciliation & site safety telemetry.',
    },
    {
      id: 'workforce',
      title: 'Workforce Ecosystem',
      subtitle: 'Autonomous human capital & compliance engine',
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/50',
      borderColor: 'border-teal-200 dark:border-teal-900/40',
      hoverBorder: 'hover:border-teal-500',
      elements: [
        'Employees',
        'Attendance',
        'Payroll',
        'WPS',
        'HR',
        'Documents',
        'Leave',
        'Compliance',
        'AI Automation',
      ],
      aiHighlight: 'Predictive overtime risk scoring & 100% automated statutory WPS file generation.',
    },
    {
      id: 'financial',
      title: 'Financial Ecosystem',
      subtitle: 'Multi-entity general ledger & treasury control',
      icon: BadgeDollarSign,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'border-amber-200 dark:border-amber-900/40',
      hoverBorder: 'hover:border-amber-500',
      elements: [
        'Accounting',
        'Banking',
        'Receivables',
        'Payables',
        'Projects',
        'Payments',
        'Reporting',
        'Analytics',
        'AI Finance',
      ],
      aiHighlight: 'Continuous ledger audit, fraud anomaly detection & instant tax report assembly.',
    },
    {
      id: 'customer',
      title: 'Customer Ecosystem',
      subtitle: 'Full commercial lifecycle & client engagement',
      icon: Briefcase,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'border-indigo-200 dark:border-indigo-900/40',
      hoverBorder: 'hover:border-indigo-500',
      elements: [
        'Leads',
        'CRM',
        'Sales',
        'Onboarding',
        'Subscriptions',
        'Support',
        'Billing',
        'Client Portal',
        'AI Engagement',
      ],
      aiHighlight: 'Autonomous lead triage, dynamic contract drafting & proactive churn prevention.',
    },
  ];

  return (
    <section id="ecosystems" className="py-20 sm:py-28 bg-background relative overflow-hidden transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Section 08 Header: Every business has its own ecosystem */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#0066FF] uppercase font-mono-code mb-3">
            <span>REAL ECOSYSTEM EXAMPLES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] font-display mb-4">
            Every business has its own ecosystem.
          </h2>

          <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal">
            Instead of forcing your enterprise into off-the-shelf software modules, we design connected environments tailored to the operating rhythm of your industry.
          </p>
        </div>

        {/* 4 Real Ecosystem Example Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-14">
          {ECOSYSTEM_EXAMPLES.map((eco) => {
            const Icon = eco.icon;
            return (
              <div
                key={eco.id}
                onClick={() => onOpenSolutionBuilder?.(eco.id)}
                className={`p-7 sm:p-8 rounded-3xl surface-card border-2 border-card-border ${eco.hoverBorder} transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${eco.bgColor} border ${eco.borderColor} flex items-center justify-center ${eco.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono-code text-foreground-muted px-2.5 py-1 rounded-full surface-card border border-border">
                      Integrated Environment
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground font-display mb-1 group-hover:text-[#0066FF] transition-colors">
                    {eco.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground-secondary mb-6 font-medium">
                    {eco.subtitle}
                  </p>

                  {/* Connected Elements Grid */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-mono-code uppercase font-bold text-foreground-muted block tracking-wider">
                      Connected Core Components
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {eco.elements.map((el, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg surface-card-subtle border border-border text-xs font-mono-code font-medium text-foreground hover:border-[#0066FF]/40 transition-colors"
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Integration Highlight */}
                  <div className="p-3.5 rounded-xl bg-blue-500/[0.04] dark:bg-blue-500/[0.08] border border-[#0066FF]/20 text-xs text-foreground-secondary flex items-start gap-2.5">
                    <Bot className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                    <span className="leading-snug">{eco.aiHighlight}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-xs font-bold text-foreground-muted group-hover:text-[#0066FF] transition-colors">
                  <span>Explore {eco.title} Architecture</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Punchline Callout Card */}
        <div className="p-8 sm:p-10 rounded-3xl surface-card border-2 border-[#0066FF]/40 shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-500/[0.03] to-indigo-500/[0.03]">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
              Your business doesn't fit a template?
            </h3>
            <p className="text-base sm:text-lg font-semibold text-[#0066FF]">
              Good. Neither does our architecture.
            </p>
            <p className="text-xs sm:text-sm text-foreground-secondary max-w-xl">
              Tell us about your operations, your people, and your data requirements. We will engineer an ecosystem that mirrors the way you actually work.
            </p>
          </div>

          <button
            onClick={() => onOpenSolutionBuilder?.()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all shrink-0 active:scale-95 group"
          >
            <span>Design My Ecosystem</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
