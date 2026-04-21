/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
    },
    resolve: {
        dedupe: ['react', 'react-dom']
    },
    // ADD THIS SECTION BELOW
    optimizeDeps: {
        // Force Vite to only scan your main entry point 
        // and ignore static HTML reports from Playwright
        entries: ['./index.html'],
    },
    server: {
        watch: {
            // Prevents Vite from watching or scanning the report folders
            ignored: ['**/playwright-report/**']
        }
    }
})