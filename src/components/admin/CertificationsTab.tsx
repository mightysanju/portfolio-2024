import React, { useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import {
  usePortfolio,
  type CertificationItem,
} from '../../context/PortfolioContext';
import {
  BTN_PRIMARY,
  CARD_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  MONO_INPUT_CLASS,
  SELECT_CLASS,
  formatSignatureId,
} from './adminStyles';

export const CertificationsTab: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const handleAddCertification = () => {
    const newId = `cert-${Date.now()}`;
    const newCert: CertificationItem = {
      id: newId,
      title: 'New professional certification',
      issuer: 'Coursera',
      date: 'Nov 2024',
      description: 'Key competencies and domain skills verified by this credential',
      category: 'ml',
      verification: {
        type: 'coursera',
        url: 'https://www.coursera.org/',
        id: '',
      },
    };
    updateData((prev) => ({
      ...prev,
      certifications: [newCert, ...prev.certifications],
    }));
    setEditingCertId(newId);
  };

  const handleUpdateCertification = (
    id: string,
    patch: Partial<CertificationItem>
  ) => {
    updateData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    }));
  };

  const handleDeleteCertification = (id: string) => {
    updateData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-[#eef0f5]">Certifications</h2>
          <p className="text-sm text-[#a3a9b8]">
            Manage Coursera, Credly, and LinkedIn Learning credentials.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCertification}
          className={BTN_PRIMARY}
        >
          <Plus className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
          Add certification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.certifications.map((cert, idx) => {
          const isEditing = editingCertId === cert.id;
          return (
            <div
              key={cert.id}
              className={`${CARD_CLASS} flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono tabular-nums text-xs text-[#7a8296] mb-1">
                      {formatSignatureId('CERT', idx)} · {cert.issuer} ·{' '}
                      {cert.date}
                    </div>
                    <h3 className="font-medium text-[#eef0f5] text-sm">
                      {cert.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCertId(isEditing ? null : cert.id)
                      }
                      className="p-2 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#a3a9b8] transition-colors duration-150"
                      title="Edit certification"
                    >
                      <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCertification(cert.id)}
                      className="p-2 rounded-[8px] bg-[#1a1e28]/70 hover:bg-[#222733] border border-white/[0.10] text-[#e5484d] transition-colors duration-150"
                      title="Delete certification"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS}>Title</label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          title: e.target.value,
                        })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Issuer</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          issuer: e.target.value,
                        })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Issued date</label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          date: e.target.value,
                        })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Category</label>
                    <select
                      value={cert.category}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          category: e.target
                            .value as CertificationItem['category'],
                        })
                      }
                      className={SELECT_CLASS}
                    >
                      <option value="ml">Machine Learning (ml)</option>
                      <option value="data">Data Science (data)</option>
                      <option value="dev">Development (dev)</option>
                      <option value="cybersecurity">Cybersecurity</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Verification provider</label>
                    <select
                      value={cert.verification.type}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, {
                          verification: {
                            ...cert.verification,
                            type: e.target.value as
                              | 'coursera'
                              | 'credly'
                              | 'linkedin',
                          },
                        })
                      }
                      className={SELECT_CLASS}
                    >
                      <option value="coursera">Coursera</option>
                      <option value="credly">Credly</option>
                      <option value="linkedin">LinkedIn Learning</option>
                    </select>
                  </div>
                  {isEditing && (
                    <>
                      <div className="sm:col-span-2">
                        <label className={LABEL_CLASS}>Description</label>
                        <input
                          type="text"
                          value={cert.description}
                          onChange={(e) =>
                            handleUpdateCertification(cert.id, {
                              description: e.target.value,
                            })
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={LABEL_CLASS}>
                          Credential verification URL
                        </label>
                        <input
                          type="text"
                          value={cert.verification.url}
                          onChange={(e) =>
                            handleUpdateCertification(cert.id, {
                              verification: {
                                ...cert.verification,
                                url: e.target.value,
                              },
                            })
                          }
                          className={MONO_INPUT_CLASS}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={LABEL_CLASS}>
                          Credential ID (optional)
                        </label>
                        <input
                          type="text"
                          value={cert.verification.id || ''}
                          onChange={(e) =>
                            handleUpdateCertification(cert.id, {
                              verification: {
                                ...cert.verification,
                                id: e.target.value || undefined,
                              },
                            })
                          }
                          className={MONO_INPUT_CLASS}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
