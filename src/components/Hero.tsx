import React, { useEffect, useMemo, useState } from 'react';
import { Download, User, ArrowUpRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialScroll from './TestimonialScroll';
import TechStackStrip from './TechStackStrip';
import { usePortfolio, type ProjectItem } from '../context/PortfolioContext';

const DEFAULT_RESUME_URL =
  'https://acrobat.adobe.com/id/urn:aaid:sc:AP:c816e211-3b4d-43d3-826d-cfc17d4011e4';

function formatProjectTags(project: ProjectItem): string {
  const safeTags = Array.isArray(project.tags)
    ? project.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : [];
  return safeTags.slice(0, 2).join(' · ') || 'SYSTEM';
}

function dataUrlToObjectUrl(dataUrl: string): string {
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return '';
  }
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) return '';
  const header = dataUrl.slice(0, commaIndex);
  const payload = dataUrl.slice(commaIndex + 1);
  const mimeMatch = header.match(/^data:([^;,]+)/i);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const isBase64 = /;base64$/i.test(header);

  let bytes: Uint8Array;
  if (isBase64) {
    const binary = atob(payload);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
  } else {
    const decoded = decodeURIComponent(payload);
    bytes = new TextEncoder().encode(decoded);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

const Hero: React.FC = () => {
  const { data, resolveAssetUrl, queuedUploads } = usePortfolio();
  const { hero } = data;
  const [legacyBlobUrl, setLegacyBlobUrl] = useState<string>('');

  const rawResumeUrl =
    typeof hero.resumeUrl === 'string' ? hero.resumeUrl.trim() : DEFAULT_RESUME_URL;
  const resolvedResumeUrl = rawResumeUrl ? resolveAssetUrl(rawResumeUrl) : '';

  useEffect(() => {
    if (!resolvedResumeUrl || !resolvedResumeUrl.startsWith('data:')) {
      setLegacyBlobUrl('');
      return;
    }

    let objectUrl = '';
    try {
      objectUrl = dataUrlToObjectUrl(resolvedResumeUrl);
      setLegacyBlobUrl(objectUrl);
    } catch {
      setLegacyBlobUrl('');
    }

    return () => {
      if (objectUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resolvedResumeUrl]);

  const effectiveResumeUrl = resolvedResumeUrl.startsWith('data:')
    ? legacyBlobUrl
    : resolvedResumeUrl;

  const isLocalOrBlobResume =
    effectiveResumeUrl.startsWith('blob:') ||
    rawResumeUrl.startsWith('/uploads/') ||
    rawResumeUrl.startsWith('/');

  const resumeFileName = useMemo(() => {
    if (!rawResumeUrl) return 'resume.pdf';
    const queued = queuedUploads[rawResumeUrl];
    if (queued?.fileName) return queued.fileName;
    const stripped = rawResumeUrl.split(/[?#]/)[0];
    const base = stripped.split('/').pop();
    return base || 'resume.pdf';
  }, [queuedUploads, rawResumeUrl]);

  const rawProfileImage =
    typeof hero.profileImage === 'string' ? hero.profileImage.trim() : '/favicon.png';
  const resolvedProfileImage =
    (rawProfileImage ? resolveAssetUrl(rawProfileImage) : '') || '/favicon.png';

  const linkedinHref =
    typeof hero.linkedinUrl === 'string'
      ? hero.linkedinUrl.trim()
      : 'https://linkedin.com/in/mightysanju/';

  const selectedProjects = useMemo(() => {
    const allProjects = Array.isArray(data.projects) ? data.projects : [];
    if (!Array.isArray(hero.shippedSystemProjectIds)) {
      return allProjects;
    }
    const selectedIds = new Set(hero.shippedSystemProjectIds);
    return allProjects.filter((project) => selectedIds.has(project.id));
  }, [data.projects, hero.shippedSystemProjectIds]);

  const recordCountLabel = `${selectedProjects.length} ${
    selectedProjects.length === 1 ? 'RECORD' : 'RECORDS'
  }`;

  const renderSystemRow = (project: ProjectItem, index: number, keyPrefix: string) => {
    const sysCode = `SYS-${String(index + 1).padStart(2, '0')}`;
    return (
      <div
        key={`${keyPrefix}-${project.id || index}`}
        className="min-h-[44px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-[#3b82f6] tabular-nums flex-shrink-0">
            {sysCode}
          </span>
          <span className="text-[#7a8296]">·</span>
          <span className="font-mono text-[#eef0f5] tabular-nums truncate">
            {project.title}
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#7a8296] tabular-nums flex-shrink-0">
          {formatProjectTags(project)}
        </span>
      </div>
    );
  };

  return (
    <div className="relative h-screen flex flex-col pt-24 pb-0 bg-[#0b0d14] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Direct Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Quiet Status Line */}
            <div className="inline-flex items-center gap-2.5 text-sm text-[#a3a9b8]">
              <span className="h-2 w-2 rounded-full bg-[#4cc38a] flex-shrink-0" />
              <span>
                {hero.statusBadge ?? 'Naperville, IL · Data Science & ML Engineering'}
              </span>
            </div>

            {/* Display Headline */}
            <div className="space-y-2">
              <p className="font-mono text-xs text-[#7a8296] tabular-nums">
                {hero.greeting || "I'm Sanju"}
              </p>
              <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-medium tracking-[-0.03em] text-[#eef0f5] leading-[1.08]">
                {hero.title || 'Data Scientist & ML Engineer'}
              </h1>
            </div>

            {/* Secondary Subhead */}
            <p className="text-base sm:text-lg text-[#a3a9b8] max-w-[60ch] leading-[1.6]">
              {hero.subtitle ||
                'Transforming complex data into actionable insights through innovative machine learning solutions and advanced analytics.'}
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {effectiveResumeUrl ? (
                <a
                  href={effectiveResumeUrl}
                  data-testid="hero-resume-link"
                  download={isLocalOrBlobResume ? resumeFileName : undefined}
                  target={isLocalOrBlobResume ? undefined : '_blank'}
                  rel={isLocalOrBlobResume ? undefined : 'noopener noreferrer'}
                  className="h-11 px-5 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white font-medium text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center gap-2 transition-colors duration-150 focus:outline-none"
                >
                  <Download className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                  <span>{hero.resumeButtonLabel || 'Download resume'}</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  data-testid="hero-resume-link"
                  className="h-11 px-5 rounded-[8px] bg-[#eef0f5]/40 text-[#0b0d14]/70 font-medium text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center gap-2 cursor-not-allowed"
                >
                  <Download className="w-4 h-4 text-[#0b0d14]/70" strokeWidth={1.5} />
                  <span>{hero.resumeButtonLabel || 'Download resume'}</span>
                </button>
              )}

              <Link
                to="/about"
                className="h-11 px-5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] hover:bg-[#222734]/80 font-medium text-sm border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center gap-2 transition-colors duration-150 focus:outline-none"
              >
                <User className="w-4 h-4 text-[#a3a9b8]" strokeWidth={1.5} />
                <span>{hero.aboutButtonLabel || 'About'}</span>
              </Link>
            </div>
          </div>

              {/* Right Column: Engineering Telemetry & Profile Panel (The Moment) */}
          <div className="lg:col-span-5 w-full flex items-center">
            <div className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] rounded-[14px] p-5 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] w-full max-h-[360px]">
              {/* Top Profile Header */}
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/[0.10]">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-[8px] overflow-hidden bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex-shrink-0">
                    <img
                      src={resolvedProfileImage}
                      alt={hero.profileCardName || hero.greeting || 'Sanju Kumar'}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-medium text-[#eef0f5] truncate">
                        {hero.profileCardName ?? (hero.greeting || 'Sanju Kumar')}
                      </h2>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4cc38a]" />
                    </div>
                    <p className="text-xs text-[#a3a9b8] truncate">
                      {hero.profileCardSubtitle ?? 'Supply Chain Analytics · ML Systems'}
                    </p>
                    <p className="font-mono text-[11px] text-[#7a8296] tabular-nums mt-0.5">
                      {hero.profileCardId ?? 'ID: SK-2024 · ACTIVE'}
                    </p>
                  </div>
                </div>

                {linkedinHref && (
                  <a
                    href={linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-2.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#a3a9b8] hover:text-[#eef0f5] inline-flex items-center gap-1 transition-colors duration-150 flex-shrink-0"
                  >
                    <span>{hero.linkedinButtonLabel || 'LinkedIn'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
                  </a>
                )}
              </div>

              {/* System Records Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#7a8296]">
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
                    <span>{hero.shippedSystemsTitle || 'SHIPPED_SYSTEMS'}</span>
                  </span>
                  <span
                    data-testid="hero-records-count"
                    className="font-mono tabular-nums"
                  >
                    {recordCountLabel}
                  </span>
                </div>

                {selectedProjects.length === 0 ? (
                  <div
                    data-testid="hero-shipped-systems"
                    className="overflow-hidden border border-white/[0.10] rounded-[8px] bg-[#0b0d14]/60 backdrop-blur-md"
                  >
                    <div className="px-3.5 py-6 text-center text-xs font-mono text-[#7a8296]">
                      No shipped systems selected.
                    </div>
                  </div>
                ) : selectedProjects.length === 1 ? (
                  <div
                    data-testid="hero-shipped-systems"
                    className="overflow-hidden border border-white/[0.10] rounded-[8px] bg-[#0b0d14]/60 backdrop-blur-md"
                  >
                    <div className="divide-y divide-white/[0.10]">
                      {renderSystemRow(selectedProjects[0], 0, 'primary')}
                    </div>
                  </div>
                ) : (
                  <div
                    data-testid="hero-shipped-systems"
                    className="h-[132px] overflow-hidden vertical-marquee-mask marquee-pause-on-hover border border-white/[0.10] rounded-[8px] bg-[#0b0d14]/60 backdrop-blur-md"
                  >
                    <div
                      data-testid="hero-shipped-systems-track"
                      className="animate-scroll-vertical flex flex-col"
                    >
                      <div className="divide-y divide-white/[0.10] border-b border-white/[0.10]">
                        {selectedProjects.map((project, idx) =>
                          renderSystemRow(project, idx, 'primary')
                        )}
                      </div>
                      <div
                        aria-hidden="true"
                        data-testid="hero-shipped-systems-clone"
                        className="divide-y divide-white/[0.10] border-b border-white/[0.10]"
                      >
                        {selectedProjects.map((project, idx) =>
                          renderSystemRow(project, idx, 'clone')
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Telemetry Footer */}
              <div className="pt-4 border-t border-white/[0.10] flex items-center justify-between text-xs font-mono text-[#7a8296] tabular-nums">
                <span className="flex-shrink-0">STACK:</span>
                <div className="flex-grow mx-4 overflow-hidden">
                    <TechStackStrip 
                        eyebrowOverride="" 
                        titleOverride=""
                    />
                </div>
                <span className="text-[#4cc38a] flex-shrink-0">
                  {hero.shippedSystemsFooterStatus ?? 'VERIFIED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Marquee */}
      <div className="w-full mt-8 border-t border-white/[0.10] pt-4">
        <TestimonialScroll />
      </div>
    </div>
  );
};

export default Hero;
