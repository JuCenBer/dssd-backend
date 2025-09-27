import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  /* server: {
    proxy: {
      '/bonita': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          const sessions = {};
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (req.url.includes('/bonita/loginservice')) {
              const cookies = proxyRes.headers['set-cookie'] || [];
              let session, token;

              cookies.forEach(c => {
                if (c.startsWith('JSESSIONID')) session = c.split(';')[0].split('=')[1];
                if (c.startsWith('X-Bonita-API-Token')) token = c.split(';')[0].split('=')[1];
              });

              const clientId = crypto.randomUUID();
              sessions[clientId] = { session, token };

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ clientId }));
            }
          });

          // antes de enviar al backend
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const clientId = req.headers['x-client-id'];
            if (clientId && sessions[clientId]) {
              const { session, token } = sessions[clientId];
              proxyReq.setHeader('X-Bonita-API-Token', token);
              proxyReq.setHeader('Cookie', `JSESSIONID=${session}`);
            }
          });
        },
      },
    },
  }, */
})