import { Component, type ReactNode } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import {
  DEFAULT_PORTFOLIO_DATA,
  mergePortfolioData,
  getRemoteRawDataUrl,
  REPO_CONFIG_STORAGE_KEY,
  PortfolioProvider,
  usePortfolio,
  type PortfolioData,
} from '../context/PortfolioContext';

const STORAGE_KEY = 'portfolio_cms_data_v1';

describe('PortfolioData schema & deep-merge backward compatibility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('deep-merges a legacy draft missing new site-wide fields without losing legacy edits', () => {
    const legacyDraft: Partial<PortfolioData> = {
      hero: {
        greeting: 'Legacy Name',
        title: 'Principal ML Architect',
        subtitle: 'Custom legacy subtitle',
        resumeUrl: '/uploads/legacy-resume.pdf',
        profileImage: '/uploads/legacy-avatar.png',
        linkedinUrl: 'https://linkedin.com/in/custom',
        credlyUrl: 'https://credly.com/custom',
      },
      testimonials: DEFAULT_PORTFOLIO_DATA.testimonials,
      projects: DEFAULT_PORTFOLIO_DATA.projects,
      certifications: DEFAULT_PORTFOLIO_DATA.certifications,
      skills: DEFAULT_PORTFOLIO_DATA.skills,
    };

    const merged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, legacyDraft);

    expect(merged.hero.greeting).toBe('Legacy Name');
    expect(merged.hero.title).toBe('Principal ML Architect');
    expect(merged.hero.shippedSystemsTitle).toBe(
      DEFAULT_PORTFOLIO_DATA.hero.shippedSystemsTitle
    );
    expect(merged.hero.shippedSystemProjectIds).toEqual([
      'proj-1',
      'proj-2',
      'proj-3',
      'proj-4',
    ]);
    expect(merged.site.navbar.brandName).toBe('Sanju Kumar');
    expect(merged.sections.projects.title).toBe('Featured projects');
    expect(merged.aboutPage.education.length).toBeGreaterThan(0);
    expect(merged.atsPage.title).toBe('ATS compatibility analyzer');
    expect(merged.standalonePages.networkapp.title).toBe('Network App');
    expect(merged.standalonePages.ddo.stakeholders.length).toBe(2);
    expect(merged.standalonePages.linkedinn.beforeData.length).toBe(8);
  });

  it('preserves sibling defaults on partial nested updates and skips undefined', () => {
    const merged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      hero: {
        ...DEFAULT_PORTFOLIO_DATA.hero,
        title: undefined as unknown as string,
        statusBadge: '',
      },
      sections: {
        ...DEFAULT_PORTFOLIO_DATA.sections,
        projects: {
          ...DEFAULT_PORTFOLIO_DATA.sections.projects,
          title: 'Custom Systems',
        },
      },
      standalonePages: {
        ...DEFAULT_PORTFOLIO_DATA.standalonePages,
        linkedInnDemo: {
          ...DEFAULT_PORTFOLIO_DATA.standalonePages.linkedInnDemo,
          defaultTimeFilterMinutes: 0,
        },
      },
    });

    // undefined is skipped so default title remains
    expect(merged.hero.title).toBe(DEFAULT_PORTFOLIO_DATA.hero.title);
    // explicit falsy primitives ("", 0) are preserved
    expect(merged.hero.statusBadge).toBe('');
    expect(merged.standalonePages.linkedInnDemo.defaultTimeFilterMinutes).toBe(0);
    // partial nested objects preserve sibling defaults
    expect(merged.sections.projects.title).toBe('Custom Systems');
    expect(merged.sections.projects.description).toBe(
      DEFAULT_PORTFOLIO_DATA.sections.projects.description
    );
    expect(merged.sections.contact.email).toBe(
      DEFAULT_PORTFOLIO_DATA.sections.contact.email
    );
  });

  it('preserves explicit empty arrays such as shippedSystemProjectIds: [] and projects: []', () => {
    const merged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      hero: {
        ...DEFAULT_PORTFOLIO_DATA.hero,
        shippedSystemProjectIds: [],
      },
      projects: [],
    });

    expect(merged.hero.shippedSystemProjectIds).toEqual([]);
    expect(merged.projects).toEqual([]);
  });

  it('falls back cleanly to DEFAULT_PORTFOLIO_DATA when localStorage contains malformed JSON', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    localStorage.setItem(STORAGE_KEY, '{not-valid-json');

    const Probe = () => {
      const { data } = usePortfolio();
      return <div data-testid="hero-title">{data.hero.title}</div>;
    };

    render(
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    );

    expect(screen.getByTestId('hero-title')).toHaveTextContent(
      DEFAULT_PORTFOLIO_DATA.hero.title
    );
    expect(warnSpy).toHaveBeenCalled();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('resolves configurable remote raw data URL from REPO_CONFIG_STORAGE_KEY', () => {
    expect(getRemoteRawDataUrl()).toBe(
      'https://raw.githubusercontent.com/mightysanju/portfolio-2024/main/src/data/portfolioData.json'
    );

    localStorage.setItem(
      REPO_CONFIG_STORAGE_KEY,
      JSON.stringify({ repo: 'custom-org/custom-repo', branch: 'release/v2' })
    );
    expect(getRemoteRawDataUrl()).toBe(
      'https://raw.githubusercontent.com/custom-org/custom-repo/release%2Fv2/src/data/portfolioData.json'
    );

    localStorage.setItem(REPO_CONFIG_STORAGE_KEY, '{broken');
    expect(getRemoteRawDataUrl()).toBe(
      'https://raw.githubusercontent.com/mightysanju/portfolio-2024/main/src/data/portfolioData.json'
    );
  });

  it('protects localStorage draft and in-flight user mutations from remote fetch clobbering', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        hero: {
          title: 'Local Draft Title',
          shippedSystemProjectIds: [],
        },
      })
    );

    const remoteLegacyPayload = {
      hero: {
        greeting: 'Remote Greeting',
        title: 'Remote Title',
        subtitle: 'Remote Sub',
        resumeUrl: 'https://example.com/resume.pdf',
        profileImage: '/favicon.png',
        linkedinUrl: 'https://linkedin.com',
        credlyUrl: 'https://credly.com',
      },
      testimonials: [],
      projects: [
        {
          id: 'proj-remote',
          title: 'Remote Project',
          description: 'Desc',
          image: '/favicon.png',
          tags: ['Python'],
          demo: '',
          github: '',
          blog: '',
        },
      ],
      certifications: [],
      skills: [],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(remoteLegacyPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    let resetFn: (() => void) | undefined;
    const Probe = () => {
      const { data, isSyncingRemote, resetToDefault } = usePortfolio();
      resetFn = resetToDefault;
      return (
        <div>
          <span data-testid="title">{data.hero.title}</span>
          <span data-testid="shipped-count">
            {String(data.hero.shippedSystemProjectIds?.length ?? -1)}
          </span>
          <span data-testid="projects-section-title">
            {data.sections.projects.title}
          </span>
          <span data-testid="syncing">{String(isSyncingRemote)}</span>
        </div>
      );
    };

    render(
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('syncing')).toHaveTextContent('false');
    });

    // Draft must NOT be clobbered by remote fetch
    expect(screen.getByTestId('title')).toHaveTextContent('Local Draft Title');
    expect(screen.getByTestId('shipped-count')).toHaveTextContent('0');

    // Resetting restores the deep-merged remote baseline (retaining default sections)
    act(() => {
      resetFn?.();
    });
    expect(screen.getByTestId('title')).toHaveTextContent('Remote Title');
    expect(screen.getByTestId('projects-section-title')).toHaveTextContent(
      'Featured projects'
    );
  });

  it('does not overwrite in-flight user mutation if fetch resolves afterwards', async () => {
    let resolveFetch!: (res: Response) => void;
    const pendingFetch = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.spyOn(globalThis, 'fetch').mockReturnValue(pendingFetch);

    let updateFn:
      | ((updater: (prev: PortfolioData) => PortfolioData) => void)
      | undefined;

    const Probe = () => {
      const { data, updateData, isSyncingRemote } = usePortfolio();
      updateFn = updateData;
      return (
        <div>
          <span data-testid="title">{data.hero.title}</span>
          <span data-testid="syncing">{String(isSyncingRemote)}</span>
        </div>
      );
    };

    render(
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    );

    act(() => {
      updateFn?.((prev) => ({
        ...prev,
        hero: { ...prev.hero, title: 'In-Flight User Edit' },
      }));
    });

    await act(async () => {
      resolveFetch(
        new Response(
          JSON.stringify({
            ...DEFAULT_PORTFOLIO_DATA,
            hero: { ...DEFAULT_PORTFOLIO_DATA.hero, title: 'Stale Remote Title' },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('syncing')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('title')).toHaveTextContent('In-Flight User Edit');
  });

  it('blocks prototype-chain hijacking (__proto__, constructor, prototype) in mergePortfolioData and remote fetch', async () => {
    const protoPayload = JSON.parse(
      '{"__proto__":{"polluted":true,"toString":"not-a-fn"},"constructor":{"prototype":{"ctorPolluted":true}},"prototype":{"protoProp":true},"hero":{"__proto__":{"heroPwned":true},"title":"Safe Title"}}'
    );

    const merged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, protoPayload);

    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
    expect(Object.getPrototypeOf(merged.hero)).toBe(Object.prototype);
    expect((merged as unknown as Record<string, unknown>).polluted).toBeUndefined();
    expect((merged as unknown as Record<string, unknown>).ctorPolluted).toBeUndefined();
    expect((merged as unknown as Record<string, unknown>).protoProp).toBeUndefined();
    expect((merged.hero as unknown as Record<string, unknown>).heroPwned).toBeUndefined();
    expect((Object.prototype as unknown as Record<string, unknown>).polluted).toBeUndefined();
    expect(() => String(merged)).not.toThrow();
    expect(merged.hero.title).toBe('Safe Title');

    const remoteMaliciousJson =
      '{"__proto__":{"remotePolluted":true,"toString":"bad"},"hero":{"greeting":"Sanju","title":"Remote Safe","subtitle":"Sub","resumeUrl":"/r.pdf","profileImage":"/favicon.png","linkedinUrl":"https://linkedin.com","credlyUrl":"https://credly.com","__proto__":{"heroPwned":true}},"projects":[]}';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(remoteMaliciousJson, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    let capturedData: PortfolioData | undefined;
    const Probe = () => {
      const { data, isSyncingRemote } = usePortfolio();
      capturedData = data;
      return (
        <div>
          <span data-testid="title">{data.hero.title}</span>
          <span data-testid="syncing">{String(isSyncingRemote)}</span>
        </div>
      );
    };

    render(
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('syncing')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('title')).toHaveTextContent('Remote Safe');
    expect(Object.getPrototypeOf(capturedData)).toBe(Object.prototype);
    expect(Object.getPrototypeOf(capturedData?.hero)).toBe(Object.prototype);
    expect(
      (capturedData as unknown as Record<string, unknown>)?.remotePolluted
    ).toBeUndefined();
    expect(
      (capturedData?.hero as unknown as Record<string, unknown>)?.heroPwned
    ).toBeUndefined();
    expect(() => String(capturedData)).not.toThrow();
  });

  it('prevents type-mismatched container clobbering in mergePortfolioData', () => {
    const merged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      hero: 'corrupt',
      projects: 'not-array',
      site: [],
      sections: 123,
      aboutPage: null,
    });

    expect(typeof merged.hero).toBe('object');
    expect(Array.isArray(merged.hero)).toBe(false);
    expect(merged.hero.title).toBe(DEFAULT_PORTFOLIO_DATA.hero.title);

    expect(Array.isArray(merged.projects)).toBe(true);
    expect(merged.projects).toEqual(DEFAULT_PORTFOLIO_DATA.projects);

    expect(typeof merged.site).toBe('object');
    expect(Array.isArray(merged.site)).toBe(false);
    expect(merged.site.navbar.brandName).toBe(
      DEFAULT_PORTFOLIO_DATA.site.navbar.brandName
    );

    expect(merged.sections.projects.title).toBe(
      DEFAULT_PORTFOLIO_DATA.sections.projects.title
    );
    expect(merged.aboutPage.title).toBe(DEFAULT_PORTFOLIO_DATA.aboutPage.title);
  });

  it('appends &t= instead of double ? when VITE_CMS_REMOTE_URL already contains a query string', async () => {
    vi.stubEnv('VITE_CMS_REMOTE_URL', 'https://cdn.example.com/data.json?token=abc');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('offline'));

    const Probe = () => {
      const { data } = usePortfolio();
      return <div data-testid="hero-title">{data.hero.title}</div>;
    };

    render(
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    const fetchedUrl = String(fetchSpy.mock.calls[0]?.[0]);
    expect(fetchedUrl).toMatch(/^https:\/\/cdn\.example\.com\/data\.json\?token=abc&t=\d+$/);
    expect(fetchedUrl.split('?').length).toBe(2);
  });

  it('rejects path-traversal repo slugs and handles non-string branch cleanly in getRemoteRawDataUrl', () => {
    localStorage.setItem(
      REPO_CONFIG_STORAGE_KEY,
      JSON.stringify({ repo: '../evil', branch: 'main' })
    );
    expect(getRemoteRawDataUrl()).toBe(
      'https://raw.githubusercontent.com/mightysanju/portfolio-2024/main/src/data/portfolioData.json'
    );

    localStorage.setItem(
      REPO_CONFIG_STORAGE_KEY,
      JSON.stringify({ repo: './evil', branch: 'main' })
    );
    expect(getRemoteRawDataUrl()).toBe(
      'https://raw.githubusercontent.com/mightysanju/portfolio-2024/main/src/data/portfolioData.json'
    );

    localStorage.setItem(
      REPO_CONFIG_STORAGE_KEY,
      JSON.stringify({ repo: 'custom-org/custom-repo', branch: 42 })
    );
    expect(getRemoteRawDataUrl()).toBe(
      'https://raw.githubusercontent.com/custom-org/custom-repo/main/src/data/portfolioData.json'
    );

    localStorage.setItem(
      REPO_CONFIG_STORAGE_KEY,
      JSON.stringify({ repo: 'custom-org/custom-repo', branch: '../secret?x=1' })
    );
    expect(getRemoteRawDataUrl()).toBe(
      'https://raw.githubusercontent.com/custom-org/custom-repo/main/src/data/portfolioData.json'
    );
  });

  it('does not set hasUnsavedChanges or block remote hydration when localStorage draft is corrupt JSON', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(STORAGE_KEY, '{corrupt-json');

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          hero: {
            ...DEFAULT_PORTFOLIO_DATA.hero,
            title: 'Hydrated Remote Title',
          },
          projects: DEFAULT_PORTFOLIO_DATA.projects,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const Probe = () => {
      const { data, hasUnsavedChanges, isSyncingRemote } = usePortfolio();
      return (
        <div>
          <span data-testid="title">{data.hero.title}</span>
          <span data-testid="unsaved">{String(hasUnsavedChanges)}</span>
          <span data-testid="syncing">{String(isSyncingRemote)}</span>
        </div>
      );
    };

    render(
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    );

    expect(screen.getByTestId('unsaved')).toHaveTextContent('false');
    expect(warnSpy).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId('syncing')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('title')).toHaveTextContent('Hydrated Remote Title');
    expect(screen.getByTestId('unsaved')).toHaveTextContent('false');
  });

  it('rejects primitive type mismatches (including NaN/Infinity) while preserving valid falsy primitives', () => {
    const merged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      hero: {
        faviconUrl: 123 as unknown as string,
        title: 456 as unknown as string,
        greeting: false as unknown as string,
        statusBadge: '',
      },
      standalonePages: {
        linkedInnDemo: {
          defaultTimeFilterMinutes: 'bad' as unknown as number,
        },
      },
    });

    expect(merged.hero.faviconUrl).toBe(DEFAULT_PORTFOLIO_DATA.hero.faviconUrl);
    expect(merged.hero.title).toBe(DEFAULT_PORTFOLIO_DATA.hero.title);
    expect(merged.hero.greeting).toBe(DEFAULT_PORTFOLIO_DATA.hero.greeting);
    expect(merged.hero.statusBadge).toBe('');
    expect(merged.standalonePages.linkedInnDemo.defaultTimeFilterMinutes).toBe(
      DEFAULT_PORTFOLIO_DATA.standalonePages.linkedInnDemo.defaultTimeFilterMinutes
    );

    const falsyMerged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      hero: {
        statusBadge: '',
      },
      standalonePages: {
        linkedInnDemo: {
          defaultTimeFilterMinutes: 0,
        },
      },
      chatbot: {
        assistantName: '',
      },
    });
    expect(falsyMerged.hero.statusBadge).toBe('');
    expect(falsyMerged.standalonePages.linkedInnDemo.defaultTimeFilterMinutes).toBe(0);
    expect(falsyMerged.chatbot.assistantName).toBe('');

    const nonFiniteMerged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      standalonePages: {
        linkedInnDemo: {
          defaultTimeFilterMinutes: Number.NaN,
        },
      },
    });
    expect(nonFiniteMerged.standalonePages.linkedInnDemo.defaultTimeFilterMinutes).toBe(
      DEFAULT_PORTFOLIO_DATA.standalonePages.linkedInnDemo.defaultTimeFilterMinutes
    );
  });

  it('mounts PortfolioProvider cleanly without throwing TypeError when localStorage or remote fetch has non-string faviconUrl', async () => {
    class TestErrorBoundary extends Component<
      { children: ReactNode },
      { errorMessage: string | null }
    > {
      constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { errorMessage: null };
      }
      static getDerivedStateFromError(error: Error) {
        return { errorMessage: error.message };
      }
      render() {
        if (this.state.errorMessage) {
          return <div data-testid="eb-error">{this.state.errorMessage}</div>;
        }
        return this.props.children;
      }
    }

    // 1. localStorage with non-string faviconUrl
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ hero: { faviconUrl: 123 } }));
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));

    const Probe = () => {
      const { data, isSyncingRemote } = usePortfolio();
      return (
        <div>
          <span data-testid="favicon-url">{String(data.hero.faviconUrl)}</span>
          <span data-testid="syncing">{String(isSyncingRemote)}</span>
        </div>
      );
    };

    const firstRender = render(
      <TestErrorBoundary>
        <PortfolioProvider>
          <Probe />
        </PortfolioProvider>
      </TestErrorBoundary>
    );

    expect(screen.queryByTestId('eb-error')).toBeNull();
    expect(screen.getByTestId('favicon-url')).toHaveTextContent(
      DEFAULT_PORTFOLIO_DATA.hero.faviconUrl || '/favicon.png'
    );
    await waitFor(() => {
      expect(screen.getByTestId('syncing')).toHaveTextContent('false');
    });
    firstRender.unmount();

    // 2. Remote fetch with non-string faviconUrl
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          hero: {
            ...DEFAULT_PORTFOLIO_DATA.hero,
            faviconUrl: 123,
            title: 'Remote With Bad Favicon',
          },
          projects: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    render(
      <TestErrorBoundary>
        <PortfolioProvider>
          <Probe />
        </PortfolioProvider>
      </TestErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByTestId('syncing')).toHaveTextContent('false');
    });
    expect(screen.queryByTestId('eb-error')).toBeNull();
    expect(screen.getByTestId('favicon-url')).toHaveTextContent(
      DEFAULT_PORTFOLIO_DATA.hero.faviconUrl || '/favicon.png'
    );
  });

  it('drops corrupt non-object/non-string array elements while keeping explicit empty arrays', () => {
    const corruptArrayMerged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      projects: ['corrupt', null, 123] as unknown as PortfolioData['projects'],
      hero: {
        shippedSystemProjectIds: ['proj-1', 42, null] as unknown as string[],
      },
    });
    expect(corruptArrayMerged.projects).toEqual([]);
    expect(corruptArrayMerged.hero.shippedSystemProjectIds).toEqual(['proj-1']);

    const mixedWithDangerousKeys = JSON.parse(
      JSON.stringify({
        projects: [
          'corrupt',
          { id: 'proj-safe', title: 'Safe', description: 'D', image: '/a.png', tags: [], demo: '', github: '', blog: '' },
          null,
        ],
      })
    );
    Object.defineProperty(mixedWithDangerousKeys.projects[1], '__proto__', {
      value: { polluted: true },
      enumerable: true,
    });
    const mixedMerged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, mixedWithDangerousKeys);
    expect(mixedMerged.projects).toHaveLength(1);
    expect(mixedMerged.projects[0]?.id).toBe('proj-safe');
    expect((mixedMerged.projects[0] as unknown as Record<string, unknown>).polluted).toBeUndefined();

    const emptyMerged = mergePortfolioData(DEFAULT_PORTFOLIO_DATA, {
      projects: [],
      hero: { shippedSystemProjectIds: [] },
    });
    expect(emptyMerged.projects).toEqual([]);
    expect(emptyMerged.hero.shippedSystemProjectIds).toEqual([]);
  });

  it('rejects single-dot and leading/trailing slash branches in getRemoteRawDataUrl', () => {
    for (const badBranch of ['.', './main', '/main', 'main/', 'feature/./x']) {
      localStorage.setItem(
        REPO_CONFIG_STORAGE_KEY,
        JSON.stringify({ repo: 'custom-org/custom-repo', branch: badBranch })
      );
      expect(getRemoteRawDataUrl()).toBe(
        'https://raw.githubusercontent.com/custom-org/custom-repo/main/src/data/portfolioData.json'
      );
    }
  });
});
