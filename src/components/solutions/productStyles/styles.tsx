import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  BRAND_GRADIENT,
  CheckList,
  CtaCard,
  ExtraSections,
  Gutter,
  HeroActions,
  Media,
  PageShell,
  PrimaryButton,
  Problem,
  ProductStyleProps,
  ProductTags,
  Prose,
  SectionTitle,
  TYPE_LABEL,
  Tag,
  goToCta,
  keyFacts,
} from './shared';

const card = 'rounded-2xl border border-border bg-card';
const eyebrow = 'text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-subtle';
const gradientText = 'text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500';

const Facts: React.FC<{ product: ProductStyleProps['product']; className?: string; cell?: string }> = ({ product, className = '', cell = '' }) => (
  <div className={`grid grid-cols-2 lg:grid-cols-4 ${className}`}>
    {keyFacts(product).map((f) => (
      <div key={f.label} className={`p-4 sm:p-5 ${cell}`}>
        <div className={`text-lg sm:text-2xl font-extrabold font-display tracking-tight ${gradientText}`}>{f.value}</div>
        <div className="text-xs text-foreground-muted mt-0.5">{f.label}</div>
      </div>
    ))}
  </div>
);

const Title: React.FC<{ name: string; className?: string; onDark?: boolean }> = ({ name, className = '', onDark }) => (
  <h1 className={`font-extrabold font-display tracking-tight leading-[1.08] ${onDark ? '!text-white' : 'text-foreground'} ${className}`}>{name}</h1>
);

/* ------------------------------------------------------------------ executive */
export const ExecutiveStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  const hasMedia = !!product.featuredMedia;
  return (
    <PageShell className="pt-28 pb-24">
      <Gutter>
        {p.renderBack()}
        <section className={`grid gap-10 lg:gap-14 items-center ${hasMedia ? 'lg:grid-cols-[1.05fr_1fr]' : ''}`}>
          <div className="space-y-5">
            <ProductTags product={product} />
            <Title name={product.name} className="text-3xl sm:text-4xl lg:text-[46px]" />
            <p className="text-base sm:text-lg leading-relaxed text-foreground-muted">{product.shortDescription}</p>
            <HeroActions props={p} />
          </div>
          <Media product={product} className="rounded-3xl overflow-hidden border border-border shadow-2xl shadow-violet-900/20" />
        </section>
        <Facts product={product} className={`mt-12 ${card} shadow-sm overflow-hidden`} cell="border-b lg:border-b-0 lg:border-r border-border last:border-0" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 mt-12">
          <div className="space-y-8 min-w-0">
            {!!product.businessProblem && <Problem text={product.businessProblem} className="border-l-4 border-l-amber-500" />}
            <Prose product={product} />
            {!!product.benefits?.length && (
              <div>
                <SectionTitle className="mb-4">Benefits</SectionTitle>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.benefits.map((b, i) => (
                    <li key={i} className={`${card} p-4 flex gap-3 text-sm text-foreground-secondary`}>
                      <span className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 grid place-items-center"><CheckCircle2 className="w-4 h-4" /></span>
                      <span className="pt-1">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!!product.features?.length && (
              <div>
                <SectionTitle className="mb-4">Features</SectionTitle>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {product.features.map((f, i) => (
                    <div key={i} className={`${card} p-4 text-sm text-foreground-secondary`}>
                      <div className="text-xs font-mono-code font-bold text-primary mb-2">{String(i + 1).padStart(2, '0')}</div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 self-start"><CtaCard props={p} title={`Interested in ${product.name}?`} /></aside>
        </div>
        <ExtraSections props={p} className="mt-14" />
      </Gutter>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ showcase */
export const ShowcaseStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  const sections = [
    { id: 'ps-overview', label: 'Overview', show: true },
    { id: 'ps-benefits', label: 'Benefits', show: !!product.benefits?.length },
    { id: 'ps-features', label: 'Features', show: !!product.features?.length },
    { id: 'product-cta', label: 'Contact', show: true },
  ].filter((s) => s.show);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <PageShell className="pt-28 pb-24 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-violet-600/15 blur-[140px]" />
      <Gutter className="relative">
        {p.renderBack()}
        <section className="text-center max-w-4xl mx-auto space-y-5">
          <div className="flex justify-center"><ProductTags product={product} /></div>
          <Title name={product.name} className="text-3xl sm:text-5xl lg:text-6xl" />
          <p className="text-base sm:text-lg leading-relaxed text-foreground-muted max-w-3xl mx-auto">{product.shortDescription}</p>
          <div className="flex justify-center"><HeroActions props={p} /></div>
        </section>
        {product.featuredMedia && (
          <div className="mt-12 max-w-5xl mx-auto p-2 sm:p-3 rounded-[28px] border border-border bg-gradient-to-b from-white/10 to-transparent shadow-[0_40px_120px_-30px_rgba(124,58,237,0.55)]">
            <Media product={product} className="rounded-2xl overflow-hidden" />
          </div>
        )}
        <nav className="sticky top-16 z-20 mt-12 mx-auto w-max max-w-full overflow-x-auto flex gap-1 p-1.5 rounded-full border border-border bg-card/90 backdrop-blur text-xs font-semibold">
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => jump(s.id)} className={`px-4 py-2 rounded-full whitespace-nowrap transition ${i === 0 ? 'bg-primary/15 text-primary' : 'text-foreground-muted hover:text-foreground'}`}>{s.label}</button>
          ))}
        </nav>
        <div className="max-w-6xl mx-auto">
          <section id="ps-overview" className="pt-14 space-y-8">
            {!!product.businessProblem && (
              <blockquote className="border-l-4 border-primary pl-5 sm:pl-7 max-w-3xl">
                <div className={`${eyebrow} !text-primary mb-2`}>The problem</div>
                <p className="text-xl sm:text-2xl leading-snug font-semibold text-foreground tracking-tight">{product.businessProblem}</p>
              </blockquote>
            )}
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-4"><Prose product={product} className="md:col-span-2 md:columns-2 md:gap-10 md:block [&>p]:mb-4" /></div>
          </section>
          {!!product.benefits?.length && (
            <section id="ps-benefits" className="pt-14">
              <SectionTitle className="mb-6 !text-2xl sm:!text-3xl">Why teams choose it</SectionTitle>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {product.benefits.map((b, i) => (
                  <li key={i} className={`${card} p-5 text-sm text-foreground-secondary ${i === 0 ? 'lg:col-span-2 bg-primary/10 border-primary/30' : ''}`}>
                    <span className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 grid place-items-center mb-4"><CheckCircle2 className="w-4 h-4" /></span>
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!!product.features?.length && (
            <section id="ps-features" className="pt-14">
              <SectionTitle className="mb-4 !text-2xl sm:!text-3xl">Everything included</SectionTitle>
              <CheckList accent="violet" items={product.features} className="grid sm:grid-cols-2 gap-x-10 !space-y-0" itemClassName="py-4 border-b border-border" />
            </section>
          )}
          <div className="pt-14 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className={`rounded-3xl p-8 sm:p-10 on-brand ${BRAND_GRADIENT} shadow-2xl shadow-violet-900/40`}>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">See {product.name} on your projects</h2>
              <p className="brand-muted mt-3 mb-6 text-sm sm:text-base">Book a consultation and we will walk through your workflow.</p>
              <PrimaryButton inverted onClick={() => goToCta(product, p.onNavigateToContact)}>Request a Consultation <ArrowRight className="w-4 h-4" /></PrimaryButton>
            </div>
            <CtaCard props={p} />
          </div>
          <ExtraSections props={p} className="mt-14" />
        </div>
      </Gutter>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ editorial */
export const EditorialStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  const flow = [
    product.businessProblem && { k: 'The problem', tone: 'bg-amber-500/10', body: <p className="text-sm text-foreground-muted leading-relaxed">{product.businessProblem}</p> },
    product.features?.length ? { k: 'What it does', tone: '', body: <ul className="text-sm text-foreground-muted space-y-1.5 list-disc pl-4">{product.features.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}</ul> } : null,
    product.benefits?.length ? { k: 'What you gain', tone: 'bg-emerald-500/10', body: <ul className="text-sm text-foreground-muted space-y-1.5 list-disc pl-4">{product.benefits.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}</ul> } : null,
  ].filter(Boolean) as { k: string; tone: string; body: React.ReactNode }[];
  const toc = [
    { id: 'ed-overview', label: 'Overview' },
    ...(product.benefits?.length ? [{ id: 'ed-benefits', label: 'Benefits' }] : []),
    ...(product.features?.length ? [{ id: 'ed-features', label: 'Features' }] : []),
  ];
  return (
    <PageShell className="pt-28 pb-24">
      <div className="bg-gradient-to-b from-primary/10 to-transparent">
        <Gutter className="pt-2">
          {p.renderBack()}
          <div className="text-[12px] font-mono-code font-bold uppercase tracking-[0.16em] text-primary">{TYPE_LABEL[product.type]}{product.category ? ` · ${product.category.name}` : ''}</div>
          <Title name={product.name} className="mt-3 text-3xl sm:text-5xl max-w-4xl" />
          <p className="mt-4 text-lg sm:text-xl leading-relaxed text-foreground-muted max-w-3xl">{product.shortDescription}</p>
          <dl className="mt-8 py-5 border-y border-border grid grid-cols-2 sm:flex sm:flex-wrap gap-x-10 gap-y-4 text-sm">
            {keyFacts(product).map((f) => (
              <div key={f.label}><dt className={eyebrow}>{f.label}</dt><dd className="font-semibold text-foreground mt-1">{f.value}</dd></div>
            ))}
          </dl>
        </Gutter>
      </div>
      <Gutter className="mt-8">
        <Media product={product} className="rounded-3xl overflow-hidden border border-border shadow-2xl shadow-black/20" />
        <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14 mt-12">
          <aside className="hidden lg:block sticky top-24 self-start text-sm">
            <div className={`${eyebrow} mb-3`}>On this page</div>
            {toc.map((t, i) => (
              <button key={t.id} onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' })} className={`block w-full text-left py-2 pl-3.5 border-l-2 font-semibold ${i === 0 ? 'border-primary text-foreground' : 'border-border text-foreground-muted hover:text-foreground'}`}>{t.label}</button>
            ))}
            <PrimaryButton className="w-full mt-5" onClick={() => goToCta(product, p.onNavigateToContact)}>Request a Consultation</PrimaryButton>
          </aside>
          <div id="ed-overview" className="min-w-0 space-y-12">
            {flow.length > 1 && (
              <div className={`grid ${flow.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} ${card} overflow-hidden md:divide-x divide-border`}>
                {flow.map((f) => (
                  <div key={f.k} className={`p-5 sm:p-6 ${f.tone}`}>
                    <div className="text-[11px] font-mono-code font-bold uppercase tracking-[0.14em] text-primary mb-2.5">{f.k}</div>
                    {f.body}
                  </div>
                ))}
              </div>
            )}
            {flow.length <= 1 && !!product.businessProblem && <Problem text={product.businessProblem} />}
            <Prose product={product} className="[&>p]:text-base sm:[&>p]:text-[17px] [&>p]:leading-8" />
            {!!product.benefits?.length && (
              <section id="ed-benefits">
                <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold tracking-tight mb-5"><span className="text-xs font-mono-code font-bold px-2 py-1 rounded-md bg-primary/10 text-primary">01</span>Benefits</h2>
                <ul className="space-y-3">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex gap-4 items-start p-4 sm:p-5 rounded-2xl bg-surface-subtle border border-border text-sm sm:text-[15px] text-foreground font-medium">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-primary grid place-items-center" style={{ color: '#fff' }}><CheckCircle2 className="w-4 h-4" /></span>{b}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!!product.features?.length && (
              <section id="ed-features">
                <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold tracking-tight mb-5"><span className="text-xs font-mono-code font-bold px-2 py-1 rounded-md bg-primary/10 text-primary">02</span>Features</h2>
                <ol className="border-t border-border">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex gap-5 items-center py-4 border-b border-border text-sm sm:text-base text-foreground">
                      <span className="w-7 font-mono-code text-xs font-bold text-primary/80">{String(i + 1).padStart(2, '0')}</span>{f}
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <CtaCard props={p} title={`Ready to see ${product.name} in action?`} />
            <ExtraSections props={p} />
          </div>
        </div>
      </Gutter>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ story (split screen) */
export const StoryStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  const steps: { n: string; title: string; body: React.ReactNode }[] = [];
  if (product.businessProblem) steps.push({ n: '01', title: 'The challenge', body: <Problem text={product.businessProblem} label="The problem" /> });
  steps.push({ n: String(steps.length + 1).padStart(2, '0'), title: 'How it works', body: <Prose product={product} /> });
  if (product.benefits?.length) steps.push({ n: String(steps.length + 1).padStart(2, '0'), title: 'What you gain', body: <CheckList items={product.benefits} /> });
  if (product.features?.length)
    steps.push({
      n: String(steps.length + 1).padStart(2, '0'),
      title: 'What is included',
      body: <div className="flex flex-wrap gap-2">{product.features.map((f, i) => <span key={i} className="px-3.5 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-[13px] font-semibold">{f}</span>)}</div>,
    });
  return (
    <PageShell className="lg:grid lg:grid-cols-[44%_56%]">
      <div className={`${BRAND_GRADIENT} on-brand relative overflow-hidden pt-28 pb-10 px-5 sm:px-8 lg:pl-[12%] lg:pr-[7%] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto`}>
        <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-violet-400/30 blur-[90px]" />
        <div className="relative space-y-5">
          {p.renderBack('onDark')}
          <ProductTags product={product} glass />
          <Title name={product.name} onDark className="text-3xl sm:text-4xl xl:text-[44px]" />
          <p className="brand-muted text-base leading-relaxed">{product.shortDescription}</p>
          <HeroActions props={p} onDark />
          <Media product={product} className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/40" />
          <div className="grid grid-cols-2 gap-3">
            {keyFacts(product).map((f) => (
              <div key={f.label} className="rounded-xl bg-white/10 p-3.5"><div className="font-bold">{f.value}</div><div className="brand-muted text-xs">{f.label}</div></div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 sm:px-8 lg:px-[6%] py-12 lg:pt-28 lg:pb-16 min-w-0">
        {steps.map((s, i) => (
          <section key={s.n} className={`grid grid-cols-[44px_1fr] sm:grid-cols-[54px_1fr] gap-4 sm:gap-5 py-9 ${i === 0 ? 'pt-0' : ''} border-b border-border`}>
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary font-mono-code font-extrabold text-sm grid place-items-center">{s.n}</div>
            <div className="min-w-0"><SectionTitle className="mb-3">{s.title}</SectionTitle>{s.body}</div>
          </section>
        ))}
        <div className="mt-9"><CtaCard props={p} title="Talk to our team" /></div>
        <ExtraSections props={p} className="mt-12" />
      </div>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ bento */
export const BentoStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  return (
    <PageShell className="pt-28 pb-24">
      <Gutter>
        {p.renderBack()}
        <section className="text-center max-w-4xl mx-auto space-y-5">
          <div className="text-sm font-semibold text-primary">{TYPE_LABEL[product.type]}{product.category ? ` · ${product.category.name}` : ''}</div>
          <Title name={product.name} className="text-4xl sm:text-5xl lg:text-6xl !tracking-[-0.035em]" />
          <p className="text-lg sm:text-xl leading-relaxed text-foreground-muted max-w-3xl mx-auto">{product.shortDescription}</p>
          <div className="flex justify-center"><HeroActions props={p} /></div>
        </section>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5">
          {product.featuredMedia && <Media product={product} className="md:col-span-6 rounded-[28px] overflow-hidden border border-border bg-gradient-to-br from-primary/10 to-sky-500/10" />}
          {!!product.businessProblem && (
            <div className="md:col-span-4 rounded-[28px] p-7 sm:p-9 border border-border" style={{ backgroundColor: '#0f172a', color: '#f1f5f9' }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-300 mb-3">The problem</div>
              <p className="text-xl sm:text-2xl font-semibold leading-snug tracking-tight">{product.businessProblem}</p>
            </div>
          )}
          {keyFacts(product)[1] && (
            <div className={`${product.businessProblem ? 'md:col-span-2' : 'md:col-span-6'} rounded-[28px] p-7 sm:p-9 on-brand ${BRAND_GRADIENT} flex flex-col justify-center`}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">{keyFacts(product)[product.features?.length ? 2 : 1]?.value ?? keyFacts(product)[1]!.value}</div>
              <div className="brand-muted text-sm mt-2">{keyFacts(product)[product.features?.length ? 2 : 1]?.label ?? keyFacts(product)[1]!.label}</div>
            </div>
          )}
          {product.benefits?.map((b, i) => (
            <div key={i} className="md:col-span-3 rounded-[28px] p-7 border border-border bg-card">
              <span className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-500 grid place-items-center mb-5"><CheckCircle2 className="w-5 h-5" /></span>
              <p className="text-lg font-semibold tracking-tight text-foreground leading-snug">{b}</p>
            </div>
          ))}
          <div className="md:col-span-6 rounded-[28px] p-7 sm:p-9 border border-border bg-card">
            <div className={`${eyebrow} mb-4`}>About</div>
            <Prose product={product} className="md:columns-2 md:gap-10 md:block [&>p]:mb-4 [&>p]:break-inside-avoid" />
          </div>
          {!!product.features?.length && (
            <div className="md:col-span-6 rounded-[28px] p-7 sm:p-9 border border-border bg-card">
              <div className={`${eyebrow} mb-3`}>Features</div>
              <CheckList accent="violet" items={product.features} className="grid sm:grid-cols-2 gap-x-10 !space-y-0" itemClassName="py-3.5 border-b border-border" />
            </div>
          )}
          <div className="md:col-span-6"><CtaCard props={p} title={`See ${product.name} on your projects`} /></div>
        </div>
        <ExtraSections props={p} className="mt-14" />
      </Gutter>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ tabbed */
type TabKey = 'overview' | 'benefits' | 'features' | 'modules';
export const TabbedStyle: React.FC<ProductStyleProps> = (p) => {
  const { product, modules } = p;
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    ...(product.benefits?.length ? [{ key: 'benefits' as TabKey, label: 'Benefits' }] : []),
    ...(product.features?.length ? [{ key: 'features' as TabKey, label: 'Features' }] : []),
    ...(modules.length ? [{ key: 'modules' as TabKey, label: 'Modules' }] : []),
  ];
  const [tab, setTab] = useState<TabKey>('overview');
  return (
    <PageShell className="pb-24">
      <section className={`${BRAND_GRADIENT} on-brand relative overflow-hidden pt-28 pb-28`}>
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(180deg,#000,transparent)]" />
        <Gutter className="relative">
          {p.renderBack('onDark')}
          <div className={`grid gap-10 items-center ${product.featuredMedia ? 'lg:grid-cols-[1.1fr_1fr]' : ''}`}>
            <div className="space-y-5">
              <ProductTags product={product} glass />
              <Title name={product.name} onDark className="text-3xl sm:text-4xl lg:text-[46px]" />
              <p className="brand-muted text-base sm:text-lg leading-relaxed">{product.shortDescription}</p>
              <HeroActions props={p} onDark />
            </div>
            <Media product={product} className="rounded-2xl overflow-hidden border border-white/25 shadow-2xl shadow-black/50" />
          </div>
        </Gutter>
      </section>
      <Gutter className="relative z-10 -mt-16">
        <div className={`${card} shadow-2xl shadow-black/30 overflow-hidden`}>
          <div role="tablist" className="flex overflow-x-auto border-b border-border px-2">
            {tabs.map((t) => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={`px-5 sm:px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] -mb-px transition ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>{t.label}</button>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1fr_330px]">
            <div className="p-6 sm:p-9 space-y-6 min-w-0" role="tabpanel">
              {tab === 'overview' && (
                <>
                  {!!product.businessProblem && <Problem text={product.businessProblem} />}
                  <Prose product={product} />
                </>
              )}
              {tab === 'benefits' && <CheckList items={product.benefits ?? []} className="grid sm:grid-cols-2 gap-3 !space-y-0" itemClassName="p-4 rounded-xl border border-border" />}
              {tab === 'features' && <CheckList accent="violet" items={product.features ?? []} className="grid sm:grid-cols-2 gap-3 !space-y-0" itemClassName="p-4 rounded-xl border border-border" />}
              {tab === 'modules' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {modules.map((m) => (
                    <div key={m.slug} className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between gap-2 mb-1.5"><h3 className="text-sm font-bold">{m.name}</h3>{m.isCore && <Tag tone="emerald">Core</Tag>}</div>
                      <p className="text-xs text-foreground-muted leading-relaxed">{m.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <aside className="p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-border bg-surface-subtle space-y-5">
              {!!product.features?.length && (
                <div><div className={`${eyebrow} mb-3`}>Included features</div><CheckList accent="violet" items={product.features.slice(0, 7)} className="!space-y-2" /></div>
              )}
              <CtaCard props={p} />
            </aside>
          </div>
        </div>
        <ExtraSections props={{ ...p, modules: [] }} className="mt-12" />
      </Gutter>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ workflow */
export const WorkflowStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  const steps = (product.features ?? []).slice(0, 4);
  return (
    <PageShell className="pt-28 pb-24">
      <Gutter>
        {p.renderBack()}
        <section className={`grid gap-10 items-center ${product.featuredMedia ? 'lg:grid-cols-2' : ''}`}>
          <div className="space-y-5">
            <ProductTags product={product} />
            <Title name={product.name} className="text-3xl sm:text-4xl lg:text-[44px]" />
            <p className="text-base sm:text-lg leading-relaxed text-foreground-muted">{product.shortDescription}</p>
            <HeroActions props={p} />
          </div>
          <Media product={product} className="rounded-3xl overflow-hidden border border-border shadow-2xl shadow-indigo-900/20" />
        </section>
        {steps.length >= 2 && (
          <section className={`mt-12 ${card} p-6 sm:p-8 shadow-sm`}>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-6">Key capabilities</h2>
            <ol className={`grid gap-6 sm:gap-0 ${steps.length === 2 ? 'sm:grid-cols-2' : steps.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} relative`}>
              {steps.map((s, i) => (
                <li key={i} className="relative text-center px-3">
                  {i < steps.length - 1 && <span className="hidden lg:block absolute top-7 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-400/70 to-violet-400/70" />}
                  <span className={`relative z-10 mx-auto w-14 h-14 rounded-full grid place-items-center bg-background border-2 font-mono-code font-extrabold ring-[6px] ${i === steps.length - 1 ? 'border-emerald-500 text-emerald-500 ring-emerald-500/10' : 'border-indigo-400 text-indigo-500 ring-indigo-500/10'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-4 text-sm font-semibold text-foreground leading-snug">{s}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
        <div className="grid lg:grid-cols-2 gap-10 mt-12">
          <div className="space-y-6 min-w-0">
            {!!product.businessProblem && <Problem text={product.businessProblem} />}
            <Prose product={product} />
          </div>
          {!!product.benefits?.length && (
            <div>
              <SectionTitle className="mb-4">What you gain</SectionTitle>
              <ul className="space-y-3">
                {product.benefits.map((b, i) => (
                  <li key={i} className={`${card} p-4 flex gap-3 text-sm text-foreground-secondary`}>
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 text-primary grid place-items-center"><CheckCircle2 className="w-4 h-4" /></span>{b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {!!product.features?.length && (
          <section className={`mt-12 rounded-3xl p-6 sm:p-9 on-brand ${BRAND_GRADIENT}`}>
            <h2 className="text-xl sm:text-2xl font-bold font-display mb-5">Everything included</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.features.map((f, i) => (
                <li key={i} className="flex gap-3 p-4 rounded-xl bg-white/10 text-sm"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c7d2fe' }} />{f}</li>
              ))}
            </ul>
          </section>
        )}
        <div className="mt-12 max-w-xl mx-auto"><CtaCard props={p} title={`See ${product.name} on your projects`} /></div>
        <ExtraSections props={p} className="mt-14" />
      </Gutter>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ cinematic */
export const CinematicStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  return (
    <PageShell>
      <section className={`relative min-h-[620px] lg:min-h-[720px] flex items-end overflow-hidden ${product.featuredMedia ? '' : BRAND_GRADIENT}`} style={product.featuredMedia ? { backgroundColor: '#020617' } : undefined}>
        {product.featuredMedia && <img src={product.featuredMedia.url} alt={product.featuredMedia.altText ?? product.name} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,6,23,0.6) 0%, rgba(2,6,23,0.4) 35%, rgba(2,6,23,0.95) 100%)' }} />
        <Gutter className="relative w-full pt-28 pb-14">
          {p.renderBack('onDark')}
          <div className="max-w-3xl space-y-5 on-brand">
            <ProductTags product={product} glass />
            <Title name={product.name} onDark className="text-4xl sm:text-5xl lg:text-6xl !tracking-[-0.03em]" />
            <p className="brand-muted text-base sm:text-lg leading-relaxed max-w-2xl">{product.shortDescription}</p>
            <HeroActions props={p} onDark />
          </div>
        </Gutter>
      </section>
      <Gutter className="-mt-8 relative z-10">
        <Facts product={product} className="rounded-2xl border border-white/10 backdrop-blur on-brand overflow-hidden shadow-2xl [background:rgba(15,23,42,0.88)]" cell="border-b lg:border-b-0 lg:border-r border-white/10 last:border-0" />
      </Gutter>
      <Gutter className="pt-12 pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-8 min-w-0">
            {!!product.businessProblem && <Problem text={product.businessProblem} />}
            <Prose product={product} />
            {!!product.benefits?.length && (
              <div><SectionTitle className="mb-4">Benefits</SectionTitle>
                <ul className="space-y-3">{product.benefits.map((b, i) => <li key={i} className={`${card} p-4 flex gap-3 text-sm text-foreground-secondary`}><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />{b}</li>)}</ul>
              </div>
            )}
            {!!product.features?.length && (
              <div><SectionTitle className="mb-4">Features</SectionTitle>
                <ul className="grid sm:grid-cols-2 gap-3">{product.features.map((f, i) => <li key={i} className={`${card} p-4 flex gap-3 text-sm text-foreground-secondary`}><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />{f}</li>)}</ul>
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 self-start"><CtaCard props={p} title={`Interested in ${product.name}?`} /></aside>
        </div>
        <ExtraSections props={p} className="mt-14" />
      </Gutter>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ datasheet */
export const DatasheetStyle: React.FC<ProductStyleProps> = (p) => {
  const { product } = p;
  const initials = product.code ? product.code.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || product.name.slice(0, 2).toUpperCase() : product.name.slice(0, 2).toUpperCase();
  const menu = [
    { id: 'ds-overview', label: 'Overview' },
    ...(product.benefits?.length ? [{ id: 'ds-benefits', label: 'Benefits' }] : []),
    ...(product.features?.length ? [{ id: 'ds-features', label: 'Features' }] : []),
    { id: 'product-cta', label: 'Contact' },
  ];
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const cardX = `${card} p-5 sm:p-6 shadow-sm`;
  return (
    <PageShell className="pt-28 pb-24 bg-surface-subtle">
      <Gutter>
        {p.renderBack()}
        <div className={`${cardX} flex flex-col lg:flex-row lg:items-center gap-5`}>
          <div className={`shrink-0 w-16 h-16 rounded-2xl on-brand font-extrabold text-lg grid place-items-center ${BRAND_GRADIENT}`}>{initials}</div>
          <div className="min-w-0 flex-1 space-y-2">
            <Title name={product.name} className="text-2xl sm:text-3xl" />
            <ProductTags product={product} />
          </div>
          <div className="flex gap-3 flex-wrap"><HeroActions props={p} /></div>
        </div>
        <div className="grid lg:grid-cols-[200px_1fr_300px] gap-5 mt-5 items-start">
          <nav className={`${card} p-2 hidden lg:block sticky top-24`}>
            {menu.map((m, i) => (
              <button key={m.id} onClick={() => jump(m.id)} className={`block w-full text-left px-3.5 py-2.5 rounded-lg text-[13px] font-semibold ${i === 0 ? 'bg-primary/10 text-primary' : 'text-foreground-muted hover:text-foreground'}`}>{m.label}</button>
            ))}
          </nav>
          <div className="space-y-5 min-w-0">
            {product.featuredMedia && <div className={`${card} p-3 sm:p-4 shadow-sm`}><Media product={product} className="rounded-xl overflow-hidden" /></div>}
            <section id="ds-overview" className={cardX}>
              <div className={`${eyebrow} mb-4`}>Overview</div>
              {!!product.businessProblem && <Problem text={product.businessProblem} className="mb-4" />}
              <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed mb-4 font-medium">{product.shortDescription}</p>
              <Prose product={product} />
            </section>
            {!!product.benefits?.length && <section id="ds-benefits" className={cardX}><div className={`${eyebrow} mb-4`}>Benefits</div><CheckList items={product.benefits} /></section>}
            {!!product.features?.length && <section id="ds-features" className={cardX}><div className={`${eyebrow} mb-4`}>Features</div><CheckList accent="violet" items={product.features} className="grid sm:grid-cols-2 gap-x-6 !space-y-0" itemClassName="py-2" /></section>}
            <CtaCard props={p} />
            <ExtraSections props={p} />
          </div>
          <aside className={`${cardX} lg:sticky lg:top-24`}>
            <div className={`${eyebrow} mb-3`}>At a glance</div>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-xs text-foreground-subtle">Type</dt><dd className="font-bold text-foreground">{TYPE_LABEL[product.type]}</dd></div>
              {product.category && <div><dt className="text-xs text-foreground-subtle">Category</dt><dd className="font-bold text-foreground">{product.category.name}</dd></div>}
              {!!product.industries?.length && <div><dt className="text-xs text-foreground-subtle">Industries</dt><dd className="font-bold text-foreground">{product.industries.map((i) => i.name).join(', ')}</dd></div>}
              {!!product.features?.length && <div><dt className="text-xs text-foreground-subtle">Capabilities</dt><dd className="font-bold text-foreground">{product.features.length}</dd></div>}
              {!!product.benefits?.length && <div><dt className="text-xs text-foreground-subtle">Key benefits</dt><dd className="font-bold text-foreground">{product.benefits.length}</dd></div>}
            </dl>
            <PrimaryButton className="w-full mt-5" onClick={() => goToCta(product, p.onNavigateToContact)}>Request a Consultation</PrimaryButton>
          </aside>
        </div>
      </Gutter>
    </PageShell>
  );
};
