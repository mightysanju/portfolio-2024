import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS } from './adminStyles';

export const SectionsContactTab: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const contact = data.sections?.contact || {
    eyebrow: '', title: '', description: '', directChannelsTitle: '',
    email: '', phone: '', location: '', formspreeUrl: '',
    nameLabel: '', emailLabel: '', inquiryLabel: '', recruiterLabel: '',
    generalLabel: '', messageLabel: '', submitLabel: '', sendingLabel: '', sentMessage: '', errorMessage: ''
  };

  const handleUpdate = (patch: Partial<typeof contact>) => {
    updateData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections!,
        contact: { ...contact, ...patch }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Contact Section Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Eyebrow</label>
            <input type="text" value={contact.eyebrow} onChange={(e) => handleUpdate({ eyebrow: e.target.value })} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Title</label>
            <input type="text" value={contact.title} onChange={(e) => handleUpdate({ title: e.target.value })} className={INPUT_CLASS} />
          </div>
          <div className="col-span-2">
            <label className={LABEL_CLASS}>Description</label>
            <textarea value={contact.description} onChange={(e) => handleUpdate({ description: e.target.value })} className={INPUT_CLASS} />
          </div>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Contact Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={LABEL_CLASS}>Email</label>
            <input type="text" value={contact.email} onChange={(e) => handleUpdate({ email: e.target.value })} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Phone</label>
            <input type="text" value={contact.phone} onChange={(e) => handleUpdate({ phone: e.target.value })} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Location</label>
            <input type="text" value={contact.location} onChange={(e) => handleUpdate({ location: e.target.value })} className={INPUT_CLASS} />
          </div>
          <div className="col-span-3">
            <label className={LABEL_CLASS}>Formspree URL</label>
            <input type="text" value={contact.formspreeUrl} onChange={(e) => handleUpdate({ formspreeUrl: e.target.value })} className={INPUT_CLASS} />
          </div>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Form Labels & Messages</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL_CLASS}>Name Label</label><input type="text" value={contact.nameLabel} onChange={(e) => handleUpdate({ nameLabel: e.target.value })} className={INPUT_CLASS} /></div>
          <div><label className={LABEL_CLASS}>Email Label</label><input type="text" value={contact.emailLabel} onChange={(e) => handleUpdate({ emailLabel: e.target.value })} className={INPUT_CLASS} /></div>
          <div><label className={LABEL_CLASS}>Submit Label</label><input type="text" value={contact.submitLabel} onChange={(e) => handleUpdate({ submitLabel: e.target.value })} className={INPUT_CLASS} /></div>
          <div><label className={LABEL_CLASS}>Sent Message</label><input type="text" value={contact.sentMessage} onChange={(e) => handleUpdate({ sentMessage: e.target.value })} className={INPUT_CLASS} /></div>
        </div>
      </div>
    </div>
  );
};
