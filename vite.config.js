import { resolve } from "path";
import { defineConfig } from "vite";
import rollupPluginCritical from "rollup-plugin-critical";

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
      plugins: [rollupPluginCritical({
          criticalUrl: './_site/',
          criticalBase: './',
          criticalPages: [
            { uri: 'index.html', template: 'index' },
            { uri: '404.html', template: '404' },
          ],
          criticalConfig: {
            inline: true,
            dimensions: [
              {
                height: 900,
                width: 375,
              },
              {
                height: 720,
                width: 1280,
              },
              {
                height: 1080,
                width: 1920,
              }
            ],
          }
        })
      ]
    },
  },
  css: {
    devSourcemap: true,
  },
});
