import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PortfolioProvider } from '../context/PortfolioContext';
import About from '../components/About';

describe('M2 Site-wide CMS Wiring', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, writable: true, value: vi.fn(() => 'blob:mock') });
    });

    it('renders profile image on About page', () => {
        render(
            <MemoryRouter>
                <PortfolioProvider>
                    <HelmetProvider>
                        <About />
                    </HelmetProvider>
                </PortfolioProvider>
            </MemoryRouter>
        );

        // Check if image is present
        const img = screen.getByAltText(/Profile/i);
        expect(img).toBeInTheDocument();
        // Assuming resolveAssetUrl works, it should return a path or blob
        expect(img.getAttribute('src')).toBeDefined();
    });
});
