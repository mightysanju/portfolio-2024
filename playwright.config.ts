import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { execSync } from 'node:child_process';

const usePreview = process.env.PW_PREVIEW === '1';
const port = parseInt(execSync(`node ${path.join(process.cwd(), 'find-port.cjs')}`).toString().trim(), 10);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 1,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
  webServer: {
    command: usePreview
      ? `npm run preview -- --host 127.0.0.1 --port ${port}`
      : `npm run dev -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
