import React from 'react';
import { Plus, Trash2, UserCheck } from 'lucide-react';
import {
  usePortfolio,
  type TestimonialItem,
} from '../../context/PortfolioContext';
import { AssetField } from './AssetField';
import {
  BTN_DANGER,
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  MONO_INPUT_CLASS,
  TEXTAREA_CLASS,
  formatSignatureId,
  generateInitialsAvatar,
} from './adminStyles';

export const TestimonialsTab: React.FC = () => {
  const { data, updateData, resolveAssetUrl } = usePortfolio();

  const handleAddTestimonial = () => {
    const newId = `rec-${Date.now()}`;
    const authorName = 'Colleague Name';
    const newRec: TestimonialItem = {
      id: newId,
      author: authorName,
      position: 'Engineering Manager, Company',
      text: 'Sanju delivers reliable machine learning and automation tools for operations teams.',
      image: generateInitialsAvatar(authorName),
      linkedinUrl: 'https://linkedin.com/in/mightysanju/',
    };
    updateData((prev) => ({
      ...prev,
      testimonials: [newRec, ...prev.testimonials],
    }));
  };

  const handleUpdateTestimonial = (
    id: string,
    patch: Partial<TestimonialItem>
  ) => {
    updateData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) =>
        t.id === id ? { ...t, ...patch } : t
      ),
    }));
  };

  const handleDeleteTestimonial = (id: string) => {
    updateData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-[#eef0f5]">
            LinkedIn recommendations
          </h2>
          <p className="text-sm text-[#a3a9b8]">
            Upload colleague avatar photos or generate automatic initials avatars.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddTestimonial}
          className={BTN_PRIMARY}
        >
          <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
          Add recommendation
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.testimonials.map((rec, index) => {
          const fallbackAvatar = generateInitialsAvatar(rec.author);
          return (
            <div
              key={rec.id}
              className={`${CARD_CLASS} flex flex-col lg:flex-row gap-6`}
            >
              {/* Live Card Preview */}
              <div className="w-full lg:w-80 shrink-0 bg-[#0b0d14]/80 border border-white/[0.10] rounded-[8px] p-5 flex flex-col justify-between min-h-[192px]">
                <div>
                  <div className="font-mono tabular-nums text-xs text-[#7a8296] mb-2">
                    {formatSignatureId('REC', index)}
                  </div>
                  <p className="text-xs text-[#a3a9b8] line-clamp-4 mb-4">
                    {rec.text}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.10]">
                  <img
                    src={resolveAssetUrl(rec.image) || fallbackAvatar}
                    alt={rec.author}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
                    }}
                    className="w-10 h-10 rounded-full object-cover border border-white/[0.10] shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-[#eef0f5] truncate">
                      {rec.author}
                    </h4>
                    <p className="text-xs text-[#7a8296] truncate">
                      {rec.position}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.10] pb-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateTestimonial(rec.id, {
                        image: generateInitialsAvatar(rec.author),
                      })
                    }
                    className={`${BTN_SECONDARY} !h-8`}
                  >
                    <UserCheck
                      className="w-4 h-4 text-[#a3a9b8]"
                      strokeWidth={1.5}
                    />
                    Use initials avatar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(rec.id)}
                    className={BTN_DANGER}
                  >
                    <Trash2
                      className="w-4 h-4 text-[#e5484d]"
                      strokeWidth={1.5}
                    />
                    Delete
                  </button>
                </div>

                <AssetField
                  label="Colleague avatar"
                  value={rec.image}
                  onChange={(url) =>
                    handleUpdateTestimonial(rec.id, { image: url })
                  }
                  accept="image/*"
                  kind="image"
                  maxWidth={300}
                  customSlug={`avatar-${rec.author}`}
                  fallbackUrl={fallbackAvatar}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Author name</label>
                    <input
                      type="text"
                      value={rec.author}
                      onChange={(e) =>
                        handleUpdateTestimonial(rec.id, {
                          author: e.target.value,
                        })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Role &amp; company</label>
                    <input
                      type="text"
                      value={rec.position}
                      onChange={(e) =>
                        handleUpdateTestimonial(rec.id, {
                          position: e.target.value,
                        })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS}>Recommendation text</label>
                    <textarea
                      rows={3}
                      value={rec.text}
                      onChange={(e) =>
                        handleUpdateTestimonial(rec.id, {
                          text: e.target.value,
                        })
                      }
                      className={TEXTAREA_CLASS}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS}>LinkedIn profile URL</label>
                    <input
                      type="text"
                      value={rec.linkedinUrl}
                      onChange={(e) =>
                        handleUpdateTestimonial(rec.id, {
                          linkedinUrl: e.target.value,
                        })
                      }
                      className={MONO_INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
