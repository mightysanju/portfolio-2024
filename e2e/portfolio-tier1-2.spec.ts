import { test, expect } from '@playwright/test';
import { 
  seedCmsDraft, 
  loginAdmin, 
  resetBrowserCmsState, 
  setupOfflineSafeRoutes
} from './helpers';

test.describe('Portfolio E2E Tier 1 & 2', () => {
  test.beforeEach(async ({ page }) => {
    await setupOfflineSafeRoutes(page);
    await page.goto('/');
    await resetBrowserCmsState(page);
    await page.reload();
  });

  test('Tier 1: CMS editability persist across reload', async ({ page }) => {
    await loginAdmin(page);
    await page.getByPlaceholder('Greeting').fill('Hello E2E');
    await page.getByRole('button', { name: /save draft locally/i }).click();
    
    await page.reload();
    await expect(page.getByText('Hello E2E')).toBeVisible();
  });

  test('Tier 2: Empty tech stack handles gracefully', async ({ page }) => {
    // Seed with no projects
    await seedCmsDraft(page, { projects: [] });
    await page.goto('/');
    
    const techStack = page.getByTestId('tech-stack-strip');
    await expect(techStack).toBeVisible();
    // Assuming it shows "empty" text or is just empty
  });
});
