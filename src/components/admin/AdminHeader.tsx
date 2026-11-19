import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  GitCommit,
  LayoutGrid,
  RotateCcw,
  Save,
} from 'lucide-react';
import { BTN_PRIMARY, BTN_SECONDARY, type StatusBannerState } from './adminStyles';

export interface AdminHeaderProps {
  hasUnsavedChanges: boolean;
  queuedUploadCount: number;
  commitMessage: string;
  onCommitMessageChange: (next: string) => void;
  onSaveDraft: () => void;
  onExportJson: () => void;
  onReset: () => void;
  onCommitPush: () => void;
  isCommitting: boolean;
  statusBanner: StatusBannerState | null;
  onDismissBanner: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  hasUnsavedChanges,
  queuedUploadCount,
  commitMessage,
  onCommitMessageChange,
  onSaveDraft,
  onExportJson,
  onReset,
  onCommitPush,
  isCommitting,
  statusBanner,
  onDismissBanner,
}) => {
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#07080d]/80 backdrop-blur-xl border-b border-white/[0.10]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className={BTN_SECONDARY}>
            <ArrowLeft className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
            View live site
          </Link>

          <Link to="/design-preview" className={BTN_SECONDARY}>
            <LayoutGrid className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
            Design previews
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm font-medium text-[#eef0f5]">
              Portfolio CMS
            </span>
            {hasUnsavedChanges ? (
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] font-mono text-xs bg-[#1a1e28]/70 text-[#a3a9b8] border border-white/[0.10]">
                <span className="w-2 h-2 rounded-full bg-[#eef0f5]" />
                Local draft active
                {queuedUploadCount > 0
                  ? ` · ${queuedUploadCount} file(s) staged`
                  : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] font-mono text-xs bg-[#1a1e28]/70 text-[#a3a9b8] border border-white/[0.10]">
                <span className="w-2 h-2 rounded-full bg-[#4cc38a]" />
                Synced
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => onCommitMessageChange(e.target.value)}
            placeholder="Commit message"
            aria-label="Commit message"
            className="w-full sm:w-64 h-9 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-[#eef0f5]/40 rounded-[8px] px-3 text-xs text-[#eef0f5] placeholder-[#7a8296] focus:outline-none transition-colors duration-150"
          />

          <button
            type="button"
            onClick={onSaveDraft}
            className={BTN_SECONDARY}
            title="Save draft in browser localStorage"
          >
            <Save className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
            Save draft locally
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className={BTN_SECONDARY}
            title="Download portfolioData.json"
          >
            <Download className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
            Export JSON
          </button>

          {confirmingReset ? (
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setConfirmingReset(false);
                  onReset();
                }}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] bg-[#e5484d]/20 hover:bg-[#e5484d]/30 border border-[#e5484d]/40 text-xs font-medium text-[#e5484d] transition-colors duration-150"
              >
                Confirm reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className={BTN_SECONDARY}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#a3a9b8] hover:text-[#e5484d] transition-colors duration-150"
              title="Discard local draft and revert to published JSON"
            >
              <RotateCcw className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={onCommitPush}
            disabled={isCommitting}
            className={BTN_PRIMARY}
          >
            <GitCommit className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
            {isCommitting ? 'Pushing to GitHub...' : 'Commit & push to GitHub'}
          </button>
        </div>
      </div>

      {statusBanner && (
        <div className="border-t border-white/[0.10] bg-[#11141c]/90 backdrop-blur-xl px-6 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusBanner.type === 'error' ? (
                <AlertCircle
                  className="w-4 h-4 shrink-0 text-[#e5484d]"
                  strokeWidth={1.5}
                />
              ) : (
                <CheckCircle2
                  className="w-4 h-4 shrink-0 text-[#4cc38a]"
                  strokeWidth={1.5}
                />
              )}
              <span className="text-[#eef0f5]">{statusBanner.text}</span>
              {statusBanner.commitUrl && (
                <a
                  href={statusBanner.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline font-medium text-[#eef0f5] ml-2"
                >
                  View commit{' '}
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={onDismissBanner}
              className="text-xs text-[#7a8296] hover:text-[#eef0f5] ml-4 transition-colors duration-150"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
