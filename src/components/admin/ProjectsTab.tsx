import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ExternalLink,
  FileText,
  Github,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  usePortfolio,
  slugify,
  type ProjectBlogContent,
  type ProjectItem,
  type ProjectsSectionMeta,
} from '../../context/PortfolioContext';
import { AssetField } from './AssetField';
import { AttachmentsEditor } from './AttachmentsEditor';
import {
  BTN_DANGER,
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  MONO_INPUT_CLASS,
  TEXTAREA_CLASS,
  formatSignatureId,
} from './adminStyles';

const LEGACY_BLOG_ROUTES = [
  '/blog/Linkedinn',
  '/blog/DDO',
  '/blog/Networkapp',
  '/blog/ats-score-checker',
];

const FALLBACK_PROJECT_IMG =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80';

export const ProjectsTab: React.FC = () => {
  const { data, updateData, resolveAssetUrl } = usePortfolio();
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});
  const [openBlogComposerIds, setOpenBlogComposerIds] = useState<
    Record<string, boolean>
  >({});

  const projectsMeta = data.sections.projects;

  const updateProjectsMeta = <K extends keyof ProjectsSectionMeta>(
    key: K,
    value: ProjectsSectionMeta[K]
  ) => {
    updateData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: {
          ...prev.sections.projects,
          [key]: value,
        },
      },
    }));
  };

  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    const defaultTitle = 'New portfolio project';
    const autoBlogRoute = `/blog/${slugify(defaultTitle)}`;
    const newProject: ProjectItem = {
      id: newId,
      title: defaultTitle,
      description:
        'Describe the problem solved, system architecture, and operational outcome.',
      image: FALLBACK_PROJECT_IMG,
      tags: ['Python', 'Machine Learning'],
      demo: '',
      github: 'https://github.com/mightysanju',
      blog: autoBlogRoute,
      blogContent: {
        subtitle:
          'System architecture, implementation details, and measurable impact',
        readTime: '5 min read',
        date: 'Nov 2024',
        highlights: [
          'Automated data pipeline and model evaluation workflow',
          'Reduced manual processing latency across operations',
        ],
        body: 'Write your full project case study here. Use blank lines to separate paragraphs.\n\nExplain the operational problem, technical architecture, and measurable results.',
        images: [],
      },
      attachments: [],
    };
    updateData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
    setOpenBlogComposerIds((prev) => ({ ...prev, [newId]: true }));
  };

  const handleUpdateProject = (id: string, patch: Partial<ProjectItem>) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...patch };
        if (patch.title !== undefined) {
          const oldAutoSlug = `/blog/${slugify(p.title)}`;
          if (
            !LEGACY_BLOG_ROUTES.includes(p.blog) &&
            (!p.blog || p.blog === oldAutoSlug)
          ) {
            updated.blog = `/blog/${slugify(patch.title)}`;
          }
        }
        return updated;
      }),
    }));
  };

  const handleUpdateProjectBlogContent = (
    projectId: string,
    patch: Partial<ProjectBlogContent>
  ) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const currentBlogContent: ProjectBlogContent = p.blogContent || {
          subtitle: p.description,
          readTime: '5 min read',
          date: 'Nov 2024',
          highlights: [],
          body: '',
          images: [],
        };
        const nextBlogRoute =
          p.blog && p.blog.startsWith('/blog/')
            ? p.blog
            : `/blog/${slugify(p.title)}`;
        return {
          ...p,
          blog: nextBlogRoute,
          blogContent: {
            ...currentBlogContent,
            ...patch,
          },
        };
      }),
    }));
  };

  const handleAddProjectTags = (projectId: string, rawInput: string) => {
    const newTags = rawInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (newTags.length === 0) return;

    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const merged = Array.from(new Set([...p.tags, ...newTags]));
        return { ...p, tags: merged };
      }),
    }));
    setNewTagInputs((prev) => ({ ...prev, [projectId]: '' }));
  };

  const handleRemoveProjectTag = (projectId: string, tagToRemove: string) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? { ...p, tags: p.tags.filter((t) => t !== tagToRemove) }
          : p
      ),
    }));
  };

  const handleMoveProject = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= data.projects.length) return;
    updateData((prev) => {
      const copy = [...prev.projects];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return { ...prev, projects: copy };
    });
  };

  const handleDeleteProject = (id: string) => {
    updateData((prev) => {
      const nextProjects = prev.projects.filter((p) => p.id !== id);
      const nextHero = Array.isArray(prev.hero.shippedSystemProjectIds)
        ? {
            ...prev.hero,
            shippedSystemProjectIds: prev.hero.shippedSystemProjectIds.filter(
              (pid) => pid !== id
            ),
          }
        : prev.hero;

      return {
        ...prev,
        hero: nextHero,
        projects: nextProjects,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header & Labels Editor (R1) */}
      <div className={`${CARD_CLASS} space-y-4`}>
        <div>
          <h2 className="text-lg font-medium text-[#eef0f5]">
            Projects section header &amp; button labels
          </h2>
          <p className="text-sm text-[#a3a9b8]">
            Customize the Projects section eyebrow, title, description, filter label, and card action button labels shown on the landing page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="projects-section-eyebrow" className={LABEL_CLASS}>
              Projects Eyebrow
            </label>
            <input
              id="projects-section-eyebrow"
              type="text"
              value={projectsMeta.eyebrow}
              onChange={(e) => updateProjectsMeta('eyebrow', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="projects-section-title" className={LABEL_CLASS}>
              Projects Title
            </label>
            <input
              id="projects-section-title"
              type="text"
              value={projectsMeta.title}
              onChange={(e) => updateProjectsMeta('title', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label
              htmlFor="projects-section-description"
              className={LABEL_CLASS}
            >
              Projects Description
            </label>
            <textarea
              id="projects-section-description"
              rows={2}
              value={projectsMeta.description}
              onChange={(e) =>
                updateProjectsMeta('description', e.target.value)
              }
              className={TEXTAREA_CLASS}
            />
          </div>

          <div>
            <label htmlFor="projects-all-tag-label" className={LABEL_CLASS}>
              All filter label
            </label>
            <input
              id="projects-all-tag-label"
              type="text"
              value={projectsMeta.allTagLabel}
              onChange={(e) =>
                updateProjectsMeta('allTagLabel', e.target.value)
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="projects-demo-label" className={LABEL_CLASS}>
              Demo button label
            </label>
            <input
              id="projects-demo-label"
              type="text"
              value={projectsMeta.demoLabel}
              onChange={(e) => updateProjectsMeta('demoLabel', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="projects-code-label" className={LABEL_CLASS}>
              Code button label
            </label>
            <input
              id="projects-code-label"
              type="text"
              value={projectsMeta.codeLabel}
              onChange={(e) => updateProjectsMeta('codeLabel', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="projects-blog-label" className={LABEL_CLASS}>
              Blog button label
            </label>
            <input
              id="projects-blog-label"
              type="text"
              value={projectsMeta.blogLabel}
              onChange={(e) => updateProjectsMeta('blogLabel', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* Projects List Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-[#eef0f5]">
            Project records &amp; case study blogs ({data.projects.length})
          </h3>
          <p className="text-xs text-[#a3a9b8]">
            Upload cover photos, manage tags (which feed the Tech Stack strip), attach downloadable files, and write built-in{' '}
            <code className="font-mono text-xs text-[#eef0f5]">/blog/:slug</code> articles.
          </p>
        </div>
        <button type="button" onClick={handleAddProject} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
          Add project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.projects.map((project, idx) => {
          const tagInputVal = newTagInputs[project.id] || '';
          const isBlogOpen = Boolean(openBlogComposerIds[project.id]);
          const autoSlugPath = `/blog/${slugify(project.title)}`;
          const activeBlogRoute = project.blog || autoSlugPath;
          const blogContent: ProjectBlogContent = project.blogContent || {
            subtitle: project.description,
            readTime: '5 min read',
            date: 'Nov 2024',
            highlights: [],
            body: '',
            images: [],
          };

          return (
            <div key={project.id} className={`${CARD_CLASS} space-y-6`}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Live Vertically Stacked Card Preview */}
                <div
                  data-testid={`project-preview-${project.id}`}
                  className="w-full lg:w-80 shrink-0 bg-[#0b0d14]/80 border border-white/[0.10] rounded-[8px] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 overflow-hidden bg-[#1a1e28]">
                      <img
                        src={resolveAssetUrl(project.image) || FALLBACK_PROJECT_IMG}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            FALLBACK_PROJECT_IMG;
                        }}
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="font-mono tabular-nums text-xs text-[#7a8296]">
                        {formatSignatureId('PRJ', idx)}
                      </div>
                      <h3 className="font-medium text-[#eef0f5] text-sm">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#a3a9b8]">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded-[6px] bg-[#1a1e28]/70 text-[#a3a9b8] border border-white/[0.10]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Action Bar Preview */}
                  <div className="px-4 pb-4 pt-3 border-t border-white/[0.10] flex flex-wrap items-center gap-2">
                    {project.demo ? (
                      <Link
                        to={project.demo}
                        target={project.demo.startsWith('/') ? undefined : '_blank'}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#eef0f5] text-[#0b0d14] text-xs font-medium"
                      >
                        <ExternalLink
                          className="w-3.5 h-3.5 text-[#0b0d14]"
                          strokeWidth={1.5}
                        />
                        {projectsMeta.demoLabel || 'Demo'}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[#1a1e28]/50 text-[#7a8296] text-xs border border-white/[0.06]">
                        No demo
                      </span>
                    )}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#1a1e28]/70 text-[#eef0f5] border border-white/[0.10] text-xs font-medium"
                      >
                        <Github
                          className="w-3.5 h-3.5 text-[#a3a9b8]"
                          strokeWidth={1.5}
                        />
                        {projectsMeta.codeLabel || 'Code'}
                      </a>
                    )}

                    {project.blog && (
                      <Link
                        to={project.blog}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#1a1e28]/70 text-[#eef0f5] border border-white/[0.10] text-xs font-medium"
                      >
                        <BookOpen
                          className="w-3.5 h-3.5 text-[#a3a9b8]"
                          strokeWidth={1.5}
                        />
                        {projectsMeta.blogLabel || 'Blog'}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Editor Controls */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.10] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums text-xs px-2 py-1 rounded-[6px] bg-[#1a1e28]/70 text-[#7a8296] border border-white/[0.10]">
                        {formatSignatureId('PRJ', idx)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-[6px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] disabled:opacity-30 text-[#a3a9b8] transition-colors duration-150"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 1)}
                        disabled={idx === data.projects.length - 1}
                        className="p-1.5 rounded-[6px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] disabled:opacity-30 text-[#a3a9b8] transition-colors duration-150"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!project.blog) {
                            handleUpdateProject(project.id, {
                              blog: autoSlugPath,
                            });
                          }
                          setOpenBlogComposerIds((prev) => ({
                            ...prev,
                            [project.id]: !prev[project.id],
                          }));
                        }}
                        className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] border text-xs font-medium transition-colors duration-150 ${
                          isBlogOpen
                            ? 'bg-[#eef0f5] text-[#0b0d14] border-white'
                            : 'bg-[#1a1e28]/70 hover:bg-[#222733] text-[#eef0f5] border-white/[0.10]'
                        }`}
                      >
                        <FileText
                          className={`w-4 h-4 ${
                            isBlogOpen ? 'text-[#0b0d14]' : 'text-[#a3a9b8]'
                          }`}
                          strokeWidth={1.5}
                        />
                        {isBlogOpen
                          ? 'Close blog editor'
                          : 'Write / edit project blog'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        aria-label={`Delete ${project.title}`}
                        className={BTN_DANGER}
                      >
                        <Trash2
                          className="w-4 h-4 text-[#e5484d]"
                          strokeWidth={1.5}
                        />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS}>Project title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          handleUpdateProject(project.id, {
                            title: e.target.value,
                          })
                        }
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <AssetField
                        label="Project cover image"
                        value={project.image}
                        onChange={(url) =>
                          handleUpdateProject(project.id, { image: url })
                        }
                        accept="image/*"
                        kind="image"
                        maxWidth={900}
                        customSlug={`${project.title}-cover`}
                        fallbackUrl={FALLBACK_PROJECT_IMG}
                        placeholder="Or paste cover image URL..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS}>Description</label>
                      <textarea
                        rows={2}
                        value={project.description}
                        onChange={(e) =>
                          handleUpdateProject(project.id, {
                            description: e.target.value,
                          })
                        }
                        className={TEXTAREA_CLASS}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS}>
                        Tags (click × to remove or type below to add)
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 text-xs text-[#eef0f5] border border-white/[0.10]"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveProjectTag(project.id, tag)
                              }
                              className="text-[#7a8296] hover:text-[#e5484d] transition-colors duration-150"
                              aria-label={`Remove ${tag}`}
                            >
                              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInputVal}
                          onChange={(e) =>
                            setNewTagInputs((prev) => ({
                              ...prev,
                              [project.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              handleAddProjectTags(project.id, tagInputVal);
                            }
                          }}
                          placeholder="Add tag (e.g. Python, NLP, Automation) and press Enter"
                          className="flex-1 h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-xs text-[#eef0f5] placeholder-[#7a8296]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleAddProjectTags(project.id, tagInputVal)
                          }
                          className={BTN_SECONDARY}
                        >
                          <Plus
                            className="w-4 h-4 text-[#a3a9b8]"
                            strokeWidth={1.5}
                          />
                          Add tag
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={LABEL_CLASS}>
                        Live app / demo link
                      </label>
                      <input
                        type="text"
                        value={project.demo}
                        onChange={(e) =>
                          handleUpdateProject(project.id, {
                            demo: e.target.value,
                          })
                        }
                        placeholder="/ats or https://..."
                        className={MONO_INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label className={LABEL_CLASS}>
                        GitHub repository link
                      </label>
                      <input
                        type="text"
                        value={project.github}
                        onChange={(e) =>
                          handleUpdateProject(project.id, {
                            github: e.target.value,
                          })
                        }
                        placeholder="https://github.com/mightysanju/..."
                        className={MONO_INPUT_CLASS}
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 bg-[#0b0d14]/70 border border-white/[0.08] rounded-[8px] px-3.5 py-2.5">
                      <div className="flex items-center gap-2 text-xs">
                        <BookOpen
                          className="w-4 h-4 text-[#7a8296]"
                          strokeWidth={1.5}
                        />
                        <span className="text-[#a3a9b8]">
                          Project blog route:
                        </span>
                        <code className="font-mono text-[#eef0f5] bg-[#1a1e28]/80 px-2 py-0.5 rounded-[4px] border border-white/[0.08]">
                          {activeBlogRoute}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenBlogComposerIds((prev) => ({
                            ...prev,
                            [project.id]: !prev[project.id],
                          }))
                        }
                        className="text-xs font-medium text-[#eef0f5] underline hover:text-white"
                      >
                        {isBlogOpen
                          ? 'Hide article composer'
                          : 'Write / edit article'}
                      </button>
                    </div>

                    <div className="sm:col-span-2">
                      <AttachmentsEditor
                        attachments={project.attachments || []}
                        onChange={(nextAttachments) =>
                          handleUpdateProject(project.id, {
                            attachments: nextAttachments,
                          })
                        }
                        slugPrefix={`${project.title}-attachment`}
                        title="Project attachments"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Built-in Project Blog Authoring Composer */}
              {isBlogOpen && (
                <div className="border-t border-white/[0.10] pt-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-medium text-[#eef0f5]">
                        Project blog article composer ({activeBlogRoute})
                      </h4>
                      <p className="text-xs text-[#a3a9b8]">
                        Changes here automatically publish to{' '}
                        <code className="font-mono text-[#eef0f5]">
                          {activeBlogRoute}
                        </code>{' '}
                        on the live site.
                      </p>
                    </div>
                    <Link to={activeBlogRoute} className={`${BTN_SECONDARY} !h-8`}>
                      <ExternalLink
                        className="w-3.5 h-3.5 text-[#a3a9b8]"
                        strokeWidth={1.5}
                      />
                      Preview blog page
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS}>Article subtitle</label>
                      <input
                        type="text"
                        value={blogContent.subtitle || ''}
                        onChange={(e) =>
                          handleUpdateProjectBlogContent(project.id, {
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="Technical deep dive and system outcomes..."
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={LABEL_CLASS}>Date</label>
                        <input
                          type="text"
                          value={blogContent.date || ''}
                          onChange={(e) =>
                            handleUpdateProjectBlogContent(project.id, {
                              date: e.target.value,
                            })
                          }
                          placeholder="Nov 2024"
                          className={MONO_INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Read time</label>
                        <input
                          type="text"
                          value={blogContent.readTime || ''}
                          onChange={(e) =>
                            handleUpdateProjectBlogContent(project.id, {
                              readTime: e.target.value,
                            })
                          }
                          placeholder="5 min read"
                          className={MONO_INPUT_CLASS}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className={LABEL_CLASS}>
                        Key engineering highlights (one bullet point per line)
                      </label>
                      <textarea
                        rows={3}
                        value={(blogContent.highlights || []).join('\n')}
                        onChange={(e) =>
                          handleUpdateProjectBlogContent(project.id, {
                            highlights: e.target.value
                              .split('\n')
                              .map((line) => line.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Reduced processing time by 45%&#10;Automated SQL capacity checks"
                        className={TEXTAREA_CLASS}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className={LABEL_CLASS}>
                        Full article body (separate paragraphs with a blank line)
                      </label>
                      <textarea
                        rows={6}
                        value={blogContent.body}
                        onChange={(e) =>
                          handleUpdateProjectBlogContent(project.id, {
                            body: e.target.value,
                          })
                        }
                        placeholder="Write your project architecture, methodology, and results here..."
                        className={`${TEXTAREA_CLASS} leading-relaxed`}
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-3">
                      <AssetField
                        label="Add article screenshot / diagram"
                        value=""
                        kind="image"
                        accept="image/*"
                        maxWidth={1100}
                        customSlug={`${project.title}-diagram-${
                          (blogContent.images || []).length + 1
                        }`}
                        allowUrlInput={false}
                        allowClear={false}
                        uploadButtonLabel="Upload diagram / screenshot"
                        onChange={(url) => {
                          if (!url) return;
                          handleUpdateProjectBlogContent(project.id, {
                            images: [...(blogContent.images || []), url],
                          });
                        }}
                      />

                      {(blogContent.images || []).length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {(blogContent.images || []).map((imgUrl, imgIdx) => (
                            <div
                              key={`${imgUrl}-${imgIdx}`}
                              className="relative group rounded-[8px] overflow-hidden border border-white/[0.10] bg-[#0b0d14] h-24"
                            >
                              <img
                                src={resolveAssetUrl(imgUrl)}
                                alt={`Blog visual ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateProjectBlogContent(project.id, {
                                    images: (blogContent.images || []).filter(
                                      (_, i) => i !== imgIdx
                                    ),
                                  })
                                }
                                className="absolute top-1.5 right-1.5 p-1 rounded-[6px] bg-[#07080d]/90 text-[#e5484d] border border-white/[0.10]"
                                title="Remove image"
                              >
                                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
