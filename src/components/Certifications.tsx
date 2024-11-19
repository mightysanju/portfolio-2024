import React, { useState } from 'react';
import { Award, Brain, Database, Code2, ExternalLink, Shield, Linkedin } from 'lucide-react';

const Certifications = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Certifications' },
    { id: 'ml', label: 'Machine Learning', icon: Brain },
    { id: 'data', label: 'Data Engineering', icon: Database },
    { id: 'dev', label: 'Development', icon: Code2 },
  ];

  const certifications = [
    {
      title: 'AWS Machine Learning Specialty',
      issuer: 'Amazon Web Services',
      date: 'January 2024',
      description: 'Advanced machine learning on AWS platform',
      category: 'ml',
      verification: {
        type: 'credly',
        url: 'https://www.credly.com/users/sanju-kumar.671f31d3'
      }
    },
    {
      title: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      date: 'December 2023',
      description: 'Deep learning and neural networks expertise',
      category: 'ml',
      verification: {
        type: 'coursera',
        url: 'https://coursera.org/verify/professional-cert/ABCD1234'
      }
    },
    {
      title: 'Azure Data Engineer Associate',
      issuer: 'Microsoft',
      date: 'November 2023',
      description: 'Data engineering and analytics on Azure',
      category: 'data',
      verification: {
        type: 'linkedin',
        url: 'https://www.linkedin.com/in/sanjukumarkanki'
      }
    },
    {
      title: 'Google Cloud Professional Data Engineer',
      issuer: 'Google Cloud',
      date: 'October 2023',
      description: 'Enterprise data solutions and ML pipelines',
      category: 'data',
      verification: {
        type: 'credly',
        url: 'https://www.credly.com/users/sanju-kumar.671f31d3'
      }
    }
  ];

  const handleCredlyVerification = () => {
    window.open('https://www.credly.com/users/sanju-kumar.671f31d3', '_blank');
  };

  const getVerificationIcon = (type: string) => {
    switch (type) {
      case 'credly':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-400" />;
      default:
        return <ExternalLink className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVerificationButton = (verification: { type: string; url: string }) => {
    const buttonClasses = "mt-4 inline-flex items-center text-sm transition-colors duration-300";
    
    switch (verification.type) {
      case 'credly':
        return (
          <a
            href={verification.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClasses} text-emerald-400 hover:text-emerald-300`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Verify on Credly
          </a>
        );
      case 'linkedin':
        return (
          <a
            href={verification.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClasses} text-blue-400 hover:text-blue-300`}
          >
            <Linkedin className="w-4 h-4 mr-2" />
            View on LinkedIn
          </a>
        );
      default:
        return (
          <a
            href={verification.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClasses} text-gray-400 hover:text-gray-300`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Verify Certificate
          </a>
        );
    }
  };

  const filteredCertifications = activeCategory === 'all'
    ? certifications
    : certifications.filter(cert => cert.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Certifications
        </h2>
        
        <div className="flex gap-4">
          <button
            onClick={handleCredlyVerification}
            className="group relative inline-flex items-center justify-center px-6 py-2 text-lg font-medium
              transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none
              overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20
              hover:bg-white/20 hover:border-white/30 text-emerald-400 hover:text-emerald-300"
          >
            <span className="relative flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Credly Profile</span>
            </span>
            <div className="absolute inset-0 flex justify-center overflow-hidden rounded-2xl pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </button>

          <a
            href="https://www.linkedin.com/in/sanjukumarkanki"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-6 py-2 text-lg font-medium
              transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none
              overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20
              hover:bg-white/20 hover:border-white/30 text-blue-400 hover:text-blue-300"
          >
            <span className="relative flex items-center space-x-2">
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn Profile</span>
            </span>
            <div className="absolute inset-0 flex justify-center overflow-hidden rounded-2xl pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </a>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
              ${activeCategory === category.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            {category.icon && <category.icon className="w-4 h-4" />}
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCertifications.map((cert, index) => (
          <div
            key={index}
            className="group bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm
              hover:transform hover:scale-105 transition-all duration-300
              hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-purple-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-200">{cert.title}</h3>
              </div>
              <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                {getVerificationIcon(cert.verification.type)}
              </div>
            </div>
            <p className="text-purple-400 mb-2">{cert.issuer}</p>
            <p className="text-gray-400 text-sm mb-3">{cert.date}</p>
            <p className="text-gray-300 mb-4">{cert.description}</p>
            
            {getVerificationButton(cert.verification)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;