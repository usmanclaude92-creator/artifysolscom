import React, { useState, useEffect } from 'react';
import {
  Bot,
  Layers,
  Cpu,
  ArrowDown,
  Shield,
  Activity,
  CheckCircle2,
  Database,
  Terminal,
  Zap,
  DollarSign,
  Users,
  TrendingUp,
  Megaphone,
  Headphones,
  LineChart,
} from 'lucide-react';
import { AGENT_WORKFORCE } from '../data/solutionsData';
import { AgentProfile } from '../types';

export const AiAgentsSection: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile>(AGENT_WORKFORCE[0]);
  const [activeTab, setActiveTab] = useState<'agents' | 'architecture'>('agents');
  const [simulatedExecutionStep, setSimulatedExecutionStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedExecutionStep((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const businessSystemsList = [
    { name: 'ERP Platforms', desc: 'SAP, NetSuite, Dynamics', color: '#8B5CF6' },
    { name: 'CRM Systems', desc: 'Salesforce, HubSpot', color: '#38BDF8' },
    { name: 'Accounting & Banking', desc: 'QuickBooks, Plaid, Stripe', color: '#10B981' },
    { name: 'Email & Documents', desc: 'M365, Google Workspace, DocuSign', color: '#F59E0B' },
    { name: 'Databases & Warehouses', desc: 'PostgreSQL, Snowflake, BigQuery', color: '#EC4899' },
    { name: 'Cloud & Custom APIs', desc: 'AWS, Azure, REST, Webhooks', color: '#14B8A6' },
  ];

  return (
    <section id="ai-agents" className="py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full px-[5%] relative z-10">
        
        {/* Header */}
        <div className="w-full max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span>AI AGENTS & DIGITAL WORKFORCE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            Meet Your Digital Workforce.
          </h2>
          <p className="text-lg text-foreground-muted leading-relaxed font-normal mb-4">
            Imagine having a team that works 24/7 across every operational pillar—independently intelligent, rigorously controlled, and seamlessly orchestrated.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-foreground-muted">
            <span className="px-3 py-1 rounded-md surface-card-subtle border border-border text-primary">Financial Intelligence Analyst</span>
            <span className="px-3 py-1 rounded-md surface-card-subtle border border-border text-sky-600 dark:text-sky-300">Workforce Operations Specialist</span>
            <span className="px-3 py-1 rounded-md surface-card-subtle border border-border text-emerald-600 dark:text-emerald-300">Commercial Pipeline Researcher</span>
            <span className="px-3 py-1 rounded-md surface-card-subtle border border-border text-amber-600 dark:text-amber-300">Omnichannel Customer Agent</span>
            <span className="px-3 py-1 rounded-md surface-card-subtle border border-border text-pink-600 dark:text-pink-300">Autonomous Operations Coordinator</span>
            <span className="px-3 py-1 rounded-md surface-card-subtle border border-border text-indigo-600 dark:text-indigo-300">Continuous Reporting Sentinel</span>
          </div>
        </div>

        {/* 3-Tier Interactive Agent Orchestration Flow */}
        <div className="mb-16 p-8 rounded-3xl surface-card border border-card-border shadow-2xl relative">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-foreground-muted font-mono-code">
              MULTI-AGENT SYSTEM TOPOLOGY
            </span>
            <h3 className="text-2xl font-bold text-foreground mt-1 font-display">
              Autonomous Execution Architecture
            </h3>
          </div>

          {/* Tier 1: Artify AI Orchestrator */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/20 via-background to-primary/20 border-2 border-primary/50 shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-center gap-2 text-primary text-xs font-bold font-mono-code uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>CENTRAL SUPERVISOR</span>
              </div>
              <h4 className="text-xl font-extrabold text-foreground font-display">
                ARTIFY AI ORCHESTRATOR
              </h4>
              <p className="text-xs text-foreground-secondary mt-1 max-w-md mx-auto">
                Deconstructs high-level business goals, assigns sub-tasks to specialized agents, verifies policy guardrails, and aggregates outcomes.
              </p>
            </div>
          </div>

          {/* Animated Connecting Traces */}
          <div className="flex justify-center my-3 text-primary animate-bounce">
            <ArrowDown className="w-6 h-6" />
          </div>

          {/* Tier 2: Specialized Agents Carousel / Grid */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <span className="text-[11px] font-bold text-foreground-muted font-mono-code uppercase tracking-wider">
                SPECIALIZED DOMAIN AGENTS (CLICK TO INSPECT PERMISSIONS & TOOLS)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {AGENT_WORKFORCE.map((agent) => {
                const isSelected = selectedAgent.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    id={`agent-tab-${agent.id}`}
                    className={`p-3 rounded-xl text-left transition-all duration-200 focus:outline-none flex flex-col justify-between ${
                      isSelected
                        ? 'surface-card border-2 border-primary shadow-lg scale-105'
                        : 'surface-card-subtle border-card-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-md bg-primary/15 text-primary flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[13px] sm:text-sm font-bold text-foreground font-display leading-tight truncate">
                        {agent.name.split(' ')[0]} Agent
                      </div>
                      <div className="text-[11px] text-foreground-muted truncate mt-0.5">
                        {agent.department.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Connecting Traces */}
          <div className="flex justify-center my-3 text-sky-500 animate-bounce">
            <ArrowDown className="w-6 h-6" />
          </div>

          {/* Tier 3: Business Systems & Integrations */}
          <div>
            <div className="text-center mb-4">
              <span className="text-[11px] font-bold text-foreground-muted font-mono-code uppercase tracking-wider">
                CONNECTED ENTERPRISE BUSINESS SYSTEMS
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {businessSystemsList.map((sys, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl surface-card-subtle border border-border flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Database className="w-3.5 h-3.5 text-foreground-muted" />
                    <span className="text-xs font-bold text-foreground-secondary">{sys.name}</span>
                  </div>
                  <span className="text-[10px] text-foreground-muted font-mono-code">{sys.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Agent Inspector Panel */}
        <div className="p-8 rounded-2xl surface-card border border-primary/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-lg shadow-primary/25">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-foreground font-display">
                    {selectedAgent.name}
                  </h3>
                  <span className="text-[11px] font-bold font-mono-code text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                    {selectedAgent.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-primary font-medium mt-0.5">
                  Role: {selectedAgent.role} • Department: {selectedAgent.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono-code text-foreground-secondary">
              <div className="px-3.5 py-2 rounded-lg surface-card-subtle border border-border">
                <span className="text-foreground-muted block text-[10px]">THROUGHPUT</span>
                <span className="font-bold text-foreground">{selectedAgent.throughput}</span>
              </div>
              <div className="px-3.5 py-2 rounded-lg surface-card-subtle border border-border">
                <span className="text-foreground-muted block text-[10px]">SUPERVISION LEVEL</span>
                <span className="font-bold text-primary">Human-In-The-Loop</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool Access */}
            <div className="p-5 rounded-xl surface-container-sunken border border-container-sunken-border">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground-secondary uppercase tracking-wider font-mono-code mb-3">
                <Zap className="w-4 h-4 text-primary" />
                <span>PROVISIONED TOOLS</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-foreground-secondary surface-card border border-border px-2.5 py-1 rounded-md"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Strict Permissions & Boundaries */}
            <div className="p-5 rounded-xl surface-container-sunken border border-container-sunken-border">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground-secondary uppercase tracking-wider font-mono-code mb-3">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>SECURITY & ACCESS BOUNDARIES</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {selectedAgent.permissions}
              </p>
            </div>

            {/* Live Sample Telemetry / Action Log */}
            <div className="p-5 rounded-xl surface-container-sunken border border-container-sunken-border">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground-secondary uppercase tracking-wider font-mono-code mb-3">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>LAST AUTONOMOUS TELEMETRY TRACE</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono-code leading-relaxed bg-emerald-500/10 p-2.5 rounded border border-emerald-500/25">
                "{selectedAgent.sampleAction}"
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
