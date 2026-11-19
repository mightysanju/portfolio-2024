import { test, expect } from '@playwright/test';
import { 
  loginAdmin, 
  resetBrowserCmsState, 
  setupOfflineSafeRoutes,
  openAdminTab
} from './helpers';

test.describe('Portfolio E2E Tier 3 & 4', () => {
  test.beforeEach(async ({ page }) => {
    await setupOfflineSafeRoutes(page);
    await page.goto('/');
    await resetBrowserCmsState(page);
    await page.reload();
  });

  test('Tier 3: Hero and Projects update from Admin', async ({ page }) => {
    await loginAdmin(page);
    await openAdminTab(page, 'Hero');
    
    // Select one project
    await page.locator('input[type="checkbox"]').first().check();
    await page.getByRole('button', { name: /save draft locally/i }).click();

    await page.goto('/');
    const count = await page.getByTestId('hero-records-count').textContent();
    expect(count).toContain('1 RECORD');
  });

  test('Tier 4: End-to-end admin editing flow', async ({ page }) => {
    await loginAdmin(page);
    await openAdminTab(page, 'Projects');
    await page.getByPlaceholder('Project Title').first().fill('New Title');
    await page.getByRole('button', { name: /save draft locally/i }).click();

    await page.goto('/');
    await expect(page.getByText('New Title')).toBeVisible();
  });
});
