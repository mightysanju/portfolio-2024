import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

