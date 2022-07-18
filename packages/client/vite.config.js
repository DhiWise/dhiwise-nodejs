// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import vitePluginRequire from 'vite-plugin-require';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
  },
  plugins: [react(), vitePluginRequire()],
});
