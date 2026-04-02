import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // 1. Spunem unde sunt testele tale
    testDir: './src/tests',

    // 2. Rulăm testele în paralel pentru viteză
    fullyParallel: true,

    // 3. Raport HTML frumos la final
    reporter: 'html',

    use: {
        // 4. URL-ul de bază pentru Vite (5173)
        baseURL: 'http://localhost:5173',

        // Înregistrăm acțiunile dacă testul eșuează (pentru debugging)
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    // 5. Definim browserele (Proiectele)
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});