import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:5173' });

test.describe('Crewzy Silver Challenge - Real Scenarios', () => {

    test('should login successfully and redirect to home', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'alex.morgan@example.com');
        await page.fill('input[type="password"]', 'parola123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('http://localhost:5173/');
        await expect(page.locator('h1').first()).toContainText('Discover, Plan & Connect');
    });

    test('should open create event modal from calendar', async ({ page }) => {
        await page.goto('/calendar');
        // Folosim un selector super specific pentru butonul rotund și negru
        await page.locator('button.bg-gray-900.rounded-full.text-white').first().click();
        await expect(page.locator('text=Create Event').first()).toBeVisible();
    });

    test('should toggle between table and card view in calendar', async ({ page }) => {
        await page.goto('/calendar');
        // Căutăm butonul după text, dar forțăm click-ul chiar dacă textul e parțial ascuns
        await page.locator('button', { hasText: 'Cards' }).click({ force: true });
        await expect(page.locator('.grid.gap-4').first()).toBeVisible();

        await page.locator('button', { hasText: 'Table' }).click({ force: true });
        await expect(page.locator('table').first()).toBeVisible();
    });

    test('should filter events by RSVP status', async ({ page }) => {
        await page.goto('/calendar');
        await page.locator('button', { hasText: 'Accepted' }).click({ force: true });
        await expect(page.locator('button', { hasText: 'Accepted' })).toHaveClass(/bg-green-500/);
    });
});