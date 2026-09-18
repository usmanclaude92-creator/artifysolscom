import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, ShieldAlert, Sparkles, Sliders, ArrowRight, RefreshCw, Cpu, Layers } from 'lucide-react';

export const TrustStatement: React.FC = () => {
  return (
    <section id="problem" className="relative py-24 bg-[#050508] border-y border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-700/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sliders className="w-3.5 h-3.5 text-violet-400" />
            <span>THE PHILOSOPHY OF ADAPTIVE SOFTWARE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5 font-display">
            The Paradigm Shift.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-200 to-sky-400 mt-2">
              Architecting Systems Around How You Actually Operate.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Traditional software forces companies to conform their processes, culture, and strategy to the limits of rigid software architectures. Artify reverses this paradigm: we build intelligent, adaptive systems designed entirely around your business reality.
          </p>
        </motion.div>

        {/* 2-Column Direct Paradigm Contrast with subtle framer-motion whileInView animation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Legacy / Rigid Paradigm (The Problem Card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 rounded-3xl bg-[#09090e] border border-red-500/20 hover:border-red-500/40 transition-colors relative overflow-hidden flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase font-bold text-red-400 tracking-wider">
                      THE TRADITIONAL VENDOR PARADIGM
                    </span>
                    <h3 className="text-xl font-bold text-white font-display">
                      Business Adapts to Software
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  Rigid & Expensive
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Forces your teams to rewrite proven processes to match pre-baked vendor screens</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Saddles you with massive license fees for bloated modules your business will never touch</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Leaves critical corporate data fragmented across disconnected spreadsheets and silos</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Requires multi-million dollar, 18-month code upgrades whenever your business evolves</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-mono-code text-zinc-400">
              Result: Operational friction, frustrated employees, and frozen innovation.
            </div>
          </motion.div>

          {/* The Artify Adaptive Paradigm (The Solution Card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 rounded-3xl bg-gradient-to-b from-violet-950/40 to-[#0c0c16] border-2 border-violet-500/50 hover:border-violet-400/80 relative overflow-hidden shadow-2xl shadow-violet-950/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-400/40 text-violet-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase font-bold text-violet-300 tracking-wider">
                      THE ARTIFY ADAPTIVE PARADIGM
                    </span>
                    <h3 className="text-xl font-bold text-white font-display">
                      Software Adapts to Business
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Adaptive & Intelligent
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-zinc-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Engineered specifically around your exact organizational workflows and proprietary taxonomy</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Enhanced by next-generation autonomous AI agents that eliminate 85%+ of repetitive administrative toil</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unifies all departments into a live, queryable enterprise knowledge graph with sub-second insights</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dynamically adapts data structures and workflows as your company expands, acquires, or scales globally</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-violet-500/20 text-xs font-mono-code text-violet-300 font-semibold flex items-center justify-between">
              <span>Result: Unconstrained enterprise agility, sovereign data, and lasting competitive velocity.</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
