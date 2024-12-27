import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    mode: 'development',
  },
  clearScreen: false,
  appType: 'custom',
  build: {
    mode: 'production',
    outDir: resolve(__dirname, '_site'),
    emptyOutDir: false,
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, '/src/assets/js/main.js'),
      },
      output: {
        assetFileNames: 'assets/css/screen.[hash].css',
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
      },
    },
  },
  css: {
    devSourcemap: true,
  },
});
