import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/upload': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/schema': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/visualize': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/nlviz': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/download': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/chat': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/chat/history': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/chat/export': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});
