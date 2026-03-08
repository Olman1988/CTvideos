import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '', // ¡Deja vacío en desarrollo!

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
  host: '0.0.0.0', // escucha todas las interfaces internas
  port: 5173,
  strictPort: true,
  hmr: {
    protocol: 'ws',
    host: '0.0.0.0', // ✅ importante para acceder desde fuera
    port: 5173,
    path: '/@vite/client',
  },
},
});