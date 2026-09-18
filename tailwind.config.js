/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '.theme-dark'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          foreground: 'var(--color-primary-foreground)',
          subtle: 'var(--color-primary-subtle)',
          border: 'var(--color-primary-border)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          foreground: 'var(--color-secondary-foreground)',
          subtle: 'var(--color-secondary-subtle)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          surface: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          subtle: 'var(--color-surface-subtle)',
          hover: 'var(--color-surface-hover)',
          muted: 'var(--color-surface-muted)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
          secondary: 'var(--color-foreground-secondary)',
          muted: 'var(--color-foreground-muted)',
          subtle: 'var(--color-foreground-subtle)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)',
          primary: 'var(--color-primary-border)',
        },
        card: {
          DEFAULT: 'var(--color-card)',
          hover: 'var(--color-card-hover)',
          border: 'var(--color-card-border)',
        },
        input: {
          DEFAULT: 'var(--color-input)',
          border: 'var(--color-input-border)',
          focus: 'var(--color-input-focus)',
          text: 'var(--color-input-text)',
          placeholder: 'var(--color-input-placeholder)',
        },
      },
    },
  },
};
