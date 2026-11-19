import React from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Youtube,
  Instagram,
  Globe,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  usePortfolio,
  type SocialLinkItem,
} from '../context/PortfolioContext';

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
  email: Mail,
  mail: Mail,
};

function toSafeLinkHref(rawHref: unknown): string {
  if (typeof rawHref !== 'string') return '';
  const trimmed = rawHref.trim();
  if (!trimmed) return '';
  if (/^\s*(javascript|vbscript|data):/i.test(trimmed)) return '';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return '';
}

function isExternalHttp(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

const Footer: React.FC = () => {
  const { data, resolveAssetUrl } = usePortfolio();
  const footer = data.site?.footer;

  const brandName =
    typeof footer?.brandName === 'string' ? footer.brandName : 'Sanju Kumar';
  const roleText =
    typeof footer?.roleText === 'string'
      ? footer.roleText
      : 'Data Scientist & ML Engineer';
  const rawLogo =
    typeof footer?.logoImage === 'string' && footer.logoImage.trim()
      ? footer.logoImage.trim()
      : '/favicon.png';
  const logoSrc = resolveAssetUrl(rawLogo) || '/favicon.png';
  const copyrightText =
    typeof footer?.copyrightText === 'string'
      ? footer.copyrightText
      : `© ${new Date().getFullYear()}`;
  const attributionText =
    typeof footer?.attributionText === 'string'
      ? footer.attributionText
      : '';
  const attributionUrl = toSafeLinkHref(footer?.attributionUrl);
  const adminLabel =
    typeof footer?.adminLabel === 'string' ? footer.adminLabel : 'Admin';

  const socialLinks: SocialLinkItem[] = (
    Array.isArray(footer?.socialLinks) ? footer.socialLinks : []
  ).filter((item): item is SocialLinkItem => {
    if (!item || typeof item !== 'object') return false;
    return toSafeLinkHref(item.href).length > 0;
  });

  return (
    <footer className="bg-[#07080d]/80 backdrop-blur-xl border-t border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[6px] overflow-hidden border border-white/[0.10] bg-[#1a1e28]/70">
              <img
                src={logoSrc}
                alt={brandName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[#eef0f5] font-medium text-sm">
              {brandName}
            </span>
            {roleText.trim().length > 0 && (
              <>
                <span className="text-[#7a8296] text-xs">·</span>
                <span className="text-[#a3a9b8] text-xs">{roleText}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const safeHref = toSafeLinkHref(social.href);
              if (!safeHref) return null;
              const idKey = (typeof social.id === 'string' ? social.id : '')
                .toLowerCase()
                .trim();
              const labelKey = (
                typeof social.label === 'string' ? social.label : ''
              )
                .toLowerCase()
                .trim();
              const IconComponent =
                SOCIAL_ICON_MAP[idKey] || SOCIAL_ICON_MAP[labelKey] || Globe;
              const ariaLabel =
                typeof social.label === 'string' && social.label.trim()
                  ? social.label.trim()
                  : social.id || 'Social link';
              const externalProps = isExternalHttp(safeHref)
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {};
              return (
                <a
                  key={`${social.id || 'social'}-${index}`}
                  href={safeHref}
                  {...externalProps}
                  aria-label={ariaLabel}
                  className="text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150"
                >
                  <IconComponent className="w-4 h-4" strokeWidth={1.5} />
                </a>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#7a8296]">
            {copyrightText.trim().length > 0 && (
              <span className="font-mono tabular-nums">{copyrightText}</span>
            )}
            {attributionText.trim().length > 0 && (
              <>
                {copyrightText.trim().length > 0 && <span>·</span>}
                {attributionUrl ? (
                  attributionUrl.startsWith('/') ? (
                    <Link
                      to={attributionUrl}
                      className="hover:text-[#eef0f5] transition-colors duration-150"
                    >
                      {attributionText}
                    </Link>
                  ) : (
                    <a
                      href={attributionUrl}
                      {...(isExternalHttp(attributionUrl)
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="hover:text-[#eef0f5] transition-colors duration-150"
                    >
                      {attributionText}
                    </a>
                  )
                ) : (
                  <span>{attributionText}</span>
                )}
              </>
            )}
            {(copyrightText.trim().length > 0 ||
              attributionText.trim().length > 0) && <span>·</span>}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[#a3a9b8] hover:text-[#eef0f5] transition-colors duration-150"
            >
              <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{adminLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
