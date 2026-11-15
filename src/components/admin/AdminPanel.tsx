import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Unlock,
  ArrowLeft,
  Save,
  Download,
  RotateCcw,
  GitCommit,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Award,
  MessageSquareQuote,
  Cpu,
  UserCheck,
  KeyRound,
  Eye,
  EyeOff,
  Github,
  BookOpen,
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Bot,
} from 'lucide-react';
import {
  usePortfolio,
  ProjectItem,
  ProjectBlogContent,
  CertificationItem,
  TestimonialItem,
  SkillItem,
  ChatbotConfig,
  ChatbotKnowledgeEntry,
  encryptTokenToVault,
  decryptTokenFromVault,
  getVaultMetadata,
  slugify,
} from '../../context/PortfolioContext';

type TabKey = 'projects' | 'certifications' | 'testimonials' | 'skills' | 'hero' | 'chatbot' | 'vault';

const ICON_OPTIONS = [
  'Code2',
  'Database',
  'Cpu',
  'BarChart',
  'Globe',
  'Lock',
  'Shield',
  'Wrench',
  'Brain',
  'Users',
  'Network',
  'Cloud',
  'Atom',
];

const formatSignatureId = (prefix: string, index: number) =>
  `${prefix}-${String(index + 1).padStart(2, '0')}`;

export const AdminPanel: React.FC = () => {
  const {
    data,
    updateData,
    saveDraftLocally,
    resetToDefault,
    hasUnsavedChanges,
    commitToGitHub,
    uploadAsset,
    queuedUploads,
  } = usePortfolio();

  // Authentication & Web Crypto Vault state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activePassword, setActivePassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // GitHub Settings & Commit state
  const [githubToken, setGithubToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [repoSlug, setRepoSlug] = useState('mightysanju/portfolio-2024');
  const [branchName, setBranchName] = useState('main');
  const [commitMessage, setCommitMessage] = useState('chore(cms): update portfolioData.json');
  const [isCommitting, setIsCommitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [lastAutoPaths, setLastAutoPaths] = useState<Record<string, string>>({});
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    commitUrl?: string;
  } | null>(null);

  // Change Admin Password dedicated form state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [vaultMeta, setVaultMeta] = useState(() => getVaultMetadata());

  // Active CMS Tab
  const [activeTab, setActiveTab] = useState<TabKey>('projects');

  // Tag input state & open blog composer state per project card
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});
  const [openBlogComposerIds, setOpenBlogComposerIds] = useState<Record<string, boolean>>({});

  // Editing item states for certifications and skills
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setAuthError('Enter your admin password');
      return;
    }

    const result = await decryptTokenFromVault(trimmed);
    if (!result.validPassword) {
      setAuthError('Invalid password (default on first visit is admin123)');
      return;
    }

    setActivePassword(trimmed);
    setCurrentPasswordInput(trimmed);
    if (result.token) {
      setGithubToken(result.token);
    }
    setIsUnlocked(true);
    setPasswordInput('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cur = currentPasswordInput.trim();
    const next = newPasswordInput.trim();
    const confirm = confirmPasswordInput.trim();

    if (!cur) {
      setStatusBanner({ type: 'error', text: 'Enter your current admin password' });
      return;
    }
    const verify = await decryptTokenFromVault(cur);
    if (!verify.validPassword && cur !== activePassword) {
      setStatusBanner({ type: 'error', text: 'Current password is incorrect' });
      return;
    }
    if (next.length < 4) {
      setStatusBanner({ type: 'error', text: 'New password must be at least 4 characters' });
      return;
    }
    if (next !== confirm) {
      setStatusBanner({ type: 'error', text: 'New password and confirmation do not match' });
      return;
    }

    try {
      await encryptTokenToVault(next, githubToken.trim());
      setActivePassword(next);
      setCurrentPasswordInput(next);
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setVaultMeta(getVaultMetadata());
      setStatusBanner({
        type: 'success',
        text: 'Admin password updated and encrypted in browser vault',
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update password',
      });
    }
  };

  const handleSaveVault = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetPassword = activePassword || 'admin123';
    try {
      await encryptTokenToVault(targetPassword, githubToken.trim());
      setVaultMeta(getVaultMetadata());
      setStatusBanner({
        type: 'success',
        text: 'Encrypted GitHub token into Web Crypto AES-GCM vault',
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to encrypt vault',
      });
    }
  };

  const handleSaveDraftClick = () => {
    saveDraftLocally();
    setStatusBanner({
      type: 'info',
      text: 'Saved draft to browser localStorage',
    });
  };

  const handleExportJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolioData.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatusBanner({
      type: 'info',
      text: 'Downloaded portfolioData.json',
    });
  };

  const handleCommitPush = async () => {
    if (!githubToken.trim()) {
      setActiveTab('vault');
      setStatusBanner({
        type: 'error',
        text: 'Add your GitHub Personal Access Token in the Security & GitHub vault tab first',
      });
      return;
    }

    setIsCommitting(true);
    setStatusBanner({
      type: 'info',
      text: 'Committing portfolioData.json and queued assets to GitHub...',
    });

    const res = await commitToGitHub({
      token: githubToken,
      repo: repoSlug,
      branch: branchName,
      message: commitMessage,
    });

    setIsCommitting(false);
    setStatusBanner({
      type: res.success ? 'success' : 'error',
      text: res.message.replace(/!/g, ''),
      commitUrl: res.commitUrl,
    });
  };

  const handleFileUpload = async (
    fieldId: string,
    file: File | undefined,
    onSuccess: (url: string, publicPath: string) => void,
    maxWidth = 900,
    customSlug?: string
  ) => {
    if (!file) return;
    setUploadingField(fieldId);
    const res = await uploadAsset({
      file,
      token: githubToken,
      repo: repoSlug,
      branch: branchName,
      maxWidth,
      customSlug,
    });
    setUploadingField(null);

    if (res.success && res.url) {
      setLastAutoPaths((prev) => ({ ...prev, [fieldId]: res.publicPath }));
      onSuccess(res.url, res.publicPath);
      setStatusBanner({
        type: 'success',
        text: res.message,
      });
    } else {
      setStatusBanner({
        type: 'error',
        text: res.message || 'File upload failed',
      });
    }
  };

  // --- Project CRUD & Built-In Blog Authoring Helpers ---
  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    const defaultTitle = 'New portfolio project';
    const autoBlogRoute = `/blog/${slugify(defaultTitle)}`;
    const newProject: ProjectItem = {
      id: newId,
      title: defaultTitle,
      description: 'Describe the problem solved, system architecture, and operational outcome.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
      tags: ['Python', 'Machine Learning'],
      demo: '',
      github: 'https://github.com/mightysanju',
      blog: autoBlogRoute,
      blogContent: {
        subtitle: 'System architecture, implementation details, and measurable impact',
        readTime: '5 min read',
        date: 'Nov 2024',
        highlights: [
          'Automated data pipeline and model evaluation workflow',
          'Reduced manual processing latency across operations',
        ],
        body: 'Write your full project case study here. Use blank lines to separate paragraphs.\n\nExplain the operational problem, technical architecture, and measurable results.',
        images: [],
      },
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
        // If title changed and the blog route was auto-generated from the previous title (or empty), keep blog slug synced
        if (patch.title !== undefined) {
          const oldAutoSlug = `/blog/${slugify(p.title)}`;
          const LegacyRoutes = ['/blog/Linkedinn', '/blog/DDO', '/blog/Networkapp', '/blog/ats-score-checker'];
          if (!LegacyRoutes.includes(p.blog) && (!p.blog || p.blog === oldAutoSlug)) {
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
        const nextBlogRoute = p.blog && p.blog.startsWith('/blog/')
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
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // --- Certification CRUD Helpers ---
  const handleAddCertification = () => {
    const newId = `cert-${Date.now()}`;
    const newCert: CertificationItem = {
      id: newId,
      title: 'New professional certification',
      issuer: 'Coursera',
      date: 'Nov 2024',
      description: 'Key competencies and domain skills verified by this credential',
      category: 'ml',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/',
        id: '',
      },
    };
    updateData((prev) => ({
      ...prev,
      certifications: [newCert, ...prev.certifications],
    }));
    setEditingCertId(newId);
  };

  const handleUpdateCertification = (id: string, patch: Partial<CertificationItem>) => {
    updateData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const handleDeleteCertification = (id: string) => {
    updateData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // --- Testimonial CRUD Helpers ---
  const generateInitialsAvatar = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Sanju Kumar')}&background=1a1e28&color=eef0f5&size=200`;

  const handleAddTestimonial = () => {
    const newId = `rec-${Date.now()}`;
    const authorName = 'Colleague Name';
    const newRec: TestimonialItem = {
      id: newId,
      author: authorName,
      position: 'Engineering Manager, Company',
      text: 'Sanju delivers reliable machine learning and automation tools for operations teams.',
      image: generateInitialsAvatar(authorName),
      linkedinUrl: 'https://linkedin.com/in/mightysanju/',
    };
    updateData((prev) => ({
      ...prev,
      testimonials: [newRec, ...prev.testimonials],
    }));
  };

  const handleUpdateTestimonial = (id: string, patch: Partial<TestimonialItem>) => {
    updateData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const handleDeleteTestimonial = (id: string) => {
    updateData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
  };

  // --- Skill CRUD Helpers ---
  const handleAddSkill = () => {
    const newId = `skill-${Date.now()}`;
    const newSkill: SkillItem = {
      id: newId,
      name: 'New technical skill',
      level: 90,
      category: 'Technical',
      icon: 'Code2',
      color: 'from-blue-500 to-cyan-500',
    };
    updateData((prev) => ({
      ...prev,
      skills: [newSkill, ...prev.skills],
    }));
    setEditingSkillId(newId);
  };

  const handleUpdateSkill = (id: string, patch: Partial<SkillItem>) => {
    updateData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const handleDeleteSkill = (id: string) => {
    updateData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // --- Chatbot & Knowledge Base CRUD Helpers ---
  const chatbotConfig: ChatbotConfig = data.chatbot || {
    assistantName: 'Ask Sanju',
    apiUrl: 'https://flaskragbot-1e1040a057f8.herokuapp.com/api/query',
    mode: 'hybrid',
    presetQuestions: [
      'Tell me about your experience',
      'What are your key skills?',
      'How can we collaborate?',
      'Tell me about yourself',
    ],
    systemContext:
      'Sanju Kumar is a Data Scientist & ML Engineer based in Naperville, IL. He holds an M.S. in Information Studies from Trine University (4.0 GPA) and a B.Tech from JNTU.',
    knowledgeEntries: [],
  };

  const handleUpdateChatbot = (patch: Partial<ChatbotConfig>) => {
    updateData((prev) => ({
      ...prev,
      chatbot: {
        ...(prev.chatbot || chatbotConfig),
        ...patch,
      },
    }));
  };

  const handleAddKnowledgeEntry = () => {
    const newEntry: ChatbotKnowledgeEntry = {
      id: `kb-${Date.now()}`,
      topic: 'New knowledge topic',
      keywords: ['keyword1', 'keyword2'],
      answer: 'Provide the detailed answer the assistant should return when asked about this topic.',
    };
    handleUpdateChatbot({
      knowledgeEntries: [newEntry, ...(chatbotConfig.knowledgeEntries || [])],
    });
  };

  const handleUpdateKnowledgeEntry = (
    id: string,
    patch: Partial<ChatbotKnowledgeEntry>
  ) => {
    handleUpdateChatbot({
      knowledgeEntries: (chatbotConfig.knowledgeEntries || []).map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry
      ),
    });
  };

  const handleDeleteKnowledgeEntry = (id: string) => {
    handleUpdateChatbot({
      knowledgeEntries: (chatbotConfig.knowledgeEntries || []).filter(
        (entry) => entry.id !== id
      ),
    });
  };

  const queuedUploadCount = Object.keys(queuedUploads).length;

  // --- Password Gate View ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-9 h-9 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#a3a9b8] hover:text-[#eef0f5] transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
              Back to portfolio
            </Link>
          </div>

          <div className="font-mono text-xs text-[#7a8296] mb-1">SYS-ADMIN · CONTENT VAULT</div>
          <h1 className="text-xl font-medium text-[#eef0f5] mb-2">
            Portfolio administration
          </h1>
          <p className="text-sm text-[#a3a9b8] mb-6">
            Authenticate to edit structured portfolio records, write project blogs, upload files, and commit changes to GitHub.
            {!vaultMeta.exists && (
              <span className="block mt-2 text-xs text-[#7a8296]">
                Default first-visit password:{' '}
                <code className="font-mono text-[#eef0f5] px-1.5 py-0.5 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[4px]">
                  admin123
                </code>
              </span>
            )}
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs text-[#a3a9b8] mb-2">
                Admin password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-10 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 pr-10 text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none transition-colors duration-150"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-[#e5484d] bg-[#1a1e28]/70 border border-[#e5484d]/30 rounded-[8px] px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#e5484d]" strokeWidth={1.5} />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-10 px-4 rounded-[8px] text-sm font-medium bg-[#eef0f5] text-[#0b0d14] hover:bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
              Sign in to CMS
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5] pb-24">
      {/* Sticky Top Action Bar */}
      <header className="sticky top-0 z-40 bg-[#07080d]/80 backdrop-blur-xl border-b border-white/[0.10]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222733] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-xs font-medium text-[#eef0f5] transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
              View live site
            </Link>

            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm font-medium text-[#eef0f5]">
                Portfolio CMS
              </span>
              {hasUnsavedChanges ? (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] font-mono text-xs bg-[#1a1e28]/70 text-[#a3a9b8] border border-white/[0.10]">
                  <span className="w-2 h-2 rounded-full bg-[#eef0f5]" />
                  Local draft active
                  {queuedUploadCount > 0 ? ` · ${queuedUploadCount} file(s) staged` : ''}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] font-mono text-xs bg-[#1a1e28]/70 text-[#a3a9b8] border border-white/[0.10]">
                  <span className="w-2 h-2 rounded-full bg-[#4cc38a]" />
                  Synced
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message"
              className="w-full sm:w-64 h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 text-xs text-[#eef0f5] placeholder-[#7a8296] focus:outline-none transition-colors duration-150"
            />

            <button
              type="button"
              onClick={handleSaveDraftClick}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222733] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-xs font-medium text-[#eef0f5] transition-colors duration-150"
              title="Save draft in browser localStorage"
            >
              <Save className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
              Save draft locally
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222733] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-xs font-medium text-[#eef0f5] transition-colors duration-150"
              title="Download portfolioData.json"
            >
              <Download className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
              Export JSON
            </button>

            <button
              type="button"
              onClick={resetToDefault}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#a3a9b8] hover:text-[#e5484d] transition-colors duration-150"
              title="Discard local draft and revert to published JSON"
            >
              <RotateCcw className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleCommitPush}
              disabled={isCommitting}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white disabled:opacity-50 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
            >
              <GitCommit className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
              {isCommitting ? 'Pushing to GitHub...' : 'Commit & push to GitHub'}
            </button>
          </div>
        </div>

        {/* Status feedback banner */}
        {statusBanner && (
          <div className="border-t border-white/[0.10] bg-[#11141c]/90 backdrop-blur-xl px-6 py-2.5 text-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusBanner.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#e5484d]" strokeWidth={1.5} />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4cc38a]" strokeWidth={1.5} />
                )}
                <span className="text-[#eef0f5]">{statusBanner.text}</span>
                {statusBanner.commitUrl && (
                  <a
                    href={statusBanner.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline font-medium text-[#eef0f5] ml-2"
                  >
                    View commit <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setStatusBanner(null)}
                className="text-xs text-[#7a8296] hover:text-[#eef0f5] ml-4 transition-colors duration-150"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-[#11141c]/75 backdrop-blur-xl p-1.5 rounded-[12px] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] w-fit">
          {[
            { id: 'projects', label: 'Projects & blogs', count: data.projects.length, icon: FolderGit2 },
            { id: 'certifications', label: 'Certifications', count: data.certifications.length, icon: Award },
            { id: 'testimonials', label: 'Recommendations', count: data.testimonials.length, icon: MessageSquareQuote },
            { id: 'skills', label: 'Skills', count: data.skills.length, icon: Cpu },
            { id: 'hero', label: 'Hero, resume & favicon', count: null, icon: UserCheck },
            {
              id: 'chatbot',
              label: 'Chatbot & AI data',
              count: (chatbotConfig.knowledgeEntries || []).length,
              icon: Bot,
            },
            { id: 'vault', label: 'Password & GitHub vault', count: null, icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] text-xs font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-[#1a1e28]/90 text-[#eef0f5] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'text-[#a3a9b8] hover:text-[#eef0f5]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROJECTS & BUILT-IN BLOG COMPOSER */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-[#eef0f5]">Projects & case study blogs</h2>
                <p className="text-sm text-[#a3a9b8]">
                  Upload cover photos, manage tags and live links, and write full project blog articles with automatic <code className="font-mono text-xs text-[#eef0f5]">/blog/:slug</code> routing
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
              >
                <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                Add project
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {data.projects.map((project, idx) => {
                const tagInputVal = newTagInputs[project.id] || '';
                const coverFieldId = `proj-img-${project.id}`;
                const blogImgFieldId = `proj-blog-img-${project.id}`;
                const isUploadingCover = uploadingField === coverFieldId;
                const isUploadingBlogImg = uploadingField === blogImgFieldId;
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
                  <div
                    key={project.id}
                    className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 space-y-6"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Live Card Preview with Action Buttons */}
                      <div className="w-full lg:w-80 shrink-0 bg-[#0b0d14]/80 border border-white/[0.10] rounded-[8px] overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="relative h-40 overflow-hidden bg-[#1a1e28]">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <div className="font-mono tabular-nums text-xs text-[#7a8296] mb-1">
                              {formatSignatureId('PRJ', idx)}
                            </div>
                            <h3 className="font-medium text-[#eef0f5] text-sm mb-1">
                              {project.title}
                            </h3>
                            <p className="text-xs text-[#a3a9b8] line-clamp-2 mb-3">
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
                              <ExternalLink className="w-3.5 h-3.5 text-[#0b0d14]" strokeWidth={1.5} />
                              Demo
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
                              <Github className="w-3.5 h-3.5 text-[#a3a9b8]" strokeWidth={1.5} />
                              Code
                            </a>
                          )}

                          {project.blog && (
                            <Link
                              to={project.blog}
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-[#1a1e28]/70 text-[#eef0f5] border border-white/[0.10] text-xs font-medium"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#a3a9b8]" strokeWidth={1.5} />
                              Blog
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Always-Visible Editor Controls */}
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
                                  handleUpdateProject(project.id, { blog: autoSlugPath });
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
                                className={`w-4 h-4 ${isBlogOpen ? 'text-[#0b0d14]' : 'text-[#a3a9b8]'}`}
                                strokeWidth={1.5}
                              />
                              {isBlogOpen ? 'Close blog editor' : 'Write / edit project blog'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProject(project.id)}
                              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#e5484d] transition-colors duration-150"
                            >
                              <Trash2 className="w-4 h-4 text-[#e5484d]" strokeWidth={1.5} />
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Project Title */}
                          <div>
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
                              Project title
                            </label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { title: e.target.value })
                              }
                              className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                            />
                          </div>

                          {/* Upload-First Cover Image Control */}
                          <div>
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
                              Project cover image
                            </label>
                            <div className="flex items-center gap-2">
                              <label className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium cursor-pointer shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150">
                                <Upload className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                                <span>
                                  {isUploadingCover ? 'Uploading...' : 'Upload cover photo'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      coverFieldId,
                                      e.target.files?.[0],
                                      (url) => handleUpdateProject(project.id, { image: url }),
                                      900,
                                      `${project.title}-cover`
                                    )
                                  }
                                />
                              </label>
                              <input
                                type="text"
                                value={
                                  project.image.startsWith('data:')
                                    ? lastAutoPaths[coverFieldId] || `/uploads/${slugify(project.title)}-cover.webp`
                                    : project.image
                                }
                                onChange={(e) =>
                                  handleUpdateProject(project.id, { image: e.target.value })
                                }
                                placeholder="Or paste image URL..."
                                className="flex-1 h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#a3a9b8]"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={project.description}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { description: e.target.value })
                              }
                              className="w-full bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 py-2 text-sm text-[#eef0f5]"
                            />
                          </div>

                          {/* Interactive Tags Manager */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
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
                                    onClick={() => handleRemoveProjectTag(project.id, tag)}
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
                                onClick={() => handleAddProjectTags(project.id, tagInputVal)}
                                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#eef0f5] transition-colors duration-150"
                              >
                                <Plus className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                                Add tag
                              </button>
                            </div>
                          </div>

                          {/* Live App / Demo Link */}
                          <div>
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
                              Live app / demo link
                            </label>
                            <input
                              type="text"
                              value={project.demo}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { demo: e.target.value })
                              }
                              placeholder="/ats or https://..."
                              className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5] placeholder-[#7a8296]"
                            />
                          </div>

                          {/* GitHub Repository Link */}
                          <div>
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
                              GitHub repository link
                            </label>
                            <input
                              type="text"
                              value={project.github}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { github: e.target.value })
                              }
                              placeholder="https://github.com/mightysanju/..."
                              className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5] placeholder-[#7a8296]"
                            />
                          </div>

                          {/* Auto-Generated Blog Route Summary Bar */}
                          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 bg-[#0b0d14]/70 border border-white/[0.08] rounded-[8px] px-3.5 py-2.5">
                            <div className="flex items-center gap-2 text-xs">
                              <BookOpen className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                              <span className="text-[#a3a9b8]">Project blog route:</span>
                              <code className="font-mono text-[#eef0f5] bg-[#1a1e28]/80 px-2 py-0.5 rounded-[4px] border border-white/[0.08]">
                                {activeBlogRoute}
                              </code>
                            </div>
                            <div className="flex items-center gap-2">
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
                                {isBlogOpen ? 'Hide article composer' : 'Write / edit article'}
                              </button>
                            </div>
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
                              <code className="font-mono text-[#eef0f5]">{activeBlogRoute}</code> on the live site
                            </p>
                          </div>
                          <Link
                            to={activeBlogRoute}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#eef0f5]"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#a3a9b8]" strokeWidth={1.5} />
                            Preview blog page
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
                              Article subtitle
                            </label>
                            <input
                              type="text"
                              value={blogContent.subtitle || ''}
                              onChange={(e) =>
                                handleUpdateProjectBlogContent(project.id, {
                                  subtitle: e.target.value,
                                })
                              }
                              placeholder="Technical deep dive and system outcomes..."
                              className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-[#a3a9b8] mb-1.5">
                                Date
                              </label>
                              <input
                                type="text"
                                value={blogContent.date || ''}
                                onChange={(e) =>
                                  handleUpdateProjectBlogContent(project.id, {
                                    date: e.target.value,
                                  })
                                }
                                placeholder="Nov 2024"
                                className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-[#a3a9b8] mb-1.5">
                                Read time
                              </label>
                              <input
                                type="text"
                                value={blogContent.readTime || ''}
                                onChange={(e) =>
                                  handleUpdateProjectBlogContent(project.id, {
                                    readTime: e.target.value,
                                  })
                                }
                                placeholder="5 min read"
                                className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5]"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
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
                              className="w-full bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 py-2 text-sm text-[#eef0f5]"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-xs text-[#a3a9b8] mb-1.5">
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
                              className="w-full bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 py-2.5 text-sm text-[#eef0f5] leading-relaxed"
                            />
                          </div>

                          {/* Upload Article Diagrams / Screenshots */}
                          <div className="sm:col-span-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <label className="block text-xs text-[#a3a9b8]">
                                Article screenshots & diagrams
                              </label>
                              <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#eef0f5] cursor-pointer transition-colors duration-150">
                                <ImageIcon className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                                <span>
                                  {isUploadingBlogImg ? 'Uploading...' : 'Upload diagram / screenshot'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      blogImgFieldId,
                                      e.target.files?.[0],
                                      (url) =>
                                        handleUpdateProjectBlogContent(project.id, {
                                          images: [...(blogContent.images || []), url],
                                        }),
                                      1100,
                                      `${project.title}-diagram-${(blogContent.images || []).length + 1}`
                                    )
                                  }
                                />
                              </label>
                            </div>
                            {(blogContent.images || []).length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {(blogContent.images || []).map((imgUrl, imgIdx) => (
                                  <div
                                    key={imgIdx}
                                    className="relative group rounded-[8px] overflow-hidden border border-white/[0.10] bg-[#0b0d14] h-24"
                                  >
                                    <img
                                      src={imgUrl}
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
        )}

        {/* TAB 2: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-[#eef0f5]">Certifications</h2>
                <p className="text-sm text-[#a3a9b8]">
                  Manage Coursera, Credly, and LinkedIn Learning credentials
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCertification}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
              >
                <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                Add certification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.certifications.map((cert, idx) => {
                const isEditing = editingCertId === cert.id;
                return (
                  <div
                    key={cert.id}
                    className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-mono tabular-nums text-xs text-[#7a8296] mb-1">
                            {formatSignatureId('CERT', idx)} · {cert.issuer} · {cert.date}
                          </div>
                          <h3 className="font-medium text-[#eef0f5] text-sm">{cert.title}</h3>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingCertId(isEditing ? null : cert.id)}
                            className="p-2 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#a3a9b8] transition-colors duration-150"
                            title="Edit certification"
                          >
                            <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCertification(cert.id)}
                            className="p-2 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#e5484d] transition-colors duration-150"
                            title="Delete certification"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">Title</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) =>
                              handleUpdateCertification(cert.id, { title: e.target.value })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">Issuer</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) =>
                              handleUpdateCertification(cert.id, { issuer: e.target.value })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">Issued date</label>
                          <input
                            type="text"
                            value={cert.date}
                            onChange={(e) =>
                              handleUpdateCertification(cert.id, { date: e.target.value })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">Category</label>
                          <select
                            value={cert.category}
                            onChange={(e) =>
                              handleUpdateCertification(cert.id, {
                                category: e.target.value as CertificationItem['category'],
                              })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          >
                            <option value="ml">Machine Learning (ml)</option>
                            <option value="data">Data Science (data)</option>
                            <option value="dev">Development (dev)</option>
                            <option value="cybersecurity">Cybersecurity</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">
                            Verification provider
                          </label>
                          <select
                            value={cert.verification.type}
                            onChange={(e) =>
                              handleUpdateCertification(cert.id, {
                                verification: {
                                  ...cert.verification,
                                  type: e.target.value as 'coursera' | 'credly' | 'linkedin',
                                },
                              })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          >
                            <option value="coursera">Coursera</option>
                            <option value="credly">Credly</option>
                            <option value="linkedin">LinkedIn Learning</option>
                          </select>
                        </div>
                        {isEditing && (
                          <>
                            <div className="sm:col-span-2">
                              <label className="block text-xs text-[#a3a9b8] mb-1.5">
                                Description
                              </label>
                              <input
                                type="text"
                                value={cert.description}
                                onChange={(e) =>
                                  handleUpdateCertification(cert.id, {
                                    description: e.target.value,
                                  })
                                }
                                className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs text-[#a3a9b8] mb-1.5">
                                Credential verification URL
                              </label>
                              <input
                                type="text"
                                value={cert.verification.url}
                                onChange={(e) =>
                                  handleUpdateCertification(cert.id, {
                                    verification: {
                                      ...cert.verification,
                                      url: e.target.value,
                                    },
                                  })
                                }
                                className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs text-[#a3a9b8] mb-1.5">
                                Credential ID (optional)
                              </label>
                              <input
                                type="text"
                                value={cert.verification.id || ''}
                                onChange={(e) =>
                                  handleUpdateCertification(cert.id, {
                                    verification: {
                                      ...cert.verification,
                                      id: e.target.value || undefined,
                                    },
                                  })
                                }
                                className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-sm text-[#eef0f5]"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: RECOMMENDATIONS (LINKEDIN) */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-[#eef0f5]">LinkedIn recommendations</h2>
                <p className="text-sm text-[#a3a9b8]">
                  Upload colleague avatar photos or generate automatic initials avatars
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
              >
                <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                Add recommendation
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {data.testimonials.map((rec, index) => {
                const avatarFieldId = `rec-img-${rec.id}`;
                const isUploadingAvatar = uploadingField === avatarFieldId;
                return (
                  <div
                    key={rec.id}
                    className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 flex flex-col lg:flex-row gap-6"
                  >
                    {/* Live Card Preview */}
                    <div className="w-full lg:w-80 shrink-0 bg-[#0b0d14]/80 border border-white/[0.10] rounded-[8px] p-5 flex flex-col justify-between min-h-[192px]">
                      <div>
                        <div className="font-mono tabular-nums text-xs text-[#7a8296] mb-2">
                          {formatSignatureId('REC', index)}
                        </div>
                        <p className="text-xs text-[#a3a9b8] line-clamp-4 mb-4">
                          {rec.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.10]">
                        <img
                          src={rec.image}
                          alt={rec.author}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = generateInitialsAvatar(
                              rec.author
                            );
                          }}
                          className="w-10 h-10 rounded-full object-cover border border-white/[0.10] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-[#eef0f5] truncate">
                            {rec.author}
                          </h4>
                          <p className="text-xs text-[#7a8296] truncate">{rec.position}</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.10] pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium cursor-pointer transition-colors duration-150">
                            <Upload className="w-3.5 h-3.5 text-[#0b0d14]" strokeWidth={1.5} />
                            <span>
                              {isUploadingAvatar ? 'Uploading...' : 'Upload avatar photo'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(
                                  avatarFieldId,
                                  e.target.files?.[0],
                                  (url) => handleUpdateTestimonial(rec.id, { image: url }),
                                  300,
                                  `avatar-${rec.author}`
                                )
                              }
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateTestimonial(rec.id, {
                                image: generateInitialsAvatar(rec.author),
                              })
                            }
                            className="inline-flex items-center gap-2 h-8 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#eef0f5] transition-colors duration-150"
                          >
                            <UserCheck className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                            Use initials avatar
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(rec.id)}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#e5484d] transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4 text-[#e5484d]" strokeWidth={1.5} />
                          Delete
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">Author name</label>
                          <input
                            type="text"
                            value={rec.author}
                            onChange={(e) =>
                              handleUpdateTestimonial(rec.id, { author: e.target.value })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">
                            Role & company
                          </label>
                          <input
                            type="text"
                            value={rec.position}
                            onChange={(e) =>
                              handleUpdateTestimonial(rec.id, { position: e.target.value })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">
                            Recommendation text
                          </label>
                          <textarea
                            rows={3}
                            value={rec.text}
                            onChange={(e) =>
                              handleUpdateTestimonial(rec.id, { text: e.target.value })
                            }
                            className="w-full bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 py-2 text-sm text-[#eef0f5]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">
                            LinkedIn profile URL
                          </label>
                          <input
                            type="text"
                            value={rec.linkedinUrl}
                            onChange={(e) =>
                              handleUpdateTestimonial(rec.id, {
                                linkedinUrl: e.target.value,
                              })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-[#eef0f5]">Skills</h2>
                <p className="text-sm text-[#a3a9b8]">
                  Adjust proficiency levels, categories, and icon mappings
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
              >
                <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                Add skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.skills.map((skill, idx) => {
                const isEditing = editingSkillId === skill.id;
                const activeSegments = Math.round(skill.level / 5);
                return (
                  <div
                    key={skill.id}
                    className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                          {formatSignatureId('SKL', idx)} · {skill.category}
                        </span>
                        <h3 className="text-sm font-medium text-[#eef0f5]">{skill.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums text-xs text-[#a3a9b8]">
                          {skill.level}%
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingSkillId(isEditing ? null : skill.id)}
                          className="p-1.5 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#a3a9b8] transition-colors duration-150"
                        >
                          <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1.5 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#e5484d] transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* 20-segment hardware digital meter preview */}
                    <div className="space-y-1.5">
                      <div className="flex gap-1 h-2.5">
                        {Array.from({ length: 20 }).map((_, cellIdx) => {
                          const isActive = cellIdx < activeSegments;
                          const isLeadingCell = isActive && cellIdx === activeSegments - 1;
                          return (
                            <div
                              key={cellIdx}
                              className={`flex-1 rounded-[2px] transition-colors duration-150 ${
                                isLeadingCell
                                  ? 'bg-[#4cc38a]'
                                  : isActive
                                  ? 'bg-[#eef0f5]'
                                  : 'bg-[#1a1e28] border border-white/[0.05]'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#7a8296] tabular-nums">
                        <span>00</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs text-[#a3a9b8] mb-1.5">Skill name</label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) =>
                            handleUpdateSkill(skill.id, { name: e.target.value })
                          }
                          className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#a3a9b8] mb-1.5">Category</label>
                        <select
                          value={skill.category}
                          onChange={(e) =>
                            handleUpdateSkill(skill.id, {
                              category: e.target.value as SkillItem['category'],
                            })
                          }
                          className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                        >
                          <option value="Technical">Technical</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="Soft Skills">Soft Skills</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-[#a3a9b8] mb-1.5">
                          Proficiency level ({skill.level}%)
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={skill.level}
                          onChange={(e) =>
                            handleUpdateSkill(skill.id, { level: Number(e.target.value) })
                          }
                          className="w-full accent-[#eef0f5] cursor-pointer"
                        />
                      </div>
                      {isEditing && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a3a9b8] mb-1.5">Icon</label>
                          <select
                            value={skill.icon}
                            onChange={(e) =>
                              handleUpdateSkill(skill.id, { icon: e.target.value })
                            }
                            className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                          >
                            {ICON_OPTIONS.map((iconName) => (
                              <option key={iconName} value={iconName}>
                                {iconName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: HERO, RESUME & FAVICON */}
        {activeTab === 'hero' && (
          <div className="max-w-3xl bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-[#eef0f5]">Hero, profile photo, resume & favicon</h2>
              <p className="text-sm text-[#a3a9b8]">
                Upload your profile photo, site favicon, and resume PDF directly from your computer (paths under <code className="font-mono text-xs text-[#eef0f5]">/uploads/</code> are created automatically)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#a3a9b8] mb-1.5">
                  Name or greeting line
                </label>
                <input
                  type="text"
                  value={data.hero.greeting}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, greeting: e.target.value },
                    }))
                  }
                  className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#a3a9b8] mb-1.5">
                  Primary role title
                </label>
                <input
                  type="text"
                  value={data.hero.title}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value },
                    }))
                  }
                  className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-[#a3a9b8] mb-1.5">
                  Hero subtitle
                </label>
                <textarea
                  rows={3}
                  value={data.hero.subtitle}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value },
                    }))
                  }
                  className="w-full bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 py-2 text-sm text-[#eef0f5]"
                />
              </div>

              {/* Upload-First Profile Photo */}
              <div className="sm:col-span-2 bg-[#0b0d14]/60 border border-white/[0.08] rounded-[10px] p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={data.hero.profileImage}
                    alt="Profile preview"
                    className="w-12 h-12 rounded-[10px] object-cover border border-white/[0.10] bg-[#1a1e28]"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#eef0f5]">Hero profile photo</div>
                    <div className="font-mono text-xs text-[#7a8296]">
                      {lastAutoPaths['hero-photo'] ||
                        (data.hero.profileImage.startsWith('data:')
                          ? '/uploads/profile-photo.webp'
                          : data.hero.profileImage)}
                    </div>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150">
                  <Upload className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                  <span>
                    {uploadingField === 'hero-photo' ? 'Uploading...' : 'Upload profile photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(
                        'hero-photo',
                        e.target.files?.[0],
                        (url) =>
                          updateData((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, profileImage: url },
                          })),
                        600,
                        'profile-photo'
                      )
                    }
                  />
                </label>
              </div>

              {/* Upload-First Site Favicon */}
              <div className="sm:col-span-2 bg-[#0b0d14]/60 border border-white/[0.08] rounded-[10px] p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={data.hero.faviconUrl || data.hero.profileImage}
                    alt="Favicon preview"
                    className="w-10 h-10 rounded-[8px] object-cover border border-white/[0.10] bg-[#1a1e28]"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#eef0f5]">Browser tab favicon</div>
                    <div className="font-mono text-xs text-[#7a8296]">
                      {lastAutoPaths['hero-favicon'] ||
                        (data.hero.faviconUrl?.startsWith('data:')
                          ? '/uploads/favicon.webp'
                          : data.hero.faviconUrl || '/favicon.png')}
                    </div>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#1a1e28]/80 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#eef0f5] cursor-pointer transition-colors duration-150">
                  <Upload className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                  <span>
                    {uploadingField === 'hero-favicon' ? 'Uploading...' : 'Upload favicon'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(
                        'hero-favicon',
                        e.target.files?.[0],
                        (url) =>
                          updateData((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, faviconUrl: url },
                          })),
                        192,
                        'favicon'
                      )
                    }
                  />
                </label>
              </div>

              {/* Upload-First Resume File + External Link Fallback */}
              <div className="sm:col-span-2 bg-[#0b0d14]/60 border border-white/[0.08] rounded-[10px] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-[#eef0f5]">Resume PDF or external link</div>
                    <div className="font-mono text-xs text-[#7a8296]">
                      {lastAutoPaths['hero-resume'] ||
                        (data.hero.resumeUrl.startsWith('data:')
                          ? '/uploads/sanju-kumar-resume.pdf'
                          : data.hero.resumeUrl)}
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150">
                    <Upload className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                    <span>
                      {uploadingField === 'hero-resume' ? 'Uploading...' : 'Upload resume PDF'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(
                          'hero-resume',
                          e.target.files?.[0],
                          (url) =>
                            updateData((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, resumeUrl: url },
                            })),
                          900,
                          'sanju-kumar-resume'
                        )
                      }
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={
                    data.hero.resumeUrl.startsWith('data:')
                      ? lastAutoPaths['hero-resume'] || '/uploads/sanju-kumar-resume.pdf'
                      : data.hero.resumeUrl
                  }
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, resumeUrl: e.target.value },
                    }))
                  }
                  placeholder="Or paste external resume link (Adobe Acrobat / Google Drive)..."
                  className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#a3a9b8]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#a3a9b8] mb-1.5">
                  LinkedIn profile URL
                </label>
                <input
                  type="text"
                  value={data.hero.linkedinUrl}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, linkedinUrl: e.target.value },
                    }))
                  }
                  className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#a3a9b8] mb-1.5">
                  Credly profile URL
                </label>
                <input
                  type="text"
                  value={data.hero.credlyUrl}
                  onChange={(e) =>
                    updateData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, credlyUrl: e.target.value },
                    }))
                  }
                  className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CHATBOT & AI KNOWLEDGE BASE */}
        {activeTab === 'chatbot' && (
          <div className="space-y-6">
            {/* Chatbot Engine & API Configuration Card */}
            <div className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-[8px] bg-[#1a1e28]/70 border border-white/[0.10] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[#eef0f5]">
                    Chatbot API & response engine
                  </h2>
                  <p className="text-sm text-[#a3a9b8] mt-1">
                    Configure your external RAG endpoint or use the built-in CMS knowledge base + live portfolio data so the assistant always responds immediately even when external servers sleep.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    Assistant display name
                  </label>
                  <input
                    type="text"
                    value={chatbotConfig.assistantName}
                    onChange={(e) =>
                      handleUpdateChatbot({ assistantName: e.target.value })
                    }
                    placeholder="Ask Sanju"
                    className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    Response routing mode
                  </label>
                  <select
                    value={chatbotConfig.mode}
                    onChange={(e) =>
                      handleUpdateChatbot({
                        mode: e.target.value as ChatbotConfig['mode'],
                      })
                    }
                    className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 text-xs text-[#eef0f5]"
                  >
                    <option value="hybrid">
                      Hybrid: External API + CMS Knowledge Base fallback
                    </option>
                    <option value="local_cms">
                      Local CMS Knowledge Base + Live Portfolio Data (Instant)
                    </option>
                    <option value="external_api">External API only</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    External RAG API endpoint URL (POST JSON &#123; query &#125;)
                  </label>
                  <input
                    type="text"
                    value={chatbotConfig.apiUrl}
                    onChange={(e) =>
                      handleUpdateChatbot({ apiUrl: e.target.value })
                    }
                    placeholder="https://flaskragbot-1e1040a057f8.herokuapp.com/api/query"
                    className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    Preset quick-prompt questions (one question per line)
                  </label>
                  <textarea
                    rows={4}
                    value={(chatbotConfig.presetQuestions || []).join('\n')}
                    onChange={(e) =>
                      handleUpdateChatbot({
                        presetQuestions: e.target.value
                          .split('\n')
                          .map((q) => q.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 py-2 text-sm text-[#eef0f5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    Core system context & bio summary
                  </label>
                  <textarea
                    rows={4}
                    value={chatbotConfig.systemContext}
                    onChange={(e) =>
                      handleUpdateChatbot({ systemContext: e.target.value })
                    }
                    className="w-full bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 py-2 text-sm text-[#eef0f5] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Knowledge Base Entries Manager */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-medium text-[#eef0f5]">
                    Knowledge base Q&amp;A entries ({(chatbotConfig.knowledgeEntries || []).length})
                  </h3>
                  <p className="text-xs text-[#a3a9b8]">
                    Stored directly in <code className="font-mono text-[#eef0f5]">portfolioData.json</code> and matched against user questions alongside live Projects, Skills, and Certifications
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddKnowledgeEntry}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
                >
                  <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                  Add knowledge entry
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(chatbotConfig.knowledgeEntries || []).map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/[0.10] pb-3">
                      <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                        {formatSignatureId('KB', idx)} · {entry.topic}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteKnowledgeEntry(entry.id)}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#e5484d] transition-colors duration-150"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#e5484d]" strokeWidth={1.5} />
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#a3a9b8] mb-1.5">
                          Topic title
                        </label>
                        <input
                          type="text"
                          value={entry.topic}
                          onChange={(e) =>
                            handleUpdateKnowledgeEntry(entry.id, {
                              topic: e.target.value,
                            })
                          }
                          className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#a3a9b8] mb-1.5">
                          Trigger keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(entry.keywords || []).join(', ')}
                          onChange={(e) =>
                            handleUpdateKnowledgeEntry(entry.id, {
                              keywords: e.target.value
                                .split(',')
                                .map((k) => k.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="experience, amazon, work, career"
                          className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-[#a3a9b8] mb-1.5">
                          Assistant response
                        </label>
                        <textarea
                          rows={4}
                          value={entry.answer}
                          onChange={(e) =>
                            handleUpdateKnowledgeEntry(entry.id, {
                              answer: e.target.value,
                            })
                          }
                          className="w-full bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 py-2 text-sm text-[#eef0f5] leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PASSWORD & GITHUB VAULT */}
        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dedicated Change Admin Password Card */}
            <div className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-[8px] bg-[#1a1e28]/70 border border-white/[0.10] flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[#eef0f5]">
                    Change admin password
                  </h2>
                  <p className="text-sm text-[#a3a9b8] mt-1">
                    Replace the default <code className="font-mono text-xs text-[#eef0f5]">admin123</code> password with your own custom password. Stored as a salted SHA-256 + PBKDF2 key in your browser.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password (min 4 characters)"
                    className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full h-9 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[8px] px-3 text-sm text-[#eef0f5]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
                >
                  <Lock className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                  Update admin password
                </button>
              </form>
            </div>

            {/* GitHub Fine-Grained PAT Vault Card */}
            <div className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-[8px] bg-[#1a1e28]/70 border border-white/[0.10] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[#eef0f5]">
                    GitHub publishing vault
                  </h2>
                  <p className="text-sm text-[#a3a9b8] mt-1">
                    Your GitHub Fine-Grained PAT is encrypted with <code className="font-mono text-xs text-[#eef0f5]">AES-GCM (256-bit)</code> using your admin password so you can commit directly to GitHub.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveVault} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#a3a9b8] mb-1.5">
                      Target GitHub repository
                    </label>
                    <input
                      type="text"
                      value={repoSlug}
                      onChange={(e) => setRepoSlug(e.target.value)}
                      placeholder="mightysanju/portfolio-2024"
                      className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#a3a9b8] mb-1.5">
                      Target branch
                    </label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      placeholder="main"
                      className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 font-mono text-xs text-[#eef0f5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#a3a9b8] mb-1.5">
                    GitHub Fine-Grained PAT (Contents: Read & write on {repoSlug})
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="github_pat_..."
                      className="w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] rounded-[8px] px-3 pr-10 font-mono text-xs text-[#eef0f5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150"
                    >
                      {showToken ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-[#7a8296] font-mono tabular-nums">
                    {vaultMeta.exists ? (
                      <span className="text-[#4cc38a]">
                        Vault active
                        {vaultMeta.updatedAt
                          ? ` (${new Date(vaultMeta.updatedAt).toLocaleTimeString()})`
                          : ''}
                      </span>
                    ) : (
                      <span>Default password active</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
                  >
                    <Shield className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                    Encrypt & save GitHub token
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
