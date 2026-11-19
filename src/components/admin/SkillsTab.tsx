import React, { useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { usePortfolio, type SkillItem } from '../../context/PortfolioContext';
import {
  BTN_PRIMARY,
  CARD_CLASS,
  ICON_OPTIONS,
  INPUT_CLASS,
  LABEL_CLASS,
  SELECT_CLASS,
  formatSignatureId,
} from './adminStyles';

export const SkillsTab: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const handleAddSkill = () => {
    const newId = `skill-${Date.now()}`;
    const newSkill: SkillItem = {
      id: newId,
      name: 'New technical skill',
      level: 90,
      category: 'Technical',
      icon: 'Code2',
      color: 'from-blue-500 to-cyan-500',
    };
    updateData((prev) => ({
      ...prev,
      skills: [newSkill, ...prev.skills],
    }));
    setEditingSkillId(newId);
  };

  const handleUpdateSkill = (id: string, patch: Partial<SkillItem>) => {
    updateData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const handleDeleteSkill = (id: string) => {
    updateData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-[#eef0f5]">Skills</h2>
          <p className="text-sm text-[#a3a9b8]">
            Adjust proficiency levels, categories, and icon mappings. (Note: the Tech Stack strip dynamically derives its pills from project tags.)
          </p>
        </div>
        <button type="button" onClick={handleAddSkill} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
          Add skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.skills.map((skill, idx) => {
          const isEditing = editingSkillId === skill.id;
          const activeSegments = Math.round(skill.level / 5);
          return (
            <div key={skill.id} className={`${CARD_CLASS} space-y-4`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                    {formatSignatureId('SKL', idx)} · {skill.category}
                  </span>
                  <h3 className="text-sm font-medium text-[#eef0f5]">
                    {skill.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono tabular-nums text-xs text-[#a3a9b8]">
                    {skill.level}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingSkillId(isEditing ? null : skill.id)
                    }
                    className="p-1.5 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#a3a9b8] transition-colors duration-150"
                  >
                    <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1.5 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#e5484d] transition-colors duration-150"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* 20-segment hardware digital meter preview */}
              <div className="space-y-1.5">
                <div className="flex gap-1 h-2.5">
                  {Array.from({ length: 20 }).map((_, cellIdx) => {
                    const isActive = cellIdx < activeSegments;
                    const isLeadingCell =
                      isActive && cellIdx === activeSegments - 1;
                    return (
                      <div
                        key={cellIdx}
                        className={`flex-1 rounded-[2px] transition-colors duration-150 ${
                          isLeadingCell
                            ? 'bg-[#4cc38a]'
                            : isActive
                            ? 'bg-[#eef0f5]'
                            : 'bg-[#1a1e28] border border-white/[0.05]'
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#7a8296] tabular-nums">
                  <span>00</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className={LABEL_CLASS}>Skill name</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) =>
                      handleUpdateSkill(skill.id, { name: e.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Category</label>
                  <select
                    value={skill.category}
                    onChange={(e) =>
                      handleUpdateSkill(skill.id, {
                        category: e.target.value as SkillItem['category'],
                      })
                    }
                    className={SELECT_CLASS}
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL_CLASS}>
                    Proficiency level ({skill.level}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(e) =>
                      handleUpdateSkill(skill.id, {
                        level: Number(e.target.value),
                      })
                    }
                    className="w-full accent-[#eef0f5] cursor-pointer"
                  />
                </div>
                {isEditing && (
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS}>Icon</label>
                    <select
                      value={skill.icon}
                      onChange={(e) =>
                        handleUpdateSkill(skill.id, { icon: e.target.value })
                      }
                      className={SELECT_CLASS}
                    >
                      {ICON_OPTIONS.map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
