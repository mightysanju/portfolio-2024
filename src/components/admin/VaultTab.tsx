import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Trash2 } from 'lucide-react';
import {
  encryptTokenToVault,
  decryptTokenFromVault,
  getVaultMetadata,
  REPO_CONFIG_STORAGE_KEY,
} from '../../context/PortfolioContext';
import { CARD_CLASS, INPUT_CLASS, MONO_INPUT_CLASS, LABEL_CLASS } from './adminStyles';

export interface VaultTabProps {
  password: string;
  token: string;
  onTokenSaved: (token: string) => void;
  onPasswordChanged: (password: string) => void;
}

function readRepoConfig(): { repo: string; branch: string } {
  try {
    const raw = localStorage.getItem(REPO_CONFIG_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as { repo?: string; branch?: string };
      return { repo: p.repo || 'mightysanju/portfolio-2024', branch: p.branch || 'main' };
    }
  } catch {
    // ignore
  }
  return { repo: 'mightysanju/portfolio-2024', branch: 'main' };
}

export const VaultTab: React.FC<VaultTabProps> = ({
  password,
  token,
  onTokenSaved,
  onPasswordChanged,
}) => {
  const [meta, setMeta] = useState(getVaultMetadata());
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repoCfg, setRepoCfg] = useState(readRepoConfig());
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => setMeta(getVaultMetadata());

  const saveToken = async () => {
    const clean = tokenInput.trim();
    if (!clean) {
      setMsg({ ok: false, text: 'Enter a GitHub Personal Access Token.' });
      return;
    }
    setBusy(true);
    try {
      await encryptTokenToVault(password, clean);
      // Verify round trip so we never report success for an unreadable vault
      const check = await decryptTokenFromVault(password);
      if (!check.validPassword || check.token !== clean) {
        throw new Error('Vault verification failed after encryption');
      }
      onTokenSaved(clean);
      setTokenInput('');
      refresh();
      setMsg({ ok: true, text: 'Token encrypted (AES-GCM, PBKDF2) and stored in this browser.' });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Failed to save token' });
    } finally {
      setBusy(false);
    }
  };

  const clearToken = async () => {
    setBusy(true);
    try {
      await encryptTokenToVault(password, '');
      onTokenSaved('');
      refresh();
      setMsg({ ok: true, text: 'Stored token removed.' });
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async () => {
    const np = newPassword.trim();
    if (np.length < 8) {
      setMsg({ ok: false, text: 'New password must be at least 8 characters.' });
      return;
    }
    setBusy(true);
    try {
      await encryptTokenToVault(np, token);
      onPasswordChanged(np);
      setNewPassword('');
      refresh();
      setMsg({ ok: true, text: 'Admin password changed; vault re-encrypted.' });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Failed to change password' });
    } finally {
      setBusy(false);
    }
  };

  const saveRepo = () => {
    const repo = repoCfg.repo.trim();
    const branch = repoCfg.branch.trim();
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) || !branch) {
      setMsg({ ok: false, text: 'Repo must be owner/name and branch must not be empty.' });
      return;
    }
    localStorage.setItem(REPO_CONFIG_STORAGE_KEY, JSON.stringify({ repo, branch }));
    setMsg({ ok: true, text: `Publish target set to ${repo}@${branch}.` });
  };

  return (
    <div className="space-y-6">
      <section className={CARD_CLASS}>
        <h2 className="flex items-center gap-2 text-base font-medium mb-1">
          <KeyRound className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} /> GitHub token vault
        </h2>
        <p className="text-xs text-[#a3a9b8] mb-4">
          Status:{' '}
          {meta.hasToken ? 'encrypted token stored' : 'no token stored'}
          {meta.updatedAt ? ` · updated ${new Date(meta.updatedAt).toLocaleString()}` : ''}
          {token ? ' · unlocked for this session' : ''}
        </p>
        <label className={LABEL_CLASS} htmlFor="vault-token">Personal Access Token (contents: write)</label>
        <input
          id="vault-token"
          type="password"
          autoComplete="off"
          className={MONO_INPUT_CLASS}
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="github_pat_..."
        />
        <div className="flex gap-2 mt-3">
          <button type="button" disabled={busy} onClick={saveToken} className="h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] text-sm font-medium disabled:opacity-50">
            Encrypt &amp; save token
          </button>
          <button type="button" disabled={busy || !meta.hasToken} onClick={clearToken} className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] border border-white/[0.10] text-sm text-[#a3a9b8] disabled:opacity-50">
            <Trash2 className="w-4 h-4" strokeWidth={1.5} /> Remove token
          </button>
        </div>
      </section>

      <section className={CARD_CLASS}>
        <h2 className="text-base font-medium mb-3">Publish target</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS} htmlFor="vault-repo">Repository (owner/name)</label>
            <input id="vault-repo" className={INPUT_CLASS} value={repoCfg.repo} onChange={(e) => setRepoCfg({ ...repoCfg, repo: e.target.value })} />
          </div>
          <div>
            <label className={LABEL_CLASS} htmlFor="vault-branch">Branch</label>
            <input id="vault-branch" className={INPUT_CLASS} value={repoCfg.branch} onChange={(e) => setRepoCfg({ ...repoCfg, branch: e.target.value })} />
          </div>
        </div>
        <button type="button" onClick={saveRepo} className="mt-3 h-9 px-4 rounded-[8px] border border-white/[0.10] text-sm">Save target</button>
      </section>

      <section className={CARD_CLASS}>
        <h2 className="flex items-center gap-2 text-base font-medium mb-3">
          <ShieldCheck className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} /> Change admin password
        </h2>
        <label className={LABEL_CLASS} htmlFor="vault-newpw">New password (min 8 chars)</label>
        <input id="vault-newpw" type="password" autoComplete="new-password" className={INPUT_CLASS} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button type="button" disabled={busy} onClick={changePassword} className="mt-3 h-9 px-4 rounded-[8px] border border-white/[0.10] text-sm disabled:opacity-50">Update password</button>
      </section>

      {msg && (
        <p role="status" className={`text-sm ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
      )}
    </div>
  );
};

