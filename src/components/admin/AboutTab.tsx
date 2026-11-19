import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS, TEXTAREA_CLASS, BTN_PRIMARY, BTN_SECONDARY, BTN_DANGER } from './adminStyles';

export const AboutTab: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const about = data.aboutPage || {
    metaTitle: '', metaDescription: '', backLabel: '', eyebrow: '', title: '', subtitle: '',
    sectionTitles: { education: '', experience: '', domainStack: '', technicalLabel: '', mlLabel: '', softLabel: '', strengths: '', improvements: '', interests: '' },
    education: [], experience: [], skills: { technical: [], ml: [], soft: [] }, strengths: [], areasOfImprovement: [], interests: []
  };

  const handleUpdate = (patch: Partial<typeof about>) => {
    updateData((prev) => ({
      ...prev,
      aboutPage: { ...about, ...patch }
    }));
  };

  return (
    <div className="space-y-6">
      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">About Page Settings</h2>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Title</label>
            <input 
              type="text" 
              value={about.title} 
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Subtitle</label>
            <textarea 
              value={about.subtitle} 
              onChange={(e) => handleUpdate({ subtitle: e.target.value })}
              className={TEXTAREA_CLASS}
            />
          </div>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Education</h2>
        <div className="space-y-4">
          {about.education.map((edu: any, idx: number) => (
            <div key={idx} className="p-3 bg-[#1a1e28] rounded-lg border border-white/[0.05] space-y-2">
              <input value={edu.id || ''} onChange={(e) => {
                const copy = [...about.education];
                copy[idx].id = e.target.value;
                handleUpdate({ education: copy });
              }} className={INPUT_CLASS} placeholder="ID (e.g., EDU-01)" />
              <input value={edu.institution} onChange={(e) => {
                const copy = [...about.education];
                copy[idx].institution = e.target.value;
                handleUpdate({ education: copy });
              }} className={INPUT_CLASS} placeholder="Institution" />
              <input value={edu.degree} onChange={(e) => {
                const copy = [...about.education];
                copy[idx].degree = e.target.value;
                handleUpdate({ education: copy });
              }} className={INPUT_CLASS} placeholder="Degree" />
              <input value={edu.year} onChange={(e) => {
                const copy = [...about.education];
                copy[idx].year = e.target.value;
                handleUpdate({ education: copy });
              }} className={INPUT_CLASS} placeholder="Year" />
              <input value={edu.gpa || ''} onChange={(e) => {
                const copy = [...about.education];
                copy[idx].gpa = e.target.value;
                handleUpdate({ education: copy });
              }} className={INPUT_CLASS} placeholder="GPA (e.g., 4.0 / 4.0)" />
              <textarea value={edu.description} onChange={(e) => {
                const copy = [...about.education];
                copy[idx].description = e.target.value;
                handleUpdate({ education: copy });
              }} className={TEXTAREA_CLASS} placeholder="Description" />
              <div className="space-y-1">
                <label className={LABEL_CLASS}>Key Coursework</label>
                {(edu.keyCoursework || []).map((course: string, cIdx: number) => (
                  <div key={cIdx} className="flex gap-2">
                    <input value={course} onChange={(e) => {
                      const copy = [...about.education];
                      copy[idx].keyCoursework[cIdx] = e.target.value;
                      handleUpdate({ education: copy });
                    }} className={INPUT_CLASS} />
                    <button className={BTN_DANGER} onClick={() => {
                      const copy = [...about.education];
                      copy[idx].keyCoursework.splice(cIdx, 1);
                      handleUpdate({ education: copy });
                    }}>X</button>
                  </div>
                ))}
                <button className={BTN_SECONDARY} onClick={() => {
                  const copy = [...about.education];
                  if (!copy[idx].keyCoursework) copy[idx].keyCoursework = [];
                  copy[idx].keyCoursework.push('');
                  handleUpdate({ education: copy });
                }}>Add Coursework</button>
              </div>
              <button className={BTN_DANGER} onClick={() => {
                const copy = [...about.education];
                copy.splice(idx, 1);
                handleUpdate({ education: copy });
              }}>Remove Education</button>
            </div>
          ))}
          <button className={BTN_PRIMARY} onClick={() => {
            handleUpdate({ education: [...about.education, { id: '', institution: '', degree: '', year: '', gpa: '', description: '', keyCoursework: [] }] });
          }}>Add Education</button>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Experience</h2>
        <div className="space-y-4">
          {about.experience.map((exp: any, idx: number) => (
            <div key={idx} className="p-3 bg-[#1a1e28] rounded-lg border border-white/[0.05] space-y-2">
              <input value={exp.id || ''} onChange={(e) => {
                const copy = [...about.experience];
                copy[idx].id = e.target.value;
                handleUpdate({ experience: copy });
              }} className={INPUT_CLASS} placeholder="ID (e.g., EXP-01)" />
              <input value={exp.company} onChange={(e) => {
                const copy = [...about.experience];
                copy[idx].company = e.target.value;
                handleUpdate({ experience: copy });
              }} className={INPUT_CLASS} placeholder="Company" />
              <input value={exp.role} onChange={(e) => {
                const copy = [...about.experience];
                copy[idx].role = e.target.value;
                handleUpdate({ experience: copy });
              }} className={INPUT_CLASS} placeholder="Role" />
              <input value={exp.location || ''} onChange={(e) => {
                const copy = [...about.experience];
                copy[idx].location = e.target.value;
                handleUpdate({ experience: copy });
              }} className={INPUT_CLASS} placeholder="Location (e.g., Hyderabad, India)" />
              <input value={exp.year} onChange={(e) => {
                const copy = [...about.experience];
                copy[idx].year = e.target.value;
                handleUpdate({ experience: copy });
              }} className={INPUT_CLASS} placeholder="Year" />
              <textarea value={exp.highlights} onChange={(e) => {
                const copy = [...about.experience];
                copy[idx].highlights = e.target.value;
                handleUpdate({ experience: copy });
              }} className={TEXTAREA_CLASS} placeholder="Highlights" />
              <div className="space-y-1">
                <label className={LABEL_CLASS}>Key Outcomes</label>
                {(exp.keyOutcomes || []).map((out: string, oIdx: number) => (
                  <div key={oIdx} className="flex gap-2">
                    <input value={out} onChange={(e) => {
                      const copy = [...about.experience];
                      copy[idx].keyOutcomes[oIdx] = e.target.value;
                      handleUpdate({ experience: copy });
                    }} className={INPUT_CLASS} />
                    <button className={BTN_DANGER} onClick={() => {
                      const copy = [...about.experience];
                      copy[idx].keyOutcomes.splice(oIdx, 1);
                      handleUpdate({ experience: copy });
                    }}>X</button>
                  </div>
                ))}
                <button className={BTN_SECONDARY} onClick={() => {
                  const copy = [...about.experience];
                  if (!copy[idx].keyOutcomes) copy[idx].keyOutcomes = [];
                  copy[idx].keyOutcomes.push('');
                  handleUpdate({ experience: copy });
                }}>Add Outcome</button>
              </div>
              <div className="space-y-1">
                <label className={LABEL_CLASS}>Technologies</label>
                {(exp.technologies || []).map((tech: string, tIdx: number) => (
                  <div key={tIdx} className="flex gap-2">
                    <input value={tech} onChange={(e) => {
                      const copy = [...about.experience];
                      copy[idx].technologies[tIdx] = e.target.value;
                      handleUpdate({ experience: copy });
                    }} className={INPUT_CLASS} />
                    <button className={BTN_DANGER} onClick={() => {
                      const copy = [...about.experience];
                      copy[idx].technologies.splice(tIdx, 1);
                      handleUpdate({ experience: copy });
                    }}>X</button>
                  </div>
                ))}
                <button className={BTN_SECONDARY} onClick={() => {
                  const copy = [...about.experience];
                  if (!copy[idx].technologies) copy[idx].technologies = [];
                  copy[idx].technologies.push('');
                  handleUpdate({ experience: copy });
                }}>Add Tech</button>
              </div>
              <button className={BTN_DANGER} onClick={() => {
                const copy = [...about.experience];
                copy.splice(idx, 1);
                handleUpdate({ experience: copy });
              }}>Remove Experience</button>
            </div>
          ))}
          <button className={BTN_PRIMARY} onClick={() => {
            handleUpdate({ experience: [...about.experience, { id: '', company: '', role: '', location: '', year: '', highlights: '', keyOutcomes: [], technologies: [] }] });
          }}>Add Experience</button>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Strengths</h2>
        <div className="space-y-2">
          {about.strengths.map((s: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input value={s} onChange={(e) => {
                const copy = [...about.strengths];
                copy[idx] = e.target.value;
                handleUpdate({ strengths: copy });
              }} className={INPUT_CLASS} />
              <button className={BTN_DANGER} onClick={() => {
                const copy = [...about.strengths];
                copy.splice(idx, 1);
                handleUpdate({ strengths: copy });
              }}>X</button>
            </div>
          ))}
          <button className={BTN_PRIMARY} onClick={() => handleUpdate({ strengths: [...about.strengths, ''] })}>Add Strength</button>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Interests</h2>
        <div className="space-y-2">
          {about.interests.map((i: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input value={i} onChange={(e) => {
                const copy = [...about.interests];
                copy[idx] = e.target.value;
                handleUpdate({ interests: copy });
              }} className={INPUT_CLASS} />
              <button className={BTN_DANGER} onClick={() => {
                const copy = [...about.interests];
                copy.splice(idx, 1);
                handleUpdate({ interests: copy });
              }}>X</button>
            </div>
          ))}
          <button className={BTN_PRIMARY} onClick={() => handleUpdate({ interests: [...about.interests, ''] })}>Add Interest</button>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Skills</h2>
        <div className="space-y-6">
          {(['technical', 'ml', 'soft'] as const).map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-[#a3a9b8] mb-2 capitalize">{category} Skills</h3>
              <div className="space-y-2">
                {about.skills[category].map((skill: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input value={skill} onChange={(e) => {
                      const copy = { ...about.skills };
                      copy[category][idx] = e.target.value;
                      handleUpdate({ skills: copy });
                    }} className={INPUT_CLASS} />
                    <button className={BTN_DANGER} onClick={() => {
                      const copy = { ...about.skills };
                      copy[category].splice(idx, 1);
                      handleUpdate({ skills: copy });
                    }}>X</button>
                  </div>
                ))}
                <button className={BTN_SECONDARY} onClick={() => {
                  const copy = { ...about.skills };
                  copy[category].push('');
                  handleUpdate({ skills: copy });
                }}>Add {category} Skill</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};