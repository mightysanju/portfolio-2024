import React, { useState } from 'react';
import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Youtube,
  Instagram,
  Lock,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  usePortfolio,
  type NavMenuItem,
  type SocialLinkItem,
} from '../context/PortfolioContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
  email: Mail,
  mail: Mail,
};

function toSafeNavHref(rawHref: unknown): string {
  if (typeof rawHref !== 'string') return '';
  const trimmed = rawHref.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('#')) {
    return trimmed.length > 1 ? trimmed : '';
  }
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

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

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { data, resolveAssetUrl } = usePortfolio();

  const navbar = data.site?.navbar;
  const brandName =
    typeof navbar?.brandName === 'string' ? navbar.brandName : 'Sanju Kumar';
  const roleTag =
    typeof navbar?.roleTag === 'string' ? navbar.roleTag : 'DS / ML';
  const adminLabel =
    typeof navbar?.adminLabel === 'string' ? navbar.adminLabel : 'Admin';
  const rawLogo =
    typeof navbar?.logoImage === 'string' && navbar.logoImage.trim()
      ? navbar.logoImage.trim()
      : '/favicon.png';
  const logoSrc = resolveAssetUrl(rawLogo) || '/favicon.png';

  const navItems: NavMenuItem[] = (
    Array.isArray(navbar?.navItems) ? navbar.navItems : []
  ).filter((item): item is NavMenuItem => {
    if (!item || typeof item !== 'object') return false;
    if (typeof item.label !== 'string' || !item.label.trim()) return false;
    return toSafeNavHref(item.href).length > 0;
  });

  const socialLinks: SocialLinkItem[] = (
    Array.isArray(navbar?.socialLinks) ? navbar.socialLinks : []
  ).filter((item): item is SocialLinkItem => {
    if (!item || typeof item !== 'object') return false;
    return toSafeLinkHref(item.href).length > 0;
  });

  const handleBrandClick = () => {
    setIsOpen(false);
    if (isHomePage) {
      onNavigate('home');
    } else {
      navigate('/');
    }
  };

  const renderNavItem = (item: NavMenuItem, index: number, mobile: boolean) => {
    const href = toSafeNavHref(item.href);
    const label = item.label.trim();
    const baseClasses = mobile
      ? 'block w-full h-9 px-3 rounded-[8px] text-sm font-medium text-left transition-colors duration-150 flex items-center'
      : 'h-9 px-3 rounded-[8px] text-sm font-medium transition-colors duration-150 inline-flex items-center';
    const activeClasses =
      'bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]';
    const inactiveClasses =
      'text-[#a3a9b8] hover:text-[#eef0f5] hover:bg-[#11141c]/75';

    if (href.startsWith('#')) {
      const sectionId = href.slice(1);
      const isActive = isHomePage && activeSection === sectionId;
      return (
        <button
          key={`${href}-${index}`}
          type="button"
          onClick={() => {
            setIsOpen(false);
            if (isHomePage) {
              onNavigate(sectionId);
            } else {
              navigate(`/${href}`);
            }
          }}
          className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
          {label}
        </button>
      );
    }

    if (href.startsWith('/')) {
      const isActive = location.pathname === href;
      return (
        <Link
          key={`${href}-${index}`}
          to={href}
          onClick={() => setIsOpen(false)}
          className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
          {label}
        </Link>
      );
    }

    return (
      <a
        key={`${href}-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsOpen(false)}
        className={`${baseClasses} ${inactiveClasses}`}
      >
        {label}
      </a>
    );
  };

  const renderSocialLink = (social: SocialLinkItem, index: number) => {
    const safeHref = toSafeLinkHref(social.href);
    if (!safeHref) return null;
    const idKey = (typeof social.id === 'string' ? social.id : '')
      .toLowerCase()
      .trim();
    const labelKey = (typeof social.label === 'string' ? social.label : '')
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
        className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] text-[#7a8296] hover:text-[#eef0f5] hover:bg-[#11141c]/75 transition-colors duration-150"
      >
        <IconComponent className="w-4 h-4" strokeWidth={1.5} />
      </a>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#07080d]/80 backdrop-blur-xl border-b border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Identity + Primary Navigation */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={handleBrandClick}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-[8px] overflow-hidden bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                src={logoSrc}
                alt={brandName}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm text-[#eef0f5] tracking-tight">
                {brandName}
              </span>
              {roleTag.trim().length > 0 && (
                <span className="hidden sm:inline font-mono text-xs text-[#7a8296]">
                  {roleTag}
                </span>
              )}
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => renderNavItem(item, index, false))}
          </div>
        </div>

        {/* Right: Monochrome Socials & Quiet Admin Link */}
        <div className="hidden md:flex items-center gap-1">
          {socialLinks.map((social, index) => renderSocialLink(social, index))}
          <div className="h-4 w-px bg-white/[0.10] mx-2" />
          <Link
            to="/admin"
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-[8px] text-xs font-medium text-[#7a8296] hover:text-[#eef0f5] hover:bg-[#1a1e28]/70 border border-transparent hover:border-white/[0.10] transition-colors duration-150"
          >
            <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{adminLabel}</span>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/admin"
            className="h-9 px-2.5 inline-flex items-center gap-1.5 rounded-[8px] text-xs font-medium text-[#7a8296] hover:text-[#eef0f5] hover:bg-[#1a1e28]/70 transition-colors duration-150"
          >
            <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{adminLabel}</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] text-[#a3a9b8] hover:text-[#eef0f5] hover:bg-[#11141c]/75 focus:outline-none transition-colors duration-150"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <X className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Menu className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#07080d]/95 backdrop-blur-xl border-b border-white/[0.10] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item, index) => renderNavItem(item, index, true))}
          <div className="flex items-center gap-2 pt-3 mt-2 border-t border-white/[0.10]">
            {socialLinks.map((social, index) => renderSocialLink(social, index))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
