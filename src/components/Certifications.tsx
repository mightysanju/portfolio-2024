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
      title: 'Computer Networks and Network Security',
      issuer: 'IBM',
      date: 'November 2024',
      description: 'Advanced networking and security concepts',
      category: 'cybersecurity',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/account/accomplishments/records/FJTPL6KHZ81E',
        id: 'FJTPL6KHZ81E'
      }
    },
    {
      title: 'Cybersecurity Compliance Framework & Standards',
      issuer: 'IBM',
      date: 'November 2024',
      description: 'Security compliance and regulatory frameworks',
      category: 'cybersecurity',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/account/accomplishments/records/G66JJGPE28E5',
        id: 'G66JJGPE28E5'
      }
    },
    {
      title: 'Cybersecurity Roles, Processes & OS Security',
      issuer: 'Coursera',
      date: 'November 2024',
      description: 'Operating system security and cybersecurity roles',
      category: 'cybersecurity',
      verification: {
        type: 'credly',
        url: 'https://www.credly.com/badges/fddaf826-376c-474f-a2c2-d78ccf9f744b'
      }
    },
    {
      title: 'Network Security & Database Vulnerabilities',
      issuer: 'Coursera',
      date: 'November 2024',
      description: 'Network and database security concepts',
      category: 'cybersecurity',
      verification: {
        type: 'credly',
        url: 'https://www.credly.com/badges/3e68931c-cd35-4d10-8d5d-2b72bb6ec3c6'
      }
    },
    {
      title: 'Operating Systems: Overview & Security',
      issuer: 'IBM',
      date: 'November 2024',
      description: 'Operating system administration and security',
      category: 'cybersecurity',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/account/accomplishments/records/JW1MPRFGYNQG',
        id: 'JW1MPRFGYNQG'
      }
    },
    {
      title: 'Introduction to Cybersecurity Tools & Cyberattacks',
      issuer: 'IBM',
      date: 'October 2024',
      description: 'Fundamental cybersecurity concepts and tools',
      category: 'cybersecurity',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/account/accomplishments/records/DF1D8YWUKHQP',
        id: 'DF1D8YWUKHQP'
      }
    },

    // Data Science Certifications
    {
      title: 'Get Started with Python',
      issuer: 'Google',
      date: 'July 2024',
      description: 'Python programming fundamentals',
      category: 'data',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/account/accomplishments/records/5L5GCQU636H7',
        id: '5L5GCQU636H7'
      }
    },
    {
      title: 'Foundations of Data Science',
      issuer: 'Google',
      date: 'June 2024',
      description: 'Core concepts in data science',
      category: 'data',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/account/accomplishments/records/D4U243DJGTZQ',
        id: 'D4U243DJGTZQ'
      }
    },
    {
      title: 'Building and Deploying Deep Learning Applications with TensorFlow',
      issuer: 'LinkedIn',
      date: 'June 2024',
      description: 'Deep learning implementation with TensorFlow',
      category: 'Machine Learning',
      verification: {
        type: 'linkedin',
        url: 'https://www.linkedin.com/learning/certificates/23e35b5c8d2d3ee95469fa1de8ff3838a440aec8c9df00764ce68ece0b92b65d'
      }
    },

    // Development Certifications
    {
      title: 'Learning GitHub',
      issuer: 'LinkedIn',
      date: 'October 2023',
      description: 'Version control and collaboration with GitHub',
      category: 'dev',
      verification: {
        type: 'linkedin',
        url: 'https://www.linkedin.com/learning/certificates/1c9f68ee2b6fb9aaf18c7bda6e5e4d9de85fcc054e64a94208204fad5b4176de'
      }
    },
    {
      title: 'Tableau Essential Training',
      issuer: 'LinkedIn',
      date: 'August 2023',
      description: 'Data visualization with Tableau',
      category: 'dev',
      verification: {
        type: 'linkedin',
        url: 'https://www.linkedin.com/learning/certificates/002606e0f7371ba428965a7ae6b089dc9308ef8b6513a55801a6e4b30ee1c64c'
      }
    },
    {
      title: 'SQL for Data Analysis',
      issuer: 'LinkedIn',
      date: 'July 2023',
      description: 'Advanced SQL for analytical purposes',
      category: 'dev',
      verification: {
        type: 'linkedin',
        url: 'https://www.linkedin.com/learning/certificates/88906470416f69188a0f5bdf84d089d8622d344bd511bbea3893353bcd12c0af'
      }
    },
    {
      title: 'Learning Python',
      issuer: 'LinkedIn',
      date: 'June 2021',
      description: 'Python programming fundamentals',
      category: 'dev',
      verification: {
        type: 'linkedin',
        url: 'https://www.linkedin.com/learning/certificates/1b192eac592268f63afc92f182dcc6f5b9323dbd95245e47a4c0f2977f521a33'
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
            href="https://www.linkedin.com/in/mightysanju/details/certifications/"
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