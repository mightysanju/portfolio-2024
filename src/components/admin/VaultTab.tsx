import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Trash2, Lock } from 'lucide-react';
import {
  encryptTokenToVault,
  decryptTokenFromVault,
  getVaultMetadata,
  REPO_CONFIG_STORAGE_KEY,
} from '../../context/PortfolioContext';
import { CARD_CLASS, INPUT_CLASS, MONO_INPUT_CLASS, LABEL_CLASS, BTN_PRIMARY, BTN_SECONDARY } from './adminStyles';

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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const check = await decryptTokenFromVault(password);
      if (!check.validPassword || check.token !== clean) {
        throw new Error('Vault verification failed after encryption');
      }
      onTokenSaved(clean);
      // Remove setTokenInput('') here to persist the value in the input field if desired, 
      // or set it to the masked version/empty as per your preference.
      // To keep it shown after save, comment out the line below.
      // setTokenInput(''); 
      refresh();
      setMsg({ ok: true, text: 'Token encrypted and stored.' });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Failed to save token' });
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMsg({ ok: false, text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 4) {
      setMsg({ ok: false, text: 'New password must be at least 4 characters.' });
      return;
    }
    setBusy(true);
    try {
      await encryptTokenToVault(newPassword, token);
      onPasswordChanged(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      refresh();
      setMsg({ ok: true, text: 'Admin password updated.' });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Failed to change password' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className={CARD_CLASS}>
        <h2 className="flex items-center gap-2 text-base font-medium mb-1">
          <Lock className="w-4 h-4 text-[#7a8296]" /> Change admin password
        </h2>
        <p className="text-xs text-[#a3a9b8] mb-4">Replace the default admin123 password with your own custom password. Stored as a salted SHA-256 + PBKDF2 key in your browser.</p>
        
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Current password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>New password (min 4 characters)</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={INPUT_CLASS} />
          </div>
          <button type="button" disabled={busy} onClick={changePassword} className={BTN_PRIMARY}>
            <Lock className="w-4 h-4" /> Update admin password
          </button>
        </div>
      </section>

      <section className={CARD_CLASS}>
        <h2 className="flex items-center gap-2 text-base font-medium mb-1">
          <ShieldCheck className="w-4 h-4 text-[#7a8296]" /> GitHub publishing vault
        </h2>
        <p className="text-xs text-[#a3a9b8] mb-4">Your GitHub Fine-Grained PAT is encrypted with AES-GCM (256-bit) using your admin password so you can commit directly to GitHub.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={LABEL_CLASS}>Target GitHub repository</label>
            <input className={INPUT_CLASS} value={repoCfg.repo} onChange={(e) => setRepoCfg({ ...repoCfg, repo: e.target.value })} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Target branch</label>
            <input className={INPUT_CLASS} value={repoCfg.branch} onChange={(e) => setRepoCfg({ ...repoCfg, branch: e.target.value })} />
          </div>
        </div>

        <label className={LABEL_CLASS}>GitHub Fine-Grained PAT (Contents: Read & write on mightysanju/portfolio-2024)</label>
        <input
          type="password"
          className={`${MONO_INPUT_CLASS} mb-4`}
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="ghp_..."
        />
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-emerald-400">Vault active ({new Date().toLocaleTimeString()})</span>
          <button type="button" disabled={busy} onClick={saveToken} className={BTN_PRIMARY}>
            <ShieldCheck className="w-4 h-4" /> Encrypt &amp; save GitHub token
          </button>
        </div>
      </section>

      {msg && (
        <div className="lg:col-span-2">
          <p role="status" className={`text-sm ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
        </div>
      )}
    </div>
  );
};
