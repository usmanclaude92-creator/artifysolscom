/**
 * Phase 9 (Forms + Landing Pages + Conversion, Artify-Backend repo) —
 * the public site's generic renderer for any Control-Center-authored
 * Form. Fetches the real field definitions (publicApi.getForm/
 * getFormById) and posts a real submission (publicApi.submitForm) —
 * this is what makes a "lead form"/"newsletter signup"/"contact block"
 * embedded via the Site Editor's `form` block (or used standalone)
 * actually work on the live site, closing the gap the Phase 9 MVP slice
 * explicitly left open ("no public-facing form renderer").
 *
 * Mirrors ContactAndBrief.tsx's established conventions exactly: the
 * honeypot is hidden via CSS (never `type="hidden"` — real bots skip
 * those), the error/success states never claim success unless the
 * request actually reached the platform API, and styling reuses the
 * same surface-card/surface-input/violet-gradient-button classes so an
 * embedded Form looks native to the rest of the site.
 */
import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { publicApi, type PublicForm as PublicFormDef, type PublicFormField } from '../../lib/publicApi';
import { ApiClientError } from '../../lib/apiClient';
import { readUtmParams, getLandingPagePath } from '../../lib/utm';

type FieldValue = string | string[];
type FormValues = Record<string, FieldValue>;

function isFieldVisible(field: PublicFormField, values: FormValues): boolean {
  if (!field.visibleWhen) return true;
  return values[field.visibleWhen.fieldKey] === field.visibleWhen.equals;
}

function isEmpty(value: FieldValue | undefined): boolean {
  if (value === undefined) return true;
  return Array.isArray(value) ? value.length === 0 : !value.trim();
}

const FieldInput: React.FC<{ field: PublicFormField; value: FieldValue | undefined; onChange: (v: FieldValue) => void }> = ({
  field,
  value,
  onChange,
}) => {
  const inputClass = 'w-full surface-input rounded-xl px-4 py-2.5 text-xs focus:outline-none';
  const id = `public-form-field-${field.key}`;

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          id={id}
          aria-required={field.required}
          rows={4}
          placeholder={field.placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} leading-relaxed`}
        />
      );
    case 'select':
      return (
        <select id={id} aria-required={field.required} value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          <option value="">Select…</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case 'multiselect': {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((o) => {
            const checked = selected.includes(o.value);
            return (
              <label
                key={o.value}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border cursor-pointer"
                style={checked ? { background: 'rgba(124,58,237,0.15)', color: '#c4b5fd', borderColor: '#7c3aed' } : undefined}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onChange(checked ? selected.filter((v) => v !== o.value) : [...selected, o.value])}
                />
                {o.label}
              </label>
            );
          })}
        </div>
      );
    }
    case 'radio':
      return (
        <div className="flex flex-wrap gap-4">
          {(field.options ?? []).map((o) => (
            <label key={o.value} className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="radio" name={id} aria-required={field.required} checked={value === o.value} onChange={() => onChange(o.value)} />
              {o.label}
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <label className="flex items-start gap-2.5 text-xs leading-relaxed cursor-pointer">
          <input type="checkbox" aria-required={field.required} checked={value === 'true'} onChange={(e) => onChange(e.target.checked ? 'true' : 'false')} className="mt-0.5" />
          <span>
            {field.label}
            {field.required && ' *'}
          </span>
        </label>
      );
    case 'date':
      return <input id={id} type="date" aria-required={field.required} value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
    case 'number':
      return (
        <input
          id={id}
          type="number"
          aria-required={field.required}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
    case 'hidden':
      return null;
    default:
      return (
        <input
          id={id}
          type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
          aria-required={field.required}
          placeholder={field.placeholder}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
  }
};

export const PublicForm: React.FC<{ slug?: string; formId?: string; className?: string }> = ({ slug, formId, className }) => {
  const [form, setForm] = useState<PublicFormDef | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    const load = slug ? publicApi.getForm(slug) : formId ? publicApi.getFormById(formId) : Promise.reject(new Error('No form specified.'));
    load
      .then((res) => {
        if (!cancelled) setForm(res);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiClientError ? err.message : 'This form is not available right now.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSubmitError(null);

    const visibleFields = form.fields.filter((f) => isFieldVisible(f, values));
    for (const field of visibleFields) {
      if (field.required && isEmpty(values[field.key])) {
        setSubmitError(`"${field.label}" is required.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await publicApi.submitForm(form.slug, {
        data: values,
        ...readUtmParams(),
        landingPagePath: getLandingPagePath(),
        website,
      });
      setSuccessMessage(res.message);
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : 'We could not submit this right now. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={className} aria-hidden="true" />;
  if (loadError || !form) {
    return (
      <div className={`p-4 rounded-xl text-xs ${className ?? ''}`} style={{ background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}>
        {loadError ?? 'This form is not available right now.'}
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className={`p-8 rounded-3xl surface-card text-center space-y-3 ${className ?? ''}`}>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <p className="text-sm text-foreground-muted max-w-md mx-auto leading-relaxed">{successMessage}</p>
      </div>
    );
  }

  const visibleFields = form.fields.filter((f) => isFieldVisible(f, values));

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className ?? ''}`}>
      {visibleFields.map((field) => (
        <div key={field.key}>
          {field.type !== 'checkbox' && field.type !== 'hidden' && (
            <label htmlFor={`public-form-field-${field.key}`} className="text-xs font-bold label-theme font-mono-code uppercase block mb-1.5">
              {field.label}
              {field.required && ' *'}
            </label>
          )}
          <FieldInput field={field} value={values[field.key]} onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))} />
        </div>
      ))}

      {/* Honeypot — hidden from real visitors via CSS, never via type=hidden (bots skip those). Mirrors ContactAndBrief.tsx exactly. */}
      <div className="absolute left-[-9999px] opacity-0" aria-hidden="true">
        <label htmlFor="public-form-website">Website</label>
        <input type="text" id="public-form-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {submitError && <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-xs text-red-300 font-mono-code">{submitError}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-3.5 rounded-xl shadow-xl shadow-violet-600/30 transition-all active:scale-[0.99] disabled:opacity-50"
      >
        <span>{submitting ? 'Submitting…' : 'Submit'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
