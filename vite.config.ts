import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  base: '/',
  envPrefix: 'REACT_APP_',
  plugins: [react(), eslint()],
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
