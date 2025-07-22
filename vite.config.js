import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config(); // load env vars from .env

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: false, // Disables the error overlay
    },
    proxy: {
      '/upload-progress': {
        target: ['https://dms.easyaab.com', 'http://localhost:5173'],
        ws: true,
        changeOrigin: true,
      },
    },
    optimizeDeps: {
      include: ['xlsx'],
    },
  },
});
