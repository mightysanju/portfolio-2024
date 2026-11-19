import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS, TEXTAREA_CLASS, BTN_SECONDARY, BTN_DANGER } from './adminStyles';

export const SiteChromeTab: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const site = data.site || {
    seo: { title: '', description: '', keywords: '', author: '', ogImage: '' },
    navbar: { brandName: '', roleTag: '', logoImage: '', adminLabel: 'Admin', navItems: [], socialLinks: [] },
    footer: { logoImage: '', brandName: '', roleText: '', copyrightText: '', attributionText: '', attributionUrl: '', adminLabel: 'Admin', socialLinks: [] }
  };

  const handleUpdate = (patch: Partial<typeof site>) => {
    updateData((prev) => ({
      ...prev,
      site: {
        ...site,
        ...patch,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Site Identity & Navigation</h2>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Brand Name</label>
            <input 
              type="text" 
              value={site.navbar.brandName} 
              onChange={(e) => handleUpdate({ navbar: { ...site.navbar, brandName: e.target.value } })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Role Tag</label>
            <input 
              type="text" 
              value={site.navbar.roleTag} 
              onChange={(e) => handleUpdate({ navbar: { ...site.navbar, roleTag: e.target.value } })}
              className={INPUT_CLASS}
            />
          </div>
          
          <div>
            <label className={LABEL_CLASS}>Navigation Items</label>
            <div className="space-y-2 mt-2">
              {site.navbar.navItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={item.label} 
                    onChange={(e) => {
                      const newItems = [...site.navbar.navItems];
                      newItems[index] = { ...item, label: e.target.value };
                      handleUpdate({ navbar: { ...site.navbar, navItems: newItems } });
                    }}
                    placeholder="Label"
                    className={`${INPUT_CLASS} flex-1`}
                  />
                  <input 
                    type="text" 
                    value={item.href} 
                    onChange={(e) => {
                      const newItems = [...site.navbar.navItems];
                      newItems[index] = { ...item, href: e.target.value };
                      handleUpdate({ navbar: { ...site.navbar, navItems: newItems } });
                    }}
                    placeholder="Path/URL"
                    className={`${INPUT_CLASS} flex-1`}
                  />
                  <button 
                    onClick={() => {
                      const newItems = site.navbar.navItems.filter((_, i) => i !== index);
                      handleUpdate({ navbar: { ...site.navbar, navItems: newItems } });
                    }}
                    className={BTN_DANGER}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  handleUpdate({ 
                    navbar: { 
                      ...site.navbar, 
                      navItems: [...site.navbar.navItems, { label: '', href: '' }] 
                    } 
                  });
                }}
                className={BTN_SECONDARY}
              >
                + Add Nav Item
              </button>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Social Links</label>
            <div className="space-y-2 mt-2">
              {site.navbar.socialLinks.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={item.label} 
                    onChange={(e) => {
                      const newLinks = [...site.navbar.socialLinks];
                      newLinks[index] = { ...item, label: e.target.value };
                      handleUpdate({ navbar: { ...site.navbar, socialLinks: newLinks } });
                    }}
                    placeholder="Platform (e.g. LinkedIn)"
                    className={`${INPUT_CLASS} flex-1`}
                  />
                  <input 
                    type="text" 
                    value={item.href} 
                    onChange={(e) => {
                      const newLinks = [...site.navbar.socialLinks];
                      newLinks[index] = { ...item, href: e.target.value };
                      handleUpdate({ navbar: { ...site.navbar, socialLinks: newLinks } });
                    }}
                    placeholder="URL"
                    className={`${INPUT_CLASS} flex-1`}
                  />
                  <button 
                    onClick={() => {
                      const newLinks = site.navbar.socialLinks.filter((_, i) => i !== index);
                      handleUpdate({ navbar: { ...site.navbar, socialLinks: newLinks } });
                    }}
                    className={BTN_DANGER}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  handleUpdate({ 
                    navbar: { 
                      ...site.navbar, 
                      socialLinks: [...site.navbar.socialLinks, { id: Date.now().toString(), label: '', href: '' }] 
                    } 
                  });
                }}
                className={BTN_SECONDARY}
              >
                + Add Social Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h2 className="text-lg font-medium text-[#eef0f5] mb-4">Footer Settings</h2>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Copyright Text</label>
            <input 
              type="text" 
              value={site.footer.copyrightText} 
              onChange={(e) => handleUpdate({ footer: { ...site.footer, copyrightText: e.target.value } })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Attribution Text</label>
            <input 
              type="text" 
              value={site.footer.attributionText} 
              onChange={(e) => handleUpdate({ footer: { ...site.footer, attributionText: e.target.value } })}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Attribution URL</label>
            <input 
              type="text" 
              value={site.footer.attributionUrl} 
              onChange={(e) => handleUpdate({ footer: { ...site.footer, attributionUrl: e.target.value } })}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Footer Social Links</label>
            <div className="space-y-2 mt-2">
              {site.footer.socialLinks.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={item.label} 
                    onChange={(e) => {
                      const newLinks = [...site.footer.socialLinks];
                      newLinks[index] = { ...item, label: e.target.value };
                      handleUpdate({ footer: { ...site.footer, socialLinks: newLinks } });
                    }}
                    placeholder="Platform"
                    className={`${INPUT_CLASS} flex-1`}
                  />
                  <input 
                    type="text" 
                    value={item.href} 
                    onChange={(e) => {
                      const newLinks = [...site.footer.socialLinks];
                      newLinks[index] = { ...item, href: e.target.value };
                      handleUpdate({ footer: { ...site.footer, socialLinks: newLinks } });
                    }}
                    placeholder="URL"
                    className={`${INPUT_CLASS} flex-1`}
                  />
                  <button 
                    onClick={() => {
                      const newLinks = site.footer.socialLinks.filter((_, i) => i !== index);
                      handleUpdate({ footer: { ...site.footer, socialLinks: newLinks } });
                    }}
                    className={BTN_DANGER}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  handleUpdate({ 
                    footer: { 
                      ...site.footer, 
                      socialLinks: [...site.footer.socialLinks, { id: Date.now().toString(), label: '', href: '' }] 
                    } 
                  });
                }}
                className={BTN_SECONDARY}
              >
                + Add Footer Social Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
