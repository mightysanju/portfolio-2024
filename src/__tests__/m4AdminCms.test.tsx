import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PortfolioProvider } from '../context/PortfolioContext';
import { clearAllStagedAssets } from '../utils/assetManager';
import { AdminPanel } from '../components/admin/AdminPanel';

describe('M4 Admin CMS', () => {
  beforeEach(async () => {
    localStorage.clear();
    await clearAllStagedAssets();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, writable: true, value: vi.fn(() => 'blob:mock') });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, writable: true, value: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('unlocks admin with default password and shows design-preview link', async () => {
    render(
      <MemoryRouter>
        <PortfolioProvider>
          <AdminPanel />
        </PortfolioProvider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(screen.getByText(/Sign in to CMS/i));

    await waitFor(() => {
      expect(screen.getByText(/View live site/i)).toBeInTheDocument();
      expect(screen.getByText(/Design previews/i)).toBeInTheDocument();
    });
    
    // Check href of design-preview link
    const previewLink = screen.getByRole('link', { name: /Design previews/i });
    expect(previewLink).toHaveAttribute('href', '/design-preview');
  });

  it('toggles project selection and updates records count', async () => {
    render(
      <MemoryRouter>
        <PortfolioProvider>
          <AdminPanel />
        </PortfolioProvider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(screen.getByText(/Sign in to CMS/i));

    // Wait for AdminPanel to load
    await waitFor(() => {
      expect(screen.getByText(/Hero, resume & favicon/i)).toBeInTheDocument();
    });

    // Check initial records count (assuming some projects exist)
    const recordsCount = screen.getByTestId('admin-shipped-records-count');
    const initialText = recordsCount.textContent || '';
    const initialCount = parseInt(initialText.split(' ')[0], 10);
    expect(initialCount).toBeGreaterThan(0);

    // Toggle a project
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];
    const isChecked = (firstCheckbox as HTMLInputElement).checked;
    
    fireEvent.click(firstCheckbox);

    // Check if count updated
    const newRecordsCount = screen.getByTestId('admin-shipped-records-count');
    const newText = newRecordsCount.textContent || '';
    const newCount = parseInt(newText.split(' ')[0], 10);
    
    expect(newCount).toBe(isChecked ? initialCount - 1 : initialCount + 1);
  });
});
