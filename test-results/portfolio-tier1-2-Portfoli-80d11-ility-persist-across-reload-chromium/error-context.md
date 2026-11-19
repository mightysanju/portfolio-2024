# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio-tier1-2.spec.ts >> Portfolio E2E Tier 1 & 2 >> Tier 1: CMS editability persist across reload
- Location: e2e/portfolio-tier1-2.spec.ts:17:3

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
  3  |   seedCmsDraft, 
  4  |   loginAdmin, 
  5  |   resetBrowserCmsState, 
  6  |   setupOfflineSafeRoutes
  7  | } from './helpers';
  8  | 
  9  | test.describe('Portfolio E2E Tier 1 & 2', () => {
  10 |   test.beforeEach(async ({ page }) => {
  11 |     await setupOfflineSafeRoutes(page);
> 12 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5174/
  13 |     await resetBrowserCmsState(page);
  14 |     await page.reload();
  15 |   });
  16 | 
  17 |   test('Tier 1: CMS editability persist across reload', async ({ page }) => {
  18 |     await loginAdmin(page);
  19 |     await page.getByPlaceholder('Greeting').fill('Hello E2E');
  20 |     await page.getByRole('button', { name: /save draft locally/i }).click();
  21 |     
  22 |     await page.reload();
  23 |     await expect(page.getByText('Hello E2E')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('Tier 2: Empty tech stack handles gracefully', async ({ page }) => {
  27 |     // Seed with no projects
  28 |     await seedCmsDraft(page, { projects: [] });
  29 |     await page.goto('/');
  30 |     
  31 |     const techStack = page.getByTestId('tech-stack-strip');
  32 |     await expect(techStack).toBeVisible();
  33 |     // Assuming it shows "empty" text or is just empty
  34 |   });
  35 | });
  36 | 
```