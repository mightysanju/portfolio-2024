import React, { useEffect, useId, useState } from 'react';
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Trash2,
  Upload,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  BTN_SECONDARY,
  MONO_INPUT_CLASS,
  isImageLikeUrl,
  isStagedUploadPath,
} from './adminStyles';

export interface AssetFieldProps {
  label: string;
  value: string;
  onChange: (
    nextUrl: string,
    meta?: { fileName?: string; mimeType?: string }
  ) => void;
  accept?: string;
  kind?: 'image' | 'file' | 'auto';
  maxWidth?: number;
  customSlug?: string;
  fallbackUrl?: string;
  placeholder?: string;
  allowUrlInput?: boolean;
  allowClear?: boolean;
  helperText?: string;
  uploadButtonLabel?: string;
  fieldTestId?: string;
}

export const AssetField: React.FC<AssetFieldProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*',
  kind = 'auto',
  maxWidth = 900,
  customSlug,
  fallbackUrl,
  placeholder = '/uploads/... or https://...',
  allowUrlInput = true,
  allowClear = true,
  helperText,
  uploadButtonLabel,
  fieldTestId,
}) => {
  const inputId = useId();
  const urlInputId = useId();
  const { uploadAsset, resolveAssetUrl, queuedUploads } = usePortfolio();

  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [value]);

  const resolvedUrl = resolveAssetUrl(value);
  const isStaged = isStagedUploadPath(value, queuedUploads);
  const showImage =
    kind === 'image' || (kind === 'auto' && isImageLikeUrl(value));

  const previewImageSrc =
    imgError && fallbackUrl
      ? resolveAssetUrl(fallbackUrl)
      : resolvedUrl || (fallbackUrl ? resolveAssetUrl(fallbackUrl) : '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setLocalError('');
    setIsUploading(true);
    try {
      const res = await uploadAsset({
        file,
        customSlug,
        maxWidth,
      });

      if (res.success && res.url) {
        onChange(res.url, {
          fileName: file.name,
          mimeType: file.type || undefined,
        });
      } else {
        setLocalError(res.error || res.message || 'Asset upload failed');
      }
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : 'Asset upload failed'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const buttonText = isUploading
    ? 'Uploading...'
    : uploadButtonLabel ||
      (value ? (showImage ? 'Replace image' : 'Replace file') : showImage ? 'Upload image' : 'Upload file');

  const downloadFileName =
    value.split('/').filter(Boolean).pop() || 'asset';

  return (
    <div
      data-testid={fieldTestId}
      className="bg-[#0b0d14]/60 border border-white/[0.08] rounded-[10px] p-3.5 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showImage ? (
            <div className="w-12 h-12 rounded-[8px] overflow-hidden border border-white/[0.10] bg-[#1a1e28] flex items-center justify-center shrink-0">
              {previewImageSrc ? (
                <img
                  src={previewImageSrc}
                  alt={`${label} preview`}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-[#7a8296]" strokeWidth={1.5} />
              )}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-[8px] border border-white/[0.10] bg-[#1a1e28] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[#eef0f5]">{label}</span>
              {isStaged && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] font-mono text-[10px] bg-[#4cc38a]/15 text-[#4cc38a] border border-[#4cc38a]/30">
                  Staged locally
                </span>
              )}
            </div>
            <div className="font-mono text-xs text-[#7a8296] truncate mt-0.5">
              {value || 'No asset selected'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label
            htmlFor={inputId}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150 ${
              isUploading ? 'opacity-60 pointer-events-none' : 'cursor-pointer'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#0b0d14]" strokeWidth={1.5} />
            <span>{buttonText}</span>
            <input
              id={inputId}
              type="file"
              accept={accept}
              disabled={isUploading}
              onChange={handleFileChange}
              aria-label={`Upload ${label}`}
              className="hidden"
            />
          </label>

          {!showImage && resolvedUrl && (
            <>
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_SECONDARY} !h-8 !px-2.5`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#a3a9b8]" strokeWidth={1.5} />
                Open
              </a>
              <a
                href={resolvedUrl}
                download={downloadFileName}
                className={`${BTN_SECONDARY} !h-8 !px-2.5`}
              >
                <Download className="w-3.5 h-3.5 text-[#a3a9b8]" strokeWidth={1.5} />
                Download
              </a>
            </>
          )}

          {allowClear && value && (
            <button
              type="button"
              onClick={() => {
                setLocalError('');
                onChange('');
              }}
              aria-label={`Clear ${label}`}
              className="inline-flex items-center gap-1 h-8 px-2.5 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-xs font-medium text-[#a3a9b8] hover:text-[#e5484d] transition-colors duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              Clear
            </button>
          )}
        </div>
      </div>

      {allowUrlInput && (
        <div>
          <label htmlFor={urlInputId} className="sr-only">
            {label} URL
          </label>
          <input
            id={urlInputId}
            type="text"
            value={value}
            onChange={(e) => {
              setLocalError('');
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            aria-label={`${label} URL`}
            className={MONO_INPUT_CLASS}
          />
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-[#7a8296]">{helperText}</p>
      )}

      {localError && (
        <div
          role="alert"
          className="flex items-center gap-2 text-xs text-[#e5484d] bg-[#1a1e28]/70 border border-[#e5484d]/30 rounded-[6px] px-2.5 py-1.5"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
};
