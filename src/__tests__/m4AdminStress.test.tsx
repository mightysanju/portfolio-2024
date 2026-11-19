import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PortfolioProvider } from '../context/PortfolioContext';
import { AdminPanel } from '../components/admin/AdminPanel';

describe('M4 Admin CMS Stress Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
  });

  it('stress test: rapid toggling of projects', async () => {
    render(
      <MemoryRouter>
        <PortfolioProvider>
          <AdminPanel />
        </PortfolioProvider>
      </MemoryRouter>
    );

    // Sign in
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(screen.getByText(/Sign in to CMS/i));

    await waitFor(() => {
      expect(screen.getByText(/Hero, resume & favicon/i)).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    // Rapidly toggle checkboxes
    for(let i = 0; i < 50; i++) {
        fireEvent.click(checkboxes[0]);
    }
  });

  it('stress test: rapid file uploads', async () => {
    render(
      <MemoryRouter>
        <PortfolioProvider>
          <AdminPanel />
        </PortfolioProvider>
      </MemoryRouter>
    );

    // Sign in
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(screen.getByText(/Sign in to CMS/i));

    await waitFor(() => {
      expect(screen.getByText(/Hero, resume & favicon/i)).toBeInTheDocument();
    });

    const fileInput = screen.getByLabelText(/Upload Hero profile photo/i);
    
    // Simulate rapid file uploads
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    
    for(let i = 0; i < 5; i++) {
        fireEvent.change(fileInput, { target: { files: [file] } });
    }
  });
});
