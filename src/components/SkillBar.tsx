import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface SkillBarProps {
  name: string;
  level: number;
  Icon: LucideIcon;
  color?: string;
  category?: string;
}

const TOTAL_SEGMENTS = 20;

const SkillBar: React.FC<SkillBarProps> = ({ name, level, Icon, category }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 60);
    return () => clearTimeout(timer);
  }, [level]);

  const activeCount = Math.max(0, Math.min(TOTAL_SEGMENTS, Math.round(level / 5)));

  return (
    <div className="p-5 rounded-[14px] bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-white/[0.18] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-[#eef0f5] truncate">
              {name}
            </h3>
            {category && (
              <span className="block text-xs text-[#7a8296]">{category}</span>
            )}
          </div>
        </div>

        <span className="font-mono tabular-nums text-xs text-[#a3a9b8] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] px-2 py-0.5 rounded-[6px] flex-shrink-0">
          {level}%
        </span>
      </div>

      {/* 20-segment precision hardware digital meter */}
      <div
        className="flex gap-1 h-2.5"
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency ${level}%`}
      >
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, cellIndex) => {
          const isActive = mounted && cellIndex < activeCount;
          const isLeadingActive = isActive && cellIndex === activeCount - 1;

          return (
            <div
              key={cellIndex}
              style={{
                transitionDelay: mounted ? `${cellIndex * 18}ms` : '0ms',
              }}
              className={`flex-1 rounded-[2px] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isLeadingActive
                  ? 'bg-[#4cc38a]'
                  : isActive
                  ? 'bg-[#eef0f5]'
                  : 'bg-[#1a1e28]/70 border border-white/[0.05]'
              }`}
            />
          );
        })}
      </div>

      {/* Subtle monospace scale row */}
      <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-[#7a8296] tabular-nums select-none">
        <span>00</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default SkillBar;
