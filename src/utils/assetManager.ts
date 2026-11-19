export interface StagedUploadItem {
  publicPath: string;
  repoPath: string;
  fileName: string;
  mimeType: string;
  base64Content: string;
  dataUrl: string;
  objectUrl?: string;
  sizeBytes: number;
  createdAt: number;
}

export interface GitHubPublishUpsert {
  repoPath: string;
  publicPath: string;
  base64Content: string;
}

export interface GitHubPublishPlan {
  portfolioJson: string;
  portfolioJsonBase64: string;
  upserts: GitHubPublishUpsert[];
  deletes: string[];
}

export interface PublishPlanToGitHubOptions {
  token: string;
  repo: string;
  branch: string;
  message: string;
  plan: GitHubPublishPlan;
}

export interface PublishPlanToGitHubResult {
  success: boolean;
  commitUrl?: string;
  message: string;
}

const IDB_NAME = 'portfolio_cms_assets_db';
const IDB_VERSION = 1;
const IDB_STORE_NAME = 'staged_uploads';

const memoryStagedAssets = new Map<string, StagedUploadItem>();

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item'
  );
}

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const slice = bytes.subarray(i, Math.min(i + chunkSize, bytes.byteLength));
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return bufferToBase64(bytes);
}

const EXTENSION_TO_MIME: Record<string, string> = {
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  bmp: 'image/bmp',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  md: 'text/markdown',
  csv: 'text/csv',
  json: 'application/json',
  zip: 'application/zip',
};

const MIME_TO_EXTENSION: Record<string, string> = {
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'text/markdown': 'md',
  'text/csv': 'csv',
  'application/json': 'json',
  'application/zip': 'zip',
};

const PASSTHROUGH_IMAGE_MIMES = new Set([
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/gif',
]);

const ALPHA_CANDIDATE_MIMES = new Set([
  'image/png',
  'image/webp',
  'image/avif',
]);

export function inferMimeType(file: File): string {
  const declared = (file.type || '').trim().toLowerCase().split(';')[0];
  if (declared && declared !== 'application/octet-stream') {
    return declared;
  }
  const dotIdx = file.name.lastIndexOf('.');
  if (dotIdx >= 0) {
    const ext = file.name.slice(dotIdx + 1).toLowerCase();
    if (EXTENSION_TO_MIME[ext]) {
      return EXTENSION_TO_MIME[ext];
    }
  }
  return declared || 'application/octet-stream';
}

export function extensionForMime(mimeType: string, fallbackExt = 'bin'): string {
  const cleanMime = (mimeType || '').trim().toLowerCase().split(';')[0];
  if (MIME_TO_EXTENSION[cleanMime]) {
    return MIME_TO_EXTENSION[cleanMime];
  }
  const sanitizedFallback = fallbackExt.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return sanitizedFallback || 'bin';
}

function parseDataUrlMime(dataUrl: string): string | null {
  const match = dataUrl.match(/^data:([^;,]+)(?:;[^,]*)?,/i);
  return match?.[1] ? match[1].trim().toLowerCase() : null;
}

function normalizeDataUrlMime(dataUrl: string, desiredMime: string): string {
  if (!dataUrl.startsWith('data:')) return dataUrl;
  const parsedMime = parseDataUrlMime(dataUrl);
  if (parsedMime && parsedMime !== 'application/octet-stream') {
    return dataUrl;
  }
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx < 0) return dataUrl;
  const header = dataUrl.slice(0, commaIdx);
  const body = dataUrl.slice(commaIdx + 1);
  const isBase64 = /;base64$/i.test(header);
  return `data:${desiredMime}${isBase64 ? ';base64' : ''},${body}`;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const raw = String(reader.result || '');
      const inferred = inferMimeType(file);
      resolve(inferred ? normalizeDataUrlMime(raw, inferred) : raw);
    };
    reader.readAsDataURL(file);
  });
}

function hasCanvas2dSupport(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe && typeof probe.getContext === 'function' && probe.getContext('2d'));
  } catch {
    return false;
  }
}

function hasTransparentPixels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): boolean {
  try {
    const imageData = ctx.getImageData(0, 0, Math.max(1, width), Math.max(1, height));
    const pixels = imageData.data;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 255) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

export async function compressImageFileToDataUrl(
  file: File,
  maxWidth = 900,
  quality = 0.82
): Promise<string> {
  const mime = inferMimeType(file);

  // Never rasterize SVG, ICO, or GIF files on canvas
  if (PASSTHROUGH_IMAGE_MIMES.has(mime)) {
    return fileToDataUrl(file);
  }

  // Safely fall back when 2D canvas is unavailable (e.g. jsdom without canvas)
  if (!hasCanvas2dSupport() || typeof Image === 'undefined') {
    return fileToDataUrl(file);
  }

  const rawDataUrl = await fileToDataUrl(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Failed to decode image'));
    img.onload = () => {
      let width = img.width || maxWidth;
      let height = img.height || maxWidth;
      if (maxWidth > 0 && width > maxWidth) {
        height = Math.max(1, Math.round((height * maxWidth) / width));
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const webpDataUrl = canvas.toDataURL('image/webp', quality);
      if (webpDataUrl.startsWith('data:image/webp')) {
        resolve(webpDataUrl);
        return;
      }

      const preserveAlpha =
        ALPHA_CANDIDATE_MIMES.has(mime) ||
        hasTransparentPixels(ctx, canvas.width, canvas.height);

      if (preserveAlpha) {
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve(canvas.toDataURL('image/jpeg', quality));
      }
    };
    img.src = rawDataUrl;
  });
}

export async function computeShortHash(bytes: Uint8Array): Promise<string> {
  const subtle =
    typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto.subtle : undefined;
  if (subtle && typeof subtle.digest === 'function') {
    try {
      const digest = await subtle.digest('SHA-256', bytes as unknown as BufferSource);
      const hex = Array.from(new Uint8Array(digest).slice(0, 4))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      if (hex.length === 8) return hex;
    } catch {
      // Fall back to FNV-1a below
    }
  }

  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export async function prepareAssetPayload(
  file: File,
  options?: { maxWidth?: number; customSlug?: string }
): Promise<StagedUploadItem> {
  const maxWidth = options?.maxWidth ?? 900;
  const dotIndex = file.name.lastIndexOf('.');
  const baseName = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
  const originalExt = dotIndex >= 0 ? file.name.slice(dotIndex + 1).toLowerCase() : 'bin';
  const inferredMime = inferMimeType(file);

  let dataUrl: string;
  let base64Content: string;

  if (inferredMime.startsWith('image/')) {
    dataUrl = await compressImageFileToDataUrl(file, maxWidth, 0.82);
    const commaIdx = dataUrl.indexOf(',');
    const header = commaIdx >= 0 ? dataUrl.slice(0, commaIdx) : '';
    const rawPayload = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : '';
    if (/;base64$/i.test(header)) {
      base64Content = rawPayload;
    } else {
      const decodedText = decodeURIComponent(rawPayload);
      base64Content = utf8ToBase64(decodedText);
      const mimeFromUrl = parseDataUrlMime(dataUrl) || inferredMime;
      dataUrl = `data:${mimeFromUrl};base64,${base64Content}`;
    }
  } else {
    dataUrl = await fileToDataUrl(file);
    if (typeof file.arrayBuffer === 'function') {
      const arrayBuf = await file.arrayBuffer();
      base64Content = bufferToBase64(arrayBuf);
    } else {
      const commaIdx = dataUrl.indexOf(',');
      base64Content = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : '';
    }
  }

  const parsedMime = parseDataUrlMime(dataUrl);
  const actualMime =
    parsedMime && parsedMime !== 'application/octet-stream' ? parsedMime : inferredMime;
  const ext = extensionForMime(actualMime, originalExt);
  const rawBytes = base64Content ? base64ToUint8Array(base64Content) : new Uint8Array(0);
  const shortHash = await computeShortHash(rawBytes);

  const slug = slugify(options?.customSlug || baseName);
  const fileName = `${slug}-${shortHash}.${ext}`;
  const publicPath = `/uploads/${fileName}`;
  const repoPath = `public/uploads/${fileName}`;

  return {
    publicPath,
    repoPath,
    fileName,
    mimeType: actualMime,
    base64Content,
    dataUrl,
    sizeBytes: rawBytes.byteLength || file.size,
    createdAt: Date.now(),
  };
}

function createObjectUrlForItem(item: StagedUploadItem): string | undefined {
  if (
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function' ||
    typeof Blob === 'undefined'
  ) {
    return undefined;
  }
  try {
    const bytes = item.base64Content ? base64ToUint8Array(item.base64Content) : new Uint8Array(0);
    const blob = new Blob([bytes as unknown as BlobPart], { type: item.mimeType });
    return URL.createObjectURL(blob);
  } catch {
    return undefined;
  }
}

function revokeObjectUrlSafely(objectUrl?: string): void {
  if (
    !objectUrl ||
    typeof URL === 'undefined' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    return;
  }
  try {
    URL.revokeObjectURL(objectUrl);
  } catch {
    // Ignore invalid/already-revoked ObjectURLs
  }
}

function openAssetDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { keyPath: 'publicPath' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbPutStagedItem(item: StagedUploadItem): Promise<void> {
  const db = await openAssetDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      const { objectUrl: _unused, ...persistable } = item;
      void _unused;
      store.put(persistable);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

async function idbDeleteStagedKeys(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  const db = await openAssetDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      for (const key of keys) {
        store.delete(key);
      }
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

async function idbClearStaged(): Promise<void> {
  const db = await openAssetDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      tx.objectStore(IDB_STORE_NAME).clear();
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

async function idbReadAllStaged(): Promise<StagedUploadItem[]> {
  const db = await openAssetDb();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const req = tx.objectStore(IDB_STORE_NAME).getAll();
      req.onsuccess = () => {
        const items = Array.isArray(req.result) ? (req.result as StagedUploadItem[]) : [];
        db.close();
        resolve(items);
      };
      req.onerror = () => {
        db.close();
        resolve([]);
      };
    } catch {
      db.close();
      resolve([]);
    }
  });
}

export async function stageAsset(item: StagedUploadItem): Promise<StagedUploadItem> {
  const existing = memoryStagedAssets.get(item.publicPath);
  const objectUrl = createObjectUrlForItem(item);
  if (existing?.objectUrl && existing.objectUrl !== objectUrl) {
    revokeObjectUrlSafely(existing.objectUrl);
  }
  const staged: StagedUploadItem = {
    ...item,
    objectUrl,
  };
  memoryStagedAssets.set(staged.publicPath, staged);
  await idbPutStagedItem(staged);
  return staged;
}

export async function hydrateStagedAssets(): Promise<Record<string, StagedUploadItem>> {
  const idbItems = await idbReadAllStaged();
  for (const idbItem of idbItems) {
    if (!memoryStagedAssets.has(idbItem.publicPath)) {
      memoryStagedAssets.set(idbItem.publicPath, { ...idbItem });
    }
  }

  const result: Record<string, StagedUploadItem> = {};
  for (const [key, item] of memoryStagedAssets.entries()) {
    const objectUrl = item.objectUrl || createObjectUrlForItem(item);
    const hydrated: StagedUploadItem = {
      ...item,
      objectUrl,
    };
    memoryStagedAssets.set(key, hydrated);
    result[key] = hydrated;
  }
  return result;
}

function hasUnsafeEncodedOrTraversalSegment(pathStr: string): boolean {
  if (/%2e|%2f|%5c/i.test(pathStr)) {
    return true;
  }
  if (pathStr.includes('\\') || pathStr.includes('//') || pathStr.endsWith('/')) {
    return true;
  }
  const segments = pathStr.split('/');
  if (segments.some((seg) => seg === '' || seg === '.' || seg === '..')) {
    return true;
  }
  return false;
}

function normalizeUploadRelativePath(rawUrl?: string): string | null {
  if (typeof rawUrl !== 'string' || !rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  if (/^(https?:|data:|blob:|mailto:|tel:)/i.test(trimmed)) {
    return null;
  }
  const withoutQueryOrHash = trimmed.split(/[?#]/)[0].trim();
  if (!withoutQueryOrHash || withoutQueryOrHash.startsWith('//')) {
    return null;
  }
  const clean = withoutQueryOrHash.replace(/^\/+/, '');
  if (!clean || hasUnsafeEncodedOrTraversalSegment(clean)) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(clean);
    if (hasUnsafeEncodedOrTraversalSegment(decoded)) {
      return null;
    }
  } catch {
    // Ignore malformed percent sequences after raw validation
  }

  if (clean.startsWith('uploads/') && clean.length > 'uploads/'.length) {
    return clean;
  }
  if (clean.startsWith('public/uploads/') && clean.length > 'public/uploads/'.length) {
    return clean.slice('public/'.length);
  }
  return null;
}

export function normalizeLookupPublicPath(rawUrl?: string): string | null {
  if (typeof rawUrl !== 'string') return null;
  const relative = normalizeUploadRelativePath(rawUrl);
  return relative ? `/${relative}` : null;
}

export function resolveStagedAssetUrl(
  url?: string,
  stagedMap?: Record<string, StagedUploadItem>
): string {
  if (typeof url !== 'string' || !url) return '';
  const trimmed = url.trim();
  const lookupKey = normalizeLookupPublicPath(trimmed) || trimmed;
  const memItem = memoryStagedAssets.get(lookupKey) || memoryStagedAssets.get(trimmed);
  if (memItem) {
    return memItem.objectUrl || memItem.dataUrl || trimmed;
  }
  const mapItem = stagedMap?.[lookupKey] || stagedMap?.[trimmed];
  if (mapItem) {
    return mapItem.objectUrl || mapItem.dataUrl || trimmed;
  }
  return url;
}

export function normalizeRepoAssetPath(rawUrl?: string): string | null {
  const relative = normalizeUploadRelativePath(rawUrl);
  return relative ? `public/${relative}` : null;
}

export async function revokeAndRemoveStagedAssets(
  repoOrPublicPaths: Iterable<string>
): Promise<string[]> {
  const removedPublicPaths: string[] = [];
  for (const rawPath of repoOrPublicPaths) {
    const normalizedRepo = normalizeRepoAssetPath(rawPath);
    const publicPath = normalizedRepo
      ? `/${normalizedRepo.slice('public/'.length)}`
      : normalizeLookupPublicPath(rawPath);
    if (!publicPath) continue;

    const existing = memoryStagedAssets.get(publicPath);
    if (existing) {
      revokeObjectUrlSafely(existing.objectUrl);
      memoryStagedAssets.delete(publicPath);
    }
    removedPublicPaths.push(publicPath);
  }
  await idbDeleteStagedKeys(removedPublicPaths);
  return removedPublicPaths;
}

export async function clearAllStagedAssets(): Promise<void> {
  for (const item of memoryStagedAssets.values()) {
    revokeObjectUrlSafely(item.objectUrl);
  }
  memoryStagedAssets.clear();
  await idbClearStaged();
}

export function revokeAllRuntimeObjectUrls(): void {
  for (const [key, item] of memoryStagedAssets.entries()) {
    if (item.objectUrl) {
      revokeObjectUrlSafely(item.objectUrl);
      memoryStagedAssets.set(key, { ...item, objectUrl: undefined });
    }
  }
}

export function collectReferencedRepoAssetPaths(data: unknown): Set<string> {
  const refs = new Set<string>();
  const visited = new Set<object>();

  const walk = (value: unknown): void => {
    if (typeof value === 'string') {
      const normalized = normalizeRepoAssetPath(value);
      if (normalized) refs.add(normalized);
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (visited.has(value)) return;
    visited.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        walk(item);
      }
      return;
    }

    for (const entryValue of Object.values(value as Record<string, unknown>)) {
      walk(entryValue);
    }
  };

  walk(data);
  return refs;
}

export function buildGitHubPublishPlan(
  baselineData: unknown,
  nextData: unknown,
  stagedUploads: Record<string, StagedUploadItem>
): GitHubPublishPlan {
  const baselineRefs = collectReferencedRepoAssetPaths(baselineData);
  const nextRefs = collectReferencedRepoAssetPaths(nextData);

  const upsertMap = new Map<string, GitHubPublishUpsert>();
  for (const item of Object.values(stagedUploads)) {
    if (!item || !item.base64Content) continue;
    const repoPath = normalizeRepoAssetPath(item.repoPath || item.publicPath);
    if (!repoPath) continue;
    if (!nextRefs.has(repoPath)) continue;
    if (!upsertMap.has(repoPath)) {
      upsertMap.set(repoPath, {
        repoPath,
        publicPath: `/${repoPath.slice('public/'.length)}`,
        base64Content: item.base64Content,
      });
    }
  }

  const upserts = Array.from(upsertMap.values());
  const deletes: string[] = [];
  for (const repoPath of baselineRefs) {
    if (!nextRefs.has(repoPath) && !upsertMap.has(repoPath)) {
      deletes.push(repoPath);
    }
  }
  deletes.sort();

  const portfolioJson = `${JSON.stringify(nextData, null, 2)}\n`;
  const portfolioJsonBase64 = utf8ToBase64(portfolioJson);

  return {
    portfolioJson,
    portfolioJsonBase64,
    upserts,
    deletes,
  };
}

async function readGitHubErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    if (body?.message) return body.message;
  } catch {
    // Ignore non-JSON error body
  }
  return `${fallback} (HTTP ${res.status})`;
}

export async function publishPlanToGitHub({
  token,
  repo,
  branch,
  message,
  plan,
}: PublishPlanToGitHubOptions): Promise<PublishPlanToGitHubResult> {
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
    'Content-Type': 'application/json',
  };

  const encodedBranchPath = branch
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  const apiBase = `https://api.github.com/repos/${repo}`;

  try {
    // 1. Resolve current branch HEAD commit SHA
    const refRes = await fetch(`${apiBase}/git/ref/heads/${encodedBranchPath}`, {
      method: 'GET',
      headers,
    });
    if (!refRes.ok) {
      return {
        success: false,
        message: await readGitHubErrorMessage(refRes, `Failed to read ref heads/${branch}`),
      };
    }
    const refJson = (await refRes.json()) as { object?: { sha?: string } };
    const headCommitSha = refJson.object?.sha;
    if (!headCommitSha) {
      return { success: false, message: 'GitHub ref response missing commit SHA' };
    }

    // 2. Resolve base tree SHA
    const commitRes = await fetch(`${apiBase}/git/commits/${headCommitSha}`, {
      method: 'GET',
      headers,
    });
    if (!commitRes.ok) {
      return {
        success: false,
        message: await readGitHubErrorMessage(commitRes, 'Failed to read HEAD commit'),
      };
    }
    const commitJson = (await commitRes.json()) as { tree?: { sha?: string } };
    const baseTreeSha = commitJson.tree?.sha;
    if (!baseTreeSha) {
      return { success: false, message: 'GitHub commit response missing tree SHA' };
    }

    // 3. List existing paths in base tree so deletes only target paths present in baseTreeSha
    const existingTreeRes = await fetch(
      `${apiBase}/git/trees/${baseTreeSha}?recursive=1`,
      { method: 'GET', headers }
    );
    if (!existingTreeRes.ok) {
      return {
        success: false,
        message: await readGitHubErrorMessage(existingTreeRes, 'Failed to read repository tree'),
      };
    }
    const existingTreeJson = (await existingTreeRes.json()) as {
      tree?: Array<{ path?: string }>;
    };
    const existingPaths = new Set<string>(
      (existingTreeJson.tree || [])
        .map((entry) => entry.path)
        .filter((p): p is string => Boolean(p))
    );

    // 4. Create blobs for staged upserts and src/data/portfolioData.json
    const createBlob = async (base64Content: string, label: string): Promise<string> => {
      const blobRes = await fetch(`${apiBase}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: base64Content,
          encoding: 'base64',
        }),
      });
      if (!blobRes.ok) {
        throw new Error(await readGitHubErrorMessage(blobRes, `Failed to create blob for ${label}`));
      }
      const blobJson = (await blobRes.json()) as { sha?: string };
      if (!blobJson.sha) {
        throw new Error(`GitHub blob response missing SHA for ${label}`);
      }
      return blobJson.sha;
    };

    const treeEntries: Array<{
      path: string;
      mode: '100644';
      type: 'blob';
      sha: string | null;
    }> = [];

    for (const upsert of plan.upserts) {
      const sha = await createBlob(upsert.base64Content, upsert.repoPath);
      treeEntries.push({
        path: upsert.repoPath,
        mode: '100644',
        type: 'blob',
        sha,
      });
    }

    const portfolioBlobSha = await createBlob(
      plan.portfolioJsonBase64,
      'src/data/portfolioData.json'
    );
    treeEntries.push({
      path: 'src/data/portfolioData.json',
      mode: '100644',
      type: 'blob',
      sha: portfolioBlobSha,
    });

    for (const deletePath of plan.deletes) {
      if (existingPaths.has(deletePath)) {
        treeEntries.push({
          path: deletePath,
          mode: '100644',
          type: 'blob',
          sha: null,
        });
      }
    }

    // 5. Create new Git tree
    const newTreeRes = await fetch(`${apiBase}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
    });
    if (!newTreeRes.ok) {
      return {
        success: false,
        message: await readGitHubErrorMessage(newTreeRes, 'Failed to create Git tree'),
      };
    }
    const newTreeJson = (await newTreeRes.json()) as { sha?: string };
    const newTreeSha = newTreeJson.sha;
    if (!newTreeSha) {
      return { success: false, message: 'GitHub tree response missing SHA' };
    }

    // 6. Create single atomic commit
    const newCommitRes = await fetch(`${apiBase}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: message.trim() || 'chore(cms): update portfolioData.json via Admin Portal',
        tree: newTreeSha,
        parents: [headCommitSha],
      }),
    });
    if (!newCommitRes.ok) {
      return {
        success: false,
        message: await readGitHubErrorMessage(newCommitRes, 'Failed to create Git commit'),
      };
    }
    const newCommitJson = (await newCommitRes.json()) as {
      sha?: string;
      html_url?: string;
    };
    const newCommitSha = newCommitJson.sha;
    if (!newCommitSha) {
      return { success: false, message: 'GitHub commit response missing SHA' };
    }

    // 7. Update branch ref
    const patchRefRes = await fetch(`${apiBase}/git/refs/heads/${encodedBranchPath}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        sha: newCommitSha,
        force: false,
      }),
    });
    if (!patchRefRes.ok) {
      return {
        success: false,
        message: await readGitHubErrorMessage(patchRefRes, `Failed to update ref heads/${branch}`),
      };
    }

    return {
      success: true,
      commitUrl: newCommitJson.html_url || `https://github.com/${repo}/commit/${newCommitSha}`,
      message: 'Committed portfolioData.json and synced repository assets to GitHub',
    };
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Network error while communicating with GitHub API',
    };
  }
}
