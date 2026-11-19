import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import {
  PortfolioProvider,
  encryptTokenToVault,
  decryptTokenFromVault,
  VAULT_STORAGE_KEY,
} from '../context/PortfolioContext';
import { clearAllStagedAssets } from '../utils/assetManager';
import { AdminPanel } from '../components/admin/AdminPanel';

const renderAdmin = () =>
  render(
    <MemoryRouter>
      <PortfolioProvider>
        <AdminPanel />
      </PortfolioProvider>
    </MemoryRouter>
  );

const unlock = async (pw = 'admin123') => {
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: pw } });
  fireEvent.click(screen.getByText(/Sign in to CMS/i));
  await waitFor(() => expect(screen.getByText(/Hero, resume & favicon/i)).toBeInTheDocument());
};

describe('M4 vault + GitHub publish (real behavior)', () => {
  beforeEach(async () => {
    localStorage.clear();
    await clearAllStagedAssets();
  });
  afterEach(() => vi.restoreAllMocks());

  it('vault encrypts the token (ciphertext != plaintext) and round-trips only with the right password', async () => {
    await encryptTokenToVault('s3cret-pass', 'ghp_exampletoken123');
    const raw = localStorage.getItem(VAULT_STORAGE_KEY)!;
    expect(raw).not.toContain('ghp_exampletoken123');
    expect(await decryptTokenFromVault('s3cret-pass')).toEqual({ validPassword: true, token: 'ghp_exampletoken123' });
    expect((await decryptTokenFromVault('wrong')).validPassword).toBe(false);
  });

  it('Vault tab saves a token encrypted and a later unlock decrypts it', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    renderAdmin();
    await unlock();
    fireEvent.click(screen.getByText(/Security & GitHub/i));
    fireEvent.change(screen.getByLabelText(/Personal Access Token/i), { target: { value: 'ghp_abc' } });
    fireEvent.click(screen.getByText(/Encrypt & save token/i));
    await waitFor(() => expect(screen.getByText(/Token encrypted/i)).toBeInTheDocument());
    expect(localStorage.getItem(VAULT_STORAGE_KEY)).not.toContain('ghp_abc');
    expect((await decryptTokenFromVault('admin123')).token).toBe('ghp_abc');
  });

  it('Commit & push without a token reports an error and makes no GitHub request', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    renderAdmin();
    await unlock();
    fetchSpy.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /commit|push|publish/i }));
    await waitFor(() => expect(screen.getByText(/No GitHub token available/i)).toBeInTheDocument());
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('Commit & push with a stored token calls the GitHub Git Data API and surfaces the commit URL', async () => {
    await encryptTokenToVault('admin123', 'ghp_live');
    const calls: Array<{ url: string; method: string; auth: string }> = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input);
      const method = init?.method || 'GET';
      const auth = (init?.headers as Record<string, string> | undefined)?.Authorization || '';
      if (!url.includes('api.github.com')) throw new Error('offline');
      calls.push({ url, method, auth });
      const json = (b: unknown) => ({ ok: true, status: 200, json: async () => b }) as Response;
      if (url.includes('/git/ref/heads/')) return json({ object: { sha: 'c1' } });
      if (url.includes('/git/commits/c1')) return json({ tree: { sha: 't1' } });
      if (url.includes('/git/trees/t1')) return json({ tree: [] });
      if (url.endsWith('/git/blobs')) return json({ sha: 'b1' });
      if (url.endsWith('/git/trees')) return json({ sha: 't2' });
      if (url.endsWith('/git/commits')) return json({ sha: 'c2', html_url: 'https://github.com/o/r/commit/c2' });
      if (url.includes('/git/refs/heads/')) return json({});
      return { ok: false, status: 404, json: async () => ({ message: 'unexpected ' + url }) } as Response;
    });
    renderAdmin();
    await unlock();
    fireEvent.click(screen.getByRole('button', { name: /commit|push|publish/i }));
    await waitFor(() => expect(calls.some((c) => c.method === 'POST' && c.url.endsWith('/git/blobs'))).toBe(true));
    expect(calls.every((c) => c.auth === 'Bearer ghp_live')).toBe(true);
    await waitFor(() => expect(document.body.innerHTML).toContain('https://github.com/o/r/commit/c2'));
  });
});
