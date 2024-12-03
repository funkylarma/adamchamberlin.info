import { resolve } from "path";
import { defineConfig } from "vite";
import rollupPluginCritical from "rollup-plugin-critical";

export default defineConfig({
  publicDir: "_site",
  css: {
    devSourcemap: true,
  },
  build: {
    mode: "production",
    outDir: "_site",
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: "/src/assets/js/main.js",
      },
      output: {
        assetFileNames: "assets/css/screen.[hash].css",
        chunkFileNames: "assets/js/[name].[hash].js",
        entryFileNames: "assets/js/[name].[hash].js",
      },
    },
  },
});
