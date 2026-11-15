import React from 'react';
import { Download, User, ArrowUpRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialScroll from './TestimonialScroll';
import { usePortfolio } from '../context/PortfolioContext';

const SYSTEM_RECORDS = [
  {
    id: 'SYS-01',
    label: 'Defect Dispute Override (Amazon TCMT)',
    metric: 'Python · GUI'
  },
  {
    id: 'SYS-02',
    label: 'Network Balancing Automation',
    metric: 'SQL · ETL'
  },
  {
    id: 'SYS-03',
    label: 'ATS Resume NLP Analyzer',
    metric: 'NLP · React'
  },
  {
    id: 'EDU',
    label: 'M.S. Information Studies (4.0 GPA)',
    metric: 'Trine Univ'
  }
];

const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { hero } = data;

  const handleDownload = () => {
    const resumeUrl =
      hero.resumeUrl ||
      'https://acrobat.adobe.com/id/urn:aaid:sc:AP:c816e211-3b4d-43d3-826d-cfc17d4011e4';
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 bg-[#0b0d14]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start lg:items-center">
          {/* Left Column: Editorial Headline & Direct Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Quiet Status Line */}
            <div className="inline-flex items-center gap-2.5 text-sm text-[#a3a9b8]">
              <span className="h-2 w-2 rounded-full bg-[#4cc38a] flex-shrink-0" />
              <span>Naperville, IL · Data Science &amp; ML Engineering</span>
            </div>

            {/* Display Headline */}
            <div className="space-y-2">
              <p className="font-mono text-xs text-[#7a8296] tabular-nums">
                {hero.greeting || "I'm Sanju"}
              </p>
              <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-medium tracking-[-0.03em] text-[#eef0f5] leading-[1.08]">
                {hero.title || 'Data Scientist & ML Engineer'}
              </h1>
            </div>

            {/* Secondary Subhead */}
            <p className="text-base sm:text-lg text-[#a3a9b8] max-w-[60ch] leading-[1.6]">
              {hero.subtitle ||
                'Transforming complex data into actionable insights through innovative machine learning solutions and advanced analytics.'}
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="h-11 px-5 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white font-medium text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center gap-2 transition-colors duration-150 focus:outline-none"
              >
                <Download className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                <span>Download resume</span>
              </button>

              <Link
                to="/about"
                className="h-11 px-5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] hover:bg-[#222734]/80 font-medium text-sm border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center gap-2 transition-colors duration-150 focus:outline-none"
              >
                <User className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                <span>About</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Engineering Telemetry & Profile Panel (The Moment) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] rounded-[14px] p-6 space-y-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              {/* Top Profile Header */}
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/[0.10]">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-[8px] overflow-hidden bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex-shrink-0">
                    <img
                      src={hero.profileImage || '/favicon.png'}
                      alt={hero.greeting || 'Sanju Kumar'}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-medium text-[#eef0f5] truncate">
                        Sanju Kumar
                      </h2>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4cc38a]" />
                    </div>
                    <p className="text-xs text-[#a3a9b8] truncate">
                      Supply Chain Analytics · ML Systems
                    </p>
                    <p className="font-mono text-[11px] text-[#7a8296] tabular-nums mt-0.5">
                      ID: SK-2024 · ACTIVE
                    </p>
                  </div>
                </div>

                <a
                  href={hero.linkedinUrl || 'https://linkedin.com/in/mightysanju/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-2.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#a3a9b8] hover:text-[#eef0f5] inline-flex items-center gap-1 transition-colors duration-150 flex-shrink-0"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
                </a>
              </div>

              {/* System Records Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#7a8296]">
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
                    <span>SHIPPED_SYSTEMS</span>
                  </span>
                  <span className="font-mono tabular-nums">4 RECORDS</span>
                </div>

                <div className="divide-y divide-white/[0.10] border border-white/[0.10] rounded-[8px] bg-[#0b0d14]/60 backdrop-blur-md">
                  {SYSTEM_RECORDS.map((record) => (
                    <div
                      key={record.id}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[#3b82f6] tabular-nums flex-shrink-0">
                          {record.id}
                        </span>
                        <span className="text-[#7a8296]">·</span>
                        <span className="font-mono text-[#eef0f5] tabular-nums truncate">
                          {record.label}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#7a8296] tabular-nums flex-shrink-0">
                        {record.metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="pt-1 flex items-center justify-between text-xs font-mono text-[#7a8296] tabular-nums">
                <span>STACK: PYTHON · SQL · TENSORFLOW</span>
                <span className="text-[#4cc38a]">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Marquee */}
      <div className="w-full mt-8 border-t border-white/[0.10] pt-4">
        <TestimonialScroll />
      </div>
    </div>
  );
};

export default Hero;
