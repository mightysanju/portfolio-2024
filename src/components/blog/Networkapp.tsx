import React, { useEffect } from 'react';
import BlogLayout from './BlogLayout';
import PerformanceChart from './NetworkappGraph';
import { Helmet } from 'react-helmet-async';
import { usePortfolio } from '../../context/PortfolioContext';

const Networkapp: React.FC = () => {
  const { data, resolveAssetUrl } = usePortfolio();
  const networkapp = data.standalonePages?.networkapp;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!networkapp) return null;

  return (
    <>
      <Helmet>
        <title>{networkapp.metaTitle}</title>
        <meta
          name="description"
          content={networkapp.metaDescription}
        />
      </Helmet>
      <BlogLayout
        title={networkapp.title}
        date={networkapp.date}
        readTime={networkapp.readTime}
        tags={networkapp.tags}
        image={resolveAssetUrl(networkapp.image)}
        demoLink={networkapp.demoLink}
        githubLink={networkapp.githubLink}
      >
        {networkapp.sections.map((section, idx) => (
          <React.Fragment key={idx}>
            <h2 className="text-xl font-medium text-[#eef0f5] mb-3">{section.heading}</h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-[#a3a9b8] text-base leading-relaxed mb-6">{p}</p>
            ))}
          </React.Fragment>
        ))}

        <div className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-6 mb-6">
          <h3 className="text-base font-medium text-[#eef0f5] mb-4">{networkapp.chartTitle}</h3>
          <p className="text-[#a3a9b8] text-sm mb-4">{networkapp.chartSubtitle}</p>
          <PerformanceChart />
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">{networkapp.pilotTableTitle}</h2>
        <div className="overflow-x-auto rounded-[10px] border border-white/[0.08] bg-[#0b0d14] mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#1a1e28] text-xs font-mono text-[#a3a9b8]">
                {networkapp.pilotHeaders.map((h, i) => (
                    <th key={i} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08] text-xs font-mono tabular-nums text-[#eef0f5]">
              {networkapp.pilotRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-[#a3a9b8]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">{networkapp.roadmapTitle}</h2>
        <ol className="list-decimal list-inside text-[#a3a9b8] text-sm space-y-2 leading-relaxed">
          {networkapp.roadmapItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      </BlogLayout>
    </>
  );
};

export default Networkapp;