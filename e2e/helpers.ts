import { expect, type Locator, type Page } from '@playwright/test';

export const CMS_STORAGE_KEY = 'portfolio_cms_data_v1';
export const VAULT_STORAGE_KEY = 'portfolio_admin_vault_v1';
export const REPO_CONFIG_STORAGE_KEY = 'portfolio_admin_repo_config_v1';
export const UPLOADS_LEGACY_KEY = 'portfolio_cms_uploads_v1';
export const ASSET_IDB_NAME = 'portfolio_cms_assets_db';
export const ASSET_IDB_STORE = 'staged_uploads';

// Valid 1x1 RGBA PNG (68 bytes) so Chromium Image() decoding always succeeds
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export interface FileUploadPayload {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export function makeTinyPngPayload(name = 'sample-photo.png'): FileUploadPayload {
  return {
    name,
    mimeType: 'image/png',
    buffer: Buffer.from(TINY_PNG_BASE64, 'base64'),
  };
}

export function makeSvgPayload(
  name = 'sample-icon.svg',
  fill = '#3b82f6'
): FileUploadPayload {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${fill}"/></svg>`;
  return {
    name,
    mimeType: 'image/svg+xml',
    buffer: Buffer.from(svg, 'utf-8'),
  };
}

export function makeIcoPayload(name = 'sample-favicon.ico'): FileUploadPayload {
  const pngBytes = Buffer.from(TINY_PNG_BASE64, 'base64');
  const header = new Uint8Array(22);
  // ICONDIR: reserved(2)=0, type(2)=1 (ICO), count(2)=1
  header[2] = 1;
  header[4] = 1;
  // ICONDIRENTRY: width=1, height=1, colorCount=0, reserved=0, planes=1, bpp=32
  header[6] = 1;
  header[7] = 1;
  header[10] = 1;
  header[12] = 32;
  // bytesInRes (uint32 LE)
  const len = pngBytes.length;
  header[14] = len & 0xff;
  header[15] = (len >> 8) & 0xff;
  header[16] = (len >> 16) & 0xff;
  header[17] = (len >> 24) & 0xff;
  // imageOffset = 22 (uint32 LE)
  header[18] = 22;

  const combined = new Uint8Array(header.length + pngBytes.length);
  combined.set(header, 0);
  combined.set(pngBytes, header.length);

  return {
    name,
    mimeType: 'image/x-icon',
    buffer: Buffer.from(combined),
  };
}

export function makePdfPayload(
  name = 'sample-resume.pdf',
  title = 'Sample Resume PDF'
): FileUploadPayload {
  const pdf = [
    '%PDF-1.4',
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R >> endobj',
    `4 0 obj << /Length ${title.length + 30} >> stream\nBT /F1 12 Tf 10 100 Td (${title}) Tj ET\nendstream endobj`,
    'xref',
    '0 5',
    '0000000000 65535 f ',
    'trailer << /Root 1 0 R /Size 5 >>',
    'startxref',
    '0',
    '%%EOF',
  ].join('\n');
  return {
    name,
    mimeType: 'application/pdf',
    buffer: Buffer.from(pdf, 'utf-8'),
  };
}

export function makeInvalidTextFilePayload(
  name = 'unsupported.exe',
  content = 'not-an-image'
): FileUploadPayload {
  return {
    name,
    mimeType: 'application/x-msdownload',
    buffer: Buffer.from(content, 'utf-8'),
  };
}

/**
 * Seeds `localStorage['portfolio_cms_data_v1']` before app mount using a one-time
 * sessionStorage guard so subsequent reloads within the same test preserve UI edits.
 */
export async function seedCmsDraft(
  page: Page,
  partialOrFullData: Record<string, unknown>,
  seedKey = '__e2e_cms_seeded'
): Promise<void> {
  await page.addInitScript(
    ({ key, seedFlag, payload }) => {
      if (!window.sessionStorage.getItem(seedFlag)) {
        window.localStorage.setItem(key, JSON.stringify(payload));
        window.sessionStorage.setItem(seedFlag, '1');
      }
    },
    { key: CMS_STORAGE_KEY, seedFlag: seedKey, payload: partialOrFullData }
  );
}

/**
 * Directly overwrites `localStorage['portfolio_cms_data_v1']` on an active page origin.
 */
export async function writeCmsDraftNow(
  page: Page,
  rawOrObject: string | Record<string, unknown>
): Promise<void> {
  const serialized =
    typeof rawOrObject === 'string' ? rawOrObject : JSON.stringify(rawOrObject);
  await page.evaluate(
    ({ key, value }) => {
      window.localStorage.setItem(key, value);
    },
    { key: CMS_STORAGE_KEY, value: serialized }
  );
}

/**
 * Reads and parses `localStorage['portfolio_cms_data_v1']` from the active page.
 */
export async function readCmsDraft(
  page: Page
): Promise<Record<string, unknown> | null> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  }, CMS_STORAGE_KEY);
}

/**
 * Clears localStorage CMS/vault keys, sessionStorage, and IndexedDB staged uploads.
 */
export async function resetBrowserCmsState(page: Page): Promise<void> {
  await page.evaluate(
    async ({ keys, dbName }) => {
      for (const k of keys) {
        window.localStorage.removeItem(k);
      }
      window.sessionStorage.clear();
      if (typeof window.indexedDB !== 'undefined') {
        await new Promise<void>((resolve) => {
          const req = window.indexedDB.deleteDatabase(dbName);
          req.onsuccess = () => resolve();
          req.onerror = () => resolve();
          req.onblocked = () => resolve();
        });
      }
    },
    {
      keys: [
        CMS_STORAGE_KEY,
        VAULT_STORAGE_KEY,
        REPO_CONFIG_STORAGE_KEY,
        UPLOADS_LEGACY_KEY,
      ],
      dbName: ASSET_IDB_NAME,
    }
  );
}

/**
 * Intercepts external third-party URLs and GitHub raw fetches so tests remain
 * deterministic offline with zero network console errors.
 */
export async function setupOfflineSafeRoutes(
  page: Page,
  options?: {
    baselineJson?: unknown;
    corsJobs?: unknown[];
  }
): Promise<void> {
  const stubSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#1a1e28"/></svg>';

  await page.route('https://raw.githubusercontent.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(options?.baselineJson ?? { __e2eOfflineStub: true }),
    });
  });

  await page.route(
    /^https:\/\/(www\.googletagmanager\.com|pagead2\.googlesyndication\.com|googleads\.g\.doubleclick\.net|www\.paypal\.com|www\.sandbox\.paypal\.com)\/.*/,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '',
      });
    }
  );

  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/css',
      body: '',
    });
  });

  await page.route(
    /^https:\/\/(i\.imgur\.com|images\.unsplash\.com|ui-avatars\.com|cdn\.credly\.com)\/.*/,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: stubSvg,
      });
    }
  );

  await page.route('https://corsproxy.io/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(options?.corsJobs ?? []),
    });
  });

  await page.route(
    'https://linked-early-apply-966926647025.us-central1.run.app/**',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(options?.corsJobs ?? []),
      });
    }
  );

  await page.route(/^https:\/\/.*\.herokuapp\.com\/.*/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ response: 'Offline test assistant reply.' }),
    });
  });
}

export interface ErrorCollector {
  consoleErrors: string[];
  pageErrors: string[];
  assertClean: () => void;
}

export function attachErrorCollectors(page: Page): ErrorCollector {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  return {
    consoleErrors,
    pageErrors,
    assertClean: () => {
      expect(pageErrors, `Unexpected pageerrors: ${pageErrors.join(' | ')}`).toEqual([]);
      expect(
        consoleErrors,
        `Unexpected console.error messages: ${consoleErrors.join(' | ')}`
      ).toEqual([]);
    },
  };
}

/**
 * Unlocks `/admin` via the login gate (default password `'admin123'`).
 */
export async function loginAdmin(
  page: Page,
  password = 'admin123',
  navigate = true
): Promise<void> {
  if (navigate) {
    await page.goto('/admin');
  }
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByRole('button', { name: /sign in to cms/i }).click();
  await expect(
    page.getByRole('button', { name: /save draft locally/i })
  ).toBeVisible();
}

export async function openAdminTab(
  page: Page,
  tabName: string | RegExp
): Promise<void> {
  const tab = page
    .locator('button, [role="tab"]')
    .filter({ hasText: tabName })
    .first();
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
}

/**
 * Locates an admin form input/textarea/select by label text, supporting both
 * `htmlFor`-linked labels and sibling labels inside a field wrapper.
 */
export function fieldByLabel(
  scope: Page | Locator,
  label: string | RegExp
): Locator {
  const byFor = scope.getByLabel(label);
  const bySibling = scope
    .locator('label')
    .filter({ hasText: label })
    .first()
    .locator(
      'xpath=following-sibling::*[self::input or self::textarea or self::select][1] | ../input[not(@type="file") and not(@type="checkbox") and not(@type="radio")][1] | ../textarea[1] | ../select[1]'
    );
  return byFor.or(bySibling).first();
}

export async function uploadToField(
  scope: Page | Locator,
  labelOrButtonText: string | RegExp,
  filePayload: FileUploadPayload
): Promise<void> {
  const directLabelInput = scope
    .locator('label')
    .filter({ hasText: labelOrButtonText })
    .locator('input[type="file"]');

  if ((await directLabelInput.count()) > 0) {
    await directLabelInput.first().setInputFiles(filePayload);
    return;
  }

  const containerInput = scope
    .locator('div:has(input[type="file"])')
    .filter({ hasText: labelOrButtonText })
    .last()
    .locator('input[type="file"]')
    .first();

  await containerInput.setInputFiles(filePayload);
}

export async function saveAdminDraft(page: Page): Promise<void> {
  await page.getByRole('button', { name: /save draft locally/i }).click();
  await expect
    .poll(async () => {
      return page.evaluate((key) => Boolean(window.localStorage.getItem(key)), CMS_STORAGE_KEY);
    })
    .toBe(true);
}

export interface CapturedGitHubTreeEntry {
  path: string;
  mode: string;
  type: string;
  sha: string | null;
}

export interface CapturedPublish {
  treePayload: {
    base_tree: string;
    tree: CapturedGitHubTreeEntry[];
  };
  upsertedPaths: string[];
  deletedPaths: string[];
  portfolioJsonText: string;
  commitMessage: string;
}

export async function mockGitHubPublish(
  page: Page,
  options: {
    baselineData: unknown;
    existingRepoPaths: string[];
    failTreePost?: boolean;
  }
): Promise<{ getCaptured: () => CapturedPublish | null }> {
  let captured: CapturedPublish | null = null;
  let blobSeq = 0;
  const blobsBySha = new Map<string, string>();
  let pendingTreePayload: CapturedPublish['treePayload'] | null = null;
  let pendingUpserts: string[] = [];
  let pendingDeletes: string[] = [];
  let pendingPortfolioJson = '';

  await page.route('https://raw.githubusercontent.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(options.baselineData),
    });
  });

  await page.route('https://api.github.com/repos/**', async (route) => {
    const request = route.request();
    const method = request.method();
    const url = request.url();

    if (method === 'GET' && url.includes('/git/ref/heads/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ object: { sha: 'head-commit-sha-001' } }),
      });
      return;
    }

    if (method === 'GET' && url.includes('/git/commits/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ tree: { sha: 'base-tree-sha-001' } }),
      });
      return;
    }

    if (method === 'GET' && url.includes('/git/trees/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          tree: options.existingRepoPaths.map((repoPath) => ({
            path: repoPath,
            type: 'blob',
          })),
        }),
      });
      return;
    }

    if (method === 'POST' && url.endsWith('/git/blobs')) {
      blobSeq += 1;
      const sha = `blob-sha-${blobSeq}`;
      const body = request.postDataJSON() as { content: string; encoding: string };
      blobsBySha.set(sha, body.content);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ sha }),
      });
      return;
    }

    if (method === 'POST' && url.endsWith('/git/trees')) {
      if (options.failTreePost) {
        await route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Simulated GitHub tree error' }),
        });
        return;
      }

      const body = request.postDataJSON() as CapturedPublish['treePayload'];
      pendingTreePayload = body;
      pendingUpserts = [];
      pendingDeletes = [];
      pendingPortfolioJson = '';

      for (const entry of body.tree) {
        if (entry.sha === null) {
          pendingDeletes.push(entry.path);
        } else if (entry.path === 'src/data/portfolioData.json') {
          const encoded = blobsBySha.get(entry.sha) ?? '';
          pendingPortfolioJson = Buffer.from(encoded, 'base64').toString('utf-8');
        } else {
          pendingUpserts.push(entry.path);
        }
      }

      captured = {
        treePayload: pendingTreePayload,
        upsertedPaths: pendingUpserts,
        deletedPaths: pendingDeletes,
        portfolioJsonText: pendingPortfolioJson,
        commitMessage: '',
      };

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ sha: 'new-tree-sha-001' }),
      });
      return;
    }

    if (method === 'POST' && url.endsWith('/git/commits')) {
      const body = request.postDataJSON() as { message?: string };
      if (captured) {
        captured.commitMessage = body.message ?? '';
      }
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          sha: 'new-commit-sha-001',
          html_url: 'https://github.com/mightysanju/portfolio-2024/commit/new-commit-sha-001',
        }),
      });
      return;
    }

    if (method === 'PATCH' && url.includes('/git/refs/heads/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ref: 'refs/heads/main',
          object: { sha: 'new-commit-sha-001' },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ message: `Unmocked GitHub API route: ${method} ${url}` }),
    });
  });

  return {
    getCaptured: () => captured,
  };
}

/**
 * Verifies every project card renders Title (h3), Description (p), and Tags in
 * strict vertical order without side-by-side column splitting.
 */
export async function assertVerticalStackInProjectCards(
  cardsLocator: Locator,
  options?: { allowEmptyTags?: boolean }
): Promise<void> {
  const count = await cardsLocator.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    const card = cardsLocator.nth(i);
    const title = card.locator('h3').first();
    const desc = card.locator('p').first();

    await expect(title).toBeVisible();
    await expect(desc).toBeVisible();

    const titleBox = await title.boundingBox();
    const descBox = await desc.boundingBox();
    expect(titleBox, `Card ${i} title missing boundingBox`).not.toBeNull();
    expect(descBox, `Card ${i} description missing boundingBox`).not.toBeNull();

    if (titleBox && descBox) {
      expect(
        titleBox.y + titleBox.height,
        `Card ${i}: Title bottom (${titleBox.y + titleBox.height}) should sit above Description top (${descBox.y})`
      ).toBeLessThanOrEqual(descBox.y + 1);
      expect(
        Math.abs(titleBox.x - descBox.x),
        `Card ${i}: Title and Description should align in one vertical column`
      ).toBeLessThan(24);
    }

    // Tag container sits immediately after description <p> in the vertical card body
    const tagContainer = card
      .locator('[data-testid="project-tags"]')
      .or(desc.locator('xpath=following-sibling::div[1]'))
      .first();

    const tagChipCount = await tagContainer.locator('button, span').count();
    if (tagChipCount === 0 && options?.allowEmptyTags) {
      continue;
    }
    expect(tagChipCount, `Card ${i} expected visible tag chips`).toBeGreaterThan(0);
    const tagsBox = await tagContainer.boundingBox();
    expect(tagsBox, `Card ${i} tags missing boundingBox`).not.toBeNull();

    if (descBox && tagsBox) {
      expect(
        descBox.y + descBox.height,
        `Card ${i}: Description bottom (${descBox.y + descBox.height}) should sit above Tags top (${tagsBox.y})`
      ).toBeLessThanOrEqual(tagsBox.y + 1);
      expect(
        Math.abs(descBox.x - tagsBox.x),
        `Card ${i}: Description and Tags should align in one vertical column`
      ).toBeLessThan(24);
    }
  }
}

export async function assertNoHorizontalPageOverflow(page: Page): Promise<void> {
  const dims = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    dims.scrollWidth,
    `Horizontal overflow detected: scrollWidth=${dims.scrollWidth} > innerWidth=${dims.innerWidth}`
  ).toBeLessThanOrEqual(dims.innerWidth);
}
