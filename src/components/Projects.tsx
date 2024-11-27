import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, ExternalLink, BookOpen } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  
  const projects = [
    {
      title: 'ATS Score Checker',
      description: 'AI-powered resume analyzer that provides instant ATS compatibility scores and suggestions',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      tags: ['Machine Learning', 'NLP', 'React'],
      // Production URL commented for future use
      // demo: 'https://ats.mightysanju.com',
      demo: '/ats',
      github: 'https://github.com/sanjukumarkanki',
      blog: '/blog/ats-score-checker'
    },
    {
      title: 'Defect Dispute Override Tool',
      description:
        'Real-time sentiment analysis of social media data using advanced NLP techniques',
      image: 'https://i.imgur.com/pqH8SRU.png',
      tags: ['Python', 'tkinter', 'Data Analysis'],
      github: 'https://github.com/sanjukumarkanki/sentiment-analysis',
      blog: '/blog/DDO',
    },
    {
      title: 'Smart Agriculture System',
      description: 'IoT-based smart farming solution with ML-powered crop prediction',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
      tags: ['IoT', 'Machine Learning', 'Python'],
      github: 'https://github.com/sanjukumarkanki/smart-agriculture',
      demo: 'https://agriculture.mightysanju.com',
      blog: '/blog/ai-image-recognition'
    },
    {
      title: 'Automated Trading Bot',
      description: 'ML-powered cryptocurrency trading bot with real-time market analysis',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      tags: ['Python', 'Machine Learning', 'Trading'],
      github: 'https://github.com/sanjukumarkanki/trading-bot',
      demo: 'https://trading.mightysanju.com',
      blog: '/blog/nlp-summarizer'
    }
  ];

  const handleDemoClick = (demo: string, index: number) => {
    if (index === 0) { // ATS Score Checker
      navigate(demo);
    } else {
      window.open(demo, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Featured Projects
      </h2>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 backdrop-blur-sm
              hover:transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex space-x-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5 mr-1" />
                  Code
                </a>
                <button
                  onClick={() => handleDemoClick(project.demo, index)}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5 mr-1" />
                  Demo
                </button>
                <Link
                  to={project.blog}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-1" />
                  Blog
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;