import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Eye,
  CheckCircle2,
  Compass,
  Cpu,
  Globe,
  Building2,
  Lock,
  Key,
  ShieldCheck,
  ArrowRight,
  FileCode,
} from 'lucide-react';
import { PartnerAccessModal } from './PartnerAccessModal';

interface AboutAndVisionProps {
  onOpenPartnerModal?: () => void;
  onNavigateToContact?: (brief?: any) => void;
}

export const AboutAndVision: React.FC<AboutAndVisionProps> = ({
  onOpenPartnerModal,
  onNavigateToContact,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const handleOpenDocs = () => {
    if (onOpenPartnerModal) {
      onOpenPartnerModal();
    } else {
      setInternalModalOpen(true);
    }
  };

  const handleRequestAccess = () => {
    const partnerBrief = {
      isPartnerRequest: true,
      industry: 'technology',
      projectDescription: `Partner & Client Portal Access Credential Request:
Company: [Your Organization Name]
Access Level Required: Enterprise Partner & AI Coworker Mesh
Target Integration Systems: SAP / NetSuite / Salesforce / Custom REST APIs
Deployment Model: Dedicated Private VPC / SOC2 High-Throughput Cluster
Estimated Agent Operations: 500,000+ monthly autonomous tasks`,
      currentTools: 'Enterprise ERP, CRM, REST APIs, OAuth2/mTLS',
      timeline: 'Immediate (Next 7-14 Days)',
    };
    if (onNavigateToContact) {
      onNavigateToContact(partnerBrief);
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] relative z-10">
        
        {/* Main Manifesto */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>OUR CORE BELIEF</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-8">
            We Believe Software{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-500">
              Should Think.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-foreground-muted leading-relaxed font-normal mb-8">
            For three decades, enterprise software has been passive—silent databases waiting for humans to click buttons, re-enter numbers, and manually copy data across screens.
          </p>

          <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium surface-container-accent border border-primary/25 p-6 rounded-2xl max-w-3xl mx-auto">
            At Artify Solutions, we engineer software that understands business objectives, orchestrates complex operations, catches anomalies before they impact revenue, and continuously evolves with your team.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          
          {/* Mission */}
          <div className="p-8 rounded-3xl surface-card border border-card-border relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/25">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-primary font-mono-code uppercase tracking-wider block mb-2">
              OUR MISSION
            </span>
            <h3 className="text-2xl font-bold text-foreground font-display mb-4">
              Empowering Organizations with Custom Intelligence
            </h3>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              To design and build AI-native software and agentic automation systems that empower forward-thinking organizations to operate with unprecedented speed, operational clarity, and precision.
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 rounded-3xl surface-card border border-card-border relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 border border-sky-500/25">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono-code uppercase tracking-wider block mb-2">
              OUR VISION
            </span>
            <h3 className="text-2xl font-bold text-foreground font-display mb-4">
              Technology Built Around the Business
            </h3>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              A world where no company is ever forced to conform to rigid off-the-shelf SaaS, but instead commands a bespoke, self-driving technology layer engineered specifically around their unique operational DNA.
            </p>
          </div>

        </div>

        {/* Access Governance Notice Bar */}
        <div className="max-w-5xl mx-auto p-6 sm:p-7 rounded-3xl surface-card border border-primary/25 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/25 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground font-display">
                    Authorized Partner & Backend Access Policy
                  </h4>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                    Restricted
                  </span>
                </div>
                <p className="text-xs text-foreground-muted mt-1">
                  The Client Portal & production AI coworker mesh are reserved for authorized Artify Solutions enterprise partners. Credentials can be requested via our contact brief.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                onClick={handleOpenDocs}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl surface-card-subtle hover:surface-card text-foreground border border-border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <FileCode className="w-3.5 h-3.5 text-primary" />
                <span>Governance Docs</span>
              </button>
              <button
                onClick={handleRequestAccess}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl btn-theme-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/25 transition-all"
              >
                <span>Request Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Internal Modal if rendered standalone */}
      <PartnerAccessModal
        isOpen={internalModalOpen}
        onClose={() => setInternalModalOpen(false)}
        onRequestAccessViaContact={handleRequestAccess}
      />
    </section>
  );
};

