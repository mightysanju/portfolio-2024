import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import Hero from './Hero';
import TechStackStrip from './TechStackStrip';
import Projects from './Projects';

const DesignPreview: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5] p-8">
      <Helmet>
        <title>Design Previews | {data.site.navbar.brandName}</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-16">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-medium">Design Preview</h1>
          <div className="flex gap-4">
            <Link to="/" className="text-blue-400 hover:text-blue-300">Back to portfolio</Link>
          </div>
        </header>

        <section data-testid="preview-hero-section" className="space-y-4">
          <h2 className="text-xl font-medium">Hero "Shipped Systems" Scroller</h2>
          <Hero />
        </section>

        <section data-testid="preview-techstack-section" className="space-y-4">
          <h2 className="text-xl font-medium">Tech Stack Strip</h2>
          <div className="max-w-xl">
             <TechStackStrip />
          </div>
        </section>

        <section data-testid="preview-projects-section" className="space-y-4">
          <h2 className="text-xl font-medium">Projects Layout</h2>
          <Projects />
        </section>
      </div>
    </div>
  );
};

export default DesignPreview;