import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Github, ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import BlogLayout from './blog/BlogLayout';

interface BlogContentShape {
  subtitle?: string;
  readTime?: string;
  date?: string;
  body?: string;
  highlights?: string[];
  images?: string[];
}

function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const DynamicBlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const portfolio = usePortfolio();
  const resolveUrl = portfolio.resolveAssetUrl;
  const projects = portfolio.data.projects || [];

  const project = useMemo(() => {
    if (!slug) return undefined;
    const targetPath = `/blog/${slug}`.toLowerCase();
    return projects.find((p) => {
      if (p.blog && p.blog.toLowerCase() === targetPath) return true;
      if (slugifyTitle(p.title) === slug.toLowerCase()) return true;
      return false;
    });
  }, [projects, slug]);

  if (!project) {
    return (
      <BlogLayout
        title="Article not found"
        date="—"
        readTime="1 min read"
        tags={['Blog']}
        image=""
      >
        <div className="space-y-4">
          <p className="text-sm text-[#a3a9b8]">
            The requested project article could not be found. It may have been renamed or removed in the Admin Portal.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white transition-colors duration-150"
          >
            {portfolio.data.sections?.blogLayout?.backLabel || 'Return to portfolio'}
          </Link>
        </div>
      </BlogLayout>
    );
  }
  
  // ... (rest of DynamicBlogPage logic)

  const blogContent = (
    project as typeof project & { blogContent?: BlogContentShape }
  ).blogContent;

  const subtitle = blogContent?.subtitle || project.description;
  const date = blogContent?.date || '2025';
  const readTime = blogContent?.readTime || '5 min read';
  const highlights = Array.isArray(blogContent?.highlights) ? blogContent.highlights.filter((h) => typeof h === 'string' && h.trim().length > 0) : [];
  const images = Array.isArray(blogContent?.images) ? blogContent.images.filter((img) => typeof img === 'string' && img.trim().length > 0) : [];
  const rawBody = blogContent?.body?.trim() || project.description;
  const blocks = rawBody.split(/\n\s*\n/);
  const attachments = Array.isArray(project.attachments) 
    ? project.attachments.filter((a) => a && typeof a.url === 'string' && a.url.trim().length > 0) 
    : [];

  return (
    <BlogLayout
      title={project.title}
      date={date}
      readTime={readTime}
      tags={Array.isArray(project.tags) ? project.tags.filter((t) => typeof t === 'string') : []}
      image={resolveUrl(project.image)}
      demoLink={project.demo || undefined}
      githubLink={project.github || undefined}
    >
      <div className="space-y-6 text-[#a3a9b8]">
        {subtitle && (
          <p className="text-base sm:text-lg text-[#eef0f5] font-normal leading-relaxed border-b border-white/[0.10] pb-5">
            {subtitle}
          </p>
        )}

        {highlights.length > 0 && (
          <div className="p-5 rounded-[10px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <h2 className="font-mono text-xs text-[#7a8296] mb-3">
              KEY HIGHLIGHTS &amp; OUTCOMES
            </h2>
            <ul className="space-y-2.5">
              {highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-[#eef0f5]"
                >
                  <CheckCircle2
                    className="w-4 h-4 text-[#4cc38a] mt-0.5 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4 leading-relaxed text-sm sm:text-base">
          {blocks.map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="text-base sm:text-lg font-medium text-[#eef0f5] pt-2"
                >
                  {trimmed.replace(/^###\s+/, '')}
                </h3>
              );
            }

            if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
              return (
                <h2
                  key={idx}
                  className="text-lg sm:text-xl font-medium text-[#eef0f5] pt-3"
                >
                  {trimmed.replace(/^##?\s+/, '')}
                </h2>
              );
            }

            const lines = trimmed.split('\n');
            const isList = lines.every(
              (line) => line.trim().startsWith('- ') || line.trim().startsWith('* ')
            );

            if (isList) {
              return (
                <ul key={idx} className="space-y-2 pl-4 list-disc text-[#a3a9b8]">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx}>{line.trim().replace(/^[-*]\s+/, '')}</li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={idx} className="text-[#a3a9b8] whitespace-pre-line">
                {trimmed}
              </p>
            );
          })}
        </div>

        {images.length > 0 && (
          <div className="pt-4 border-t border-white/[0.10]">
            <h3 className="font-mono text-xs text-[#7a8296] mb-4">
              SYSTEM SNAPSHOTS &amp; GALLERY
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="rounded-[10px] overflow-hidden border border-white/[0.10] bg-[#07080d]"
                >
                  <img
                    src={resolveUrl(imgUrl)}
                    alt={`${project.title} snapshot ${idx + 1}`}
                    className="w-full h-56 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {attachments.length > 0 && (
          <div className="pt-4 border-t border-white/[0.10]">
            <h3 className="font-mono text-xs text-[#7a8296] mb-4">
              PROJECT FILES &amp; ATTACHMENTS
            </h3>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={resolveUrl(att.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={att.fileName || undefined}
                  className="px-3 py-1.5 rounded-[8px] text-xs font-mono bg-[#1a1e28] text-[#eef0f5] border border-white/[0.10] hover:bg-[#222734]"
                >
                  {att.label || att.fileName || 'Attachment'}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </BlogLayout>
  );
};


const Projects: React.FC = () => {
  const navigate = useNavigate();
  const portfolio = usePortfolio();
  const resolveUrl = portfolio.resolveAssetUrl;
  const projects = portfolio.data.projects || [];

  const projectsMeta = portfolio.data.sections?.projects;
  const ALL_TAG_KEY = '__all__';
  const [activeTagKey, setActiveTagKey] = useState<string>(ALL_TAG_KEY);

  const tagPills = useMemo(() => {
    const counts: Record<string, number> = {};
    const labelMap = new Map<string, string>(); // normalizedKey -> firstSeenLabel

    projects.forEach((project) => {
      const uniqueTags = new Set<string>();
      (project.tags || []).forEach((tag) => {
        if (typeof tag !== 'string') return;
        const trimmed = tag.trim();
        if (!trimmed) return;
        uniqueTags.add(trimmed);
      });
      uniqueTags.forEach((tag) => {
        const normalized = tag.toLowerCase();
        if (!labelMap.has(normalized)) labelMap.set(normalized, tag);
        counts[normalized] = (counts[normalized] || 0) + 1;
      });
    });

    return [
      { key: ALL_TAG_KEY, label: projectsMeta?.allTagLabel || 'All', count: projects.length },
      ...Array.from(labelMap.entries()).map(([key, label]) => ({ key, label, count: counts[key] })),
    ];
  }, [projects, projectsMeta?.allTagLabel]);

  const filteredProjects = useMemo(() => {
    if (activeTagKey === ALL_TAG_KEY) return projects;
    return projects.filter((project) =>
      (project.tags || []).some(
        (tag) => typeof tag === 'string' && tag.trim().toLowerCase() === activeTagKey
      )
    );
  }, [projects, activeTagKey]);

  const handleDemoClick = (demo: string) => {
    if (!demo) return;
    if (demo.startsWith('/')) {
      navigate(demo);
    } else {
      window.open(demo, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs text-[#7a8296]">
            {projectsMeta?.eyebrow || '03 / Selected work'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#eef0f5]">
            {projectsMeta?.title || 'Featured projects'}
          </h2>
          <p className="text-sm sm:text-base text-[#a3a9b8] max-w-xl">
            {projectsMeta?.description || 'Production tools, machine learning applications, and workflow automation systems.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tagPills.map((pill) => {
            const isActive = activeTagKey === pill.key;
            return (
              <button
                key={pill.key}
                onClick={() => setActiveTagKey(pill.key)}
                className={`h-9 px-3.5 rounded-[8px] text-sm font-medium transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'bg-[#11141c]/75 backdrop-blur-xl text-[#a3a9b8] border-white/[0.10] hover:text-[#eef0f5] hover:bg-[#1a1e28]/70'
                }`}
              >
                <span>{pill.label}</span>
                <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => {
          const globalIndex = projects.indexOf(project);
          const prjNum = String(
            (globalIndex >= 0 ? globalIndex : index) + 1
          ).padStart(2, '0');
          const attachments = Array.isArray(project.attachments) 
            ? project.attachments.filter((a) => a && typeof a.url === 'string' && a.url.trim().length > 0) 
            : [];

          return (
            <div
              key={project.id || index}
              data-testid="project-card"
              className="flex flex-col justify-between bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] overflow-hidden border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-white/[0.18] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#07080d] border-b border-white/[0.10]">
                  <img
                    src={resolveUrl(project.image)}
                    alt={project.title}
                    className="w-full h-full object-cover object-center opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-5 pb-4 flex flex-col gap-3" data-testid="project-card-body">
                  <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                    PRJ-{prjNum}
                  </span>
                  <h3 className="text-lg font-medium text-[#eef0f5] leading-snug" data-testid="project-card-title">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#a3a9b8] leading-relaxed" data-testid="project-card-description">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5" data-testid="project-card-tags">
                    {(project.tags || []).map((tag, tagIndex) => (
                      <button
                        type="button"
                        key={tagIndex}
                        onClick={() => setActiveTagKey(tag.trim().toLowerCase())}
                        className="px-2.5 py-1 rounded-[6px] text-xs font-medium bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:text-[#eef0f5] transition-colors duration-150"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {attachments.map((att) => (
                        <a
                          key={att.id}
                          href={resolveUrl(att.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={att.fileName || undefined}
                          className="px-2 py-1 rounded-[6px] text-[10px] font-mono bg-[#1a1e28] text-[#a3a9b8] hover:text-[#eef0f5] border border-white/[0.10]"
                        >
                          {att.label || att.fileName || 'Attachment'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3.5 border-t border-white/[0.10] flex items-center gap-2">
                {project.demo && (
                  <button
                    onClick={() => handleDemoClick(project.demo)}
                    className="flex-1 h-9 px-3 rounded-[8px] text-xs font-medium bg-[#eef0f5] text-[#0b0d14] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white inline-flex items-center justify-center gap-1.5 transition-colors duration-150"
                  >
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>{projectsMeta?.demoLabel || 'Demo'}</span>
                  </button>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-9 px-3 rounded-[8px] text-xs font-medium bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#222734]/80 inline-flex items-center justify-center gap-1.5 transition-colors duration-150"
                  >
                    <Github className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
                    <span>{projectsMeta?.codeLabel || 'Code'}</span>
                  </a>
                )}
                {project.blog && (
                  <Link
                    to={project.blog}
                    className="flex-1 h-9 px-3 rounded-[8px] text-xs font-medium bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#222734]/80 inline-flex items-center justify-center gap-1.5 transition-colors duration-150"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
                    <span>{projectsMeta?.blogLabel || 'Blog'}</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
