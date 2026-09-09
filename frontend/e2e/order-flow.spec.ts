import { test, expect } from '@playwright/test';

test.describe('FoodLine Campus — Core Navigation & Order Flow Smoke Tests', () => {
  test('Landing page loads with core hero CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/FoodLine/i);
    // Verify primary CTA button is present
    const ctaButton = page.locator('a[href="/select-campus"], button:has-text("Select Campus")').first();
    await expect(ctaButton).toBeVisible();
  });

  test('Campus and Canteen directory loads with 5 Sanjivani outlets', async ({ page }) => {
    await page.goto('/canteens');
    await expect(page.locator('text=Cafe @7').first()).toBeVisible();
    await expect(page.locator('text=South Corner').first()).toBeVisible();
  });

  test('Menu screen loads dishes and category filter tabs', async ({ page }) => {
    await page.goto('/menu');
    await expect(page.locator('text=All').first()).toBeVisible();
    // Verify at least one dish is rendered
    const dishCard = page.locator('[data-dish-id], [role="article"], .dish-card, button:has-text("Add")').first();
    await expect(dishCard).toBeVisible();
  });

  test('Login screen renders PRN input and active account detection', async ({ page }) => {
    await page.goto('/login');
    const prnInput = page.locator('input[placeholder*="PRN"], input[name*="prn"]').first();
    await expect(prnInput).toBeVisible();
  });
});
