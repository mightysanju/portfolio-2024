# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: adversarial.spec.ts >> Portfolio E2E Adversarial >> Should handle invalid file upload gracefully
- Location: e2e/adversarial.spec.ts:19:3

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
  6  |   openAdminTab,
  7  |   uploadToField,
  8  |   makeInvalidTextFilePayload
  9  | } from './helpers';
  10 | 
  11 | test.describe('Portfolio E2E Adversarial', () => {
  12 |   test.beforeEach(async ({ page }) => {
  13 |     await setupOfflineSafeRoutes(page);
> 14 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5174/
  15 |     await resetBrowserCmsState(page);
  16 |     await page.reload();
  17 |   });
  18 | 
  19 |   test('Should handle invalid file upload gracefully', async ({ page }) => {
  20 |     await loginAdmin(page);
  21 |     await openAdminTab(page, 'Hero');
  22 |     
  23 |     // Attempt upload of invalid file
  24 |     await uploadToField(page, 'Profile Image', makeInvalidTextFilePayload());
  25 |     
  26 |     // Expect error message or no crash
  27 |     // Based on requirements, it should probably show an error
  28 |     await expect(page.getByText(/error|invalid/i)).toBeVisible();
  29 |   });
  30 | });
  31 | 
```