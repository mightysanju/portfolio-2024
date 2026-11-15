import React, { useEffect } from 'react';
import BlogLayout from './BlogLayout';

const ATSScoreChecker: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BlogLayout
      title="Building an AI-Powered ATS Score Checker"
      date="March 20, 2024"
      readTime="15 min read"
      tags={['Machine Learning', 'NLP', 'React']}
      image="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80"
      demoLink="/ats"
      githubLink="https://github.com/mightysanju"
    >
      <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
        An overview of how we built an Applicant Tracking System (ATS) resume analyzer that evaluates
        resume compatibility against target job descriptions using natural language processing and
        structured keyword extraction.
      </p>

      <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Problem statement</h2>
      <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
        Modern job applications pass through automated ATS parsers before reaching technical
        recruiters. Candidates frequently miss qualified roles due to formatting mismatches or
        missing domain terminology. We designed a transparent analyzer that scores resumes and
        surfaces concrete missing terms.
      </p>

      <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Technical implementation</h2>
      <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
        The pipeline tokenizes both the uploaded resume and target job description, computes
        weighted term overlap across technical skills, action verbs, and structural sections, and
        outputs a deterministic compatibility report.
      </p>

      <div className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-6">
        <h3 className="text-base font-medium text-[#eef0f5] mb-3">System capabilities</h3>
        <ul className="list-disc list-inside text-[#a3a9b8] text-sm space-y-2 leading-relaxed">
          <li>Real-time resume parsing and keyword extraction</li>
          <li>Role-specific term gap identification</li>
          <li>Document structure and formatting validation</li>
          <li>Section-by-section scoring breakdown</li>
          <li>Actionable revision recommendations</li>
        </ul>
      </div>
    </BlogLayout>
  );
};

export default ATSScoreChecker;
