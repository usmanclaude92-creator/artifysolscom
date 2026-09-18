import React, { useState } from 'react';
import {
  X,
  FileCode,
  Check,
  Copy,
  Download,
  ExternalLink,
  Search,
  Sparkles,
  Bot,
  BookOpen,
  Layers,
  Globe,
} from 'lucide-react';
import { getSitemapUrlList, generateSitemapXml, SitemapUrlEntry } from '../utils/sitemap';
import { safeCopyToClipboard } from '../utils/clipboard';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProduct?: (slug: string) => void;
  onNavigateToBlog?: (slug: string) => void;
  theme?: 'light' | 'dark';
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onNavigateToProduct,
  onNavigateToBlog,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewRawXml, setViewRawXml] = useState(false);

  if (!isOpen) return null;

  const urlEntries = getSitemapUrlList();
  const rawXml = generateSitemapXml();

  const filteredEntries = urlEntries.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.category && entry.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || entry.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCopyXml = async () => {
    const success = await safeCopyToClipboard(rawXml);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadXml = () => {
    const blob = new Blob([rawXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getTypeBadge = (type: SitemapUrlEntry['type']) => {
    switch (type) {
      case 'product':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-violet-950/70 border border-violet-500/30 text-violet-300 flex items-center gap-1 font-mono-code">
            <Bot className="w-3 h-3 text-violet-400" /> Product
          </span>
        );
      case 'article':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950/70 border border-sky-500/30 text-sky-300 flex items-center gap-1 font-mono-code">
            <BookOpen className="w-3 h-3 text-sky-400" /> Article
          </span>
        );
      case 'category':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 font-mono-code">
            <Layers className="w-3 h-3 text-emerald-400" /> Category
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-300 flex items-center gap-1 font-mono-code">
            <Globe className="w-3 h-3 text-zinc-400" /> Core
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] surface-modal rounded-2xl shadow-2xl flex flex-col overflow-hidden text-foreground font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border surface-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 p-[1px] flex items-center justify-center">
              <div className="w-full h-full surface-card rounded-[11px] flex items-center justify-center">
                <FileCode className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground font-display">
                  Dynamic XML Sitemap Generator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono-code">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-foreground-muted">
                Auto-indexes all product catalog routes, research articles, category hubs, and core landing endpoints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewRawXml(!viewRawXml)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-colors border ${
                viewRawXml
                  ? 'btn-theme-primary'
                  : 'btn-theme-secondary'
              }`}
            >
              {viewRawXml ? 'View Table' : 'View XML Code'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action / Stats Bar */}
        <div className="px-6 py-3 surface-card-subtle border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-foreground-muted font-mono-code text-[11px]">
            <span>
              Total Routes: <strong className="text-foreground">{urlEntries.length}</strong>
            </span>
            <span>•</span>
            <span>
              Products: <strong className="text-violet-400">{urlEntries.filter((e) => e.type === 'product').length}</strong>
            </span>
            <span>•</span>
            <span>
              Articles: <strong className="text-sky-400">{urlEntries.filter((e) => e.type === 'article').length}</strong>
            </span>
            <span>•</span>
            <span>
              Categories: <strong className="text-emerald-400">{urlEntries.filter((e) => e.type === 'category').length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-theme-secondary text-xs font-mono-code transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied XML!' : 'Copy XML'}</span>
            </button>
            <button
              onClick={handleDownloadXml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-xs font-mono-code transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .xml</span>
            </button>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-theme-secondary text-xs font-mono-code transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-foreground-muted" />
              <span>/sitemap.xml</span>
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[60vh]">
          {viewRawXml ? (
            <div className="relative">
              <pre className="p-4 rounded-xl surface-container-sunken border border-border text-emerald-500 font-mono-code text-[11px] leading-relaxed overflow-x-auto selection:bg-emerald-950 selection:text-emerald-200">
                {rawXml}
              </pre>
            </div>
          ) : (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search canonical URL or title..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl surface-input text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {['all', 'core', 'product', 'article', 'category'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono-code transition-colors capitalize ${
                        filterType === type
                          ? 'btn-theme-primary'
                          : 'btn-theme-secondary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of Entries */}
              <div className="rounded-xl border border-border overflow-hidden surface-card">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border surface-card-subtle text-foreground-muted font-mono-code text-[10px] uppercase">
                      <th className="py-2.5 px-4 font-semibold">Type</th>
                      <th className="py-2.5 px-4 font-semibold">Canonical Location (loc)</th>
                      <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Priority</th>
                      <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Frequency</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono-code text-[11px]">
                    {filteredEntries.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-surface-hover transition-colors">
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          {getTypeBadge(entry.type)}
                        </td>
                        <td className="py-2.5 px-4 font-sans">
                          <div className="flex flex-col">
                            {entry.title && (
                              <span className="text-foreground font-medium text-xs truncate max-w-md">
                                {entry.title}
                              </span>
                            )}
                            <span className="text-primary font-mono-code text-[11px] truncate max-w-md">
                              {entry.loc}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-foreground-secondary hidden md:table-cell">
                          <span className="px-1.5 py-0.5 rounded surface-card-subtle text-foreground-muted font-bold">
                            {entry.priority?.toFixed(2) || '0.50'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-foreground-muted hidden sm:table-cell">
                          {entry.changefreq || 'weekly'}
                        </td>
                        <td className="py-2.5 px-4 text-foreground-muted text-right whitespace-nowrap">
                          {entry.lastmod || 'Today'}
                        </td>
                      </tr>
                    ))}
                    {filteredEntries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-foreground-muted font-sans">
                          No matching sitemap URLs found for "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-border surface-card-subtle flex items-center justify-between text-[11px] text-foreground-muted">
          <span className="flex items-center gap-1.5 font-mono-code">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Search Engine Standards: Sitemaps XML 0.9 & Google Image Indexing 1.1</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg btn-theme-secondary font-mono-code transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
