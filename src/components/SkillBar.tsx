import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface SkillBarProps {
  name: string;
  level: number;
  Icon: LucideIcon;
  color: string;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, Icon, color }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(level);
    }, 100);
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <div className="relative p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700
      hover:transform hover:scale-105 transition-all duration-300 neon-card">
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} mr-3 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="font-medium text-gray-200">{name}</span>
        <span className="ml-auto text-gray-400">{level}%</span>
      </div>
      <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out rounded-full
            relative overflow-hidden`}
          style={{ width: `${width}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          <div className="absolute inset-0 opacity-50 animate-pulse-subtle" />
        </div>
      </div>
    </div>
  );
};

export default SkillBar;