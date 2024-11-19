import React, { useState } from 'react';
import { Brain, Database, BarChart, Code2, Atom, Network, Cloud, Lock, Globe, Cpu } from 'lucide-react';
import SkillBar from './SkillBar';

const Skills = () => {
  const [activeTab, setActiveTab] = useState('all');

  const allSkills = {
    'Machine Learning': {
      skills: [
        { name: 'Deep Learning', level: 92, icon: Brain, color: 'from-purple-500 to-indigo-600' },
        { name: 'Natural Language Processing', level: 88, icon: Code2, color: 'from-blue-500 to-cyan-500' },
        { name: 'Computer Vision', level: 85, icon: Atom, color: 'from-pink-500 to-rose-500' },
        { name: 'Reinforcement Learning', level: 82, icon: Network, color: 'from-green-500 to-emerald-600' },
      ],
    },
    'Data Engineering': {
      skills: [
        { name: 'Big Data Processing', level: 90, icon: Database, color: 'from-yellow-500 to-orange-500' },
        { name: 'Data Pipelines', level: 87, icon: Network, color: 'from-emerald-500 to-teal-600' },
        { name: 'Cloud Computing', level: 85, icon: Cloud, color: 'from-blue-400 to-indigo-500' },
        { name: 'Data Security', level: 83, icon: Lock, color: 'from-red-500 to-pink-500' },
      ],
    },
    'Development': {
      skills: [
        { name: 'Python', level: 95, icon: Code2, color: 'from-yellow-400 to-orange-500' },
        { name: 'SQL', level: 88, icon: Database, color: 'from-blue-500 to-cyan-500' },
        { name: 'Web Development', level: 85, icon: Globe, color: 'from-purple-500 to-indigo-500' },
        { name: 'System Design', level: 82, icon: Cpu, color: 'from-green-400 to-emerald-500' },
      ],
    },
  };

  const tabs = [
    { id: 'all', label: 'All Skills' },
    ...Object.keys(allSkills).map(key => ({ id: key, label: key })),
  ];

  const getFilteredSkills = () => {
    if (activeTab === 'all') {
      return Object.values(allSkills).flatMap(category => category.skills);
    }
    return allSkills[activeTab as keyof typeof allSkills]?.skills || [];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Technical Skills
      </h2>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredSkills().map((skill) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            level={skill.level}
            Icon={skill.icon}
            color={skill.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;