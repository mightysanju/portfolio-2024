import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultPortfolioData from '../data/portfolioData.json';

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

export interface PortfolioData {
  hero: HeroData;
  testimonials: TestimonialItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  skills: SkillItem[];
  chatbot?: ChatbotConfig;
}

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
  message: string;
}

export interface QueuedUploadItem {
  publicPath: string;
  repoPath: string;
  base64Content: string;
  dataUrl: string;
  fileName: string;
}

export interface PortfolioContextType {
  data: PortfolioData;
  updateData: (updater: PortfolioData | ((prev: PortfolioData) => PortfolioData)) => void;
  saveDraftLocally: () => void;
  resetToDefault: () => void;
  hasUnsavedChanges: boolean;
  isSyncingRemote: boolean;
  commitToGitHub: (options: CommitToGitHubOptions) => Promise<CommitToGitHubResult>;
  uploadAsset: (options: UploadAssetOptions) => Promise<UploadAssetResult>;
  queuedUploads: Record<string, QueuedUploadItem>;
  resolveAssetUrl: (url: string) => string;
}

const STORAGE_KEY = 'portfolio_cms_data_v1';
const UPLOADS_STORAGE_KEY = 'portfolio_cms_uploads_v1';
export const VAULT_STORAGE_KEY = 'portfolio_admin_vault_v1';
const REMOTE_RAW_URL =
  'https://raw.githubusercontent.com/mightysanju/portfolio-2024/main/src/data/portfolioData.json';

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item'
  );
}

export interface EncryptedVaultPayload {
  salt: string;
  iv: string;
  ciphertext: string;
  passwordHash: string;
  updatedAt: string;
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function compressImageFileToDataUrl(
  file: File,
  maxWidth = 900,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        if (webpDataUrl.startsWith('data:image/webp')) {
          resolve(webpDataUrl);
        } else {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
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

export async function hashAdminPassword(password: string, saltBase64?: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const salt = saltBase64 ? base64ToUint8Array(saltBase64) : window.crypto.getRandomValues(new Uint8Array(16));
  const combined = new Uint8Array(salt.length + enc.encode(password).length);
  combined.set(salt, 0);
  combined.set(enc.encode(password), salt.length);
  const digest = await window.crypto.subtle.digest('SHA-256', combined);
  return {
    hash: bufferToBase64(digest),
    salt: bufferToBase64(salt),
  };
}

export async function encryptTokenToVault(password: string, githubToken: string): Promise<EncryptedVaultPayload> {
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

export async function decryptTokenFromVault(password: string): Promise<{ validPassword: boolean; token: string }> {
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

export function getVaultMetadata(): { exists: boolean; hasToken: boolean; updatedAt?: string } {
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

const typedDefaultData = defaultPortfolioData as PortfolioData;

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baselineData, setBaselineData] = useState<PortfolioData>(typedDefaultData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const [isSyncingRemote, setIsSyncingRemote] = useState<boolean>(false);

  const [queuedUploads, setQueuedUploads] = useState<Record<string, QueuedUploadItem>>(() => {
    try {
      const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...typedDefaultData,
          ...parsed,
          hero: { ...typedDefaultData.hero, ...(parsed.hero || {}) },
          chatbot: parsed.chatbot
            ? { ...typedDefaultData.chatbot, ...parsed.chatbot }
            : typedDefaultData.chatbot,
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached portfolio CMS data:', e);
    }
    return typedDefaultData;
  });

  // Dynamically sync favicon in document head when hero.faviconUrl or hero.profileImage changes
  useEffect(() => {
    const faviconHref = data.hero.faviconUrl || data.hero.profileImage;
    if (!faviconHref || typeof document === 'undefined') return;
    const linkEl = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (linkEl) {
      linkEl.href = faviconHref;
    }
  }, [data.hero.faviconUrl, data.hero.profileImage]);

  useEffect(() => {
    let isMounted = true;
    const hasLocalDraft = Boolean(localStorage.getItem(STORAGE_KEY));

    setIsSyncingRemote(true);
    fetch(`${REMOTE_RAW_URL}?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((remoteJson: PortfolioData) => {
        if (!isMounted) return;
        if (remoteJson && remoteJson.hero && Array.isArray(remoteJson.projects)) {
          setBaselineData(remoteJson);
          if (!hasLocalDraft && !localStorage.getItem(STORAGE_KEY)) {
            setData(remoteJson);
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
    (updater: PortfolioData | ((prev: PortfolioData) => PortfolioData)) => {
      setData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          setHasUnsavedChanges(true);
        } catch (e) {
          console.error('Failed to save portfolio draft to localStorage:', e);
        }
        return next;
      });
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
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(UPLOADS_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage draft:', e);
    }
    setQueuedUploads({});
    setData(baselineData);
    setHasUnsavedChanges(false);
  }, [baselineData]);

  const uploadAsset = useCallback(
    async ({
      file,
      token = '',
      repo = 'mightysanju/portfolio-2024',
      branch = 'main',
      maxWidth = 900,
      customSlug,
    }: UploadAssetOptions): Promise<UploadAssetResult> => {
      const cleanToken = token.trim();
      const dotIndex = file.name.lastIndexOf('.');
      const baseName = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
      const ext = file.type.startsWith('image/')
        ? 'webp'
        : dotIndex > 0
        ? file.name.slice(dotIndex + 1).toLowerCase()
        : 'bin';

      const cleanFileName = `${slugify(customSlug || baseName)}.${ext}`;
      const publicPath = `/uploads/${cleanFileName}`;
      const repoPath = `public/uploads/${cleanFileName}`;

      try {
        let dataUrl: string;
        let base64Content: string;

        if (file.type.startsWith('image/')) {
          dataUrl = await compressImageFileToDataUrl(file, maxWidth, 0.82);
          const commaIdx = dataUrl.indexOf(',');
          base64Content = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : '';
        } else {
          dataUrl = await fileToDataUrl(file);
          const arrayBuf = await file.arrayBuffer();
          base64Content = bufferToBase64(arrayBuf);
        }

        // If GitHub PAT is configured, try pushing directly to public/uploads/<filename>
        if (cleanToken && base64Content) {
          try {
            const apiUrl = `https://api.github.com/repos/${repo}/contents/${repoPath}`;
            const headers: Record<string, string> = {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${cleanToken}`,
              'X-GitHub-Api-Version': '2022-11-28',
              'Content-Type': 'application/json',
            };

            let existingSha: string | undefined;
            const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
              method: 'GET',
              headers,
            });
            if (getRes.ok) {
              const meta = await getRes.json();
              existingSha = meta.sha;
            }

            const putRes = await fetch(apiUrl, {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                message: `chore(cms): upload ${cleanFileName}`,
                content: base64Content,
                sha: existingSha,
                branch,
              }),
            });

            if (putRes.ok) {
              return {
                success: true,
                url: dataUrl,
                publicPath,
                message: `Uploaded ${file.name} to GitHub (${publicPath})`,
              };
            }
          } catch {
            // Fall through to local queue
          }
        }

        // Queue file in localStorage so commitToGitHub pushes it to public/uploads/<cleanFileName>
        const item: QueuedUploadItem = {
          publicPath,
          repoPath,
          base64Content,
          dataUrl,
          fileName: cleanFileName,
        };
        setQueuedUploads((prev) => {
          const next = { ...prev, [publicPath]: item };
          try {
            localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(next));
          } catch {
            // Ignore quota errors on large files
          }
          return next;
        });

        return {
          success: true,
          url: dataUrl,
          publicPath,
          message: `Ready: ${file.name} -> auto path ${publicPath}`,
        };
      } catch (err) {
        return {
          success: false,
          url: '',
          publicPath: '',
          message: err instanceof Error ? err.message : 'Failed to process file',
        };
      }
    },
    []
  );

  const commitToGitHub = useCallback(
    async ({
      token,
      repo = 'mightysanju/portfolio-2024',
      branch = 'main',
      message = 'chore(cms): update portfolioData.json via Admin Portal',
    }: CommitToGitHubOptions): Promise<CommitToGitHubResult> => {
      const cleanToken = token.trim();
      if (!cleanToken) {
        return {
          success: false,
          message: 'GitHub Personal Access Token is required to push changes',
        };
      }

      const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${cleanToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      };

      try {
        // 0. Push any queued uploaded assets to public/uploads/<filename> and rewrite Data URLs to /uploads/<filename>
        let jsonString = JSON.stringify(data, null, 2) + '\n';
        const pendingItems = Object.values(queuedUploads);
        for (const item of pendingItems) {
          if (!item.base64Content) continue;
          const uploadApiUrl = `https://api.github.com/repos/${repo}/contents/${item.repoPath}`;
          let existingSha: string | undefined;
          const checkRes = await fetch(`${uploadApiUrl}?ref=${encodeURIComponent(branch)}`, {
            method: 'GET',
            headers,
          });
          if (checkRes.ok) {
            const meta = await checkRes.json();
            existingSha = meta.sha;
          }
          const uploadRes = await fetch(uploadApiUrl, {
            method: 'PUT',
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `chore(cms): upload ${item.fileName}`,
              content: item.base64Content,
              sha: existingSha,
              branch,
            }),
          });
          if (uploadRes.ok && item.dataUrl) {
            jsonString = jsonString.split(JSON.stringify(item.dataUrl)).join(JSON.stringify(item.publicPath));
          }
        }

        const apiUrl = `https://api.github.com/repos/${repo}/contents/src/data/portfolioData.json`;

        // 1. GET current file SHA
        const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
          method: 'GET',
          headers,
        });

        let sha: string | undefined;
        if (getRes.ok) {
          const fileMeta = await getRes.json();
          sha = fileMeta.sha;
        } else if (getRes.status !== 404) {
          const errBody = await getRes.json().catch(() => ({}));
          return {
            success: false,
            message: errBody.message || `Failed to read repo file metadata (HTTP ${getRes.status})`,
          };
        }

        // 2. UTF-8 safe base64 encoding
        const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

        // 3. PUT updated file contents
        const putRes = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.trim() || 'chore(cms): update portfolioData.json via Admin Portal',
            content: base64Content,
            sha,
            branch,
          }),
        });

        if (!putRes.ok) {
          const errBody = await putRes.json().catch(() => ({}));
          return {
            success: false,
            message: errBody.message || `GitHub commit failed with status ${putRes.status}`,
          };
        }

        const result = await putRes.json();
        const commitUrl: string | undefined = result?.commit?.html_url;

        // Clear local unsaved draft flag and upload queue
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(UPLOADS_STORAGE_KEY);
        setQueuedUploads({});
        setBaselineData(data);
        setHasUnsavedChanges(false);

        return {
          success: true,
          commitUrl,
          message: 'Committed portfolioData.json and uploaded assets to GitHub',
        };
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Network error while communicating with GitHub API',
        };
      }
    },
    [data, queuedUploads]
  );

  const resolveAssetUrl = useCallback(
    (url: string): string => {
      if (!url) return url;
      if (queuedUploads[url]?.dataUrl) {
        return queuedUploads[url].dataUrl;
      }
      return url;
    },
    [queuedUploads]
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
