import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const NLPSummarizer = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link 
        to="/"
        className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>

      <article className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Building an Advanced NLP Text Summarizer
        </h1>

        <div className="flex items-center space-x-6 text-gray-400 mb-8">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>March 5, 2024</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>12 min read</span>
          </div>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            <span>Natural Language Processing</span>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80"
          alt="NLP Text Summarizer"
          className="w-full rounded-xl mb-8"
        />

        <p className="text-gray-300 mb-6">
          Discover how we built a state-of-the-art text summarization system using transformer models.
          This article details our approach to creating concise, meaningful summaries from long-form content.
        </p>

        <h2 className="text-2xl font-semibold text-gray-200 mb-4">The Challenge</h2>
        <p className="text-gray-300 mb-6">
          Creating meaningful summaries requires deep understanding of context and content relevance.
          We tackled this challenge using advanced NLP techniques and transformer architectures.
        </p>

        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Technical Implementation</h2>
        <p className="text-gray-300 mb-6">
          Our solution leverages the latest advances in transformer models, combining extractive and
          abstractive summarization techniques for optimal results.
        </p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Key Features</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Multi-language support</li>
            <li>Contextual understanding</li>
            <li>Customizable summary length</li>
            <li>API integration options</li>
          </ul>
        </div>
      </article>
    </div>
  );
};

export default NLPSummarizer;