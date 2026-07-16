import { test, expect } from '@playwright/test';

test.describe('Wallet Operations Flow', () => {
  test('should successfully sign up and view dashboard', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Switch to sign up
    await page.click('text=sign up →');
    
    // Fill sign up form with random data
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const email = `testuser_${randomSuffix}@example.com`;
    
    await page.fill('input[name="name"]', `Test User ${randomSuffix}`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'Password123!');
    
    // Submit form
    await page.click('button:has-text("create account →")');
    
    // Verify successful navigation to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Dashboard').first()).toBeVisible({ timeout: 10000 });
    
    // Check dashboard balance tile is rendered
    await expect(page.locator('text=[01] balance').first()).toBeVisible();
    
    // Navigate to transfer page
    await page.click('text=add money');
    await expect(page).toHaveURL(/.*\/transfer/);
    
    // Check add money form is rendered
    await expect(page.locator('text=[01] add money').first()).toBeVisible();
    
    // Try adding money locally (without completing Razorpay)
    await page.fill('input[placeholder="0.00"]', '500');
    await page.click('button:has-text("add money")');
    
    // Verify it tries to load razorpay or shows some interaction
    await expect(page.locator('text=powered by razorpay').first()).toBeVisible();
  });
});
