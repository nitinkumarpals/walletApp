import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should render the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=move money at the').first()).toBeVisible();
    await expect(page.locator('text=open account').first()).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    const loginButton = page.locator('a', { hasText: /\[ log in \]/i }).first();
    await loginButton.click();
    
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('text=welcome back.')).toBeVisible();
  });

  test('should show validation errors on invalid login', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'short');
    
    const signInButton = page.locator('button', { hasText: /^sign in/i });
    await signInButton.click();
    
    // Check if toast appears
    await expect(page.locator('text=Incorrect email or password').first()).toBeVisible({ timeout: 5000 });
  });
});
