/**
 * Our Ecosystem (/ecosystem) — dedicated page replacing the old /#ecosystem
 * homepage anchor. Static, dependency-free (CSS + inline SVG only) so it adds
 * nothing to the homepage bundle: it is lazy-loaded as its own route chunk.
 * Capability areas are described as the ecosystem Artify designs and connects
 * for each client — not as a catalogue of off-the-shelf products.
 */
import React from 'react';
import {
  ArrowRight,
  ArrowDown,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  Cpu,
  Database,
  DollarSign,
  Eye,
  FileCheck2,
  HardHat,
  Layers,
  LayoutGrid,
  Lock,
  Network,
  Puzzle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Wallet,
  Boxes,
  Share2,
  UserCheck,
  Gauge,
} from 'lucide-react';
import { updatePageSeo } from '../../utils/seo';
import { EcosystemExplorer } from '../ecosystem/EcosystemExplorer';

interface EcosystemPageProps {
  onNavigateToContact: () => void;
  onOpenSolutionBuilder?: () => void;
  theme?: 'dark' | 'light';
}

const Eyebrow: React.FC<{ icon?: React.ElementType; children: React.ReactNode }> = ({ icon: Icon = Network, children }) => (
  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-5">
    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
    <span>{children}</span>
  </div>
);

const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500">{children}</span>
);

/** Horizontal-on-desktop / vertical-on-mobile chain of steps. */
const Chain: React.FC<{ steps: string[]; accent?: boolean }> = ({ steps, accent = false }) => (
  <ol className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-2 md:gap-1.5" role="list">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <li
          className={`px-3.5 py-2 rounded-xl border text-xs sm:text-[13px] font-semibold text-center ${
            accent ? 'bg-primary/10 border-primary/30 text-primary' : 'surface-card-subtle border-card-border text-foreground'
          }`}
        >
          {step}
        </li>
        {i < steps.length - 1 && (
          <>
            <ArrowRight className="hidden md:block w-4 h-4 text-foreground-muted shrink-0" aria-hidden="true" />
            <ArrowDown className="md:hidden w-4 h-4 text-foreground-muted self-center" aria-hidden="true" />
          </>
        )}
      </React.Fragment>
    ))}
  </ol>
);

const AREAS = [
  { icon: Users, name: 'People & Workforce', text: 'Rosters, attendance, roles and the day-to-day operations of your teams.', group: 'People' },
  { icon: LayoutGrid, name: 'Enterprise Resource Planning', text: 'The operational backbone: master data, ledgers and cross-entity visibility.', group: 'Core' },
  { icon: DollarSign, name: 'Finance & Accounting', text: 'Ledgers, payables, receivables and reporting tied to real operations.', group: 'Core' },
  { icon: Wallet, name: 'Payroll & WPS', text: 'Payroll runs and wage-protection compliance fed directly by attendance data.', group: 'Core' },
  { icon: UserCheck, name: 'Human Capital Management', text: 'Employee lifecycle from onboarding to development and offboarding.', group: 'People' },
  { icon: HardHat, name: 'Project & Construction Management', text: 'Projects, procurement, site progress and cost control in one thread.', group: 'Operations' },
  { icon: Briefcase, name: 'Industry-Specific Solutions', text: 'Workflows shaped around the rules and rhythms of your sector.', group: 'Operations' },
  { icon: Puzzle, name: 'Custom Enterprise Applications', text: 'Purpose-built applications for processes no off-the-shelf tool fits.', group: 'Operations' },
  { icon: Database, name: 'Data & Intelligence', text: 'Shared business data, reporting and analytics across every area.', group: 'Intelligence' },
  { icon: Bot, name: 'AI & Automation', text: 'Governed AI assistance and automation, with people approving what matters.', group: 'Intelligence' },
  { icon: Share2, name: 'Client / Customer Experience', text: 'Portals and touchpoints that show customers the same truth you see.', group: 'Experience' },
  { icon: Layers, name: 'Integrations & External Systems', text: 'Secure connections to the banks, ERPs, CRMs and tools you already run.', group: 'Experience' },
] as const;

const FLOW = [
  ['People', 'The roles and teams who run the business, with the access they need.'],
  ['Processes', 'Workflows and policies modelled the way your business actually works.'],
  ['Applications', 'The modules your teams use, built to share one set of records.'],
  ['Shared Data', 'One consistent source of business truth, with controlled access.'],
  ['AI Intelligence', 'Analysis and recommendations grounded in that shared data.'],
  ['Automated Execution', 'Approved actions carried out inside your own systems.'],
  ['Business Decisions', 'Leaders see what is happening and decide with confidence.'],
] as const;

const LOOP = ['Understand', 'Analyze', 'Recommend', 'Human Approves', 'Execute', 'Learn'];

const DATA_POINTS = [
  { icon: Database, title: 'Consistent business data', text: 'Each fact is recorded once and reused, so modules agree with each other.' },
  { icon: Lock, title: 'Controlled access', text: 'Role-based permissions decide who sees and changes what.' },
  { icon: Eye, title: 'Cross-module visibility', text: 'Follow a business event across finance, operations and people.' },
  { icon: FileCheck2, title: 'Traceability', text: 'Actions and changes are recorded so they can be reviewed later.' },
  { icon: BarChart3, title: 'Operational intelligence', text: 'Reports and insights built on live operational records.' },
  { icon: ShieldCheck, title: 'Secure integrations', text: 'Connections to external systems are authenticated and scoped.' },
] as const;

const JOURNEYS = [
  { title: 'Construction', steps: ['Project', 'Procurement', 'Finance', 'Payroll', 'Documents', 'Management Intelligence'] },
  { title: 'Human Resources', steps: ['Employee', 'Attendance', 'Payroll', 'WPS', 'Finance', 'Analytics'] },
  { title: 'Customer', steps: ['Lead', 'CRM', 'Proposal', 'Project', 'Billing', 'Customer Portal'] },
  { title: 'AI', steps: ['Business Data', 'AI Understanding', 'Analysis', 'Recommendation', 'Approval', 'Action'] },
] as const;

const WHY = [
  { icon: Puzzle, title: 'Built Around Your Business', text: 'We start from your workflows, policies and data, not from a template.' },
  { icon: Network, title: 'Connected by Design', text: 'Modules share records from day one instead of being stitched together later.' },
  { icon: Cpu, title: 'Intelligent by Architecture', text: 'AI sits on top of shared data, with clear boundaries and approvals.' },
  { icon: Boxes, title: 'Modular and Scalable', text: 'Start with the areas that matter and extend as the business grows.' },
  { icon: ShieldCheck, title: 'Secure and Governed', text: 'Permissions, audit trails and controlled integrations are part of the base.' },
  { icon: UserCheck, title: 'Human-Centered AI', text: 'People stay in charge: AI recommends, humans approve the actions that matter.' },
] as const;

const Section: React.FC<{ id?: string; alt?: boolean; children: React.ReactNode; label: string }> = ({ id, alt, children, label }) => (
<section id={id} aria-label={label} className={`scroll-mt-28 py-16 sm:py-24 border-t border-border ${alt ? 'bg-secondary/30' : 'bg-background'}`}>
    <div className="w-full px-[7.5%]">{children}</div>
  </section>
);

export const EcosystemPage: React.FC<EcosystemPageProps> = ({ onNavigateToContact, onOpenSolutionBuilder }) => {
  React.useEffect(() => {
    updatePageSeo({
      title: 'Our Ecosystem | Artify Solutions',
      description:
        'Explore the Artify enterprise ecosystem — connected people, processes, data, applications and AI designed to work together around your business.',
      canonicalUrl: 'https://artifysols.com/ecosystem',
      ogType: 'website',
      ogTitle: 'Our Ecosystem | Artify Solutions',
      ogDescription:
        'Explore the Artify enterprise ecosystem — connected people, processes, data, applications and AI designed to work together around your business.',
    });
    window.scrollTo({ top: 0 });
  }, []);

  const scrollToMap = () => {
    const el = document.getElementById('ecosystem-map');
    if (el) el.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="bg-background text-foreground">
      {/* 1. HERO */}
      <section aria-label="Our Ecosystem" className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24 bg-grid-pattern">
        <div className="w-full px-[7.5%] relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow>THE ARTIFY ENTERPRISE ECOSYSTEM</Eyebrow>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold font-display tracking-tight leading-[1.08] mb-6">
              From Disparate Systems to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500">One Intelligent Business.</span>
            </h1>
            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed max-w-2xl mb-3">
              Artify does not build isolated software. We design interconnected business ecosystems where people, processes, data, systems and AI work
              together — so information flows once, decisions are better informed, and the software adapts to your business.
            </p>
            <p className="text-sm sm:text-base font-semibold text-foreground mb-8">
              Software should adapt to your business, not your business to software.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToMap}
                className="btn-theme-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold min-h-[44px]"
              >
                <span>Explore the Ecosystem</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => onNavigateToContact()}
                className="btn-theme-secondary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold min-h-[44px]"
              >
                <span>Talk to Us</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Interface / connection visual */}
          <div className="lg:col-span-5" aria-hidden="true">
            <div className="relative rounded-2xl surface-card border border-card-border shadow-xl p-4 sm:p-5">
              <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-[10px] font-mono-code text-foreground-muted uppercase tracking-wider">Business ecosystem · connected view</span>
              </div>
              <svg viewBox="0 0 400 260" className="w-full h-auto" role="img" aria-label="Diagram of connected business areas">
                <g stroke="currentColor" className="text-primary/40" strokeWidth="1.2" fill="none">
                  <path d="M200 130 L70 50" /><path d="M200 130 L330 50" /><path d="M200 130 L60 130" />
                  <path d="M200 130 L340 130" /><path d="M200 130 L90 215" /><path d="M200 130 L310 215" />
                </g>
                <circle cx="200" cy="130" r="38" className="fill-primary/10 stroke-primary" strokeWidth="1.5" />
                <text x="200" y="127" textAnchor="middle" className="fill-current text-foreground" fontSize="10" fontWeight="700">YOUR</text>
                <text x="200" y="141" textAnchor="middle" className="fill-current text-foreground" fontSize="10" fontWeight="700">BUSINESS</text>
                {[
                  ['People', 70, 50], ['Processes', 330, 50], ['Data', 60, 130],
                  ['Systems', 340, 130], ['AI', 90, 215], ['Decisions', 310, 215],
                ].map(([label, x, y]) => (
                  <g key={label as string}>
                    <rect x={(x as number) - 38} y={(y as number) - 14} width="76" height="28" rx="8" className="fill-current text-secondary stroke-primary/30" strokeWidth="1" />
                    <text x={x as number} y={(y as number) + 4} textAnchor="middle" className="fill-current text-foreground" fontSize="10" fontWeight="600">{label as string}</text>
                  </g>
                ))}
              </svg>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {['Shared records', 'Role-based access', 'Audit trail'].map((t) => (
                  <div key={t} className="text-[10px] font-mono-code text-center px-2 py-1.5 rounded-lg surface-card-subtle border border-border text-foreground-muted">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PHILOSOPHY */}
      <Section label="Core philosophy">
        <div className="max-w-3xl mb-10">
          <Eyebrow icon={Sparkles}>CORE PHILOSOPHY</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight mb-4">
            Not Isolated Software.
            <GradientText>An Interconnected Living Ecosystem.</GradientText>
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">
            Separate applications each hold part of the picture, and people carry data between them by hand. Connected systems share one set of records, so
            a change in one area is visible everywhere it matters — which is where the real business value is.
          </p>
        </div>
        <Chain steps={['People', 'Processes', 'Data', 'Systems', 'AI', 'Decisions']} accent />
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <div className="p-6 rounded-2xl surface-card-subtle border border-card-border">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wide text-foreground-muted mb-3">Isolated applications</h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              {['Data re-entered between tools', 'Reports reconciled by hand', 'No single view of an event', 'Changes bolted on, one tool at a time'].map((t) => (
                <li key={t} className="flex gap-2.5"><span aria-hidden="true" className="text-rose-500">×</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-2xl surface-card border border-primary/30">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wide text-primary mb-3">A connected ecosystem</h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              {['Data recorded once, reused everywhere', 'Reports built on live shared records', 'One thread from event to decision', 'Modules added to a common foundation'].map((t) => (
                <li key={t} className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 3. THE ARTIFY ECOSYSTEM */}
      <Section id="ecosystem-map" alt label="The Artify ecosystem">
        <div className="max-w-3xl mb-10">
          <Eyebrow icon={Network}>THE ARTIFY ECOSYSTEM</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight mb-4">
            Twelve Connected Areas.
            <GradientText>One Shared Foundation.</GradientText>
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">
            These are the areas of the business we design and connect. Each engagement is scoped to what your organization needs — you start where it matters
            most and extend from there.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {AREAS.map(({ icon: Icon, name, text, group }) => (
            <li key={name} className="p-5 rounded-2xl surface-card border border-card-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-foreground-muted">{group}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{name}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3b. Interactive node explorer */}
      <EcosystemExplorer onOpenSolutionBuilder={onOpenSolutionBuilder} onNavigateToContact={onNavigateToContact} />

      {/* 4. ONE CONNECTED BUSINESS */}
      <Section label="One connected business">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Eyebrow icon={Workflow}>ONE CONNECTED BUSINESS</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight mb-4">
              One Flow, From People
              <GradientText>to Decisions.</GradientText>
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              When every layer shares the same records, a single business event travels the whole way — without being re-typed, re-checked or lost.
            </p>
          </div>
          <ol className="lg:col-span-7 relative space-y-3" role="list">
            {FLOW.map(([title, text], i) => (
              <li key={title} className="relative flex gap-4 p-4 rounded-2xl surface-card border border-card-border">
                <span className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold font-mono-code flex items-center justify-center shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{title}</h3>
                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 5. INTELLIGENCE LAYER */}
      <Section alt label="Intelligence layer">
        <div className="max-w-3xl mb-10">
          <Eyebrow icon={Cpu}>THE INTELLIGENCE LAYER</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight mb-4">
            AI Is Not a Chatbot.
            <GradientText>It Is an Intelligence Fabric.</GradientText>
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">
            AI works across your shared data rather than beside it. It proposes; people approve; approved actions run inside systems that keep a record of them.
          </p>
        </div>
        <Chain steps={LOOP} accent />
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <div className="p-6 rounded-2xl surface-card border border-card-border">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-3">Working in our platform today</h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              {[
                'AI assistance that answers from your own business data and documents',
                'Governed AI actions that wait for a human approval before they run',
                'Permission checks and an audit trail on AI activity',
                'An architecture advisor and solution builder on this site',
              ].map((t) => (
                <li key={t} className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-2xl surface-card-subtle border border-dashed border-border">
            <h3 className="text-sm font-bold font-mono-code uppercase tracking-wide text-foreground-muted mb-3">Architectural vision</h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              {[
                'Intelligence that learns from approved outcomes across every module',
                'Cross-module recommendations drawn from the full operating picture',
                'Wider automated execution, always inside approval boundaries',
              ].map((t) => (
                <li key={t} className="flex gap-2.5"><Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />{t}</li>
              ))}
            </ul>
            <p className="text-xs text-foreground-muted mt-4">The vision describes where the architecture is designed to go; scope is agreed per engagement.</p>
          </div>
        </div>
      </Section>

      {/* 6. ADAPTIVE ARCHITECTURE */}
      <Section label="Adaptive architecture">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Eyebrow icon={Gauge}>ADAPTIVE ARCHITECTURE</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight mb-4">
              Your Business Should Not Have to
              <GradientText>Adapt to Your Software.</GradientText>
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              The architecture is configured around how you operate: the workflows you follow, the policies you enforce, the data you keep and the operational
              requirements you must meet. When the business changes, the system is changed to match — not the other way round.
            </p>
          </div>
          <ul className="lg:col-span-6 grid sm:grid-cols-2 gap-3" role="list">
            {[
              [Workflow, 'Workflows', 'Approval paths and processes modelled as you run them.'],
              [FileCheck2, 'Policies', 'Rules, limits and controls encoded into the system.'],
              [Database, 'Data', 'Records and fields shaped to your organization.'],
              [Search, 'Operations', 'Requirements such as compliance and reporting built in.'],
            ].map(([Icon, title, text]) => {
              const I = Icon as React.ElementType;
              return (
                <li key={title as string} className="p-4 rounded-2xl surface-card border border-card-border">
                  <I className="w-5 h-5 text-primary mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold">{title as string}</h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">{text as string}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* 7. CONNECTED DATA */}
      <Section alt label="Connected data">
        <div className="max-w-3xl mb-10">
          <Eyebrow icon={Database}>CONNECTED DATA</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight mb-4">
            One Source of Truth,
            <GradientText>Under Your Control.</GradientText>
          </h2>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {DATA_POINTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="p-5 rounded-2xl surface-card border border-card-border">
              <Icon className="w-5 h-5 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-sm font-bold mb-1">{title}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 8. ECOSYSTEM JOURNEYS */}
      <Section label="Ecosystem journeys">
        <div className="max-w-3xl mb-10">
          <Eyebrow icon={Workflow}>ECOSYSTEM JOURNEYS</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight mb-4">
            See How the Connections
            <GradientText>Play Out.</GradientText>
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">Illustrative journeys — the order and steps are configured to each organization.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          {JOURNEYS.map((j) => (
            <div key={j.title} className="p-5 rounded-2xl surface-card border border-card-border">
              <h3 className="text-xs font-bold font-mono-code uppercase tracking-wider text-primary mb-3">{j.title}</h3>
              <Chain steps={[...j.steps]} />
            </div>
          ))}
        </div>
      </Section>

      {/* 9. WHY ARTIFY */}
      <Section alt label="Why Artify">
        <div className="max-w-3xl mb-10">
          <Eyebrow icon={ShieldCheck}>WHY ARTIFY</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight">
            Designed as a Whole,
            <GradientText>Not Assembled in Pieces.</GradientText>
          </h2>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {WHY.map(({ icon: Icon, title, text }) => (
            <li key={title} className="p-5 rounded-2xl surface-card border border-card-border">
              <Icon className="w-5 h-5 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-sm font-bold mb-1">{title}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 10. FINAL CTA */}
      <Section label="Talk to Artify">
        <div className="rounded-3xl surface-card border border-primary/30 p-8 sm:p-14 text-center shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight mb-4">
            Build Your Business Ecosystem.
            <GradientText>Not Another Isolated Application.</GradientText>
          </h2>
          <p className="text-base text-foreground-muted max-w-2xl mx-auto mb-8">
            Tell us how your business runs. We will show you how the pieces can work as one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigateToContact()}
              className="btn-theme-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold min-h-[44px]"
            >
              <span>Talk to Artify</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            {onOpenSolutionBuilder && (
              <button
                onClick={() => onOpenSolutionBuilder()}
                className="btn-theme-secondary inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold min-h-[44px]"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Launch Solution Wizard</span>
              </button>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};
