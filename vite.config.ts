import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const rootDir = process.cwd();
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'serve-root-logo',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/logo.webp' || req.url === '/logo.png') {
              const possiblePaths = [
                path.resolve(rootDir, 'logo.webp'),
                path.resolve(rootDir, 'public/logo.webp'),
                path.resolve(rootDir, 'src/logo.webp'),
                path.resolve(rootDir, 'src/assets/logo.webp'),
                path.resolve(rootDir, 'bank-of-america-stacked-logo-cj.webp'),
              ];
              for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                  res.setHeader('Content-Type', 'image/webp');
                  return fs.createReadStream(p).pipe(res);
                }
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
