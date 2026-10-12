import React from 'react';
import { ArrowRight, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import type { PublicProduct, PublicProductModule } from '../../../lib/publicApi';
import { PublicForm } from '../../forms/PublicForm';

export const TYPE_LABEL: Record<PublicProduct['type'], string> = { PRODUCT: 'Product', SERVICE: 'Service', SOLUTION: 'Solution' };

export interface ProductStyleProps {
  product: PublicProduct;
  modules: PublicProductModule[];
  /** Back button; `onDark` for use on top of a dark brand gradient. */
  renderBack: (tone?: 'default' | 'onDark') => React.ReactNode;
  onSelectProduct: (product: { slug: string }) => void;
  onNavigateToContact: () => void;
  onOpenConsultant: () => void;
}

export const CTA_ID = 'product-cta';

/** Primary call-to-action: scroll to the on-page form when the product has one, otherwise open the contact flow. */
export function goToCta(product: PublicProduct, onNavigateToContact: () => void) {
  if (product.ctaForm) {
    document.getElementById(CTA_ID)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  onNavigateToContact();
}

/** Facts that come from the product's own data, never invented. */
export function keyFacts(product: PublicProduct): { value: string; label: string }[] {
  const facts: { value: string; label: string }[] = [{ value: TYPE_LABEL[product.type], label: 'Offering type' }];
  if (product.category) facts.push({ value: product.category.name, label: 'Category' });
  if (product.features?.length) facts.push({ value: String(product.features.length), label: product.features.length === 1 ? 'Capability' : 'Capabilities' });
  if (product.benefits?.length) facts.push({ value: String(product.benefits.length), label: product.benefits.length === 1 ? 'Key benefit' : 'Key benefits' });
  if (product.industries?.length) facts.push({ value: product.industries.length === 1 ? product.industries[0]!.name : String(product.industries.length), label: product.industries.length === 1 ? 'Industry' : 'Industries served' });
  return facts.slice(0, 4);
}

export const paragraphs = (product: PublicProduct) => product.description.split('\n\n').filter((p) => p.trim().length > 0);

export const Tag: React.FC<{ children: React.ReactNode; tone?: 'violet' | 'sky' | 'emerald' | 'amber' | 'glass'; className?: string }> = ({ children, tone = 'violet', className = '' }) => {
  const tones: Record<string, string> = {
    violet: 'bg-primary/10 text-primary border-primary/30',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30',
    glass: 'bg-white/15 !text-white border-white/25 backdrop-blur',
  };
  return <span className={`text-[10px] font-mono-code uppercase tracking-wider px-2.5 py-1 rounded-full border ${tones[tone]} ${className}`}>{children}</span>;
};

export const ProductTags: React.FC<{ product: PublicProduct; glass?: boolean }> = ({ product, glass }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <Tag tone={glass ? 'glass' : 'violet'}>{TYPE_LABEL[product.type]}</Tag>
    {product.isFeatured && (
      <Tag tone={glass ? 'glass' : 'amber'}>
        <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> Featured</span>
      </Tag>
    )}
    {product.category && <Tag tone={glass ? 'glass' : 'sky'}>{product.category.name}</Tag>}
    {product.industries?.map((i) => (
      <Tag key={i.slug} tone={glass ? 'glass' : 'emerald'}>{i.name}</Tag>
    ))}
  </div>
);

export const PrimaryButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; inverted?: boolean }> = ({ onClick, children, className = '', inverted }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-sm font-bold transition active:scale-[0.98] ${
      inverted ? 'keep-color bg-white text-violet-900 hover:bg-violet-50 shadow-lg' : 'btn-theme-primary shadow-lg shadow-violet-600/25'
    } ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; onDark?: boolean }> = ({ onClick, children, className = '', onDark }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-sm font-semibold border transition ${
      onDark ? 'border-white/40 hover:bg-white/10' : 'btn-theme-secondary'
    } ${className}`}
  >
    {children}
  </button>
);

export const HeroActions: React.FC<{ props: ProductStyleProps; onDark?: boolean }> = ({ props, onDark }) => (
  <div className="flex flex-wrap items-center gap-3">
    <PrimaryButton inverted={onDark} onClick={() => goToCta(props.product, props.onNavigateToContact)}>
      Request a Consultation <ArrowRight className="w-4 h-4" />
    </PrimaryButton>
    <SecondaryButton onDark={onDark} onClick={props.onOpenConsultant}>Ask the AI Advisor</SecondaryButton>
  </div>
);

export const Media: React.FC<{ product: PublicProduct; className?: string; imgClassName?: string }> = ({ product, className = '', imgClassName = '' }) =>
  product.featuredMedia ? (
    <div className={className}>
      <img src={product.featuredMedia.url} alt={product.featuredMedia.altText ?? product.name} className={`w-full h-auto block ${imgClassName}`} />
    </div>
  ) : null;

/** Highlighted problem statement. */
export const Problem: React.FC<{ text: string; className?: string; label?: string }> = ({ text, className = '', label = 'The problem' }) => (
  <div className={`rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 ${className}`}>
    <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5 text-amber-700 dark:text-amber-300">{label}</h2>
    <p className="text-sm sm:text-base leading-relaxed text-foreground-secondary">{text}</p>
  </div>
);

export const Prose: React.FC<{ product: PublicProduct; className?: string }> = ({ product, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {paragraphs(product).map((p, i) => (
      <p key={i} className="text-sm sm:text-[15px] leading-relaxed text-foreground-muted whitespace-pre-line">{p}</p>
    ))}
  </div>
);

export const CheckList: React.FC<{ items: string[]; accent?: 'emerald' | 'violet'; className?: string; itemClassName?: string }> = ({ items, accent = 'emerald', className = '', itemClassName = '' }) => (
  <ul className={`space-y-2.5 ${className}`}>
    {items.map((t, i) => (
      <li key={i} className={`flex items-start gap-2.5 text-sm text-foreground-secondary ${itemClassName}`}>
        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${accent === 'emerald' ? 'text-emerald-500' : 'text-primary'}`} />
        <span>{t}</span>
      </li>
    ))}
  </ul>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-xl sm:text-2xl font-bold font-display tracking-tight text-foreground ${className}`}>{children}</h2>
);

/** The conversion form (or a consultation button) — always carries the scroll target. */
export const CtaCard: React.FC<{ props: ProductStyleProps; className?: string; title?: string }> = ({ props, className = '', title }) => {
  const { product } = props;
  return (
    <div id={CTA_ID} className={`rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm ${className}`}>
      <h2 className="text-sm font-bold text-foreground mb-3">{product.ctaForm ? product.ctaForm.name : title ?? 'Interested?'}</h2>
      {product.ctaForm ? (
        <PublicForm formId={product.ctaForm.id} />
      ) : (
        <>
          <p className="text-xs text-foreground-muted mb-4 leading-relaxed">Tell us about your needs and we will show you how {product.name} fits.</p>
          <PrimaryButton className="w-full" onClick={props.onNavigateToContact}>Request a Consultation</PrimaryButton>
        </>
      )}
    </div>
  );
};

/** Related items and the module list, shared by every layout. */
export const ExtraSections: React.FC<{ props: ProductStyleProps; className?: string }> = ({ props, className = '' }) => {
  const { product, modules } = props;
  const hasRelated = !!product.relatedProducts?.length;
  if (!hasRelated && modules.length === 0) return null;
  return (
    <div className={`space-y-10 ${className}`}>
      {hasRelated && (
        <div>
          <SectionTitle className="mb-4 !text-base">Related</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {product.relatedProducts!.map((r) => (
              <button
                key={r.slug}
                onClick={() => props.onSelectProduct({ slug: r.slug })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-card text-foreground-secondary hover:border-primary transition"
              >
                {r.name} <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}
      {modules.length > 0 && (
        <div>
          <SectionTitle className="mb-5">Modules &amp; Components</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <div key={mod.slug} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="text-sm font-bold text-foreground">{mod.name}</h3>
                  {mod.isCore && (
                    <span className="flex items-center gap-1 text-[10px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Core
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-foreground-muted">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const PageShell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`min-h-screen bg-background text-foreground ${className}`}>{children}</div>
);

export const Gutter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-5 sm:px-8 lg:px-[6%] ${className}`}>{children}</div>
);

export const BRAND_GRADIENT = 'bg-gradient-to-br from-indigo-950 via-violet-800 to-blue-700';
export const NoLayersIcon = Layers;
