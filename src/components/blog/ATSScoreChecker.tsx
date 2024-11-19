import React from 'react';
import BlogLayout from './BlogLayout';

const ATSScoreChecker = () => {
  return (
    <BlogLayout
      title="Building an AI-Powered ATS Score Checker"
      date="March 20, 2024"
      readTime="15 min read"
      tags={['Machine Learning', 'NLP', 'React']}
      image="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80"
      demoLink="/ats"
      githubLink="https://github.com/sanjukumarkanki"
    >
      <p className="text-gray-300 mb-6">
        Discover how we built an advanced ATS Score Checker that helps job seekers optimize their
        resumes for Applicant Tracking Systems. Learn about the AI algorithms, natural language
        processing techniques, and user experience considerations that went into creating this tool.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">The Challenge</h2>
      <p className="text-gray-300 mb-6">
        Modern job applications often go through ATS before reaching human recruiters. We needed to
        create a tool that could accurately simulate ATS behavior while providing actionable feedback
        to users.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Technical Implementation</h2>
      <p className="text-gray-300 mb-6">
        Our solution uses advanced NLP techniques to analyze resumes against job descriptions,
        providing detailed scoring and recommendations for improvement.
      </p>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Key Features</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Real-time resume analysis</li>
          <li>Keyword optimization suggestions</li>
          <li>Format compatibility checking</li>
          <li>Section-by-section scoring</li>
          <li>Industry-specific recommendations</li>
        </ul>
      </div>
    </BlogLayout>
  );
};

export default ATSScoreChecker;