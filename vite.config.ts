import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: '../build',
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
