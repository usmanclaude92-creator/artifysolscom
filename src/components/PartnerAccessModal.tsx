import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Key,
  Server,
  FileText,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  Building2,
  Users,
  Cpu,
  ArrowRight,
  Info,
  Check,
  Globe,
  Database,
  Terminal,
} from 'lucide-react';
import { safeCopyToClipboard } from '../utils/clipboard';

interface PartnerAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestAccessViaContact: () => void;
  theme?: 'dark' | 'light';
}

export const PartnerAccessModal: React.FC<PartnerAccessModalProps> = ({
  isOpen,
  onClose,
  onRequestAccessViaContact,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'policy' | 'roles' | 'protocol' | 'template'>('policy');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const sampleTemplate = `Subject: Artify Solutions Partner & Client Portal Access Request
Organization: [Your Company / Enterprise Name]
Corporate Domain: [yourname@company.com]
Desired Access Level: [Enterprise Partner / Growth Client / Security Auditor]
Target AI Systems & Workflows: [e.g., Autonomous Financial Reconciliation, Multi-Agent ERP Orchestration, Hybrid Graph RAG]
Infrastructure Requirement: [Dedicated Private VPC / AWS / GCP / Azure / Air-Gapped On-Premise]
Estimated Monthly Agentic Throughput: [e.g., 500,000+ operations / month]
Security & Compliance Standards Needed: [SOC2 Type II / HIPAA / GDPR / Custom mTLS]`;

  const handleCopyTemplate = async () => {
    const success = await safeCopyToClipboard(sampleTemplate);
    if (success) {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      id="partner-access-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl border border-card-border surface-card text-foreground shadow-2xl overflow-hidden my-8 transition-all"
        id="partner-access-modal"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-border surface-card-subtle relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase border bg-primary/10 text-primary border-primary/25">
                  Access Governance Policy
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25">
                  Restricted Environment
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
                Enterprise Backend & Partner Portal Access
              </h2>
              <p className="text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed text-foreground-muted">
                The Artify Solutions Client Portal, autonomous agent coworker clusters, and production REST APIs are restricted to authorized enterprise partners and licensed organizations.
              </p>
            </div>

            <button
              onClick={onClose}
              id="partner-modal-close-btn"
              className="p-2 rounded-xl border border-border surface-card text-foreground-muted hover:text-foreground transition-all"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 relative z-10 border-t border-border pt-4">
            {[
              { id: 'policy', label: 'Access Policy & Overview', icon: ShieldCheck },
              { id: 'roles', label: 'Role-Based Access (RBAC)', icon: Key },
              { id: 'protocol', label: 'Request Credentials Protocol', icon: Server },
              { id: 'template', label: 'Procurement Template', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'btn-theme-primary text-white shadow-lg shadow-primary/25'
                      : 'surface-card text-foreground-muted hover:text-foreground border border-border'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: ACCESS POLICY */}
          {activeTab === 'policy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-200 flex items-start gap-3.5">
                <Lock className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold">Enterprise Security Mandate:</span> Due to real-time integration with corporate financial ledgers, ERP systems (SAP, NetSuite, Salesforce), and proprietary vector indices, unauthenticated or unauthorized public registration is strictly prohibited. Access is provisioned exclusively by Artify Solutions SOC architects following contract execution or vetted trial agreements.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-card-border surface-card">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/25 flex items-center justify-center mb-3">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold font-display text-foreground">What the Backend Controls</h4>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-foreground-muted">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Deterministic AI Coworker Fleets & Agent Mesh</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Sub-40ms Vector RAG & Knowledge Graph Traversal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Zero-Exception Financial Reconciliation Workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>API Keys, Token Quotas, and Webhook Endpoints</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border border-card-border surface-card">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold font-display text-foreground">Governance & Auditability</h4>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-foreground-muted">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Cryptographic Session Tokens with Role Scoping</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>SOC2 Type II Aligned Immutable Telemetry Logs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Private VPC & Air-Gapped Cluster Isolation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Human-in-the-Loop High-Risk Approval Escalations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RBAC ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs text-foreground-muted">
                Artify Solutions enforces strict Role-Based Access Control (RBAC) across all backend REST endpoints and portal views:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Super Admin */}
                <div className="p-4 rounded-2xl border border-primary/25 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary font-mono-code">ROLE: SUPER_ADMIN</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">Root Access</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mt-1">Super Administrator</h4>
                  <p className="text-xs mt-1 leading-relaxed text-foreground-muted">
                    Root infrastructure orchestration, global AI coworker fleet policies, CMS page publishing, and master billing engine controls.
                  </p>
                </div>

                {/* Enterprise Partner */}
                <div className="p-4 rounded-2xl border border-blue-500/25 bg-blue-500/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono-code">ROLE: ENTERPRISE_PARTNER</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300">Client Exec</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mt-1">Enterprise Partner</h4>
                  <p className="text-xs mt-1 leading-relaxed text-foreground-muted">
                    Multi-agent coworker deployment, dedicated private VPC cluster monitoring, sub-40ms vector RAG benchmarks, and API rate limit keys.
                  </p>
                </div>

                {/* Growth Client */}
                <div className="p-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono-code">ROLE: GROWTH_CLIENT</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">Standard Tier</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mt-1">Growth Client</h4>
                  <p className="text-xs mt-1 leading-relaxed text-foreground-muted">
                    Licensed AI products management, SEO health telemetry, invoices, usage graphs, and API key regeneration.
                  </p>
                </div>

                {/* Compliance Auditor */}
                <div className="p-4 rounded-2xl border border-border surface-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground-muted font-mono-code">ROLE: AUDITOR</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full surface-card-subtle text-foreground-muted border border-border">Read-Only</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mt-1">Compliance & Security Auditor</h4>
                  <p className="text-xs mt-1 leading-relaxed text-foreground-muted">
                    Zero-persistence verification, SOC2 Type II cryptographic audit trails, and execution safety policy compliance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REQUEST PROTOCOL */}
          {activeTab === 'protocol' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="relative pl-6 border-l-2 border-primary/40 space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Submit Access Request via Contact Form</h4>
                  <p className="text-xs mt-1 leading-relaxed text-foreground-muted">
                    Navigate to the Contact page and select <strong>"Strategic AI Partnership & Access Request"</strong>. Specify your organization, verified corporate email domain, target ERP/CRM integrations, and expected agent workload.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Security Vetting & Tenant Provisioning</h4>
                  <p className="text-xs mt-1 leading-relaxed text-foreground-muted">
                    Our Security Operations Center validates domain authenticity and provisions an isolated tenant cluster (or dedicated VPC) with specific role policies and cryptographic session encryption.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Credential Dispatch & Onboarding</h4>
                  <p className="text-xs mt-1 leading-relaxed text-foreground-muted">
                    You receive secure access credentials, an initial admin session token, sandbox environment keys, and an architecture orientation session with our Principal AI Architects.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-primary/25 surface-container-accent flex items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-primary">Ready to initiate partner credentialing?</h5>
                  <p className="text-[11px] text-foreground-muted">
                    Our partner review SLA is typically under 24 hours for verified corporate domains.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onRequestAccessViaContact();
                  }}
                  className="px-4 py-2 rounded-xl btn-theme-primary text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-md shadow-primary/25 hover:scale-[1.02]"
                >
                  <span>Open Contact Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROCUREMENT TEMPLATE */}
          {activeTab === 'template' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-foreground-muted">
                  Use this structured format in the Contact Brief to fast-track your enterprise authorization:
                </p>
                <button
                  onClick={handleCopyTemplate}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    copiedTemplate
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'surface-card text-foreground-muted hover:text-foreground border-border'
                  }`}
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-border surface-container-sunken font-mono-code text-xs leading-relaxed overflow-x-auto select-all text-emerald-600 dark:text-emerald-400">
                <pre>{sampleTemplate}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 sm:p-8 border-t border-border surface-card-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>End-to-end encrypted · SOC2 Type II Aligned</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold border border-border surface-card hover:surface-card-subtle text-foreground transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestAccessViaContact();
              }}
              id="partner-modal-request-cta"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl btn-theme-primary text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Credentials via Contact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
