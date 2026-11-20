import http from 'http';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Persistent keep-alive agent to prevent socket / ephemeral port exhaustion (ENOBUFS) on Windows
const keepAliveAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 30000
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3005',
          changeOrigin: true,
          secure: false,
          ws: false,
          timeout: 30000,
          proxyTimeout: 30000,
          agent: keepAliveAgent,
          configure: (proxy) => {
            proxy.on('error', (err: any, _req, res) => {
              const code = err?.code || err?.message || 'UNKNOWN';
              // Avoid flooding console for anticipated connection issues
              console.warn(`[vite proxy] API connection error (${code}) to 127.0.0.1:3005`);
              if (res && 'writeHead' in res && !(res as any).headersSent) {
                (res as any).writeHead(502, { 'Content-Type': 'application/json' });
                (res as any).end(JSON.stringify({
                  error: `Backend API server at http://127.0.0.1:3005 is unreachable (${code}). Please ensure the backend server is running.`
                }));
              }
            });
          }
        }
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/server/**', '**/.data/**', '**/server.ts', '**/dist/**', '**/node_modules/**']
      },
    },
  };
});
