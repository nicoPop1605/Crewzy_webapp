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
        await page.locator('button.bg-gray-900.rounded-full.text-white').first().click();
        await expect(page.locator('text=Create Event').first()).toBeVisible();
    });

   

    test('should filter events by RSVP status', async ({ page }) => {
        await page.goto('/calendar');
        await page.locator('button', { hasText: 'Accepted' }).click({ force: true });
        await expect(page.locator('button', { hasText: 'Accepted' })).toHaveClass(/bg-green-500/);
    });


    test('should filter discover events by category', async ({ page }) => {
        await page.goto('/discover');
        // Dăm click pe categoria Karaoke
        await page.locator('button', { hasText: 'Karaoke' }).click({ force: true });
        // Verificăm dacă butonul a devenit activ (primește clasa de fundal negru)
        await expect(page.locator('button', { hasText: 'Karaoke' })).toHaveClass(/bg-gray-900/);
    });

    test('should switch to Groups tab in Friends page', async ({ page }) => {
        await page.goto('/friends');
        // Dăm click pe tab-ul "Groups"
        await page.locator('button', { hasText: 'Groups' }).click({ force: true });
        // Verificăm dacă apare grupul "Weekend Warriors" din lista ta mock-uită
        await expect(page.locator('text=Weekend Warriors').first()).toBeVisible();
    });

    test('should toggle edit mode on Profile page', async ({ page }) => {
        await page.goto('/profile');
        // Apăsăm butonul de editare
        await page.locator('button', { hasText: 'Edit Profile' }).click({ force: true });
        // Verificăm dacă a apărut butonul "Save" în locul lui "Edit Profile"
        await expect(page.locator('button', { hasText: 'Save' })).toBeVisible();
        // Verificăm dacă adresa de email a devenit un câmp editabil (input)
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('should open day details modal in calendar', async ({ page }) => {
        await page.goto('/calendar');
        // Apăsăm pe prima celulă (zi) din calendar care arată ca un buton pătrat
        await page.locator('button.aspect-square').first().click({ force: true });
        // Verificăm dacă s-a deschis fereastra detaliată pentru ziua respectivă
        await expect(page.locator('text=Mark Your Availability').first()).toBeVisible();
    });

});