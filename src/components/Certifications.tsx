import React, { useState, useMemo } from 'react';
import {
  Brain,
  Database,
  Code2,
  ExternalLink,
  Shield,
  Linkedin,
  ShieldCheck,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import {
  usePortfolio,
  type CertificationItem,
} from '../context/PortfolioContext';

interface CategoryMeta {
  id: string;
  label: string;
  icon?: LucideIcon;
}

function toSafeExternalUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '';
}

const DEFAULT_CREDLY_URL =
  'https://www.credly.com/users/sanju-kumar.671f31d3';
const DEFAULT_LINKEDIN_CERTS_URL =
  'https://www.linkedin.com/in/mightysanju/details/certifications/';

const Certifications: React.FC = () => {
  const { data } = usePortfolio();
  const certifications = useMemo(
    () =>
      Array.isArray(data.certifications)
        ? data.certifications.filter(
            (c): c is CertificationItem => Boolean(c && typeof c === 'object')
          )
        : [],
    [data.certifications]
  );
  const hero = data.hero;
  const certMeta = data.sections?.certifications;
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const eyebrow =
    typeof certMeta?.eyebrow === 'string'
      ? certMeta.eyebrow
      : '02 / Credentials';
  const title =
    typeof certMeta?.title === 'string' ? certMeta.title : 'Certifications';
  const description =
    typeof certMeta?.description === 'string'
      ? certMeta.description
      : 'Verified credentials across machine learning, data science, software development, and security compliance.';
  const allLabel =
    typeof certMeta?.allLabel === 'string' && certMeta.allLabel.trim()
      ? certMeta.allLabel
      : 'All credentials';
  const credlyLabel =
    typeof certMeta?.credlyLabel === 'string' && certMeta.credlyLabel.trim()
      ? certMeta.credlyLabel
      : 'Credly profile';
  const linkedinLabel =
    typeof certMeta?.linkedinLabel === 'string' && certMeta.linkedinLabel.trim()
      ? certMeta.linkedinLabel
      : 'LinkedIn credentials';

  const credlyUrl =
    typeof hero?.credlyUrl === 'string'
      ? toSafeExternalUrl(hero.credlyUrl)
      : DEFAULT_CREDLY_URL;
  const linkedinCertsUrl =
    typeof hero?.linkedinCertsUrl === 'string'
      ? toSafeExternalUrl(hero.linkedinCertsUrl)
      : DEFAULT_LINKEDIN_CERTS_URL;

  const categoriesWithCounts = useMemo(() => {
    const definitions: CategoryMeta[] = [
      { id: 'all', label: allLabel },
      { id: 'ml', label: 'Machine learning', icon: Brain },
      { id: 'data', label: 'Data engineering', icon: Database },
      { id: 'dev', label: 'Development', icon: Code2 },
      { id: 'cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
    ];

    const counts: Record<string, number> = {};
    certifications.forEach((cert) => {
      const cat =
        typeof cert.category === 'string' && cert.category
          ? cert.category
          : 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return definitions.map((cat) => ({
      ...cat,
      count: cat.id === 'all' ? certifications.length : counts[cat.id] || 0,
    }));
  }, [certifications, allLabel]);

  const filteredCertifications = useMemo(() => {
    if (activeCategory === 'all') return certifications;
    return certifications.filter((cert) => cert.category === activeCategory);
  }, [certifications, activeCategory]);

  const renderVerificationLink = (
    verification?: CertificationItem['verification']
  ) => {
    if (!verification || typeof verification !== 'object') return null;
    const safeUrl = toSafeExternalUrl(verification.url);
    if (!safeUrl) return null;

    const label =
      verification.type === 'credly'
        ? 'Verify on Credly'
        : verification.type === 'linkedin'
        ? 'View on LinkedIn'
        : 'Verify certificate';

    const IconComponent =
      verification.type === 'credly'
        ? Shield
        : verification.type === 'linkedin'
        ? Linkedin
        : CheckCircle2;

    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-9 px-3 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222734]/80 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#eef0f5] inline-flex items-center justify-between transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <span className="inline-flex items-center gap-2">
          <IconComponent
            className="w-4 h-4 text-[#4cc38a]"
            strokeWidth={1.5}
          />
          <span>{label}</span>
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
      </a>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          {eyebrow.trim().length > 0 && (
            <p className="font-mono text-xs text-[#7a8296] mb-2">{eyebrow}</p>
          )}
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#eef0f5] mb-2">
            {title}
          </h2>
          {description.trim().length > 0 && (
            <p className="text-sm sm:text-base text-[#a3a9b8] max-w-xl">
              {description}
            </p>
          )}
        </div>

        {(credlyUrl || linkedinCertsUrl) && (
          <div className="flex flex-wrap items-center gap-2.5">
            {credlyUrl && (
              <a
                href={credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222734]/80 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#eef0f5] inline-flex items-center gap-2 transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <Shield className="w-4 h-4 text-[#4cc38a]" strokeWidth={1.5} />
                <span>{credlyLabel}</span>
                <ExternalLink
                  className="w-3.5 h-3.5 text-[#7a8296]"
                  strokeWidth={1.5}
                />
              </a>
            )}

            {linkedinCertsUrl && (
              <a
                href={linkedinCertsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222734]/80 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#eef0f5] inline-flex items-center gap-2 transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <Linkedin
                  className="w-4 h-4 text-[#7a8296]"
                  strokeWidth={1.5}
                />
                <span>{linkedinLabel}</span>
                <ExternalLink
                  className="w-3.5 h-3.5 text-[#7a8296]"
                  strokeWidth={1.5}
                />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Pills with Counts */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categoriesWithCounts.map((category) => {
          const isActive = activeCategory === category.id;
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`h-9 px-3.5 rounded-[8px] text-sm font-medium transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                  : 'bg-[#11141c]/75 backdrop-blur-xl text-[#a3a9b8] border-white/[0.10] hover:text-[#eef0f5] hover:bg-[#1a1e28]/70'
              }`}
            >
              {IconComponent && (
                <IconComponent
                  className="w-4 h-4 text-[#7a8296]"
                  strokeWidth={1.5}
                />
              )}
              <span>{category.label}</span>
              <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                {category.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Uniform Bento Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCertifications.map((cert, index) => {
          const globalIndex = certifications.indexOf(cert);
          const displayNum = String(
            (globalIndex >= 0 ? globalIndex : index) + 1
          ).padStart(2, '0');
          const verId =
            typeof cert.verification?.id === 'string'
              ? cert.verification.id.trim()
              : '';
          const sigId = verId ? `CERT-${displayNum} · ${verId}` : `CERT-${displayNum}`;
          const verificationNode = renderVerificationLink(cert.verification);

          return (
            <div
              key={cert.id || index}
              className="flex flex-col justify-between bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-white/[0.18] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <div>
                {/* Top Meta Row: Signature ID & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono tabular-nums text-xs text-[#7a8296] truncate">
                    {sigId}
                  </span>
                  <span className="font-mono tabular-nums text-xs text-[#7a8296] flex-shrink-0">
                    {typeof cert.date === 'string' ? cert.date : ''}
                  </span>
                </div>

                {/* Issuer Pill */}
                <div className="mb-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    {typeof cert.issuer === 'string' ? cert.issuer : ''}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-medium text-[#eef0f5] mb-1.5 leading-snug">
                  {typeof cert.title === 'string' ? cert.title : ''}
                </h3>
                <p className="text-sm text-[#a3a9b8] leading-relaxed mb-5">
                  {typeof cert.description === 'string' ? cert.description : ''}
                </p>
              </div>

              {/* Bottom Pinned Verification Row */}
              {verificationNode && (
                <div className="pt-3 border-t border-white/[0.10]">
                  {verificationNode}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Certifications;
