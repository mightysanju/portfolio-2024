import React from 'react';
import { Github, Linkedin, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07080d]/80 backdrop-blur-xl border-t border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[6px] overflow-hidden border border-white/[0.10] bg-[#1a1e28]/70">
              <img src="/favicon.png" alt="Sanju Kumar" className="w-full h-full object-cover" />
            </div>
            <span className="text-[#eef0f5] font-medium text-sm">Sanju Kumar</span>
            <span className="text-[#7a8296] text-xs">·</span>
            <span className="text-[#a3a9b8] text-xs">Data Scientist &amp; ML Engineer</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mightysanju"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150"
            >
              <Github className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="https://linkedin.com/in/mightysanju"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150"
            >
              <Linkedin className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="mailto:sanju.k3r+portfolio@gmail.com"
              aria-label="Email"
              className="text-[#7a8296] hover:text-[#eef0f5] transition-colors duration-150"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#7a8296]">
            <span className="font-mono tabular-nums">© {new Date().getFullYear()}</span>
            <span>·</span>
            <span>Unslopped with unslop by @heydamir (CC BY 4.0)</span>
            <span>·</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[#a3a9b8] hover:text-[#eef0f5] transition-colors duration-150"
            >
              <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
