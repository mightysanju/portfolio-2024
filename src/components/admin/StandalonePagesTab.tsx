import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS, TEXTAREA_CLASS } from './adminStyles';

export const StandalonePagesTab: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const pages = data.standalonePages || {
    networkapp: { title: '', sections: [] },
    ddo: { title: '', sections: [] },
    atsBlog: { title: '', sections: [] },
    linkedinn: { title: '', sections: [] },
    linkedInnDemo: { title: '', subtitle: '' }
  };

  const handleUpdate = (pageKey: keyof typeof pages, patch: any) => {
    updateData((prev) => ({
      ...prev,
      standalonePages: {
        ...(prev.standalonePages || pages),
        [pageKey]: { ...(prev.standalonePages ? prev.standalonePages[pageKey] : pages[pageKey]), ...patch }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Standalone Pages Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(pages) as Array<keyof typeof pages>).map(key => (
            <div key={key} className="p-4 bg-[#1a1e28] rounded-lg border border-white/[0.05]">
              <h3 className="text-sm font-bold text-[#eef0f5] uppercase mb-2">{key}</h3>
              <input 
                value={(pages[key] as any).title || ''}
                onChange={(e) => handleUpdate(key, { title: e.target.value })}
                className={INPUT_CLASS}
                placeholder="Page Title"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
