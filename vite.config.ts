import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            utils: ['lucide-react', 'html-entities']
          }
        }
      },
      target: 'es2015',
      minify: 'terser',
      assetsDir: 'assets',
      cssCodeSplit: true,
      modulePreload: {
        polyfill: true
      }
    },
    server: {
      port: 5173,
      host: true,
      strictPort: true,
      open: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
      open: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react']
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
      'process.env.VITE_SCRAPINGBEE_API_KEY': JSON.stringify(process.env.VITE_SCRAPINGBEE_API_KEY)
    }
  };
});