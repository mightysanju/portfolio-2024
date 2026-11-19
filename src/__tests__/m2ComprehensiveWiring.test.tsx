import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatButton from '../components/ChatButton';
import TestimonialScroll from '../components/TestimonialScroll';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import ATSApp from '../components/ats/ATSApp';
import BlogLayout from '../components/blog/BlogLayout';
import Networkapp from '../components/blog/Networkapp';
import NetworkappGraph from '../components/blog/NetworkappGraph';
import DDO from '../components/blog/DDO';
import ATSScoreChecker from '../components/blog/ATSScoreChecker';
import Linkedinn from '../components/blog/Linkedinn';
import LinkedInnAppDemo from '../components/blog/LinkedInnAppDemo';

// Mocking usePortfolio hook
const mockUsePortfolio = vi.fn();
vi.mock('../context/PortfolioContext', async () => {
  const actual = await vi.importActual('../context/PortfolioContext');
  return {
    ...actual,
    usePortfolio: () => mockUsePortfolio(),
  };
});

describe('M2 Comprehensive Wiring', () => {
  const mockData = {
    hero: { greeting: 'Hi', title: 'Title', subtitle: 'Subtitle', resumeUrl: '', profileImage: '/img.png', linkedinUrl: '', credlyUrl: '' },
    testimonials: [],
    projects: [],
    certifications: [],
    skills: [],
    site: {
      navbar: {
        brandName: 'Test Brand',
        roleTag: 'Role',
        logoImage: '/test-logo.png',
        adminLabel: 'Admin',
        navItems: [{ label: 'Home', href: '/' }],
        socialLinks: []
      },
      footer: {
        logoImage: '/footer-logo.png',
        brandName: 'Test Brand',
        roleText: 'Role',
        copyrightText: '© 2024',
        attributionText: 'Attr',
        attributionUrl: 'http://attr.com',
        adminLabel: 'Admin',
        socialLinks: []
      }
    },
    sections: {
        skills: { eyebrow: 'E', title: 'T', description: 'D', allFilterLabel: 'All', techStackEyebrow: 'TE', techStackTitle: 'TT', techStackEmptyText: 'E' },
        certifications: { eyebrow: 'E', title: 'T', description: 'D', allLabel: 'All', credlyLabel: 'C', linkedinLabel: 'L' },
        projects: { eyebrow: 'E', title: 'T', description: 'D', allTagLabel: 'All', demoLabel: 'D', codeLabel: 'C', blogLabel: 'B' },
        contact: { eyebrow: 'E', title: 'T', description: 'D', directChannelsTitle: 'D', email: 'E', phone: 'P', location: 'L', formspreeUrl: 'F', nameLabel: 'N', emailLabel: 'E', inquiryLabel: 'I', recruiterLabel: 'R', generalLabel: 'G', messageLabel: 'M', submitLabel: 'S', sendingLabel: 'S', sentMessage: 'S', errorMessage: 'E' },
        chatbotUi: { subtitle: 'S', emptyPrompt: 'E', thinkingLabel: 'T', inputPlaceholder: 'I', unreachableError: 'U' },
        blogLayout: { backLabel: 'B', demoLabel: 'D', codeLabel: 'C' }
    }
  };

  beforeEach(() => {
    mockUsePortfolio.mockReturnValue({
      data: mockData,
      resolveAssetUrl: (url: string) => `resolved://${url}`,
    });
  });

  it('renders all components correctly', () => {
    const components = [
        <Navbar activeSection="home" onNavigate={() => {}} />,
        <Footer />,
        <ChatButton />,
        <TestimonialScroll />,
        <Certifications />,
        <Contact />,
        <ATSApp />,
        <BlogLayout title="T" date="D" readTime="R" tags={[]} image="I"><div></div></BlogLayout>,
        <Networkapp />,
        <NetworkappGraph />,
        <DDO />,
        <ATSScoreChecker />,
        <Linkedinn />,
        <LinkedInnAppDemo />
    ];

    components.forEach(component => {
        render(<MemoryRouter>{component}</MemoryRouter>);
    });
    // Add specific checks for rendering
    expect(screen.getAllByText('Test Brand').length).toBeGreaterThan(0);
  });
});
