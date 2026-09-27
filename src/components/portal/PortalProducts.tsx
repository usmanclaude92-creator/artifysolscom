import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Mail } from 'lucide-react';

interface PortalProductsProps {
  theme?: 'dark' | 'light';
}

export const PortalProducts: React.FC<PortalProductsProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Purchased AI Systems
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
          Self-service deployment management for purchased products.
        </p>
      </div>

      <div className={`p-10 text-center rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
        <Layers className={`w-8 h-8 mx-auto mb-3 opacity-60 ${isLight ? 'text-violet-500' : 'text-violet-400'}`} />
        <h3 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Not available yet</h3>
        <p className={`text-xs max-w-md mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
          Self-service deployment tracking and telemetry for purchased AI systems isn't part of the Client Portal yet. For
          the status of an active engagement or deployment, reach out to your account manager — see the{' '}
          <strong>Subscriptions</strong> tab for your contracted products and services.
        </p>
        <a
          href="mailto:support@artifysols.com"
          className={`mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${
            isLight ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-violet-600 text-white hover:bg-violet-500'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Support</span>
        </a>
      </div>
    </div>
  );
};
