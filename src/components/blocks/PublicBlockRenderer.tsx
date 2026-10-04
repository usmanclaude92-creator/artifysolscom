/**
 * Phase 9 (Forms + Landing Pages + Conversion, Artify-Backend repo) — the
 * public site's renderer for a Page's real Site Editor composition
 * (`editorBlocks`). Mirrors Artify-Backend's own BlockTreeRenderer
 * (src/components/common/BlockRenderer.tsx) block-for-block — same data
 * model, same "do not build a second page-builder system" principle —
 * but renders real, live React for every block instead of the Control
 * Center's read-only preview, and makes the `form` block genuinely
 * interactive (real controlled inputs + a real submission), which is the
 * reason this renderer exists at all: a page built in the Site Editor
 * previously only ever rendered as the flattened, static `body` HTML
 * fallback on this site — forms/testimonials need more than that.
 *
 * `image`/`testimonial` avatar URLs arrive already resolved
 * (`resolvedUrl`/`resolvedAvatarUrl`) — publicSiteService.ts resolves
 * every editorBlocks media reference server-side, since this site has no
 * authenticated media-read path to do it itself.
 */
import React from 'react';
import type { PublicEditorBlock } from '../../lib/publicApi';
import { PublicForm } from '../forms/PublicForm';

const Block: React.FC<{ block: PublicEditorBlock }> = ({ block }) => {
  switch (block.type) {
    case 'section':
    case 'container':
      return (
        <div className="mb-4">
          {(block.children ?? []).map((c) => (
            <Block key={c.id} block={c} />
          ))}
        </div>
      );
    case 'columns':
      return (
        <div className="mb-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${Number(block.props.columnCount) || 2}, minmax(0,1fr))` }}>
          {(block.children ?? []).map((c) => (
            <Block key={c.id} block={c} />
          ))}
        </div>
      );
    case 'text':
      return <div className="mb-4 text-sm leading-relaxed text-foreground-secondary" dangerouslySetInnerHTML={{ __html: String(block.props.html ?? '') }} />;
    case 'heading': {
      const level = Math.min(6, Math.max(1, Number(block.props.level) || 2));
      const Tag = `h${level}` as 'h2';
      return (
        <Tag className="mb-4 font-bold font-display text-foreground">{String(block.props.text ?? '')}</Tag>
      );
    }
    case 'image': {
      const url = typeof block.props.resolvedUrl === 'string' ? block.props.resolvedUrl : null;
      if (!url) return null;
      const alt = typeof block.props.alt === 'string' ? block.props.alt : '';
      const caption = typeof block.props.caption === 'string' ? block.props.caption : '';
      return (
        <figure className="mb-4">
          <img src={url} alt={alt} className="w-full rounded-xl" />
          {caption && <figcaption className="mt-1.5 text-xs text-foreground-muted">{caption}</figcaption>}
        </figure>
      );
    }
    case 'button': {
      const label = String(block.props.label ?? 'Button');
      const href = typeof block.props.href === 'string' ? block.props.href : '#';
      const openInNewTab = !!block.props.openInNewTab;
      const variant = String(block.props.variant ?? 'primary');
      const classByVariant: Record<string, string> = {
        primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30',
        secondary: 'bg-surface border border-border text-foreground hover:bg-surface/80',
        outline: 'border border-violet-500 text-violet-400 hover:bg-violet-500/10',
        ghost: 'text-violet-400 hover:text-violet-300',
      };
      return (
        <div className="mb-4">
          <a
            href={href}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${classByVariant[variant] ?? classByVariant.primary}`}
          >
            {label}
          </a>
        </div>
      );
    }
    case 'card':
      return (
        <div className="mb-4 p-5 rounded-2xl surface-card">
          {!!block.props.title && <p className="font-bold font-display text-foreground mb-2">{String(block.props.title)}</p>}
          {!!block.props.body && <div className="text-sm text-foreground-secondary" dangerouslySetInnerHTML={{ __html: String(block.props.body) }} />}
          {(block.children ?? []).map((c) => (
            <Block key={c.id} block={c} />
          ))}
        </div>
      );
    case 'spacer':
      return <div style={{ height: Number(block.props.height) || 40 }} />;
    case 'divider':
      return <hr className="mb-4 border-border" />;
    case 'testimonial': {
      const quote = typeof block.props.quote === 'string' ? block.props.quote : '';
      if (!quote) return null;
      const authorName = typeof block.props.authorName === 'string' ? block.props.authorName : '';
      const authorTitle = typeof block.props.authorTitle === 'string' ? block.props.authorTitle : '';
      const avatarUrl = typeof block.props.resolvedAvatarUrl === 'string' ? block.props.resolvedAvatarUrl : null;
      return (
        <figure className="mb-4 p-6 rounded-2xl surface-card">
          <blockquote className="text-base italic text-foreground leading-relaxed">“{quote}”</blockquote>
          {(authorName || authorTitle) && (
            <figcaption className="mt-4 flex items-center gap-3">
              {avatarUrl && <img src={avatarUrl} alt={authorName} className="w-10 h-10 rounded-full object-cover" />}
              <div className="text-xs">
                {authorName && <p className="font-semibold text-foreground">{authorName}</p>}
                {authorTitle && <p className="text-foreground-muted">{authorTitle}</p>}
              </div>
            </figcaption>
          )}
        </figure>
      );
    }
    case 'form': {
      const formId = typeof block.props.formId === 'string' ? block.props.formId : '';
      if (!formId) return null;
      return (
        <div className="mb-4 p-6 rounded-3xl surface-card">
          <PublicForm formId={formId} />
        </div>
      );
    }
    // Resolved against the Template/Template Part and NavigationMenu
    // systems, same reuse model as Artify-Backend's own flattened body
    // fallback — not resolved for a Page's body content here (a header/
    // footer embedded this way inside page content, rather than via the
    // site's own App shell, is not a case Phase 9 needs to support).
    // Rendering nothing is the honest choice — a stray, unlabeled icon
    // would be a confusing non-functional control for a real visitor.
    case 'templatePart':
    case 'navigationMenu':
      return null;
    default:
      return null;
  }
};

export const PublicBlockRenderer: React.FC<{ blocks: PublicEditorBlock[] }> = ({ blocks }) => (
  <>
    {blocks.map((b) => (
      <Block key={b.id} block={b} />
    ))}
  </>
);
