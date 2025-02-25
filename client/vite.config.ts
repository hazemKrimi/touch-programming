import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import vitesTSConfigPaths from 'vite-tsconfig-paths';
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    vitesTSConfigPaths(),
    svgr(),
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
