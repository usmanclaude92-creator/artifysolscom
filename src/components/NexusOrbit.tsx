import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Database, Cpu, Workflow, LineChart, Network, Zap } from 'lucide-react';

interface OrbitNode {
  id: string;
  name: string;
  category: string;
  icon: any;
  angle: number;
  distance: number;
  description: string;
  color: string;
}

/**
 * The interactive "Nexus: Your Business" orbit shown on the home page hero. Shared so other pages (for example Our Ecosystem)
 * can show the exact same visual. `className` lets the caller place it in its own grid column.
 */
export const NexusOrbit: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeNode, setActiveNode] = useState<string | null>('agents');
  const [pulseCount, setPulseCount] = useState(0);
  // Orbit diagram size, so every node can sit exactly on the middle ring (inset-16 = 64px).
  const orbitRef = useRef<HTMLDivElement>(null);
  const [orbitSize, setOrbitSize] = useState(0);
  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;
    const measure = () => setOrbitSize(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const ringRadius = orbitSize > 0 ? orbitSize / 2 - 64 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const nodes: OrbitNode[] = [
    {
      id: 'agents',
      name: 'AUTONOMOUS',
      category: 'Autonomous Workforce',
      icon: Bot,
      angle: 0,
      distance: 175,
      description: 'AI agents that take care of routine tasks, with your people reviewing the decisions that matter.',
      color: '#8B5CF6',
    },
    {
      id: 'data',
      name: 'DATABASE',
      category: 'Unified Knowledge Graph',
      icon: Database,
      angle: 51,
      distance: 180,
      description: 'Brings your data sources together so your team can search and use them in one place.',
      color: '#38BDF8',
    },
    {
      id: 'automation',
      name: 'AUTOMATION',
      category: 'Zero-Touch Execution',
      icon: Cpu,
      angle: 102,
      distance: 175,
      description: 'Automates repetitive steps so your team can focus on work that needs judgment.',
      color: '#10B981',
    },
    {
      id: 'software',
      name: 'SOFTWARE',
      category: 'Adaptive Enterprise Platforms',
      icon: Zap,
      angle: 154,
      distance: 185,
      description: 'Custom web and mobile software built around how your business works.',
      color: '#F59E0B',
    },
    {
      id: 'workflows',
      name: 'WORKFLOWS',
      category: 'Self-Healing Pipelines',
      icon: Workflow,
      angle: 205,
      distance: 175,
      description: 'Connects steps across departments so work moves forward without manual hand-offs.',
      color: '#EC4899',
    },
    {
      id: 'analytics',
      name: 'ANALYTICS',
      category: 'Predictive Intelligence',
      icon: LineChart,
      angle: 257,
      distance: 180,
      description: 'Ask questions in plain language and get answers from your own data.',
      color: '#6366F1',
    },
    {
      id: 'integrations',
      name: 'INTEGRATIONS',
      category: 'Connected Ecosystem',
      icon: Network,
      angle: 308,
      distance: 175,
      description: 'Connects the tools you already use, such as ERP, CRM and cloud services.',
      color: '#14B8A6',
    },
  ];

  const selectedNodeData = nodes.find((n) => n.id === activeNode) || nodes[0];

  return (
          <motion.div
            className={`flex flex-col items-center justify-center relative w-full ${className}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div ref={orbitRef} className="relative w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[506px] aspect-square flex items-center justify-center scale-[0.88] xs:scale-95 sm:scale-100 origin-center">
              
              {/* Concentric subtle rings */}
              <div className="absolute inset-4 rounded-full border border-violet-500/15 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full border border-sky-500/15 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-28 rounded-full border border-indigo-500/20" />

              {/* Dynamic SVG Connection Lines & Data Pulses */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox={`0 0 ${orbitSize || 460} ${orbitSize || 460}`}>
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {nodes.map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const centerX = (orbitSize || 460) / 2;
                  const centerY = centerX;
                  const reach = ringRadius > 0 ? ringRadius : node.distance * 0.95;
                  const targetX = centerX + Math.cos(rad) * reach;
                  const targetY = centerY + Math.sin(rad) * reach;
                  const isSelected = activeNode === node.id;

                  return (
                    <g key={`connection-${node.id}`}>
                      {/* Connection Line */}
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={targetX}
                        y2={targetY}
                        stroke={isSelected ? '#8B5CF6' : 'currentColor'}
                        strokeWidth={isSelected ? '2' : '1'}
                        strokeDasharray={isSelected ? 'none' : '3 3'}
                        className={`transition-all duration-300 ${
                          isSelected ? 'text-violet-500' : 'text-slate-400/60 dark:text-white/20'
                        }`}
                      />
                      {/* Animated traveling data packet */}
                      <circle
                        r={isSelected ? '3.5' : '2'}
                        fill={node.color}
                        opacity={isSelected ? 0.9 : 0.5}
                      >
                        <animateMotion
                          path={`M ${centerX} ${centerY} L ${targetX} ${targetY}`}
                          dur={`${2.2 + (i % 3) * 0.6}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* Center Node: YOUR BUSINESS */}
              <div className="relative z-20 flex flex-col items-center justify-center w-28 h-28 rounded-full bg-gradient-to-b from-[#181822] to-[#0d0d12] border-2 border-violet-500/60 shadow-[0_0_40px_rgba(139,92,246,0.35)] cursor-pointer group">
                <div className="absolute inset-0 rounded-full bg-violet-600/10 animate-ping opacity-30" />
                <div className="w-3 h-3 rounded-full bg-violet-400 mb-1.5 shadow-sm shadow-violet-300 animate-pulse" />
                <span className="text-[12px] uppercase tracking-widest text-violet-300 font-bold font-mono-code">
                  NEXUS
                </span>
                <span className="text-[14.5px] font-black tracking-tight text-white font-display text-center leading-tight">
                  YOUR<br />BUSINESS
                </span>
              </div>

              {/* Orbiting Nodes */}
              {nodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const orbitR = ringRadius > 0 ? ringRadius : (node.distance * (orbitSize || 460)) / 460;
                const base = orbitSize || 460;
                const top = 50 + (Math.sin(rad) * orbitR * 100) / base;
                const left = 50 + (Math.cos(rad) * orbitR * 100) / base;
                const isSelected = activeNode === node.id;
                const IconComponent = node.icon;

                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    id={`hero-node-${node.id}`}
                    style={{
                      top: `${top}%`,
                      left: `${left}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute z-20 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group focus:outline-none ${
                      isSelected
                        ? 'surface-card border-2 border-primary shadow-[0_0_25px_rgba(139,92,246,0.4)] scale-110'
                        : 'surface-card-subtle border border-card-border hover:border-primary/40'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center mb-1"
                      style={{
                        backgroundColor: `${node.color}20`,
                        color: node.color,
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider text-foreground whitespace-nowrap font-mono-code">
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Node Telemetry Card */}
            <div className="w-full max-w-[420px] mt-4 p-4 rounded-xl surface-card border border-card-border backdrop-blur-md shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedNodeData.color }}
                  />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono-code">
                    {selectedNodeData.name}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground-secondary font-medium leading-relaxed">
                {selectedNodeData.description}
              </p>
            </div>

          </motion.div>
  );
};
