import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail, Youtube, Instagram, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const socialLinks = [
    { href: 'https://github.com/mightysanju', Icon: Github, label: 'GitHub' },
    { href: 'https://linkedin.com/in/mightysanju', Icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://youtube.com/@sanjukumar', Icon: Youtube, label: 'YouTube' },
    { href: 'https://instagram.com/mightysanju3', Icon: Instagram, label: 'Instagram' },
    { href: 'mailto:sanju.k3r+portfolio@gmail.com', Icon: Mail, label: 'Email' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#07080d]/80 backdrop-blur-xl border-b border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Identity + Primary Navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-[8px] overflow-hidden bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                src="/favicon.png"
                alt="Sanju Kumar"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm text-[#eef0f5] tracking-tight">
                Sanju Kumar
              </span>
              <span className="hidden sm:inline font-mono text-xs text-[#7a8296]">
                DS / ML
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = isHomePage && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`h-9 px-3 rounded-[8px] text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                      : 'text-[#a3a9b8] hover:text-[#eef0f5] hover:bg-[#11141c]/75'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Monochrome Socials & Quiet Admin Link */}
        <div className="hidden md:flex items-center gap-1">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] text-[#7a8296] hover:text-[#eef0f5] hover:bg-[#11141c]/75 transition-colors duration-150"
            >
              <social.Icon className="w-4 h-4" strokeWidth={1.5} />
            </a>
          ))}
          <div className="h-4 w-px bg-white/[0.10] mx-2" />
          <Link
            to="/admin"
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-[8px] text-xs font-medium text-[#7a8296] hover:text-[#eef0f5] hover:bg-[#1a1e28]/70 border border-transparent hover:border-white/[0.10] transition-colors duration-150"
          >
            <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/admin"
            className="h-9 px-2.5 inline-flex items-center gap-1.5 rounded-[8px] text-xs font-medium text-[#7a8296] hover:text-[#eef0f5] hover:bg-[#1a1e28]/70 transition-colors duration-150"
          >
            <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Admin</span>
          </Link>
          <button
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
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full h-9 px-3 rounded-[8px] text-sm font-medium text-left transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'text-[#a3a9b8] hover:text-[#eef0f5] hover:bg-[#11141c]/75'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="flex items-center gap-2 pt-3 mt-2 border-t border-white/[0.10]">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] text-[#7a8296] hover:text-[#eef0f5] hover:bg-[#11141c]/75 transition-colors duration-150"
              >
                <social.Icon className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
