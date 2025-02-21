import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import vitesTSConfigPaths from 'vite-tsconfig-paths';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    react(),
    vitesTSConfigPaths(),
    mkcert()
  ],
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
