import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Bot,
  Cpu,
  Workflow,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Database,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { INDUSTRIES_DATA } from '../data/solutionsData';

interface SolutionBuilderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteBrief: (brief: any) => void;
  initialIndustryId?: string;
  theme?: 'light' | 'dark';
}

export const SolutionBuilderWizard: React.FC<SolutionBuilderWizardProps> = ({
  isOpen,
  onClose,
  onCompleteBrief,
  initialIndustryId,
  theme,
}) => {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustryId || 'finance');
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([
    'autonomous-agents',
    'intelligent-automation',
  ]);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([
    'Financial reporting & reconciliation',
    'Cross-system data sync',
  ]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([
    'ERP (NetSuite / SAP)',
    'CRM (Salesforce / HubSpot)',
    'SQL Database',
  ]);
  const [organizationScale, setOrganizationScale] = useState('Mid-Market (50-500 employees)');

  if (!isOpen) return null;

  const capabilitiesOptions = [
    { id: 'autonomous-agents', label: 'Autonomous AI Agents', desc: 'Goal-directed digital workers with tool execution' },
    { id: 'intelligent-automation', label: 'Intelligent Automation', desc: 'Zero-touch document and transaction processing' },
    { id: 'custom-platform', label: 'Custom Business Platform', desc: 'Bespoke ERP/CRM operating environment' },
    { id: 'conversational-bi', label: 'Conversational BI Dashboard', desc: 'Natural language queries over your data lake' },
    { id: 'mobile-executive', label: 'Executive Mobile Command', desc: 'Instant mobile approvals and alerts' },
  ];

  const workflowOptions = [
    'Financial reporting & multi-entity reconciliation',
    'Invoice processing & 3-way PO verification',
    'Customer intake, compliance & KYC validation',
    'Sales lead enrichment & automated pipeline updates',
    'HR onboarding, document generation & payroll audits',
    'Supply chain inventory forecasting & anomaly detection',
    'Real-time field operations & asset tracking',
    'Cross-system data synchronization & ETL pipelines',
  ];

  const integrationOptions = [
    'ERP (NetSuite / SAP / Dynamics)',
    'CRM (Salesforce / HubSpot)',
    'Accounting (QuickBooks / Xero)',
    'Payment & Banking (Stripe / Plaid)',
    'Databases (PostgreSQL / Snowflake / BigQuery)',
    'Communication (Slack / Teams / Email)',
    'Document Storage (Google Drive / SharePoint / S3)',
    'Custom In-House REST / GraphQL APIs',
  ];

  const toggleCapability = (id: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleWorkflow = (item: string) => {
    setSelectedWorkflows((prev) =>
      prev.includes(item) ? prev.filter((w) => w !== item) : [...prev, item]
    );
  };

  const toggleIntegration = (item: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    const brief = {
      industry: selectedIndustry,
      capabilities: selectedCapabilities,
      workflows: selectedWorkflows,
      integrations: selectedIntegrations,
      scale: organizationScale,
    };
    onCompleteBrief(brief);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl surface-modal rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border surface-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">
                Artify Solution Architect Wizard
              </h3>
              <p className="text-xs text-foreground-muted">
                Step {step} of 4 • Configure your custom AI architecture blueprint
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl btn-theme-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* Step 1: Industry & Scale */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-foreground font-display mb-1">
                  Select Your Industry & Organization Scale
                </h4>
                <p className="text-xs text-foreground-muted">
                  We customize AI models and compliance boundaries around your sector's regulatory framework.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted font-mono-code uppercase block mb-2">
                  Target Industry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {INDUSTRIES_DATA.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setSelectedIndustry(ind.id)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold transition-all ${
                        selectedIndustry === ind.id
                          ? 'btn-theme-primary shadow-md shadow-violet-600/30'
                          : 'surface-card text-foreground-secondary hover:border-violet-500/40'
                      }`}
                    >
                      {ind.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground-muted font-mono-code uppercase block mb-2">
                  Organization Scale
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    'Growth / Startup (1-50 employees)',
                    'Mid-Market (50-500 employees)',
                    'Enterprise (500+ employees)',
                  ].map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setOrganizationScale(sc)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold transition-all ${
                        organizationScale === sc
                          ? 'bg-violet-600/20 text-violet-400 border-2 border-violet-500'
                          : 'surface-card text-foreground-muted hover:border-violet-500/40'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Capabilities */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-foreground font-display mb-1">
                  Select Required AI Pillars & Architecture Layers
                </h4>
                <p className="text-xs text-foreground-muted">
                  Select one or more intelligence components you wish to deploy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilitiesOptions.map((cap) => {
                  const isChecked = selectedCapabilities.includes(cap.id);
                  return (
                    <div
                      key={cap.id}
                      onClick={() => toggleCapability(cap.id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all ${
                        isChecked
                          ? 'surface-card border-2 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                          : 'surface-card-subtle hover:border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-foreground font-display">{cap.label}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
                      </div>
                      <p className="text-xs text-foreground-muted">{cap.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Workflows to Automate */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-foreground font-display mb-1">
                  Select High-Impact Workflows to Automate
                </h4>
                <p className="text-xs text-foreground-muted">
                  Choose operational loops where your teams lose the most manual hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workflowOptions.map((wf) => {
                  const isChecked = selectedWorkflows.includes(wf);
                  return (
                    <div
                      key={wf}
                      onClick={() => toggleWorkflow(wf)}
                      className={`p-3.5 rounded-xl cursor-pointer text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-violet-600/20 text-violet-400 border border-violet-500'
                          : 'surface-card text-foreground-secondary hover:border-violet-500/40'
                      }`}
                    >
                      <span>{wf}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 ml-2" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Systems & Final Synthesis */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-foreground font-display mb-1">
                  Connect Your Existing Enterprise Stack
                </h4>
                <p className="text-xs text-foreground-muted">
                  Artify integrates directly with your existing software—zero rip-and-replace.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {integrationOptions.map((intg) => {
                  const isChecked = selectedIntegrations.includes(intg);
                  return (
                    <div
                      key={intg}
                      onClick={() => toggleIntegration(intg)}
                      className={`p-3 rounded-xl cursor-pointer text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-violet-600/20 text-violet-400 border border-violet-500'
                          : 'surface-card text-foreground-secondary hover:border-violet-500/40'
                      }`}
                    >
                      <span>{intg}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 ml-2" />}
                    </div>
                  );
                })}
              </div>

              {/* Live Blueprint Summary Box */}
              <div className="p-5 rounded-2xl surface-card-subtle border border-violet-500/40 text-xs font-mono-code text-foreground-secondary space-y-2">
                <div className="text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Zap className="w-4 h-4" />
                  <span>SYNTHESIZED ARCHITECTURAL CONFIGURATION</span>
                </div>
                <div>
                  <span className="text-foreground-muted">Industry:</span> <strong className="text-foreground">{selectedIndustry.toUpperCase()}</strong> ({organizationScale})
                </div>
                <div>
                  <span className="text-foreground-muted">Selected Capabilities:</span> <strong className="text-violet-400">{selectedCapabilities.length} Architecture Layers</strong>
                </div>
                <div>
                  <span className="text-foreground-muted">Target Workflows:</span> <strong className="text-emerald-400">{selectedWorkflows.length} Autonomous Loops</strong>
                </div>
                <div>
                  <span className="text-foreground-muted">Connected Systems:</span> <strong className="text-sky-400">{selectedIntegrations.length} Data Bridges</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-border surface-card flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold btn-theme-secondary px-4 py-2.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 text-xs font-semibold btn-theme-primary px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 text-xs font-semibold btn-theme-primary px-6 py-2.5 rounded-xl shadow-lg shadow-violet-600/40 transition-all"
            >
              <span>Transfer to Project Brief →</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
