import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const extractUniqueProjectTags = (projects: ReadonlyArray<{ tags?: string[] | null }>) => {
  const seen = new Map<string, string>();
  projects.forEach((project) => {
    (project.tags || []).forEach((tag) => {
      if (typeof tag !== 'string') return;
      const trimmed = tag.trim();
      if (!trimmed) return;
      const normalized = trimmed.toLowerCase();
      if (!seen.has(normalized)) {
        seen.set(normalized, trimmed);
      }
    });
  });
  return Array.from(seen.values());
};

interface TechStackStripProps {
  projectsOverride?: ReadonlyArray<{ tags?: string[] | null }>;
  eyebrowOverride?: string;
  titleOverride?: string;
  emptyTextOverride?: string;
}

const TechStackStrip: React.FC<TechStackStripProps> = ({
  projectsOverride,
  eyebrowOverride,
  titleOverride,
  emptyTextOverride,
}) => {
  const { data } = usePortfolio();
  const projects = projectsOverride || data.projects || [];
  const meta = data.sections?.skills;
  const eyebrow = eyebrowOverride || meta?.techStackEyebrow || 'PROJECT_STACK_UNION';
  const title = titleOverride || meta?.techStackTitle || 'Tech stack across projects';
  const emptyText = emptyTextOverride || meta?.techStackEmptyText || 'No project tags configured yet.';

  const uniqueTags = useMemo(() => extractUniqueProjectTags(projects), [projects]);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const singleTrackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const checkOverflow = () => {
      const container = containerRef.current;
      const track = singleTrackRef.current;
      if (container && track) {
        const containerWidth = container.clientWidth || container.getBoundingClientRect().width;
        const trackWidth = Math.max(track.scrollWidth, track.getBoundingClientRect().width);
        setIsOverflowing(containerWidth > 0 && trackWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [uniqueTags]);

  if (uniqueTags.length === 0) {
    return (
      <div className="py-10 text-center text-[#a3a9b8]">
        <p className="font-mono text-sm">{emptyText}</p>
      </div>
    );
  }

  const TagList = () => (
    <div className="flex flex-nowrap items-center gap-2.5">
      {uniqueTags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[10px] font-mono text-[#eef0f5] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
      {isOverflowing && <div className="w-2.5 flex-shrink-0" />}
    </div>
  );

  return (
    <div className="space-y-0">
      <div
        ref={containerRef}
        data-testid="tech-stack-strip"
        data-overflowing={isOverflowing ? 'true' : 'false'}
        className="w-full overflow-hidden marquee-mask marquee-pause-on-hover"
      >
        <div
          ref={singleTrackRef}
          className={isOverflowing ? 'flex w-max animate-scroll-left' : 'flex flex-wrap justify-center gap-2.5'}
        >
          <TagList />
          {isOverflowing && (
            <div className="flex flex-nowrap items-center gap-2.5" aria-hidden="true" data-testid="tech-stack-track-clone">
              <TagList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechStackStrip;