import React from 'react';
import { Linkedin } from 'lucide-react';

interface StakeholderProps {
  name: string;
  role: string;
  company: string;
  linkedinUrl: string;
  imageUrl: string;
  contribution?: string;
}

const Stakeholder: React.FC<StakeholderProps> = ({
  name,
  role,
  company,
  linkedinUrl,
  imageUrl,
  contribution
}) => {
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=1a1e28&color=eef0f5&size=200`;

  return (
    <div className="bg-[#1a1e28]/70 backdrop-blur-md rounded-[10px] p-5 border border-white/[0.10] hover:border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150">
      <div className="flex items-center gap-4 mb-3">
        <img
          src={imageUrl || fallbackAvatar}
          alt={name}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== fallbackAvatar) {
              target.src = fallbackAvatar;
            }
          }}
          className="w-12 h-12 rounded-full object-cover border border-white/[0.10] bg-[#11141c] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-[#eef0f5] truncate">{name}</h3>
          <p className="text-xs text-[#a3a9b8] truncate">{role}</p>
          <p className="text-xs font-mono text-[#7a8296] truncate">{company}</p>
        </div>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} LinkedIn`}
          className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150 flex-shrink-0"
        >
          <Linkedin className="w-4 h-4" strokeWidth={1.5} />
        </a>
      </div>
      {contribution && (
        <p className="text-[#a3a9b8] text-sm leading-relaxed border-t border-white/[0.10] pt-3">
          {contribution}
        </p>
      )}
    </div>
  );
};

export default Stakeholder;
