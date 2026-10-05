import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';
import {defineConfig} from 'vite';

/**
 * Vercel serves a real file at "/" straight from the filesystem and never
 * applies the catch-all rewrite to it, so the homepage bypassed the SSR-head
 * function (api/index.ts) and always showed index.html's baked-in share tags.
 * Emitting the built shell under another name leaves "/" without a static
 * file, so it is rewritten to the function like every other route; the
 * function reads the shell from /app-shell.html.
 */
function renameShellForSsr() {
  return {
    name: 'rename-shell-for-ssr',
    apply: 'build' as const,
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist');
      const from = path.join(dist, 'index.html');
      if (fs.existsSync(from)) fs.renameSync(from, path.join(dist, 'app-shell.html'));
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), renameShellForSsr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Split rarely-changing vendor code into its own chunk so an app
          // deploy doesn't invalidate the browser's cached copy of React.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
              return 'vendor-react';
            }
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('lucide-react')) return 'vendor-icons';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
