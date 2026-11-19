import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import {
  PortfolioProvider,
  usePortfolio,
  DEFAULT_PORTFOLIO_DATA,
  type PortfolioContextType,
} from '../context/PortfolioContext';
import { clearAllStagedAssets } from '../utils/assetManager';

const STORAGE_KEY = 'portfolio_cms_data_v1';

describe('Asset staging, immediate preview, favicon sync & atomic GitHub publish', () => {
  let blobCounter = 0;
  let createObjectUrlMock: ReturnType<typeof vi.fn>;
  let revokeObjectUrlMock: ReturnType<typeof vi.fn>;
  const origCreateObjectUrl = URL.createObjectURL;
  const origRevokeObjectUrl = URL.revokeObjectURL;

  beforeEach(async () => {
    localStorage.clear();
    document.head.innerHTML = '<link rel="icon" type="image/png" href="/favicon.png" />';
    await clearAllStagedAssets();
    blobCounter = 0;

    createObjectUrlMock = vi.fn(() => {
      blobCounter += 1;
      return `blob:http://localhost/mock-asset-${blobCounter}`;
    });
    revokeObjectUrlMock = vi.fn();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: createObjectUrlMock,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectUrlMock,
    });
  });

  afterEach(async () => {
    await clearAllStagedAssets();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: origCreateObjectUrl,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: origRevokeObjectUrl,
    });
    vi.restoreAllMocks();
  });

  function renderWithContext() {
    let ctx!: PortfolioContextType;
    const Probe = () => {
      ctx = usePortfolio();
      return (
        <div>
          <span data-testid="profile-resolved">
            {ctx.resolveAssetUrl(ctx.data.hero.profileImage)}
          </span>
          <span data-testid="resume-raw">{ctx.data.hero.resumeUrl}</span>
          <span data-testid="unsaved">{String(ctx.hasUnsavedChanges)}</span>
          <span data-testid="queued-count">
            {String(Object.keys(ctx.queuedUploads).length)}
          </span>
        </div>
      );
    };

    const view = render(
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    );
    return { getCtx: () => ctx, ...view };
  }

  it('stages uploads locally with zero fetch calls, supports both overloads, and returns /uploads/... without data: URI leaks', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('offline'));

    const { getCtx } = renderWithContext();

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1); // initial remote sync only
    });
    fetchSpy.mockClear();

    const pdfFile = new File(['%PDF-1.4 mock resume'], 'Sanju Resume.pdf', {
      type: 'application/pdf',
    });
    const pngFile = new File([new Uint8Array([137, 80, 78, 71])], 'headshot.png', {
      type: 'image/png',
    });

    // Positional overload: (file, customSlug)
    const resumeRes = await act(async () =>
      getCtx().uploadAsset(pdfFile, 'resume-sanju')
    );

    // Options object overload (backward-compatible with AdminPanel.tsx)
    const avatarRes = await act(async () =>
      getCtx().uploadAsset({
        file: pngFile,
        token: 'ghp_should_not_push_during_upload',
        repo: 'mightysanju/portfolio-2024',
        branch: 'main',
        customSlug: 'profile-headshot',
      })
    );

    // Zero network requests during upload!
    expect(fetchSpy).not.toHaveBeenCalled();

    expect(resumeRes.success).toBe(true);
    expect(resumeRes.url).toMatch(/^\/uploads\/resume-sanju-[0-9a-f]{8}\.pdf$/);
    expect(resumeRes.publicPath).toBe(resumeRes.url);
    expect(resumeRes.url.startsWith('data:')).toBe(false);
    expect(resumeRes.previewUrl.startsWith('blob:')).toBe(true);
    expect(resumeRes.message.length).toBeGreaterThan(0);

    expect(avatarRes.success).toBe(true);
    expect(avatarRes.url).toMatch(/^\/uploads\/profile-headshot-[0-9a-f]{8}\.png$/);
    expect(avatarRes.previewUrl.startsWith('blob:')).toBe(true);
    expect(getCtx().resolveAssetUrl(avatarRes.url)).toBe(avatarRes.previewUrl);

    act(() => {
      getCtx().updateData((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          profileImage: avatarRes.url,
          resumeUrl: resumeRes.url,
        },
      }));
    });

    expect(screen.getByTestId('profile-resolved')).toHaveTextContent(
      avatarRes.previewUrl
    );
    expect(screen.getByTestId('resume-raw')).toHaveTextContent(resumeRes.url);
  });

  it('revokes superseded ObjectURL on asset replacement, protects shared refs, and cleans up on resetToDefault', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const revokeSpy = revokeObjectUrlMock;
    const { getCtx } = renderWithContext();

    const firstFile = new File([new Uint8Array([1, 2, 3])], 'first.png', {
      type: 'image/png',
    });
    const secondFile = new File([new Uint8Array([4, 5, 6])], 'second.png', {
      type: 'image/png',
    });

    const first = await act(async () =>
      getCtx().uploadAsset(firstFile, 'first-img')
    );
    const second = await act(async () =>
      getCtx().uploadAsset(secondFile, 'second-img')
    );

    // Wire first image to BOTH hero.profileImage and aboutPage.profileImage (shared ref)
    act(() => {
      getCtx().updateData((prev) => ({
        ...prev,
        hero: { ...prev.hero, profileImage: first.url },
        aboutPage: { ...prev.aboutPage, profileImage: first.url },
      }));
    });
    expect(revokeSpy).not.toHaveBeenCalled();

    // Replace only hero.profileImage -> first.url is still referenced by aboutPage.profileImage
    act(() => {
      getCtx().updateData((prev) => ({
        ...prev,
        hero: { ...prev.hero, profileImage: second.url },
      }));
    });
    expect(revokeSpy).not.toHaveBeenCalledWith(first.previewUrl);

    // Replace aboutPage.profileImage too -> first.url now has 0 references and MUST be revoked
    act(() => {
      getCtx().updateData((prev) => ({
        ...prev,
        aboutPage: { ...prev.aboutPage, profileImage: second.url },
      }));
    });
    await waitFor(() => {
      expect(revokeSpy).toHaveBeenCalledWith(first.previewUrl);
    });
    await waitFor(() => {
      expect(getCtx().queuedUploads[first.url]).toBeUndefined();
    });

    // resetToDefault revokes remaining staged ObjectURLs and clears queue
    act(() => {
      getCtx().resetToDefault();
    });
    expect(revokeSpy).toHaveBeenCalledWith(second.previewUrl);
    expect(Object.keys(getCtx().queuedUploads)).toHaveLength(0);
    expect(screen.getByTestId('unsaved')).toHaveTextContent('false');
  });

  it('syncs document <link rel="icon"> href and type dynamically for staged favicons', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const { getCtx } = renderWithContext();

    const svgIcon = new File(
      ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"></svg>'],
      'site-fav.svg',
      { type: 'image/svg+xml' }
    );
    const stagedIcon = await act(async () =>
      getCtx().uploadAsset(svgIcon, 'favicon-custom')
    );

    act(() => {
      getCtx().updateData((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          faviconUrl: stagedIcon.url,
        },
      }));
    });

    const linkEl = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    expect(linkEl).not.toBeNull();
    expect(linkEl.getAttribute('href')).toBe(stagedIcon.previewUrl);
    expect(linkEl.type).toBe('image/svg+xml');
  });

  it('commits atomically via Git Data API with verified sha: null deletes and preserves draft on failure', async () => {
    const baselineWithOldUploads = {
      ...DEFAULT_PORTFOLIO_DATA,
      hero: {
        ...DEFAULT_PORTFOLIO_DATA.hero,
        profileImage: '/uploads/old-avatar-11111111.png',
        resumeUrl: '/uploads/missing-on-remote-22222222.pdf',
        faviconUrl: '/favicon.png',
      },
      aboutPage: {
        ...DEFAULT_PORTFOLIO_DATA.aboutPage,
        profileImage: '/uploads/shared-avatar-33333333.png',
      },
    };

    const recordedCalls: Array<{ url: string; method: string; body?: unknown }> = [];
    let failTreePost = true;

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = typeof input === 'string' ? input : input.toString();
      const method = (init?.method || 'GET').toUpperCase();
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      recordedCalls.push({ url, method, body });

      if (url.includes('raw.githubusercontent.com')) {
        return new Response(JSON.stringify(baselineWithOldUploads), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (method === 'GET' && url.endsWith('/git/ref/heads/main')) {
        return new Response(JSON.stringify({ object: { sha: 'head-commit-sha' } }), {
          status: 200,
        });
      }
      if (method === 'GET' && url.endsWith('/git/commits/head-commit-sha')) {
        return new Response(JSON.stringify({ tree: { sha: 'base-tree-sha' } }), {
          status: 200,
        });
      }
      if (method === 'GET' && url.endsWith('/git/trees/base-tree-sha?recursive=1')) {
        return new Response(
          JSON.stringify({
            tree: [
              { path: 'src/data/portfolioData.json', type: 'blob' },
              { path: 'public/favicon.png', type: 'blob' },
              { path: 'public/uploads/old-avatar-11111111.png', type: 'blob' },
              { path: 'public/uploads/shared-avatar-33333333.png', type: 'blob' },
              // Note: public/uploads/missing-on-remote-22222222.pdf intentionally absent
            ],
          }),
          { status: 200 }
        );
      }
      if (method === 'POST' && url.endsWith('/git/blobs')) {
        return new Response(
          JSON.stringify({ sha: `blob-sha-${recordedCalls.length}` }),
          { status: 201 }
        );
      }
      if (method === 'POST' && url.endsWith('/git/trees')) {
        if (failTreePost) {
          return new Response(JSON.stringify({ message: 'Simulated 500 tree error' }), {
            status: 500,
          });
        }
        return new Response(JSON.stringify({ sha: 'new-tree-sha' }), { status: 201 });
      }
      if (method === 'POST' && url.endsWith('/git/commits')) {
        return new Response(
          JSON.stringify({
            sha: 'new-commit-sha',
            html_url: 'https://github.com/mightysanju/portfolio-2024/commit/new-commit-sha',
          }),
          { status: 201 }
        );
      }
      if (method === 'PATCH' && url.endsWith('/git/refs/heads/main')) {
        return new Response(JSON.stringify({ ref: 'refs/heads/main' }), {
          status: 200,
        });
      }

      return new Response(JSON.stringify({ message: `Unhandled ${method} ${url}` }), {
        status: 404,
      });
    });

    const { getCtx } = renderWithContext();

    // Wait for initial remote baseline sync
    await waitFor(() => {
      expect(getCtx().data.hero.profileImage).toBe('/uploads/old-avatar-11111111.png');
    });

    const newAvatarFile = new File([new Uint8Array([9, 8, 7])], 'new-avatar.png', {
      type: 'image/png',
    });
    const uploaded = await act(async () =>
      getCtx().uploadAsset(newAvatarFile, 'new-avatar')
    );

    act(() => {
      getCtx().updateData((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          profileImage: uploaded.url,
          resumeUrl: 'https://example.com/resume-new.pdf',
        },
      }));
    });

    // 1. Failure case: draft and staged upload must remain intact
    failTreePost = true;
    const failedCommit = await act(async () =>
      getCtx().commitToGitHub({
        token: 'ghp_test_token',
        repo: 'mightysanju/portfolio-2024',
        branch: 'main',
      })
    );
    expect(failedCommit.success).toBe(false);
    expect(getCtx().hasUnsavedChanges).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    expect(Object.keys(getCtx().queuedUploads)).toContain(uploaded.url);

    // 2. Success case: atomic commit creates blobs, deletes ONLY verified existing unreferenced uploads, clears draft
    recordedCalls.length = 0;
    failTreePost = false;
    const successCommit = await act(async () =>
      getCtx().commitToGitHub({
        token: 'ghp_test_token',
        repo: 'mightysanju/portfolio-2024',
        branch: 'main',
        message: 'feat(cms): publish atomic update',
      })
    );

    expect(successCommit.success).toBe(true);
    expect(successCommit.commitUrl).toBe(
      'https://github.com/mightysanju/portfolio-2024/commit/new-commit-sha'
    );

    const treeCall = recordedCalls.find(
      (c) => c.method === 'POST' && c.url.endsWith('/git/trees')
    );
    expect(treeCall).toBeDefined();
    const treeEntries = (
      treeCall?.body as {
        base_tree: string;
        tree: Array<{ path: string; sha: string | null }>;
      }
    ).tree;

    // Upsert new avatar + portfolioData.json
    expect(treeEntries.some((e) => e.path === `public${uploaded.url}` && e.sha)).toBe(true);
    expect(
      treeEntries.some((e) => e.path === 'src/data/portfolioData.json' && e.sha)
    ).toBe(true);

    // Delete ONLY old-avatar-11111111.png (exists in baseTreeSha & unreferenced)
    expect(treeEntries).toContainEqual({
      path: 'public/uploads/old-avatar-11111111.png',
      mode: '100644',
      type: 'blob',
      sha: null,
    });

    // Must NOT emit sha: null for path absent from baseTreeSha, shared path, or /favicon.png
    expect(
      treeEntries.some(
        (e) => e.path === 'public/uploads/missing-on-remote-22222222.pdf'
      )
    ).toBe(false);
    expect(
      treeEntries.some((e) => e.path === 'public/uploads/shared-avatar-33333333.png')
    ).toBe(false);
    expect(treeEntries.some((e) => e.path === 'public/favicon.png')).toBe(false);

    // Draft & staged uploads cleared after success
    expect(getCtx().hasUnsavedChanges).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(Object.keys(getCtx().queuedUploads)).toHaveLength(0);
  });
});
