import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],

    // Explicitly publish public/ assets at the root of dist/.
    publicDir: path.resolve(__dirname, 'public'),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      target: 'es2022',
      cssCodeSplit: true,
      minify: 'esbuild',

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }

              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }

              if (id.includes('motion')) {
                return 'vendor-motion';
              }

              if (id.includes('axios')) {
                return 'vendor-network';
              }

              return 'vendor-utils';
            }
          },
        },
      },

      chunkSizeWarningLimit: 600,
    },

    server: {
      host: '0.0.0.0',
      port: 3000,

      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},

      // Forward contact form submissions to the PHP backend.
      proxy: {
        '/api/contact': {
          target: 'https://oankcleaning.co.uk',
          changeOrigin: true,
          secure: true,

          // Maps /api/contact to /api/contact.php on the PHP server.
          rewrite: (requestPath) =>
            requestPath.replace(/^\/api\/contact$/, '/api/contact.php'),
        },
        '/api/quote': {
          target: 'https://oankcleaning.co.uk',
          changeOrigin: true,
          secure: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api\/quote$/, '/api/quote.php'),
        },
        '/api/job-admin': {
          target: 'https://oankcleaning.co.uk', changeOrigin: true, secure: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api\/job-admin$/, '/api/job_admin.php'),
        },
        '/api/job-track': {
          target: 'https://oankcleaning.co.uk', changeOrigin: true, secure: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api\/job-track$/, '/api/job_track.php'),
        },
      },
    },
  };
});