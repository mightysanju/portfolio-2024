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
  const isInternalDemo = demoLink?.startsWith('/');

  return (
    <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#a3a9b8] hover:text-[#eef0f5] mb-8 transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
          <span>Back to projects</span>
        </Link>

        <article className="max-w-none">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-[-0.025em] text-[#eef0f5] leading-[1.15] mb-5">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#7a8296] mb-6 pb-6 border-b border-white/[0.10]">
            <div className="inline-flex items-center gap-1.5 font-mono tabular-nums">
              <Calendar className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
              <span>{date}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 font-mono tabular-nums">
              <Clock className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
              <span>{readTime}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-[#a3a9b8] text-xs font-mono"
                >
                  <Tag className="w-3 h-3 text-[#7a8296]" strokeWidth={1.5} />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {(demoLink || githubLink) && (
            <div className="flex flex-wrap gap-3 mb-8">
              {demoLink &&
                (isInternalDemo ? (
                  <Link
                    to={demoLink}
                    className="h-10 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center gap-2 transition-colors duration-150"
                  >
                    <ExternalLink className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                    <span>Live demo</span>
                  </Link>
                ) : (
                  <a
                    href={demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center gap-2 transition-colors duration-150"
                  >
                    <ExternalLink className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                    <span>Live demo</span>
                  </a>
                ))}
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] hover:bg-[#222734]/80 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-sm font-medium inline-flex items-center gap-2 transition-colors duration-150"
                >
                  <Github className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                  <span>View code</span>
                </a>
              )}
            </div>
          )}

          {image && (
            <div className="relative rounded-[14px] overflow-hidden mb-8 border border-white/[0.10] bg-[#11141c]/75 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <img
                src={image}
                alt={title}
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-6 sm:p-8 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogLayout;
