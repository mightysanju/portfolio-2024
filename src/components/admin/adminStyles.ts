import type { QueuedUploadItem } from '../../context/PortfolioContext';

export type TabKey =
  | 'projects'
  | 'certifications'
  | 'testimonials'
  | 'skills'
  | 'hero'
  | 'site'
  | 'sections'
  | 'about'
  | 'pages'
  | 'chatbot'
  | 'vault';

export interface StatusBannerState {
  type: 'success' | 'error' | 'info';
  text: string;
  commitUrl?: string;
}

export const CARD_CLASS =
  'bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[14px] p-6';

export const SUBCARD_CLASS =
  'bg-[#0b0d14]/60 border border-white/[0.08] rounded-[10px] p-4';

export const LABEL_CLASS = 'block text-xs text-[#a3a9b8] mb-1.5';

export const INPUT_CLASS =
  'w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none transition-colors duration-150';

export const MONO_INPUT_CLASS =
  'w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 font-mono text-xs text-[#eef0f5] placeholder-[#7a8296] focus:outline-none transition-colors duration-150';

export const TEXTAREA_CLASS =
  'w-full bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 py-2 text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none transition-colors duration-150';

export const SELECT_CLASS =
  'w-full h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 text-sm text-[#eef0f5] focus:outline-none transition-colors duration-150';

export const BTN_PRIMARY =
  'inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white disabled:opacity-50 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150';

export const BTN_SECONDARY =
  'inline-flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222733] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-xs font-medium text-[#eef0f5] transition-colors duration-150';

export const BTN_DANGER =
  'inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#e5484d] transition-colors duration-150';

export const BTN_GHOST = 
  'inline-flex items-center gap-2 h-9 px-3 rounded-[8px] hover:bg-[#1a1e28]/70 text-xs font-medium text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150';

export const ICON_OPTIONS = [
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

export const SOCIAL_ID_OPTIONS = [
  'github',
  'linkedin',
  'youtube',
  'instagram',
  'email',
  'website',
];

export const formatSignatureId = (prefix: string, index: number): string =>
  `${prefix}-${String(index + 1).padStart(2, '0')}`;

export const generateInitialsAvatar = (name: string): string =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Sanju Kumar')}&background=1a1e28&color=eef0f5&size=200`;

export function normalizeStagedLookupKey(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim().split(/[?#]/)[0];
  if (!trimmed) return '';
  if (trimmed.startsWith('/uploads/')) return trimmed;
  if (trimmed.startsWith('uploads/')) return `/${trimmed}`;
  if (trimmed.startsWith('public/uploads/')) return `/${trimmed.slice('public/'.length)}`;
  if (trimmed.startsWith('/public/uploads/')) return `/${trimmed.slice('/public/'.length)}`;
  return trimmed;
}

export function isStagedUploadPath(
  url: string | undefined,
  queuedUploads: Record<string, QueuedUploadItem>
): boolean {
  const key = normalizeStagedLookupKey(url);
  if (!key) return false;
  return Boolean(queuedUploads[key]);
}

export function isImageLikeUrl(url?: string): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase().split(/[?#]/)[0];
  if (clean.startsWith('data:image/') || clean.startsWith('blob:')) return true;
  if (/\.(png|jpe?g|webp|gif|svg|ico|bmp|avif)$/.test(clean)) return true;
  if (
    clean.includes('images.unsplash.com') ||
    clean.includes('i.imgur.com') ||
    clean.includes('ui-avatars.com')
  ) {
    return true;
  }
  return false;
}
