import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import defaultPortfolioData from '../data/portfolioData.json';
import {
  StagedUploadItem,
  slugify,
  bufferToBase64,
  base64ToUint8Array,
  compressImageFileToDataUrl,
  fileToDataUrl,
  prepareAssetPayload,
  stageAsset,
  hydrateStagedAssets,
  resolveStagedAssetUrl,
  revokeAndRemoveStagedAssets,
  clearAllStagedAssets,
  revokeAllRuntimeObjectUrls,
  collectReferencedRepoAssetPaths,
  buildGitHubPublishPlan,
  publishPlanToGitHub,
} from '../utils/assetManager';

export {
  slugify,
  compressImageFileToDataUrl,
  fileToDataUrl,
  collectReferencedRepoAssetPaths,
  buildGitHubPublishPlan,
};

export interface AttachmentItem {
  id: string;
  label: string;
  url: string;
  fileName?: string;
  mimeType?: string;
}

export interface HeroData {
  greeting: string;
  title: string;
  subtitle: string;
  resumeUrl: string;
  profileImage: string;
  faviconUrl?: string;
  linkedinUrl: string;
  credlyUrl: string;
  linkedinCertsUrl?: string;
  statusBadge?: string;
  profileCardName?: string;
  profileCardSubtitle?: string;
  profileCardId?: string;
  resumeButtonLabel?: string;
  aboutButtonLabel?: string;
  linkedinButtonLabel?: string;
  shippedSystemsTitle?: string;
  shippedSystemsFooterStack?: string;
  shippedSystemsFooterStatus?: string;
  shippedSystemProjectIds?: string[];
}

export interface TestimonialItem {
  id: string;
  text: string;
  author: string;
  position: string;
  image: string;
  linkedinUrl: string;
}

export interface ProjectBlogContent {
  subtitle?: string;
  readTime?: string;
  date?: string;
  body: string;
  highlights?: string[];
  images?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demo: string;
  github: string;
  blog: string;
  blogContent?: ProjectBlogContent;
  attachments?: AttachmentItem[];
}

export interface CertificationVerification {
  type: 'coursera' | 'credly' | 'linkedin';
  url: string;
  id?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  category: 'ml' | 'data' | 'dev' | 'cybersecurity';
  verification: CertificationVerification;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
  category: 'Technical' | 'Cybersecurity' | 'Soft Skills';
  icon: string;
  color: string;
}

export interface ChatbotKnowledgeEntry {
  id: string;
  topic: string;
  keywords: string[];
  answer: string;
}

export interface ChatbotConfig {
  assistantName: string;
  apiUrl: string;
  mode: 'hybrid' | 'local_cms' | 'external_api';
  presetQuestions: string[];
  systemContext: string;
  knowledgeEntries: ChatbotKnowledgeEntry[];
}

export interface SiteSeoSettings {
  title: string;
  description: string;
  keywords: string;
  author: string;
  ogImage: string;
}

export interface NavMenuItem {
  label: string;
  href: string;
}

export interface SocialLinkItem {
  id: string;
  label: string;
  href: string;
}

export interface SiteNavbarSettings {
  brandName: string;
  roleTag: string;
  logoImage: string;
  adminLabel: string;
  navItems: NavMenuItem[];
  socialLinks: SocialLinkItem[];
}

export interface SiteFooterSettings {
  logoImage: string;
  brandName: string;
  roleText: string;
  copyrightText: string;
  attributionText: string;
  attributionUrl: string;
  adminLabel: string;
  socialLinks: SocialLinkItem[];
}

export interface SiteSettings {
  seo: SiteSeoSettings;
  navbar: SiteNavbarSettings;
  footer: SiteFooterSettings;
}

export interface SkillsSectionMeta {
  eyebrow: string;
  title: string;
  description: string;
  allFilterLabel: string;
  techStackEyebrow: string;
  techStackTitle: string;
  techStackEmptyText: string;
}

export interface CertificationsSectionMeta {
  eyebrow: string;
  title: string;
  description: string;
  allLabel: string;
  credlyLabel: string;
  linkedinLabel: string;
}

export interface ProjectsSectionMeta {
  eyebrow: string;
  title: string;
  description: string;
  allTagLabel: string;
  demoLabel: string;
  codeLabel: string;
  blogLabel: string;
}

export interface ContactSectionMeta {
  eyebrow: string;
  title: string;
  description: string;
  directChannelsTitle: string;
  email: string;
  phone: string;
  location: string;
  formspreeUrl: string;
  nameLabel: string;
  emailLabel: string;
  inquiryLabel: string;
  recruiterLabel: string;
  generalLabel: string;
  messageLabel: string;
  submitLabel: string;
  sendingLabel: string;
  sentMessage: string;
  errorMessage: string;
}

export interface ChatbotUiMeta {
  subtitle: string;
  emptyPrompt: string;
  thinkingLabel: string;
  inputPlaceholder: string;
  unreachableError: string;
}

export interface BlogLayoutMeta {
  backLabel: string;
  demoLabel: string;
  codeLabel: string;
}

export interface SectionsMeta {
  skills: SkillsSectionMeta;
  certifications: CertificationsSectionMeta;
  projects: ProjectsSectionMeta;
  contact: ContactSectionMeta;
  chatbotUi: ChatbotUiMeta;
  blogLayout: BlogLayoutMeta;
}

export interface AboutSectionTitles {
  education: string;
  experience: string;
  domainStack: string;
  technicalLabel: string;
  mlLabel: string;
  softLabel: string;
  strengths: string;
  improvements: string;
  interests: string;
}

export interface AboutEducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
  description: string;
  courses: string[];
  gpa?: string;
  achievements?: string[];
}

export interface AboutExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
  technologies: string[];
}

export interface AboutStrengthItem {
  title: string;
  description: string;
}

export interface AboutImprovementItem {
  area: string;
  plan: string;
}

export interface AboutPageData {
  metaTitle: string;
  metaDescription: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  profileImage?: string;
  resumeAttachmentLabel?: string;
  attachments?: AttachmentItem[];
  sectionTitles: AboutSectionTitles;
  education: AboutEducationItem[];
  experience: AboutExperienceItem[];
  skills: {
    technical: string[];
    ml: string[];
    soft: string[];
  };
  strengths: AboutStrengthItem[];
  areasOfImprovement: AboutImprovementItem[];
  interests: string[];
}

export interface AtsPageData {
  metaTitle: string;
  metaDescription: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  uploadCardTitle: string;
  uploadFormatsHint: string;
  dropzonePrompt: string;
  localNote: string;
  statusLabel: string;
  jdCardTitle: string;
  jdPlaceholder: string;
  analyzeButtonLabel: string;
  analyzingButtonLabel: string;
  resultsEyebrow: string;
  overallScoreLabel: string;
  matchedKeywordsTitle: string;
  missingKeywordsTitle: string;
  recommendationsTitle: string;
  attachments?: AttachmentItem[];
}

export interface BlogNarrativeSection {
  heading: string;
  paragraphs: string[];
}

export interface NetworkappChartDatum {
  name: string;
  Manual: number;
  NetworkApp: number;
}

export interface NetworkappPageData {
  metaTitle: string;
  metaDescription: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  githubLink?: string;
  demoLink?: string;
  sections: BlogNarrativeSection[];
  chartTitle: string;
  chartSubtitle: string;
  chartSpeedupLabel: string;
  chartReductionLabel: string;
  chartData: NetworkappChartDatum[];
  pilotTableTitle: string;
  pilotHeaders: string[];
  pilotRows: string[][];
  roadmapTitle: string;
  roadmapItems: string[];
  attachments?: AttachmentItem[];
}

export interface DdoMetricItem {
  label: string;
  value: string;
  detail: string;
}

export interface DdoStakeholderItem {
  name: string;
  role: string;
  company: string;
  linkedinUrl: string;
  image: string;
  contribution: string;
}

export interface DdoPageData {
  metaTitle: string;
  metaDescription: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  githubLink: string;
  demoLink?: string;
  sections: BlogNarrativeSection[];
  metrics: DdoMetricItem[];
  stakeholdersTitle: string;
  stakeholders: DdoStakeholderItem[];
  attachments?: AttachmentItem[];
}

export interface AtsBlogPageData {
  metaTitle: string;
  metaDescription: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  demoLink: string;
  githubLink: string;
  sections: BlogNarrativeSection[];
  capabilitiesTitle: string;
  capabilities: string[];
  attachments?: AttachmentItem[];
}

export interface ChartSeriesPoint {
  label: string;
  value: number;
}

export interface LinkedinnPageData {
  metaTitle: string;
  metaDescription: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  demoLink: string;
  githubLink: string;
  youtubeId: string;
  paypalClientId: string;
  paypalPlanId: string;
  supportTitle: string;
  supportDescription: string;
  chartTitle: string;
  beforeData: ChartSeriesPoint[];
  afterData: ChartSeriesPoint[];
  sections: BlogNarrativeSection[];
  impactTitle: string;
  impactItems: string[];
  attachments?: AttachmentItem[];
}

export interface LinkedInnMockJob {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt: string;
  applicants: string;
  url: string;
}

export interface LinkedInnDemoPageData {
  metaTitle: string;
  metaDescription: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  jobTitleOptions: string[];
  applicantFilterOptions: string[];
  defaultJobTitle: string;
  defaultLocation: string;
  defaultTimeFilterMinutes: number;
  apiBaseUrl: string;
  corsProxyUrl: string;
  contactEmail: string;
  contactPrompt: string;
  searchButtonLabel: string;
  mockJobs: LinkedInnMockJob[];
  attachments?: AttachmentItem[];
}

export interface StandalonePagesData {
  networkapp: NetworkappPageData;
  ddo: DdoPageData;
  atsBlog: AtsBlogPageData;
  linkedinn: LinkedinnPageData;
  linkedInnDemo: LinkedInnDemoPageData;
}

export interface PortfolioData {
  hero: HeroData;
  testimonials: TestimonialItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  skills: SkillItem[];
  chatbot?: ChatbotConfig;
  site?: SiteSettings;
  sections?: SectionsMeta;
  aboutPage?: AboutPageData;
  atsPage?: AtsPageData;
  standalonePages?: StandalonePagesData;
}

export type NormalizedPortfolioData = PortfolioData &
  Required<
    Pick<
      PortfolioData,
      'chatbot' | 'site' | 'sections' | 'aboutPage' | 'atsPage' | 'standalonePages'
    >
  >;

export interface CommitToGitHubOptions {
  token: string;
  repo?: string;
  branch?: string;
  message?: string;
}

export interface CommitToGitHubResult {
  success: boolean;
  commitUrl?: string;
  message: string;
}

export interface UploadAssetOptions {
  file: File;
  token?: string;
  repo?: string;
  branch?: string;
  maxWidth?: number;
  customSlug?: string;
}

export interface UploadAssetResult {
  success: boolean;
  url: string;
  publicPath: string;
  previewUrl: string;
  message: string;
  error?: string;
}

export type QueuedUploadItem = StagedUploadItem;

export interface PortfolioContextType {
  data: NormalizedPortfolioData;
  updateData: (
    updater: PortfolioData | ((prev: NormalizedPortfolioData) => PortfolioData)
  ) => void;
  saveDraftLocally: () => void;
  resetToDefault: () => void;
  hasUnsavedChanges: boolean;
  isSyncingRemote: boolean;
  commitToGitHub: (options: CommitToGitHubOptions) => Promise<CommitToGitHubResult>;
  uploadAsset: {
    (options: UploadAssetOptions): Promise<UploadAssetResult>;
    (file: File, customSlug?: string): Promise<UploadAssetResult>;
  };
  queuedUploads: Record<string, QueuedUploadItem>;
  resolveAssetUrl: (url?: string) => string;
}

const STORAGE_KEY = 'portfolio_cms_data_v1';
const UPLOADS_STORAGE_KEY = 'portfolio_cms_uploads_v1';
export const VAULT_STORAGE_KEY = 'portfolio_admin_vault_v1';
export const REPO_CONFIG_STORAGE_KEY = 'portfolio_admin_repo_config_v1';

const DEFAULT_GITHUB_REPO = 'mightysanju/portfolio-2024';
const DEFAULT_GITHUB_BRANCH = 'main';

export function getRemoteRawDataUrl(): string {
  const metaEnv = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  ).env;
  const processEnv = (
    globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;
  const readEnv = (key: string): string | undefined =>
    metaEnv?.[key] ?? processEnv?.[key];

  const explicitUrl = readEnv('VITE_CMS_REMOTE_URL')?.trim();
  if (explicitUrl) return explicitUrl;

  let repo = readEnv('VITE_GITHUB_REPO')?.trim() || DEFAULT_GITHUB_REPO;
  let branch = readEnv('VITE_GITHUB_BRANCH')?.trim() || DEFAULT_GITHUB_BRANCH;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(REPO_CONFIG_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isPlainObject(parsed)) {
          if (typeof parsed.repo === 'string') {
            const candidateRepo = parsed.repo.trim();
            if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(candidateRepo)) {
              const [owner, name] = candidateRepo.split('/');
              if (
                owner &&
                name &&
                owner !== '.' &&
                name !== '.' &&
                !owner.includes('..') &&
                !name.includes('..')
              ) {
                repo = candidateRepo;
              }
            }
          }
          if (typeof parsed.branch === 'string') {
            const candidateBranch = parsed.branch.trim();
            if (
              candidateBranch.length > 0 &&
              candidateBranch !== '.' &&
              !candidateBranch.startsWith('./') &&
              !candidateBranch.startsWith('/') &&
              !candidateBranch.endsWith('/') &&
              !candidateBranch.includes('..') &&
              !candidateBranch.includes('//') &&
              !candidateBranch.includes('\\') &&
              !candidateBranch.includes('?') &&
              !candidateBranch.includes('#') &&
              !candidateBranch.split('/').some((seg) => seg === '.')
            ) {
              branch = candidateBranch;
            }
          }
        }
      }
    } catch {
      // Ignore malformed stored repo config
    }
  }

  return `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(branch)}/src/data/portfolioData.json`;
}

export interface EncryptedVaultPayload {
  salt: string;
  iv: string;
  ciphertext: string;
  passwordHash: string;
  updatedAt: string;
}

async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 120000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function hashAdminPassword(
  password: string,
  saltBase64?: string
): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const salt = saltBase64
    ? base64ToUint8Array(saltBase64)
    : window.crypto.getRandomValues(new Uint8Array(16));
  const combined = new Uint8Array(salt.length + enc.encode(password).length);
  combined.set(salt, 0);
  combined.set(enc.encode(password), salt.length);
  const digest = await window.crypto.subtle.digest('SHA-256', combined);
  return {
    hash: bufferToBase64(digest),
    salt: bufferToBase64(salt),
  };
}

export async function encryptTokenToVault(
  password: string,
  githubToken: string
): Promise<EncryptedVaultPayload> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const cleanToken = githubToken.trim();
  let ciphertextBase64 = '';
  if (cleanToken) {
    const key = await deriveAesKey(password, salt);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      enc.encode(cleanToken)
    );
    ciphertextBase64 = bufferToBase64(encrypted);
  }
  const { hash } = await hashAdminPassword(password, bufferToBase64(salt));
  const payload: EncryptedVaultPayload = {
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    ciphertext: ciphertextBase64,
    passwordHash: hash,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export async function decryptTokenFromVault(
  password: string
): Promise<{ validPassword: boolean; token: string }> {
  const raw = localStorage.getItem(VAULT_STORAGE_KEY);
  if (!raw) {
    return { validPassword: password === 'admin123', token: '' };
  }
  try {
    const payload: EncryptedVaultPayload = JSON.parse(raw);
    const { hash } = await hashAdminPassword(password, payload.salt);
    if (hash !== payload.passwordHash) {
      return { validPassword: false, token: '' };
    }
    if (!payload.ciphertext) {
      return { validPassword: true, token: '' };
    }
    const salt = base64ToUint8Array(payload.salt);
    const iv = base64ToUint8Array(payload.iv);
    const ciphertext = base64ToUint8Array(payload.ciphertext);
    const key = await deriveAesKey(password, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      ciphertext as unknown as BufferSource
    );
    const dec = new TextDecoder();
    return { validPassword: true, token: dec.decode(decrypted) };
  } catch {
    return { validPassword: false, token: '' };
  }
}

export function getVaultMetadata(): {
  exists: boolean;
  hasToken: boolean;
  updatedAt?: string;
} {
  const raw = localStorage.getItem(VAULT_STORAGE_KEY);
  if (!raw) return { exists: false, hasToken: false };
  try {
    const parsed: EncryptedVaultPayload = JSON.parse(raw);
    return {
      exists: true,
      hasToken: Boolean(parsed.ciphertext),
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return { exists: false, hasToken: false };
  }
}

const DANGEROUS_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    value === Object.prototype
  ) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as unknown as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (DANGEROUS_OBJECT_KEYS.has(k)) continue;
      out[k] = deepClone(v);
    }
    return out as T;
  }
  return value;
}

function isAllowedJsonPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

function deepMergeObjects<T extends Record<string, unknown>>(
  defaults: T,
  partial: Record<string, unknown>
): T {
  const result: Record<string, unknown> = deepClone(defaults);
  for (const [key, val] of Object.entries(partial)) {
    if (DANGEROUS_OBJECT_KEYS.has(key)) continue;
    if (val === undefined) continue;
    const defVal = result[key];
    if (Array.isArray(defVal)) {
      if (Array.isArray(val)) {
        if (defVal.length > 0 && defVal.every((item) => isPlainObject(item))) {
          result[key] = val
            .filter((item): item is Record<string, unknown> => isPlainObject(item))
            .map((item) => deepClone(item));
        } else if (defVal.length > 0 && defVal.every((item) => typeof item === 'string')) {
          result[key] = val.filter((item): item is string => typeof item === 'string');
        } else {
          result[key] = deepClone(val);
        }
      }
    } else if (isPlainObject(defVal)) {
      if (isPlainObject(val)) {
        result[key] = deepMergeObjects(defVal, val);
      }
    } else if (defVal === null || defVal === undefined) {
      if (
        val === null ||
        isAllowedJsonPrimitive(val) ||
        Array.isArray(val) ||
        isPlainObject(val)
      ) {
        result[key] = deepClone(val);
      }
    } else if (typeof val === typeof defVal && isAllowedJsonPrimitive(val)) {
      result[key] = val;
    }
  }
  return result as T;
}

export function mergePortfolioData(
  defaults: NormalizedPortfolioData,
  partial: Partial<PortfolioData> | unknown
): NormalizedPortfolioData {
  if (!isPlainObject(partial)) {
    return deepClone(defaults);
  }
  return deepMergeObjects(
    defaults as unknown as Record<string, unknown>,
    partial
  ) as unknown as NormalizedPortfolioData;
}

const STATIC_DEFAULT_PORTFOLIO_DATA: NormalizedPortfolioData = {
  hero: {
    greeting: 'Sanju Kumar',
    title: 'Data Scientist & ML Engineer',
    subtitle:
      'Building machine learning pipelines, statistical models, and production automation for supply chain and network operations',
    resumeUrl:
      'https://acrobat.adobe.com/id/urn:aaid:sc:AP:c816e211-3b4d-43d3-826d-cfc17d4011e4',
    profileImage: '/favicon.png',
    faviconUrl: '/favicon.png',
    linkedinUrl: 'https://linkedin.com/in/mightysanju/',
    credlyUrl: 'https://www.credly.com/users/sanju-kumar.671f31d3',
    linkedinCertsUrl: 'https://www.linkedin.com/in/mightysanju/details/certifications/',
    statusBadge: 'Naperville, IL · Data Science & ML Engineering',
    profileCardName: 'Sanju Kumar',
    profileCardSubtitle: 'Supply Chain Analytics · ML Systems',
    profileCardId: 'ID: SK-2024 · ACTIVE',
    resumeButtonLabel: 'Download resume',
    aboutButtonLabel: 'About',
    linkedinButtonLabel: 'LinkedIn',
    shippedSystemsTitle: 'SHIPPED_SYSTEMS',
    shippedSystemsFooterStack: 'STACK: PYTHON · SQL · TENSORFLOW',
    shippedSystemsFooterStatus: 'VERIFIED',
    shippedSystemProjectIds: ['proj-1', 'proj-2', 'proj-3', 'proj-4'],
  },
  testimonials: [],
  projects: [],
  certifications: [],
  skills: [],
  chatbot: {
    assistantName: 'Ask Sanju',
    apiUrl: 'https://flaskragbot-1e1040a057f8.herokuapp.com/api/query',
    mode: 'hybrid',
    presetQuestions: [
      'Tell me about your experience',
      'What are your key skills?',
      'How can we collaborate?',
      'Tell me about yourself',
    ],
    systemContext: '',
    knowledgeEntries: [],
  },
  site: {
    seo: {
      title: 'SANJU KUMAR | Data Scientist & ML Engineer',
      description:
        'Expert Data Scientist and ML Engineer specializing in AI, Machine Learning, and Data Engineering. View my certifications, projects, and skills.',
      keywords:
        'DDO tool, sanju, sanju kumar, data scientist, machine learning engineer, AI, deep learning, python, data engineering, AWS, Azure, TensorFlow, computer vision, NLP',
      author: 'Sanju Kumar',
      ogImage: 'https://i.imgur.com/e9T4kwI.png',
    },
    navbar: {
      brandName: 'Sanju Kumar',
      roleTag: 'DS / ML',
      logoImage: '/favicon.png',
      adminLabel: 'Admin',
      navItems: [
        { label: 'Home', href: '#home' },
        { label: 'Skills', href: '#skills' },
        { label: 'Certifications', href: '#certifications' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
      ],
      socialLinks: [
        { id: 'github', label: 'GitHub', href: 'https://github.com/mightysanju' },
        { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/mightysanju' },
        { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/@sanjukumar' },
        { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/mightysanju3' },
        { id: 'email', label: 'Email', href: 'mailto:sanju.k3r+portfolio@gmail.com' },
      ],
    },
    footer: {
      logoImage: '/favicon.png',
      brandName: 'Sanju Kumar',
      roleText: 'Data Scientist & ML Engineer',
      copyrightText: '© 2026',
      attributionText: 'Unslopped with unslop by @heydamir (CC BY 4.0)',
      attributionUrl: '',
      adminLabel: 'Admin',
      socialLinks: [
        { id: 'github', label: 'GitHub', href: 'https://github.com/mightysanju' },
        { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/mightysanju' },
        { id: 'email', label: 'Email', href: 'mailto:sanju.k3r+portfolio@gmail.com' },
      ],
    },
  },
  sections: {
    skills: {
      eyebrow: '01 / Capabilities',
      title: 'Technical skills',
      description:
        'Applied proficiency across data science, process automation, security frameworks, and operational tooling.',
      allFilterLabel: 'All skills',
      techStackEyebrow: 'PROJECT_STACK_UNION',
      techStackTitle: 'Tech stack across projects',
      techStackEmptyText: 'No project tags configured yet.',
    },
    certifications: {
      eyebrow: '02 / Credentials',
      title: 'Certifications',
      description:
        'Verified credentials across machine learning, data science, software development, and security compliance.',
      allLabel: 'All credentials',
      credlyLabel: 'Credly profile',
      linkedinLabel: 'LinkedIn credentials',
    },
    projects: {
      eyebrow: '03 / Selected work',
      title: 'Featured projects',
      description:
        'Production tools, machine learning applications, and workflow automation systems.',
      allTagLabel: 'All',
      demoLabel: 'Demo',
      codeLabel: 'Code',
      blogLabel: 'Blog',
    },
    contact: {
      eyebrow: '04 / Contact',
      title: 'Get in touch',
      description:
        'Direct inquiries for engineering roles, consulting, or technical collaboration.',
      directChannelsTitle: 'Direct channels',
      email: 'sanju.k3r@gmail.com',
      phone: '224 702 6736',
      location: 'Naperville, IL',
      formspreeUrl: 'https://formspree.io/f/manyjkkr',
      nameLabel: 'Name',
      emailLabel: 'Email',
      inquiryLabel: 'Inquiry type',
      recruiterLabel: 'Recruiter',
      generalLabel: 'General inquiry',
      messageLabel: 'Message',
      submitLabel: 'Send message',
      sendingLabel: 'Sending...',
      sentMessage: 'Message sent.',
      errorMessage: 'Failed to send message. Please try again.',
    },
    chatbotUi: {
      subtitle: 'AI portfolio assistant',
      emptyPrompt: 'Select a prompt or ask a question about my work and experience.',
      thinkingLabel: 'Thinking...',
      inputPlaceholder: 'Ask a question...',
      unreachableError:
        'External API endpoint is currently unreachable. Switch mode to Hybrid or Local CMS in /admin, or try again later.',
    },
    blogLayout: {
      backLabel: 'Back to projects',
      demoLabel: 'Live demo',
      codeLabel: 'View code',
    },
  },
  aboutPage: {
    metaTitle: 'Sanju Kumar | Background & Experience',
    metaDescription:
      'Sanju Kumar is a Data Scientist and ML Engineer with hands-on experience in Python, TensorFlow, PyTorch, SQL, and enterprise process automation.',
    backLabel: 'Back to portfolio',
    eyebrow: 'PROFILE / DOSSIER',
    title: 'Background & engineering experience',
    subtitle:
      'Academic credentials, production systems shipped at Amazon, and core technical competencies.',
    profileImage: '/favicon.png',
    resumeAttachmentLabel: 'Download resume',
    attachments: [],
    sectionTitles: {
      education: 'Education',
      experience: 'Experience',
      domainStack: 'Domain stack',
      technicalLabel: 'Technical',
      mlLabel: 'Machine learning',
      softLabel: 'Operations',
      strengths: 'Core strengths',
      improvements: 'Current focus & growth areas',
      interests: 'Research interests',
    },
    education: [],
    experience: [],
    skills: {
      technical: [],
      ml: [],
      soft: [],
    },
    strengths: [],
    areasOfImprovement: [],
    interests: [],
  },
  atsPage: {
    metaTitle: 'ATS Compatibility Analyzer | Sanju Kumar',
    metaDescription:
      'Evaluate resume keyword alignment, structural parsing, and role compatibility against a target job description.',
    backLabel: 'Back to portfolio',
    eyebrow: 'SYS-03 / INTERACTIVE ANALYZER',
    title: 'ATS compatibility analyzer',
    subtitle:
      'Evaluate resume keyword alignment, structural parsing, and role compatibility against a target job description.',
    uploadCardTitle: '1. Resume document',
    uploadFormatsHint: 'PDF / DOC / DOCX / TXT',
    dropzonePrompt: 'Drop resume file here or click to browse',
    localNote: 'Processed locally in your browser',
    statusLabel: 'Status',
    jdCardTitle: '2. Target job description',
    jdPlaceholder: 'Paste the target job description here...',
    analyzeButtonLabel: 'Run ATS evaluation',
    analyzingButtonLabel: 'Evaluating...',
    resultsEyebrow: 'EVALUATION SUMMARY',
    overallScoreLabel: 'Overall ATS compatibility score',
    matchedKeywordsTitle: 'Matched keywords',
    missingKeywordsTitle: 'Missing keywords',
    recommendationsTitle: 'Recommended adjustments',
    attachments: [],
  },
  standalonePages: {
    networkapp: {
      metaTitle: 'Network App: Automating Network Balancing SIMs',
      metaDescription:
        'Network App automates SQL data retrieval, payload formatting, and fulfillment center notifications for network balancing SIM workflows.',
      title: 'Network App',
      date: 'April 15, 2023',
      readTime: '10 min read',
      tags: ['Automation', 'Advanced SQL', 'Python'],
      image: 'https://i.imgur.com/VxGPpEB.png',
      githubLink: '',
      demoLink: '',
      sections: [],
      chartTitle: 'Benchmark comparison: Manual vs. Network App',
      chartSubtitle: 'PILOT SAMPLE: 149 SIM RECORDS',
      chartSpeedupLabel: 'SPEEDUP: 17.72x',
      chartReductionLabel: 'AHT REDUCTION: 94.36%',
      chartData: [],
      pilotTableTitle: 'Pilot study results',
      pilotHeaders: [],
      pilotRows: [],
      roadmapTitle: 'Roadmap',
      roadmapItems: [],
      attachments: [],
    },
    ddo: {
      metaTitle: 'Defect Dispute Override (DDO): Logistics & Supply Chain Automation',
      metaDescription:
        'Defect Dispute Override (DDO) is a Python desktop application built to streamline carrier performance evaluation and dispute dispositioning in supply chain operations.',
      title: 'Defect Dispute Override Tool',
      date: 'March 10, 2023',
      readTime: '8 min read',
      tags: ['Data Science', 'Python', 'SQL', 'Analytics'],
      image: 'https://i.imgur.com/pqH8SRU.png',
      githubLink: 'https://github.com/mightysanju/DDO-Tool-Code-for-Public',
      demoLink: '',
      sections: [],
      metrics: [],
      stakeholdersTitle: 'Project stakeholders',
      stakeholders: [],
      attachments: [],
    },
    atsBlog: {
      metaTitle: 'Building an AI-Powered ATS Score Checker',
      metaDescription:
        'An overview of how we built an Applicant Tracking System (ATS) resume analyzer that evaluates resume compatibility against target job descriptions using natural language processing and structured keyword extraction.',
      title: 'Building an AI-Powered ATS Score Checker',
      date: 'March 20, 2024',
      readTime: '15 min read',
      tags: ['Machine Learning', 'NLP', 'React'],
      image:
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
      demoLink: '/ats',
      githubLink: 'https://github.com/mightysanju',
      sections: [],
      capabilitiesTitle: 'System capabilities',
      capabilities: [],
      attachments: [],
    },
    linkedinn: {
      metaTitle: 'LinkedIn Early Applicant Automation: Job Alert Pipeline',
      metaDescription:
        'A Python job monitoring and SMTP alert system that surfaces newly posted roles within minutes.',
      title: 'LinkedIn Early Applicant Automation',
      date: 'August 31, 2025',
      readTime: '6 min read',
      tags: ['Automation', 'Web Scraping', 'Python', 'SMTP'],
      image: 'https://i.imgur.com/hNa0ROb.jpeg',
      demoLink: '/blog/LinkedInnAppDemo',
      githubLink: 'https://github.com/mightysanju/Linked-Inn-Be-an-Early-Applicant.git',
      youtubeId: 'dQw4w9WgXcQ',
      paypalClientId:
        'AaTJvFXMHqSxzTnmhoH-PMiem_RRZyCdF_0fMbdQkyAGAkLB2rgZVQODfHlDGO1T0UOOrbRZwlcUQLHS',
      paypalPlanId: 'P-5C171323XC216760BNDDXMIY',
      supportTitle: 'SUPPORT PROJECT',
      supportDescription:
        'Subscribe to support ongoing maintenance and hosted alert infrastructure.',
      chartTitle: 'Shortlisting rate — baseline vs. automated alerts',
      beforeData: [],
      afterData: [],
      sections: [],
      impactTitle: 'Operational impact',
      impactItems: [],
      attachments: [],
    },
    linkedInnDemo: {
      metaTitle: 'Early Applicant Job Finder — Live Demo',
      metaDescription:
        'Query newly posted LinkedIn roles by recency window and applicant threshold.',
      backLabel: 'Back to projects',
      eyebrow: 'DEMO · LINKEDIN EARLY APPLICANT QUERY ENGINE',
      title: 'Early applicant job finder',
      subtitle:
        'Query newly posted LinkedIn roles by recency window and applicant threshold.',
      jobTitleOptions: [
        'Java',
        'Data Analyst',
        'Data Scientist',
        'Network Engineer',
        'Data Engineer',
      ],
      applicantFilterOptions: ['all', 'Be among the first 25 applicants'],
      defaultJobTitle: 'Data Scientist',
      defaultLocation: 'Chicago',
      defaultTimeFilterMinutes: 120,
      apiBaseUrl: 'https://linked-early-apply-966926647025.us-central1.run.app/search',
      corsProxyUrl: 'https://corsproxy.io/?',
      contactEmail: 'sanju.k3r@gmail.com',
      contactPrompt: 'For scheduled daily SMTP alerts, contact',
      searchButtonLabel: 'Run search',
      mockJobs: [],
      attachments: [],
    },
  },
};

export const DEFAULT_PORTFOLIO_DATA: NormalizedPortfolioData = mergePortfolioData(
  STATIC_DEFAULT_PORTFOLIO_DATA,
  defaultPortfolioData as Partial<PortfolioData>
);

function inferIconMimeType(
  resolvedHref: string,
  rawHref: string,
  mimeHint?: string
): string | undefined {
  if (mimeHint) return mimeHint;
  if (typeof resolvedHref === 'string' && resolvedHref.startsWith('data:')) {
    const match = resolvedHref.match(/^data:([^;,]+)/i);
    if (match?.[1]) return match[1].toLowerCase();
  }
  const candidate =
    typeof rawHref === 'string' && rawHref
      ? rawHref
      : typeof resolvedHref === 'string'
        ? resolvedHref
        : '';
  if (!candidate) return undefined;
  const cleanPath = candidate.split(/[?#]/)[0].toLowerCase();
  if (cleanPath.endsWith('.svg')) return 'image/svg+xml';
  if (cleanPath.endsWith('.png')) return 'image/png';
  if (cleanPath.endsWith('.ico')) return 'image/x-icon';
  if (cleanPath.endsWith('.webp')) return 'image/webp';
  if (cleanPath.endsWith('.jpg') || cleanPath.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanPath.endsWith('.gif')) return 'image/gif';
  return undefined;
}

function readValidLocalDraft(): Record<string, unknown> | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed: unknown = JSON.parse(saved);
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baselineData, setBaselineData] =
    useState<NormalizedPortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(() =>
    Boolean(readValidLocalDraft())
  );
  const [isSyncingRemote, setIsSyncingRemote] = useState<boolean>(false);
  const [queuedUploads, setQueuedUploads] = useState<Record<string, QueuedUploadItem>>({});

  const [data, setData] = useState<NormalizedPortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isPlainObject(parsed)) {
          return mergePortfolioData(DEFAULT_PORTFOLIO_DATA, parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached portfolio CMS data:', e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const hasUserMutatedRef = useRef<boolean>(false);
  const prevRefsRef = useRef<Set<string>>(collectReferencedRepoAssetPaths(data));

  // Hydrate staged uploads from IndexedDB / memory cache on mount; revoke runtime ObjectURLs on unmount
  useEffect(() => {
    let isMounted = true;
    void hydrateStagedAssets().then((hydrated) => {
      if (!isMounted) return;
      if (Object.keys(hydrated).length > 0) {
        setQueuedUploads((prev) => ({ ...prev, ...hydrated }));
      }
    });

    return () => {
      isMounted = false;
      revokeAllRuntimeObjectUrls();
    };
  }, []);

  // Diff previous vs next referenced repo paths and revoke/remove superseded staged assets
  useEffect(() => {
    const prevRefs = prevRefsRef.current;
    const nextRefs = collectReferencedRepoAssetPaths(data);
    const removedRepoPaths: string[] = [];

    for (const repoPath of prevRefs) {
      if (!nextRefs.has(repoPath)) {
        removedRepoPaths.push(repoPath);
      }
    }
    prevRefsRef.current = nextRefs;

    if (removedRepoPaths.length > 0) {
      void revokeAndRemoveStagedAssets(removedRepoPaths).then((removedPublicPaths) => {
        if (removedPublicPaths.length === 0) return;
        setQueuedUploads((prev) => {
          let changed = false;
          const next = { ...prev };
          for (const publicPath of removedPublicPaths) {
            if (publicPath in next) {
              delete next[publicPath];
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      });
    }
  }, [data]);

  const resolveAssetUrl = useCallback(
    (url?: string): string => resolveStagedAssetUrl(url, queuedUploads),
    [queuedUploads]
  );

  // Dynamically sync favicon in document head when hero.faviconUrl or hero.profileImage changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const rawHref =
      (typeof data.hero.faviconUrl === 'string' && data.hero.faviconUrl) ||
      (typeof data.hero.profileImage === 'string' && data.hero.profileImage) ||
      '/favicon.png';
    if (typeof rawHref !== 'string' || !rawHref) return;
    const resolvedHref = resolveAssetUrl(rawHref);
    if (!resolvedHref) return;

    let linkEl = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.rel = 'icon';
      document.head.appendChild(linkEl);
    }

    linkEl.href = resolvedHref;
    const cleanRawKey = rawHref.split(/[?#]/)[0];
    const stagedMime =
      queuedUploads[rawHref]?.mimeType || queuedUploads[cleanRawKey]?.mimeType;
    const mimeType = inferIconMimeType(resolvedHref, rawHref, stagedMime);
    if (mimeType) {
      linkEl.type = mimeType;
    } else {
      linkEl.removeAttribute('type');
    }
  }, [data.hero.faviconUrl, data.hero.profileImage, queuedUploads, resolveAssetUrl]);

  // Remote sync on mount (never clobbering localStorage drafts or in-flight user edits)
  useEffect(() => {
    let isMounted = true;
    const hasLocalDraft = Boolean(readValidLocalDraft());

    setIsSyncingRemote(true);
    const remoteUrl = getRemoteRawDataUrl();
    const cacheBustedUrl = `${remoteUrl}${remoteUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
    fetch(cacheBustedUrl, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((remoteJson: unknown) => {
        if (!isMounted) return;
        if (
          isPlainObject(remoteJson) &&
          isPlainObject(remoteJson.hero) &&
          Array.isArray(remoteJson.projects)
        ) {
          const mergedRemote = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, remoteJson);
          setBaselineData(mergedRemote);
          const currentDraftExists = Boolean(readValidLocalDraft());
          if (!hasLocalDraft && !currentDraftExists && !hasUserMutatedRef.current) {
            setData(mergedRemote);
          }
        }
      })
      .catch(() => {
        // Silently fall back to bundled portfolioData.json when offline or rate-limited
      })
      .finally(() => {
        if (isMounted) setIsSyncingRemote(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateData = useCallback(
    (updater: PortfolioData | ((prev: NormalizedPortfolioData) => PortfolioData)) => {
      hasUserMutatedRef.current = true;
      setData((prev) => {
        const rawNext = typeof updater === 'function' ? updater(prev) : updater;
        const next = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, rawNext);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error('Failed to save portfolio draft to localStorage:', e);
        }
        return next;
      });
      setHasUnsavedChanges(true);
    },
    []
  );

  const saveDraftLocally = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setHasUnsavedChanges(true);
    } catch (e) {
      console.error('Failed to save local draft:', e);
    }
  }, [data]);

  const resetToDefault = useCallback(() => {
    hasUserMutatedRef.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(UPLOADS_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage draft:', e);
    }
    void clearAllStagedAssets();
    setQueuedUploads({});
    setData(baselineData);
    setHasUnsavedChanges(false);
  }, [baselineData]);

  const uploadAssetImpl = useCallback(
    async (
      fileOrOptions: File | UploadAssetOptions,
      customSlugArg?: string
    ): Promise<UploadAssetResult> => {
      const isFileArg =
        (typeof File !== 'undefined' && fileOrOptions instanceof File) ||
        !('file' in fileOrOptions);
      const file = isFileArg
        ? (fileOrOptions as File)
        : (fileOrOptions as UploadAssetOptions).file;
      const maxWidth = isFileArg
        ? 900
        : (fileOrOptions as UploadAssetOptions).maxWidth ?? 900;
      const customSlug = isFileArg
        ? customSlugArg
        : (fileOrOptions as UploadAssetOptions).customSlug ?? customSlugArg;

      try {
        const prepared = await prepareAssetPayload(file, { maxWidth, customSlug });
        const staged = await stageAsset(prepared);

        setQueuedUploads((prev) => ({
          ...prev,
          [staged.publicPath]: staged,
        }));

        const previewUrl = staged.objectUrl || staged.dataUrl;
        return {
          success: true,
          url: staged.publicPath,
          publicPath: staged.publicPath,
          previewUrl,
          message: `Staged ${file.name} -> ${staged.publicPath}`,
        };
      } catch (err) {
        const errMessage =
          err instanceof Error ? err.message : 'Failed to process file';
        return {
          success: false,
          url: '',
          publicPath: '',
          previewUrl: '',
          message: errMessage,
          error: errMessage,
        };
      }
    },
    []
  );

  const uploadAsset = uploadAssetImpl as PortfolioContextType['uploadAsset'];

  const commitToGitHub = useCallback(
    async ({
      token,
      repo = DEFAULT_GITHUB_REPO,
      branch = DEFAULT_GITHUB_BRANCH,
      message = 'chore(cms): update portfolioData.json via Admin Portal',
    }: CommitToGitHubOptions): Promise<CommitToGitHubResult> => {
      const plan = buildGitHubPublishPlan(baselineData, data, queuedUploads);
      const result = await publishPlanToGitHub({
        token,
        repo,
        branch,
        message,
        plan,
      });

      if (!result.success) {
        return result;
      }

      hasUserMutatedRef.current = false;
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(UPLOADS_STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
      await clearAllStagedAssets();
      setQueuedUploads({});
      setBaselineData(data);
      setHasUnsavedChanges(false);

      return result;
    },
    [baselineData, data, queuedUploads]
  );

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        saveDraftLocally,
        resetToDefault,
        hasUnsavedChanges,
        isSyncingRemote,
        commitToGitHub,
        uploadAsset,
        queuedUploads,
        resolveAssetUrl,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio(): PortfolioContextType {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
