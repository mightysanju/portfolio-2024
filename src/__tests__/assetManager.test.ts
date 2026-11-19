import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  compressImageFileToDataUrl,
  prepareAssetPayload,
  collectReferencedRepoAssetPaths,
  buildGitHubPublishPlan,
  normalizeRepoAssetPath,
  normalizeLookupPublicPath,
  resolveStagedAssetUrl,
  type StagedUploadItem,
} from '../utils/assetManager';
import { DEFAULT_PORTFOLIO_DATA } from '../context/PortfolioContext';

describe('assetManager pure utilities & compression', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps SVG and ICO files untouched without canvas rasterization and matches extension to MIME', async () => {
    const svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>';
    const svgFile = new File([svgMarkup], 'brand-mark.svg', {
      type: 'image/svg+xml',
    });
    const icoFile = new File([new Uint8Array([0, 0, 1, 0])], 'site-icon.ico', {
      type: 'image/x-icon',
    });
    const msIcoFile = new File([new Uint8Array([0, 0, 1, 0])], 'win-icon.ico', {
      type: 'image/vnd.microsoft.icon',
    });

    const createElementSpy = vi.spyOn(document, 'createElement');

    const svgDataUrl = await compressImageFileToDataUrl(svgFile);
    const icoDataUrl = await compressImageFileToDataUrl(icoFile);
    const msIcoDataUrl = await compressImageFileToDataUrl(msIcoFile);

    expect(svgDataUrl.startsWith('data:image/svg+xml;base64,')).toBe(true);
    expect(icoDataUrl.startsWith('data:image/x-icon;base64,')).toBe(true);
    expect(msIcoDataUrl.startsWith('data:image/vnd.microsoft.icon;base64,')).toBe(true);
    expect(createElementSpy).not.toHaveBeenCalledWith('canvas');

    const stagedSvg = await prepareAssetPayload(svgFile, { customSlug: 'Brand Mark' });
    const stagedIco = await prepareAssetPayload(icoFile, { customSlug: 'Favicon' });

    expect(stagedSvg.mimeType).toBe('image/svg+xml');
    expect(stagedSvg.publicPath).toMatch(/^\/uploads\/brand-mark-[0-9a-f]{8}\.svg$/);
    expect(stagedSvg.repoPath).toMatch(/^public\/uploads\/brand-mark-[0-9a-f]{8}\.svg$/);

    expect(stagedIco.mimeType).toBe('image/x-icon');
    expect(stagedIco.publicPath).toMatch(/^\/uploads\/favicon-[0-9a-f]{8}\.ico$/);
  });

  it('safely handles PNG in no-canvas jsdom without hanging and keeps .png extension', async () => {
    const pngFile = new File([new Uint8Array([137, 80, 78, 71])], 'avatar.png', {
      type: 'image/png',
    });

    const staged = await prepareAssetPayload(pngFile, { customSlug: 'avatar' });
    expect(staged.mimeType).toBe('image/png');
    expect(staged.dataUrl.startsWith('data:image/png;base64,')).toBe(true);
    expect(staged.publicPath).toMatch(/^\/uploads\/avatar-[0-9a-f]{8}\.png$/);
  });

  it('preserves PNG alpha channel by falling back to image/png (never image/jpeg) when WebP encoding is unavailable', async () => {
    const toDataUrlCalls: string[] = [];
    const mockCtx = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([255, 0, 0, 0]),
      })),
    } as unknown as CanvasRenderingContext2D;

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL: vi.fn((type?: string) => {
        const requested = type || 'image/png';
        toDataUrlCalls.push(requested);
        // Simulate browser without WebP encoder returning PNG fallback
        if (requested === 'image/webp') {
          return 'data:image/png;base64,AAAA';
        }
        if (requested === 'image/png') {
          return 'data:image/png;base64,UE5HQUxQSEE=';
        }
        return 'data:image/jpeg;base64,SlBFRw==';
      }),
    } as unknown as HTMLCanvasElement;

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'canvas') {
        return mockCanvas;
      }
      return origCreateElement(tagName);
    });

    class MockImage {
      width = 1600;
      height = 800;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        queueMicrotask(() => {
          this.onload?.();
        });
      }
    }
    vi.stubGlobal('Image', MockImage);

    const pngFile = new File([new Uint8Array([137, 80, 78, 71])], 'alpha-logo.png', {
      type: 'image/png',
    });

    const staged = await prepareAssetPayload(pngFile, {
      maxWidth: 800,
      customSlug: 'alpha-logo',
    });

    expect(toDataUrlCalls).toContain('image/webp');
    expect(toDataUrlCalls).toContain('image/png');
    expect(toDataUrlCalls).not.toContain('image/jpeg');
    expect(staged.mimeType).toBe('image/png');
    expect(staged.publicPath).toMatch(/^\/uploads\/alpha-logo-[0-9a-f]{8}\.png$/);
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(400);
  });

  it('produces .webp when WebP encoding succeeds and .jpg for opaque JPEG fallback', async () => {
    let supportWebp = true;
    const mockCtx = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([10, 20, 30, 255]),
      })),
    } as unknown as CanvasRenderingContext2D;

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL: vi.fn((type?: string) => {
        if (type === 'image/webp') {
          return supportWebp
            ? 'data:image/webp;base64,V0VCUA=='
            : 'data:image/png;base64,RkFMTA==';
        }
        if (type === 'image/jpeg') {
          return 'data:image/jpeg;base64,SlBH';
        }
        return 'data:image/png;base64,UE5H';
      }),
    } as unknown as HTMLCanvasElement;

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'canvas') return mockCanvas;
      return origCreateElement(tagName);
    });

    class MockImage {
      width = 200;
      height = 100;
      onload: (() => void) | null = null;
      set src(_value: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal('Image', MockImage);

    const jpgFile = new File([new Uint8Array([255, 216, 255])], 'photo.jpg', {
      type: 'image/jpeg',
    });

    supportWebp = true;
    const webpStaged = await prepareAssetPayload(jpgFile, { customSlug: 'photo' });
    expect(webpStaged.mimeType).toBe('image/webp');
    expect(webpStaged.publicPath).toMatch(/\.webp$/);

    supportWebp = false;
    const jpgStaged = await prepareAssetPayload(jpgFile, { customSlug: 'photo' });
    expect(jpgStaged.mimeType).toBe('image/jpeg');
    expect(jpgStaged.publicPath).toMatch(/\.jpg$/);
  });

  it('collectReferencedRepoAssetPaths normalizes /uploads paths and ignores non-upload paths', () => {
    const sampleData = {
      hero: {
        ...DEFAULT_PORTFOLIO_DATA.hero,
        faviconUrl: '/favicon.png',
        profileImage: '/uploads/avatar-12345678.png?v=2',
        resumeUrl: 'uploads/resume-abcdef01.pdf#page=1',
      },
      site: {
        ...DEFAULT_PORTFOLIO_DATA.site,
        navbar: {
          ...DEFAULT_PORTFOLIO_DATA.site.navbar,
          logoImage: 'public/uploads/logo-deadbeef.svg',
        },
        seo: {
          ...DEFAULT_PORTFOLIO_DATA.site.seo,
          ogImage: 'https://i.imgur.com/e9T4kwI.png',
        },
      },
      projects: [
        {
          ...DEFAULT_PORTFOLIO_DATA.projects[0],
          image: 'data:image/png;base64,AAA',
          blogContent: {
            body: 'test',
            images: ['/uploads/diagram-11223344.webp'],
          },
          attachments: [
            {
              id: 'att-1',
              label: 'Spec',
              url: '/uploads/spec-99887766.pdf',
            },
          ],
        },
      ],
    };

    const refs = collectReferencedRepoAssetPaths(sampleData);
    expect(Array.from(refs).sort()).toEqual([
      'public/uploads/avatar-12345678.png',
      'public/uploads/diagram-11223344.webp',
      'public/uploads/logo-deadbeef.svg',
      'public/uploads/resume-abcdef01.pdf',
      'public/uploads/spec-99887766.pdf',
    ]);
  });

  it('buildGitHubPublishPlan computes ref-counted deletes, protects shared refs and /favicon.png, and excludes orphan uploads', () => {
    const baseline = {
      ...DEFAULT_PORTFOLIO_DATA,
      hero: {
        ...DEFAULT_PORTFOLIO_DATA.hero,
        faviconUrl: '/favicon.png',
        profileImage: '/uploads/shared-11111111.png',
        resumeUrl: '/uploads/old-resume-22222222.pdf',
      },
      aboutPage: {
        ...DEFAULT_PORTFOLIO_DATA.aboutPage,
        profileImage: '/uploads/shared-11111111.png',
      },
      projects: [
        {
          ...DEFAULT_PORTFOLIO_DATA.projects[0],
          image: '/uploads/old-proj-33333333.webp',
        },
      ],
    };

    const next = {
      ...baseline,
      hero: {
        ...baseline.hero,
        // Replace profileImage (still referenced by aboutPage.profileImage!)
        profileImage: '/uploads/new-avatar-44444444.webp',
        // Replace resumeUrl (now 0 references anywhere)
        resumeUrl: '/uploads/new-resume-55555555.pdf',
      },
      projects: [
        {
          ...baseline.projects[0],
          image: 'https://i.imgur.com/hNa0ROb.jpeg',
        },
      ],
    };

    const stagedUploads: Record<string, StagedUploadItem> = {
      '/uploads/new-avatar-44444444.webp': {
        publicPath: '/uploads/new-avatar-44444444.webp',
        repoPath: 'public/uploads/new-avatar-44444444.webp',
        fileName: 'new-avatar-44444444.webp',
        mimeType: 'image/webp',
        base64Content: 'QVZBVEFS',
        dataUrl: 'data:image/webp;base64,QVZBVEFS',
        sizeBytes: 6,
        createdAt: 1,
      },
      '/uploads/new-resume-55555555.pdf': {
        publicPath: '/uploads/new-resume-55555555.pdf',
        repoPath: 'public/uploads/new-resume-55555555.pdf',
        fileName: 'new-resume-55555555.pdf',
        mimeType: 'application/pdf',
        base64Content: 'UERG',
        dataUrl: 'data:application/pdf;base64,UERG',
        sizeBytes: 3,
        createdAt: 2,
      },
      '/uploads/orphaned-66666666.png': {
        publicPath: '/uploads/orphaned-66666666.png',
        repoPath: 'public/uploads/orphaned-66666666.png',
        fileName: 'orphaned-66666666.png',
        mimeType: 'image/png',
        base64Content: 'T1JQSEFO',
        dataUrl: 'data:image/png;base64,T1JQSEFO',
        sizeBytes: 6,
        createdAt: 3,
      },
    };

    const plan = buildGitHubPublishPlan(baseline, next, stagedUploads);

    // Orphaned staged upload must NOT be uploaded
    expect(plan.upserts.map((u) => u.repoPath).sort()).toEqual([
      'public/uploads/new-avatar-44444444.webp',
      'public/uploads/new-resume-55555555.pdf',
    ]);

    // Shared reference and /favicon.png must NOT be deleted; only unreferenced public/uploads/* are deleted
    expect(plan.deletes).toEqual([
      'public/uploads/old-proj-33333333.webp',
      'public/uploads/old-resume-22222222.pdf',
    ]);
    expect(plan.deletes).not.toContain('public/uploads/shared-11111111.png');
    expect(plan.deletes).not.toContain('favicon.png');
    expect(plan.deletes).not.toContain('public/favicon.png');
  });

  it('rejects dot and dot-dot path traversal segments in normalizeRepoAssetPath', () => {
    expect(normalizeRepoAssetPath('/uploads/../favicon.png')).toBeNull();
    expect(normalizeRepoAssetPath('public/uploads/../favicon.png')).toBeNull();
    expect(normalizeRepoAssetPath('/uploads/./avatar.png')).toBeNull();
    expect(normalizeRepoAssetPath('/uploads/sub/../avatar.png')).toBeNull();
    expect(normalizeRepoAssetPath('/uploads\\..\\favicon.png')).toBeNull();
    expect(normalizeRepoAssetPath('/uploads/avatar-12345678.png')).toBe(
      'public/uploads/avatar-12345678.png'
    );
  });

  it('returns empty string safely from resolveStagedAssetUrl for non-string inputs', () => {
    expect(resolveStagedAssetUrl(12345 as unknown as string)).toBe('');
    expect(resolveStagedAssetUrl(null as unknown as string)).toBe('');
    expect(resolveStagedAssetUrl(undefined)).toBe('');
    expect(normalizeLookupPublicPath(12345 as unknown as string)).toBeNull();
  });

  it('maintains normalization parity on whitespace before query and rejects encoded traversal, double slashes, and trailing slashes', () => {
    const spacedPath = 'uploads/valid-12345678.png ?v=1';
    expect(normalizeRepoAssetPath(spacedPath)).toBe('public/uploads/valid-12345678.png');
    expect(normalizeLookupPublicPath(spacedPath)).toBe('/uploads/valid-12345678.png');

    const stagedMap: Record<string, StagedUploadItem> = {
      '/uploads/valid-12345678.png': {
        publicPath: '/uploads/valid-12345678.png',
        repoPath: 'public/uploads/valid-12345678.png',
        fileName: 'valid-12345678.png',
        mimeType: 'image/png',
        base64Content: 'UE5H',
        dataUrl: 'data:image/png;base64,UE5H',
        objectUrl: 'blob:http://localhost/valid-12345678',
        sizeBytes: 3,
        createdAt: 1,
      },
    };
    expect(resolveStagedAssetUrl(spacedPath, stagedMap)).toBe(
      'blob:http://localhost/valid-12345678'
    );

    const maliciousPaths = [
      '/uploads/%2e%2e/favicon.png',
      '/uploads/%2E%2E/favicon.png',
      '/uploads/%2e/a.png',
      '/uploads/..%2ffavicon.png',
      '/uploads/a%5cb.png',
      '/uploads/%252e%252e/favicon.png',
      '/uploads//a.png',
      '//uploads/a.png',
      '/uploads/a.png/',
      '/uploads/ /',
    ];
    for (const badPath of maliciousPaths) {
      expect(normalizeRepoAssetPath(badPath)).toBeNull();
      expect(normalizeLookupPublicPath(badPath)).toBeNull();
    }
  });
});
