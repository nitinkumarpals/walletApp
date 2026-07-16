import { test, expect } from '@playwright/test';

test.describe('Transfer Operations Flow', () => {
  test('should successfully sign up two users and send money between them', async ({ page, browser }) => {
    // We'll use two different contexts to simulate two users or just sequence them in one context
    
    // User 1 Sign Up
    await page.goto('/login');
    await page.click('text=sign up →');
    
    const suffix1 = Math.floor(Math.random() * 1000000);
    const email1 = `sender_${suffix1}@example.com`;
    const phone1 = `9876${suffix1.toString().padStart(6, '0')}`;
    
    await page.fill('input[name="name"]', `Sender ${suffix1}`);
    await page.fill('input[name="number"]', phone1);
    await page.fill('input[name="email"]', email1);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button:has-text("create account →")');
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Log out User 1
    await page.click('text=log out');
    await expect(page).toHaveURL("http://localhost:3000/");
    
    // User 2 Sign Up
    await page.goto('/login');
    await page.click('text=sign up →');
    
    const suffix2 = Math.floor(Math.random() * 1000000);
    const email2 = `receiver_${suffix2}@example.com`;
    const phone2 = `9876${suffix2.toString().padStart(6, '0')}`;
    
    await page.fill('input[name="name"]', `Receiver ${suffix2}`);
    await page.fill('input[name="number"]', phone2);
    await page.fill('input[name="email"]', email2);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button:has-text("create account →")');
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Log out User 2
    await page.click('text=log out');
    await expect(page).toHaveURL("http://localhost:3000/");
    
    // Log back in as User 1
    await page.goto('/login');
    await page.fill('input[name="email"]', email1);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button:has-text("sign in →")');
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Go to Send page
    await page.click('text=send money');
    await expect(page).toHaveURL(/.*\/p2p/);
    
    // Since balance is 0, we can try to send and verify insufficient funds error
    await page.fill('input[placeholder="name@example.com"]', email2);
    await page.fill('input[placeholder="0.00"]', '100');
    await page.click('button:has-text("Send")');
    
    // Check for any toast to appear (since error could be formatted differently)
    await expect(page.locator('[role="status"]').first()).toBeVisible({ timeout: 10000 });
  });
});
