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
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm
      hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={imageUrl}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/20"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-200">{name}</h3>
          <p className="text-purple-400">{role}</p>
          <p className="text-gray-400 text-sm">{company}</p>
        </div>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
        >
          <Linkedin className="w-5 h-5 text-blue-400" />
        </a>
      </div>
      {contribution && (
        <p className="text-gray-300 text-sm italic">
          "{contribution}"
        </p>
      )}
    </div>
  );
};

export default Stakeholder;