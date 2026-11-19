import React, { useState } from 'react';
import {
  usePortfolio,
  getVaultMetadata,
  REPO_CONFIG_STORAGE_KEY,
} from '../../context/PortfolioContext';
import { AdminAuthGate } from './AdminAuthGate';
import { AdminHeader } from './AdminHeader';
import { HeroTab } from './HeroTab';
import { ProjectsTab } from './ProjectsTab';
import { CertificationsTab } from './CertificationsTab';
import { TestimonialsTab } from './TestimonialsTab';
import { SkillsTab } from './SkillsTab';
import { ChatbotTab } from './ChatbotTab';
import { VaultTab } from './VaultTab';
import { SiteChromeTab } from './SiteChromeTab';
import { SectionsContactTab } from './SectionsContactTab';
import { AboutTab } from './AboutTab';
import { StandalonePagesTab } from './StandalonePagesTab';
import { TabKey } from './adminStyles';
import { 
  FolderGit2, Award, MessageSquareQuote, Cpu, UserCheck, Bot, 
  KeyRound, Layout, BookOpen, Info, FileText 
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    data, 
    hasUnsavedChanges, 
    queuedUploads, 
    saveDraftLocally, 
    resetToDefault, 
    commitToGitHub,
  } = usePortfolio();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [sessionPassword, setSessionPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [commitMessage, setCommitMessage] = useState('chore(cms): update portfolioData.json');
  const [isCommitting, setIsCommitting] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    commitUrl?: string;
  } | null>(null);

  if (!isUnlocked) {
    return (
      <AdminAuthGate
        vaultExists={getVaultMetadata().exists}
        onUnlockSuccess={(password, token) => {
          setSessionPassword(password);
          setGithubToken(token);
          setIsUnlocked(true);
        }}
      />
    );
  }

  const handleExportJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolioData.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatusBanner({ type: 'info', text: 'Downloaded portfolioData.json' });
  };

  const handleCommitPush = async () => {
    if (!githubToken.trim()) {
      setStatusBanner({
        type: 'error',
        text: 'No GitHub token available. Save a Personal Access Token in the Security & GitHub tab first.',
      });
      return;
    }
    let repo: string | undefined;
    let branch: string | undefined;
    try {
      const raw = localStorage.getItem(REPO_CONFIG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { repo?: string; branch?: string };
        if (parsed.repo?.trim()) repo = parsed.repo.trim();
        if (parsed.branch?.trim()) branch = parsed.branch.trim();
      }
    } catch {
      // fall back to defaults
    }
    setIsCommitting(true);
    setStatusBanner({ type: 'info', text: 'Publishing to GitHub...' });
    try {
      const result = await commitToGitHub({
        token: githubToken,
        repo,
        branch,
        message: commitMessage.trim() || undefined,
      });
      setStatusBanner({
        type: result.success ? 'success' : 'error',
        text: result.message,
        commitUrl: result.commitUrl,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Publish failed',
      });
    } finally {
      setIsCommitting(false);
    }
  };

  const tabs: { id: TabKey; label: string; count: number | null; icon: React.ElementType }[] = [
    { id: 'hero', label: 'Hero, resume & favicon', count: null, icon: UserCheck },
    { id: 'projects', label: 'Projects & blogs', count: data.projects.length, icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', count: data.certifications.length, icon: Award },
    { id: 'testimonials', label: 'Recommendations', count: data.testimonials.length, icon: MessageSquareQuote },
    { id: 'skills', label: 'Skills', count: data.skills.length, icon: Cpu },
    { id: 'site', label: 'Site Chrome', count: null, icon: Layout },
    { id: 'sections', label: 'Sections & Contact', count: null, icon: Info },
    { id: 'about', label: 'About Page', count: null, icon: FileText },
    { id: 'pages', label: 'Standalone Pages', count: null, icon: BookOpen },
    { id: 'chatbot', label: 'Chatbot', count: data.chatbot?.knowledgeEntries.length || 0, icon: Bot },
    { id: 'vault', label: 'Security & GitHub', count: null, icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5] pb-24">
      <AdminHeader 
        hasUnsavedChanges={hasUnsavedChanges}
        queuedUploadCount={Object.keys(queuedUploads).length}
        commitMessage={commitMessage}
        onCommitMessageChange={setCommitMessage}
        onSaveDraft={saveDraftLocally}
        onExportJson={handleExportJson}
        onReset={resetToDefault}
        onCommitPush={handleCommitPush}
        isCommitting={isCommitting}
        statusBanner={statusBanner}
        onDismissBanner={() => setStatusBanner(null)}
      />
      
      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-wrap gap-1 mb-8 bg-[#11141c]/75 backdrop-blur-xl p-1.5 rounded-[12px] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] text-xs font-medium transition-colors duration-150 ${
                  active ? 'bg-[#1a1e28]/90 text-[#eef0f5] border border-white/[0.10]' : 'text-[#a3a9b8] hover:text-[#eef0f5]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'hero' && <HeroTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'certifications' && <CertificationsTab />}
        {activeTab === 'testimonials' && <TestimonialsTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'site' && <SiteChromeTab />}
        {activeTab === 'sections' && <SectionsContactTab />}
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'pages' && <StandalonePagesTab />}
        {activeTab === 'chatbot' && <ChatbotTab />}
        {activeTab === 'vault' && <VaultTab
          password={sessionPassword}
          token={githubToken}
          onTokenSaved={setGithubToken}
          onPasswordChanged={setSessionPassword}
        />}
      </main>
    </div>
  );
};
