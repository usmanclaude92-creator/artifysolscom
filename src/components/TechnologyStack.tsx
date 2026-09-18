import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  Database,
  Cloud,
  Shield,
  Smartphone,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const TechnologyStack: React.FC = () => {
  const stackCategories = [
    {
      title: 'AI & Agent Frameworks',
      icon: Cpu,
      items: ['Gemini 2.5/3.0 Models', 'LangGraph / Multi-Agent Networks', 'Vector Embeddings', 'Function Calling & Tool Calling', 'Semantic Caching'],
      color: '#8B5CF6',
    },
    {
      title: 'Data & Knowledge Storage',
      icon: Database,
      items: ['PostgreSQL / pgvector', 'Pinecone / Qdrant', 'Snowflake / BigQuery', 'Redis Semantic Cache', 'Change Data Capture (CDC)'],
      color: '#38BDF8',
    },
    {
      title: 'Platforms & Core Architecture',
      icon: Layers,
      items: ['TypeScript & Node.js', 'React 19 & Next.js', 'FastAPI & Python', 'gRPC & WebSocket Streams', 'Event-Driven Microservices'],
      color: '#10B981',
    },
    {
      title: 'Cloud & Sovereign Infrastructure',
      icon: Cloud,
      items: ['Google Cloud Platform', 'AWS Enterprise VPC', 'Microsoft Azure Gov/Cloud', 'Docker & Kubernetes', 'Zero-Trust Networks'],
      color: '#F59E0B',
    },
  ];

  return (
    <section className="py-28 bg-background border-t border-border relative overflow-hidden transition-colors duration-200">
      {/* Glow */}
      <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full px-[5%] relative z-10">
        
        {/* Header */}
        <div className="w-full max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>TECHNOLOGY ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display mb-4">
            Built on Modern Intelligence.
          </h2>
          <p className="text-lg text-foreground-muted leading-relaxed font-normal">
            We leverage production-hardened models, high-performance distributed databases, and modern cloud infrastructure designed for sub-second latency and zero data leaks.
          </p>
        </div>

        {/* 4 Tech Categories */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {stackCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl surface-card border border-card-border hover:border-primary/40 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                      border: `1px solid ${cat.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-4 font-display">
                    {cat.title}
                  </h3>

                  <ul className="space-y-2.5">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-foreground-secondary font-mono-code">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
