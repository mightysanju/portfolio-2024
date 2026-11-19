import { test, expect } from '@playwright/test';
import { 
  loginAdmin, 
  resetBrowserCmsState, 
  setupOfflineSafeRoutes,
  openAdminTab,
  uploadToField,
  makeInvalidTextFilePayload
} from './helpers';

test.describe('Portfolio E2E Adversarial', () => {
  test.beforeEach(async ({ page }) => {
    await setupOfflineSafeRoutes(page);
    await page.goto('/');
    await resetBrowserCmsState(page);
    await page.reload();
  });

  test('Should handle invalid file upload gracefully', async ({ page }) => {
    await loginAdmin(page);
    await openAdminTab(page, 'Hero');
    
    // Attempt upload of invalid file
    await uploadToField(page, 'Profile Image', makeInvalidTextFilePayload());
    
    // Expect error message or no crash
    // Based on requirements, it should probably show an error
    await expect(page.getByText(/error|invalid/i)).toBeVisible();
  });
});
