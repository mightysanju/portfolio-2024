import React from 'react';
import { Layers } from 'lucide-react';
import { usePortfolio, type HeroData } from '../../context/PortfolioContext';
import { AssetField } from './AssetField';
import {
  BTN_SECONDARY,
  CARD_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  MONO_INPUT_CLASS,
  SUBCARD_CLASS,
  TEXTAREA_CLASS,
} from './adminStyles';

export const HeroTab: React.FC = () => {
  const { data, updateData } = usePortfolio();

  const updateHeroField = <K extends keyof HeroData>(
    key: K,
    value: HeroData[K]
  ) => {
    updateData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: value,
      },
    }));
  };

  // When shippedSystemProjectIds is undefined, all current projects are active.
  const projectIds = data.projects.map((p) => p.id);
  const rawSelectedIds =
    data.hero.shippedSystemProjectIds === undefined
      ? projectIds
      : data.hero.shippedSystemProjectIds;
  const activeSelectedIds = rawSelectedIds.filter((id) =>
    projectIds.includes(id)
  );
  const activeSet = new Set(activeSelectedIds);
  const recordsCount = activeSelectedIds.length;
  const recordsLabel = `${recordsCount} ${recordsCount === 1 ? 'RECORD' : 'RECORDS'}`;

  const handleToggleProject = (projectId: string) => {
    updateData((prev) => {
      const allIds = prev.projects.map((p) => p.id);
      const current =
        prev.hero.shippedSystemProjectIds === undefined
          ? allIds
          : prev.hero.shippedSystemProjectIds.filter((id) =>
              allIds.includes(id)
            );
      const exists = current.includes(projectId);
      const next = exists
        ? current.filter((id) => id !== projectId)
        : [...current, projectId];

      return {
        ...prev,
        hero: {
          ...prev.hero,
          shippedSystemProjectIds: next,
        },
      };
    });
  };

  const handleSelectAll = () => {
    updateData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        shippedSystemProjectIds: prev.projects.map((p) => p.id),
      },
    }));
  };

  const handleDeselectAll = () => {
    updateData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        shippedSystemProjectIds: [],
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Main Hero Identity & Assets Card */}
      <div className={`${CARD_CLASS} space-y-6`}>
        <div>
          <h2 className="text-lg font-medium text-[#eef0f5]">
            Hero, profile photo, resume &amp; favicon
          </h2>
          <p className="text-sm text-[#a3a9b8]">
            Edit every hero copy block, button label, external profile URL, and upload your profile photo, browser favicon, and resume under{' '}
            <code className="font-mono text-xs text-[#eef0f5]">/uploads/</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hero-greeting" className={LABEL_CLASS}>
              Name or greeting line
            </label>
            <input
              id="hero-greeting"
              type="text"
              value={data.hero.greeting}
              onChange={(e) => updateHeroField('greeting', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-title" className={LABEL_CLASS}>
              Primary role title
            </label>
            <input
              id="hero-title"
              type="text"
              value={data.hero.title}
              onChange={(e) => updateHeroField('title', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="hero-subtitle" className={LABEL_CLASS}>
              Hero subtitle
            </label>
            <textarea
              id="hero-subtitle"
              rows={3}
              value={data.hero.subtitle}
              onChange={(e) => updateHeroField('subtitle', e.target.value)}
              className={TEXTAREA_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-status-badge" className={LABEL_CLASS}>
              Availability status badge
            </label>
            <input
              id="hero-status-badge"
              type="text"
              value={data.hero.statusBadge || ''}
              onChange={(e) => updateHeroField('statusBadge', e.target.value)}
              placeholder="AVAILABLE · DATA SCIENCE & ML ENGINEERING"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-profile-card-name" className={LABEL_CLASS}>
              Profile card name
            </label>
            <input
              id="hero-profile-card-name"
              type="text"
              value={data.hero.profileCardName || ''}
              onChange={(e) =>
                updateHeroField('profileCardName', e.target.value)
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-profile-card-subtitle" className={LABEL_CLASS}>
              Profile card subtitle
            </label>
            <input
              id="hero-profile-card-subtitle"
              type="text"
              value={data.hero.profileCardSubtitle || ''}
              onChange={(e) =>
                updateHeroField('profileCardSubtitle', e.target.value)
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-profile-card-id" className={LABEL_CLASS}>
              Profile card ID / location tag
            </label>
            <input
              id="hero-profile-card-id"
              type="text"
              value={data.hero.profileCardId || ''}
              onChange={(e) => updateHeroField('profileCardId', e.target.value)}
              className={MONO_INPUT_CLASS}
            />
          </div>
        </div>

        {/* Uploadable Hero Assets */}
        <div className="space-y-3 pt-2">
          <AssetField
            label="Hero profile photo"
            value={data.hero.profileImage}
            onChange={(url) => updateHeroField('profileImage', url)}
            accept="image/*"
            kind="image"
            maxWidth={600}
            customSlug="profile-photo"
            fallbackUrl="/favicon.png"
            fieldTestId="asset-field-hero-profile"
            helperText="Stages locally into /uploads/ with immediate preview; clears to empty string."
          />

          <AssetField
            label="Browser tab favicon"
            value={data.hero.faviconUrl || ''}
            onChange={(url) => updateHeroField('faviconUrl', url)}
            accept="image/*,.ico,.svg"
            kind="image"
            maxWidth={192}
            customSlug="favicon"
            fallbackUrl={data.hero.profileImage || '/favicon.png'}
            fieldTestId="asset-field-hero-favicon"
            helperText="Updates document <link rel='icon'> immediately on upload."
          />

          <AssetField
            label="Resume PDF / document"
            value={data.hero.resumeUrl}
            onChange={(url) => updateHeroField('resumeUrl', url)}
            accept=".pdf,.doc,.docx,image/*"
            kind="file"
            customSlug="sanju-kumar-resume"
            placeholder="Upload resume PDF or paste external URL..."
            fieldTestId="asset-field-hero-resume"
            helperText="Stages PDF/DOCX under /uploads/ with immediate Open & Download preview links."
          />
        </div>

        {/* CTA Button Labels & Profile Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label htmlFor="hero-resume-btn-label" className={LABEL_CLASS}>
              Resume button label
            </label>
            <input
              id="hero-resume-btn-label"
              type="text"
              value={data.hero.resumeButtonLabel || ''}
              onChange={(e) =>
                updateHeroField('resumeButtonLabel', e.target.value)
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-about-btn-label" className={LABEL_CLASS}>
              About button label
            </label>
            <input
              id="hero-about-btn-label"
              type="text"
              value={data.hero.aboutButtonLabel || ''}
              onChange={(e) =>
                updateHeroField('aboutButtonLabel', e.target.value)
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-linkedin-btn-label" className={LABEL_CLASS}>
              LinkedIn button label
            </label>
            <input
              id="hero-linkedin-btn-label"
              type="text"
              value={data.hero.linkedinButtonLabel || ''}
              onChange={(e) =>
                updateHeroField('linkedinButtonLabel', e.target.value)
              }
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-linkedin-url" className={LABEL_CLASS}>
              LinkedIn profile URL
            </label>
            <input
              id="hero-linkedin-url"
              type="text"
              value={data.hero.linkedinUrl}
              onChange={(e) => updateHeroField('linkedinUrl', e.target.value)}
              className={MONO_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-credly-url" className={LABEL_CLASS}>
              Credly profile URL
            </label>
            <input
              id="hero-credly-url"
              type="text"
              value={data.hero.credlyUrl}
              onChange={(e) => updateHeroField('credlyUrl', e.target.value)}
              className={MONO_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="hero-linkedin-certs-url" className={LABEL_CLASS}>
              LinkedIn credentials URL
            </label>
            <input
              id="hero-linkedin-certs-url"
              type="text"
              value={data.hero.linkedinCertsUrl || ''}
              onChange={(e) =>
                updateHeroField('linkedinCertsUrl', e.target.value)
              }
              className={MONO_INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* R3 Hero Shipped Systems Scroller & Project Selector */}
      <div className={`${CARD_CLASS} space-y-5`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#1a1e28]/70 border border-white/[0.10] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-medium text-[#eef0f5]">
                Hero &ldquo;Shipped Systems&rdquo; scroller &amp; selector
              </h3>
              <p className="text-xs text-[#a3a9b8] mt-0.5">
                Choose which projects appear in the Hero vertical auto-scroller. The active records badge updates live.
              </p>
            </div>
          </div>

          <span
            data-testid="admin-shipped-records-count"
            className="inline-flex items-center px-2.5 py-1 rounded-[6px] font-mono tabular-nums text-xs bg-[#1a1e28]/80 text-[#eef0f5] border border-white/[0.12]"
          >
            {recordsLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="hero-shipped-title" className={LABEL_CLASS}>
              Shipped systems card title
            </label>
            <input
              id="hero-shipped-title"
              type="text"
              value={data.hero.shippedSystemsTitle || ''}
              onChange={(e) =>
                updateHeroField('shippedSystemsTitle', e.target.value)
              }
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="hero-shipped-footer-stack" className={LABEL_CLASS}>
              Footer stack summary
            </label>
            <input
              id="hero-shipped-footer-stack"
              type="text"
              value={data.hero.shippedSystemsFooterStack || ''}
              onChange={(e) =>
                updateHeroField('shippedSystemsFooterStack', e.target.value)
              }
              className={MONO_INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="hero-shipped-footer-status" className={LABEL_CLASS}>
              Footer status label
            </label>
            <input
              id="hero-shipped-footer-status"
              type="text"
              value={data.hero.shippedSystemsFooterStatus || ''}
              onChange={(e) =>
                updateHeroField('shippedSystemsFooterStatus', e.target.value)
              }
              className={MONO_INPUT_CLASS}
            />
          </div>
        </div>

        <div className={`${SUBCARD_CLASS} space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-[#eef0f5]">
              Included projects ({recordsCount} of {data.projects.length} selected)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`${BTN_SECONDARY} !h-8`}
              >
                Select all
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className={`${BTN_SECONDARY} !h-8`}
              >
                Deselect all
              </button>
            </div>
          </div>

          {data.projects.length === 0 ? (
            <p className="text-xs text-[#7a8296]">
              No projects available. Add projects in the Projects &amp; blogs tab.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.projects.map((proj, index) => {
                const checked = activeSet.has(proj.id);
                return (
                  <label
                    key={proj.id}
                    className={`flex items-start gap-3 p-3 rounded-[8px] border cursor-pointer transition-colors duration-150 ${
                      checked
                        ? 'bg-[#1a1e28]/80 border-white/[0.16]'
                        : 'bg-[#0b0d14]/40 border-white/[0.06] opacity-75'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleProject(proj.id)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#0b0d14] accent-[#eef0f5]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[#eef0f5] truncate">
                          {proj.title}
                        </span>
                        <span className="font-mono text-[10px] text-[#7a8296] shrink-0">
                          PRJ-{String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7a8296] truncate mt-0.5">
                        {proj.tags.slice(0, 3).join(' · ')}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
