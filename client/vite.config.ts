import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import vitesTSConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vitesTSConfigPaths()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
});
