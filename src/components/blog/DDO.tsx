import React, { useEffect } from 'react';
import BlogLayout from './BlogLayout';
import Stakeholder from './stakeholder';
import { Helmet } from 'react-helmet-async';
import { usePortfolio } from '../../context/PortfolioContext';

const DDO: React.FC = () => {
  const { data, resolveAssetUrl } = usePortfolio();
  const ddo = data.standalonePages?.ddo;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!ddo) return null;

  return (
    <>
      <Helmet>
        <title>{ddo.metaTitle}</title>
        <meta
          name="description"
          content={ddo.metaDescription}
        />
      </Helmet>

      <BlogLayout
        title={ddo.title}
        date={ddo.date}
        readTime={ddo.readTime}
        tags={ddo.tags}
        image={resolveAssetUrl(ddo.image)}
        githubLink={ddo.githubLink}
        demoLink={ddo.demoLink}
      >
        {ddo.sections.map((section, idx) => (
          <React.Fragment key={idx}>
            <h2 className="text-xl font-medium text-[#eef0f5] mb-3">{section.heading}</h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-[#a3a9b8] text-base leading-relaxed mb-6">{p}</p>
            ))}
          </React.Fragment>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {ddo.metrics.map((metric, idx) => (
            <div key={idx} className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-5">
              <p className="font-mono text-xs text-[#7a8296] mb-1">{metric.label}</p>
              <p className="font-mono text-2xl font-medium text-[#eef0f5] tabular-nums">{metric.value}</p>
              <p className="text-xs text-[#a3a9b8] mt-1">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">{ddo.stakeholdersTitle}</h2>
        <div className="grid gap-4">
          {ddo.stakeholders.map((stakeholder, index) => (
            <Stakeholder key={index} 
              {...stakeholder} 
              imageUrl={resolveAssetUrl(stakeholder.image)}
            />
          ))}
        </div>
      </BlogLayout>
    </>
  );
};

export default DDO;