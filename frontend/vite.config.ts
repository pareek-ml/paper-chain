// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: './',        // important for canister hosting
    build: {
        outDir: 'dist',  // where build will land
    },
});