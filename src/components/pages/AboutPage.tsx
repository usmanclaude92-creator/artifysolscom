import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Cpu, Globe, Users, Lock, Award, Zap, Key, Server } from 'lucide-react';
import { AboutAndVision } from '../AboutAndVision';
import { TechnologyStack } from '../TechnologyStack';
import { AboutPartnerAccessSection } from '../AboutPartnerAccessSection';
import { PartnerAccessModal } from '../PartnerAccessModal';
import { updatePageSeo } from '../../utils/seo';

interface AboutPageProps {
  onNavigateToContact: (brief?: any) => void;
  onNavigateToAiSolutions: () => void;
  theme?: 'dark' | 'light';
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToContact,
  onNavigateToAiSolutions,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  React.useEffect(() => {
    updatePageSeo({
      title: 'About Artify Solutions - We Believe Software Should Think',
      description: 'Learn about Artify Solutions, our AI engineering philosophy, enterprise security standards, multi-agent frameworks, partner access policies, and leadership vision.',
      canonicalUrl: 'https://artifysols.com/about',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRequestPartnerAccess = () => {
    const partnerBrief = {
      isPartnerRequest: true,
      industry: 'technology',
      projectDescription: `Partner & Client Portal Access Credential Request:
Company: [Your Organization Name]
Access Level Required: Enterprise Partner & AI Coworker Mesh
Target Integration Systems: SAP / NetSuite / Salesforce / Custom REST APIs
Deployment Model: Dedicated Private VPC
Estimated Agent Operations: 500,000+ monthly autonomous tasks`,
      currentTools: 'Enterprise ERP, CRM, REST APIs, OAuth2/mTLS',
      timeline: 'Immediate (Next 7-14 Days)',
    };
    onNavigateToContact(partnerBrief);
  };

  return (
    <div
      className={`min-h-screen ${
        isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-[#F5F5F5]'
      } transition-colors duration-300 pt-20 sm:pt-28 pb-24`}
    >
      <AboutAndVision
        onNavigateToContact={handleRequestPartnerAccess}
      />

      {/* Enterprise Partner & Backend Access Policy Section */}
      <AboutPartnerAccessSection
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onNavigateToContact={handleRequestPartnerAccess}
        theme={theme}
      />

      <div className="mt-16">
        <TechnologyStack />
      </div>

      {/* Security design */}
      <div className="w-[92%] sm:w-[88%] max-w-7xl mx-auto mt-20 pt-16 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c0c14] border border-white/[0.08] text-center">
            <ShieldCheck className="w-8 h-8 text-violet-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Audit Trails</h4>
            <p className="text-xs text-zinc-400 mt-1">Agent actions are logged so your team can review them.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0c0c14] border border-white/[0.08] text-center">
            <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Privacy-Focused Design</h4>
            <p className="text-xs text-zinc-400 mt-1">Zero data persistence options and dynamic PII tokenization.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0c0c14] border border-white/[0.08] text-center">
            <Globe className="w-8 h-8 text-sky-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Multi-Region VPC</h4>
            <p className="text-xs text-zinc-400 mt-1">Deploy on AWS, GCP, Azure, or air-gapped on-premise clusters.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0c0c14] border border-white/[0.08] text-center">
            <Cpu className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">High-Availability Design</h4>
            <p className="text-xs text-zinc-400 mt-1">Distributed worker pools built to keep services running.</p>
          </div>
        </div>
      </div>

      {/* Partner Access & Backend Governance Modal */}
      <PartnerAccessModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        onRequestAccessViaContact={handleRequestPartnerAccess}
        theme={theme}
      />
    </div>
  );
};
