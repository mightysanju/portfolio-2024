import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DesignPreview from '../components/DesignPreview';
import Projects from '../components/Projects';
import { PortfolioProvider } from '../context/PortfolioContext';

describe('M3 Layout Behaviors', () => {
  it('renders DesignPreview', () => {
    render(
      <HelmetProvider>
        <PortfolioProvider>
          <MemoryRouter>
            <DesignPreview />
          </MemoryRouter>
        </PortfolioProvider>
      </HelmetProvider>
    );
    expect(screen.getByText('Design Preview')).toBeDefined();
  });
  
  it('renders Projects', () => {
    render(
      <PortfolioProvider>
        <MemoryRouter>
          <Projects />
        </MemoryRouter>
      </PortfolioProvider>
    );
    expect(screen.getAllByTestId('project-card').length).toBeGreaterThan(0);
  });
});
