import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';
import { decryptTokenFromVault } from '../../context/PortfolioContext';
import { CARD_CLASS } from './adminStyles';

export interface AdminAuthGateProps {
  vaultExists: boolean;
  onUnlockSuccess: (password: string, decryptedToken: string) => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  vaultExists,
  onUnlockSuccess,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setAuthError('Enter your admin password');
      return;
    }

    setIsUnlocking(true);
    try {
      const result = await decryptTokenFromVault(trimmed);
      if (!result.validPassword) {
        setAuthError('Invalid password (default on first visit is admin123)');
        return;
      }
      setPasswordInput('');
      onUnlockSuccess(trimmed, result.token || '');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5] flex flex-col justify-center items-center px-4">
      <div className={`w-full max-w-md ${CARD_CLASS}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="w-9 h-9 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] flex items-center justify-center">
            <Lock className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#a3a9b8] hover:text-[#eef0f5] transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
            Back to portfolio
          </Link>
        </div>

        <div className="font-mono text-xs text-[#7a8296] mb-1">
          SYS-ADMIN · CONTENT VAULT
        </div>
        <h1 className="text-xl font-medium text-[#eef0f5] mb-2">
          Portfolio administration
        </h1>
        <p className="text-sm text-[#a3a9b8] mb-6">
          Authenticate to edit site-wide CMS content, write project blogs, upload files, and commit changes to GitHub.
          {!vaultExists && (
            <span className="block mt-2 text-xs text-[#7a8296]">
              Default first-visit password:{' '}
              <code className="font-mono text-[#eef0f5] px-1.5 py-0.5 bg-[#1a1e28]/70 border border-white/[0.10] rounded-[4px]">
                admin123
              </code>
            </span>
          )}
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password-input"
              className="block text-xs text-[#a3a9b8] mb-2"
            >
              Admin password
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full h-10 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 pr-10 text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none transition-colors duration-150"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {authError && (
            <div
              role="alert"
              className="flex items-center gap-2 text-xs text-[#e5484d] bg-[#1a1e28]/70 border border-[#e5484d]/30 rounded-[8px] px-3 py-2.5"
            >
              <AlertCircle
                className="w-4 h-4 shrink-0 text-[#e5484d]"
                strokeWidth={1.5}
              />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full h-10 px-4 rounded-[8px] text-sm font-medium bg-[#eef0f5] text-[#0b0d14] hover:bg-white disabled:opacity-60 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150 flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
            {isUnlocking ? 'Unlocking...' : 'Sign in to CMS'}
          </button>
        </form>
      </div>
    </div>
  );
};
