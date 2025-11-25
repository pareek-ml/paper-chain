// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import path from 'path';


export default defineConfig({
  base: './',        // important for canister hosting
  plugins: [react()],
  resolve: {
    alias: {
      '@declarations': path.resolve(__dirname, '../src/declarations'),
    }
  },
  build: {
    outDir: 'dist',  // where build will land
  },
});