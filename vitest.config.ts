import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Prevent Vitest's interactive package installer check from walking into
// sandbox-restricted parent directories outside this workspace.
const nodeProcess = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process;
if (nodeProcess?.env && !nodeProcess.env.VITEST_SKIP_INSTALL_CHECKS) {
  nodeProcess.env.VITEST_SKIP_INSTALL_CHECKS = '1';
}

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e/**'],
  },
});
