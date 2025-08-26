import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, ExternalLink, BookOpen } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: 'Linked Inn Job Notification',
      description:'Automated Smart Linked Inn Job Notification, Be an early Applicant.',
      image:'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzdlbTV3ZHljejEzNXdqcWhmbHpoNGYzcmVlNG9vZ2Nnb294czR1bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UWWUDiZOyNwuEsNsmA/giphy.gif',
      tags: ['Web Scraping', 'SMTP', 'Python'],
      // Production URL commented for future use
      // demo: 'https://ats.mightysanju.com',
      demo: '/LinkedInn',
      github: 'https://github.com/sanjukumarkanki',
      blog: '/blog/Linkedinn',
    },
    {
      title: 'Defect Dispute Override Tool',
      description: 'Real-time Defect Dispute Management Tool with GUI',
      image: 'https://i.imgur.com/pqH8SRU.png',
      tags: ['GUI', 'Python', 'Analytics'],
      github: 'https://github.com/mightysanju/DDO-Tool-Code-for-Public',
      blog: '/blog/DDO',
    },
    {
      title: 'Network App',
      description:
        'The Network App automates network balancing tasks, saving time and reducing errors.',
      image:
        'https://i.imgur.com/VxGPpEB.png',
      tags: ['Automation', 'Advanced SQL', 'Python'],
      //github: 'https://github.com/sanjukumarkanki/smart-agriculture',
      //demo: 'https://agriculture.mightysanju.com',
      blog: '/blog/Networkapp',
    },
    {
      title: 'ATS Score Checker',
      description:
        'AI-powered resume analyzer that provides instant ATS compatibility scores and suggestions',
      image:
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      tags: ['Machine Learning', 'NLP', 'React'],
      // Production URL commented for future use
      // demo: 'https://ats.mightysanju.com',
      demo: '/ats',
      github: 'https://github.com/mightysanju',
      blog: '/blog/ats-score-checker',
    },
  ];

  const handleDemoClick = (demo: string, index: number) => {
    if (index === 0) {
      // ATS Score Checker
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
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <Github className="w-5 h-5 mr-1" />
                    Code
                  </a>
                )}

                {project.demo && (
                  <button
                    onClick={() => handleDemoClick(project.demo, index)}
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-1" />
                    Demo
                  </button>
                )}

                {project.blog && (
                  <Link
                    to={project.blog}
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <BookOpen className="w-5 h-5 mr-1" />
                    Blog
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
