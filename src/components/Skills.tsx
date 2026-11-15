import React, { useState, useMemo } from 'react';
import {
  Brain,
  Database,
  BarChart,
  Code2,
  Atom,
  Network,
  Cloud,
  Lock,
  Globe,
  Cpu,
  Wrench,
  Users,
  Shield,
  LucideIcon,
} from 'lucide-react';
import SkillBar from './SkillBar';
import { usePortfolio } from '../context/PortfolioContext';

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Database,
  Cpu,
  BarChart,
  Globe,
  Lock,
  Shield,
  Wrench,
  Brain,
  Users,
  Network,
  Cloud,
  Atom,
};

const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const skills = data.skills || [];
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    skills.forEach((skill) => {
      const cat = skill.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const orderedCategories = ['Technical', 'Cybersecurity', 'Soft Skills'];
    const dynamicCategories = Object.keys(counts).filter(
      (cat) => !orderedCategories.includes(cat)
    );

    const allCats = [
      ...orderedCategories.filter((cat) => counts[cat] > 0),
      ...dynamicCategories,
    ];

    return [
      { id: 'all', label: 'All skills', count: skills.length },
      ...allCats.map((cat) => ({
        id: cat,
        label: cat,
        count: counts[cat] || 0,
      })),
    ];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (activeTab === 'all') return skills;
    return skills.filter((skill) => skill.category === activeTab);
  }, [skills, activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="font-mono text-xs text-[#7a8296] mb-2">
            01 / Capabilities
          </p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#eef0f5] mb-2">
            Technical skills
          </h2>
          <p className="text-sm sm:text-base text-[#a3a9b8] max-w-xl">
            Applied proficiency across data science, process automation, security frameworks, and operational tooling.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 px-3.5 rounded-[8px] text-sm font-medium transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'bg-[#11141c]/75 backdrop-blur-xl text-[#a3a9b8] border-white/[0.10] hover:text-[#eef0f5] hover:bg-[#1a1e28]/70'
                }`}
              >
                <span>{tab.label}</span>
                <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const IconComponent = ICON_MAP[skill.icon] || Code2;
          return (
            <SkillBar
              key={skill.id || skill.name}
              name={skill.name}
              level={skill.level}
              Icon={IconComponent}
              color={skill.color}
              category={skill.category}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
