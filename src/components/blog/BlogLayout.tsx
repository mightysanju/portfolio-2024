import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';


interface BlogLayoutProps {
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  children: React.ReactNode;
  demoLink?: string;
  githubLink?: string;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
  title,
  date,
  readTime,
  tags,
  image,
  children,
  demoLink,
  githubLink
}) => {
  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0 animate-nebula"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
              filter: 'blur(40px)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <Link 
          to="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{readTime}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {(demoLink || githubLink) && (
            <div className="flex gap-4 mb-8">
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              )}
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </a>
              )}
            </div>
          )}

          <div className="relative rounded-xl overflow-hidden mb-8 group">
            <img
              src={image}
              alt={title}
              className="w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-50" />
          </div>

          <div className="bg-gray-800/30 rounded-xl p-8 backdrop-blur-sm border border-gray-700/50">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogLayout;