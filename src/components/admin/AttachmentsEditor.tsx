import React from 'react';
import { Paperclip, Plus, Trash2 } from 'lucide-react';
import type { AttachmentItem } from '../../context/PortfolioContext';
import { AssetField } from './AssetField';
import {
  BTN_DANGER,
  BTN_SECONDARY,
  INPUT_CLASS,
  LABEL_CLASS,
} from './adminStyles';

export interface AttachmentsEditorProps {
  attachments: AttachmentItem[];
  onChange: (next: AttachmentItem[]) => void;
  slugPrefix: string;
  title?: string;
  description?: string;
}

export const AttachmentsEditor: React.FC<AttachmentsEditorProps> = ({
  attachments,
  onChange,
  slugPrefix,
  title = 'Downloadable & embedded attachments',
  description = 'Upload PDFs, datasets, slides, or supporting files stored under /uploads/.',
}) => {
  const safeAttachments = attachments || [];

  const handleAdd = () => {
    const nextItem: AttachmentItem = {
      id: `att-${Date.now()}-${safeAttachments.length + 1}`,
      label: `Attachment ${safeAttachments.length + 1}`,
      url: '',
    };
    onChange([...safeAttachments, nextItem]);
  };

  const handleUpdate = (id: string, patch: Partial<AttachmentItem>) => {
    onChange(
      safeAttachments.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    onChange(safeAttachments.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#0b0d14]/50 border border-white/[0.08] rounded-[10px] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <Paperclip className="w-4 h-4 text-[#7a8296] mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <h4 className="text-xs font-medium text-[#eef0f5]">
              {title} ({safeAttachments.length})
            </h4>
            <p className="text-[11px] text-[#7a8296]">{description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`${BTN_SECONDARY} !h-8`}
        >
          <Plus className="w-3.5 h-3.5 text-[#a3a9b8]" strokeWidth={1.5} />
          Add attachment
        </button>
      </div>

      {safeAttachments.length === 0 ? (
        <div className="text-xs text-[#7a8296] italic py-1">
          No attachments configured yet.
        </div>
      ) : (
        <div className="space-y-3">
          {safeAttachments.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#11141c]/70 border border-white/[0.08] rounded-[8px] p-3 space-y-3"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className={LABEL_CLASS}>
                    Attachment #{idx + 1} label
                  </label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      handleUpdate(item.id, { label: e.target.value })
                    }
                    placeholder="e.g. Architecture Whitepaper (PDF)"
                    className={INPUT_CLASS}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className={BTN_DANGER}
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#e5484d]" strokeWidth={1.5} />
                  Remove
                </button>
              </div>

              <AssetField
                label={`Attachment file (${item.label || `#${idx + 1}`})`}
                value={item.url}
                kind="file"
                accept=".pdf,.doc,.docx,.txt,.csv,.json,.zip,image/*"
                customSlug={`${slugPrefix}-${item.label || `attachment-${idx + 1}`}`}
                placeholder="/uploads/... or https://..."
                onChange={(nextUrl, meta) =>
                  handleUpdate(item.id, {
                    url: nextUrl,
                    fileName: nextUrl ? meta?.fileName ?? item.fileName : undefined,
                    mimeType: nextUrl ? meta?.mimeType ?? item.mimeType : undefined,
                  })
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
