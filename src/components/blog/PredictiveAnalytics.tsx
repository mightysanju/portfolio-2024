import React from 'react';
import BlogLayout from './BlogLayout';

const PredictiveAnalytics = () => {
  return (
    <BlogLayout
      title="Building a Predictive Analytics Dashboard"
      date="March 10, 2024"
      readTime="8 min read"
      tags={['Data Science', 'Machine Learning', 'Analytics']}
      image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      demoLink="https://sentiment.mightysanju.com"
      githubLink="https://github.com/sanjukumarkanki/sentiment-analysis"
    >
      <p className="text-gray-300 mb-6">
        Learn how we developed a comprehensive predictive analytics dashboard that helps businesses
        forecast key metrics and make data-driven decisions. This article covers the entire process
        from data collection to deployment.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">The Problem</h2>
      <p className="text-gray-300 mb-6">
        Businesses need accurate forecasting tools to make informed decisions, but existing solutions
        often lack flexibility and real-time capabilities. We set out to create a solution that
        addresses these limitations.
      </p>

      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Solution Architecture</h2>
      <p className="text-gray-300 mb-6">
        Our dashboard combines multiple forecasting models with real-time data processing capabilities,
        providing accurate predictions while maintaining system responsiveness.
      </p>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Core Features</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Real-time data processing</li>
          <li>Multiple forecasting models</li>
          <li>Interactive visualizations</li>
          <li>Automated model updates</li>
        </ul>
      </div>
    </BlogLayout>
  );
};

export default PredictiveAnalytics;