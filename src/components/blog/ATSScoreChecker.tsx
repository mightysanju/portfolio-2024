import React, { useEffect } from 'react';
import BlogLayout from './BlogLayout';
import { Helmet } from 'react-helmet-async';
import { usePortfolio } from '../../context/PortfolioContext';

const ATSScoreChecker: React.FC = () => {
  const { data, resolveAssetUrl } = usePortfolio();
  const atsBlog = data.standalonePages?.atsBlog;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!atsBlog) return null;

  return (
    <>
      <Helmet>
        <title>{atsBlog.metaTitle}</title>
        <meta
          name="description"
          content={atsBlog.metaDescription}
        />
      </Helmet>

      <BlogLayout
        title={atsBlog.title}
        date={atsBlog.date}
        readTime={atsBlog.readTime}
        tags={atsBlog.tags}
        image={resolveAssetUrl(atsBlog.image)}
        demoLink={atsBlog.demoLink}
        githubLink={atsBlog.githubLink}
      >
        {atsBlog.sections.map((section, idx) => (
          <React.Fragment key={idx}>
            <h2 className="text-xl font-medium text-[#eef0f5] mb-3">{section.heading}</h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-[#a3a9b8] text-base leading-relaxed mb-6">{p}</p>
            ))}
          </React.Fragment>
        ))}

        <div className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-6">
          <h3 className="text-base font-medium text-[#eef0f5] mb-3">{atsBlog.capabilitiesTitle}</h3>
          <ul className="list-disc list-inside text-[#a3a9b8] text-sm space-y-2 leading-relaxed">
            {atsBlog.capabilities.map((cap, idx) => (
              <li key={idx}>{cap}</li>
            ))}
          </ul>
        </div>
      </BlogLayout>
    </>
  );
};

export default ATSScoreChecker;