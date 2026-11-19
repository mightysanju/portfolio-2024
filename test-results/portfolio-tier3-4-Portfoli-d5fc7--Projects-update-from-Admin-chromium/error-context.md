# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio-tier3-4.spec.ts >> Portfolio E2E Tier 3 & 4 >> Tier 3: Hero and Projects update from Admin
- Location: e2e/portfolio-tier3-4.spec.ts:17:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5174/
Call log:
  - navigating to "http://127.0.0.1:5174/", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: 127.0.0.1
      - text: refused to connect.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Try:"
      - list [ref=e12]:
        - listitem [ref=e13]: Checking the connection
        - listitem [ref=e14]:
          - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Reload" [ref=e19] [cursor=pointer]
    - button "Details" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { 
  3  |   loginAdmin, 
  4  |   resetBrowserCmsState, 
  5  |   setupOfflineSafeRoutes,
  6  |   openAdminTab
  7  | } from './helpers';
  8  | 
  9  | test.describe('Portfolio E2E Tier 3 & 4', () => {
  10 |   test.beforeEach(async ({ page }) => {
  11 |     await setupOfflineSafeRoutes(page);
> 12 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5174/
  13 |     await resetBrowserCmsState(page);
  14 |     await page.reload();
  15 |   });
  16 | 
  17 |   test('Tier 3: Hero and Projects update from Admin', async ({ page }) => {
  18 |     await loginAdmin(page);
  19 |     await openAdminTab(page, 'Hero');
  20 |     
  21 |     // Select one project
  22 |     await page.locator('input[type="checkbox"]').first().check();
  23 |     await page.getByRole('button', { name: /save draft locally/i }).click();
  24 | 
  25 |     await page.goto('/');
  26 |     const count = await page.getByTestId('hero-records-count').textContent();
  27 |     expect(count).toContain('1 RECORD');
  28 |   });
  29 | 
  30 |   test('Tier 4: End-to-end admin editing flow', async ({ page }) => {
  31 |     await loginAdmin(page);
  32 |     await openAdminTab(page, 'Projects');
  33 |     await page.getByPlaceholder('Project Title').first().fill('New Title');
  34 |     await page.getByRole('button', { name: /save draft locally/i }).click();
  35 | 
  36 |     await page.goto('/');
  37 |     await expect(page.getByText('New Title')).toBeVisible();
  38 |   });
  39 | });
  40 | 
```