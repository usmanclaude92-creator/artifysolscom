import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  CheckCircle2,
  Calendar,
  FileCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const DeploymentMethodology: React.FC<{ onNavigateToContact?: () => void }> = ({
  onNavigateToContact,
}) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const phases = [
    {
      phase: 'Phase 01',
      title: 'Operational Deep-Dive & Reality Audit',
      timeframe: 'Weeks 1 – 2',
      badge: 'Discovery',
      summary: 'We embed with your operational leads, finance team, and IT directors to map exact processes, data bottlenecks, and edge cases.',
      deliverables: ['Current Workflow & Bottleneck Heatmap', 'Data Source & Legacy API Schema Audit', 'Bespoke Architecture & Agent Topology Spec'],
    },
    {
      phase: 'Phase 02',
      title: 'Architectural Blueprint & Data Ingestion',
      timeframe: 'Weeks 3 – 4',
      badge: 'Architecture',
      summary: 'We establish sovereign tenant environments, map data schemas, deploy vector indexes, and configure integration bridges.',
      deliverables: ['Sovereign VPC / Database Deployment', 'Historical Data Cleansing & Ingestion', 'Security RBAC & Policy Boundary Definition'],
    },
    {
      phase: 'Phase 03',
      title: 'Custom Engineering & Multi-Agent Tuning',
      timeframe: 'Weeks 5 – 8',
      badge: 'Build & Calibrate',
      summary: 'We configure custom business logic, train cognitive document parsers on your actual forms, and choreograph multi-agent swarms.',
      deliverables: ['Custom Operational Modules & Workflows', 'Cognitive Parser & Anomaly Guardrail Calibration', 'End-to-End Test Runs in Staging Sandbox'],
    },
    {
      phase: 'Phase 04',
      title: 'Human-in-the-Loop Shadow & Verification',
      timeframe: 'Weeks 9 – 10',
      badge: 'Validation',
      summary: 'The system runs in parallel with existing processes, verifying accounting balances, rota assignments, and order execution without risk.',
      deliverables: ['Live Parallel Shadow Run Testing', 'Discrepancy Reporting & Policy Refinement', 'Executive Sign-Off & User Onboarding'],
    },
    {
      phase: 'Phase 05',
      title: 'Full Production Deployment & Continuous Scale',
      timeframe: 'Week 11 onwards',
      badge: 'Live Operations',
      summary: 'Production go-live with 24/7 autonomous monitoring, continuous prompt and schema adaptation, and dedicated engineering support.',
      deliverables: ['Zero-Downtime Production Cutover', 'Real-Time Telemetry & SLA Guarantee', 'Continuous Model & Business Rule Adaptation'],
    },
  ];

  return (
    <section id="methodology" className="py-28 bg-[#040406] border-t border-white/[0.06] relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-[5%] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-700/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Rocket className="w-3.5 h-3.5 text-violet-400" />
            <span>RAPID & RISK-FREE DEPLOYMENT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display mb-4">
            From Reality to Live System in Weeks.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-sky-300 to-indigo-300">
              Not Multi-Year ERP Nightmares.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Legacy ERP implementations take 18–36 months and fail over 50% of the time. Artify uses an agile, architecture-first methodology that validates real data in weeks, protecting your operations from disruption.
          </p>
        </div>

        {/* 5-Phase Horizontal Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mb-12">
          {phases.map((ph, idx) => {
            const isSelected = activePhaseIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-violet-950/60 to-[#0c0c16] border-violet-500/70 shadow-lg shadow-violet-950/40 scale-[1.02]'
                    : 'bg-[#09090f] border-white/[0.08] hover:border-violet-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-white/[0.05] text-violet-300">
                      {ph.phase}
                    </span>
                    <span className="text-[11px] font-mono-code text-zinc-400">
                      {ph.timeframe}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-display mb-2">
                    {ph.title}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                    {ph.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono-code text-violet-400 font-semibold">
                  {ph.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase Details Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0d0d16] via-[#090910] to-[#0d0d16] border border-violet-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono-code block mb-1">
              Active Phase Deliverables: {phases[activePhaseIndex].phase} — {phases[activePhaseIndex].timeframe}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-4">
              {phases[activePhaseIndex].title}
            </h3>
            <div className="space-y-2">
              {phases[activePhaseIndex].deliverables.map((del, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{del}</span>
                </div>
              ))}
            </div>
          </div>

          {onNavigateToContact && (
            <button
              onClick={onNavigateToContact}
              className="px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-violet-600/30 shrink-0"
            >
              <span>Schedule Architecture Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
