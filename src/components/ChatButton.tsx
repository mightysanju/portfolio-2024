import React, { useState, useRef, useEffect, useId } from 'react';
import { X, SendHorizontal } from 'lucide-react';
import axios from 'axios';
import { usePortfolio, PortfolioData } from '../context/PortfolioContext';

interface LocalKnowledgeEntry {
  id: string;
  topic: string;
  keywords: string[];
  answer: string;
}

interface LocalChatbotConfig {
  assistantName?: string;
  apiUrl?: string;
  mode?: 'hybrid' | 'local_cms' | 'external_api';
  presetQuestions?: string[];
  systemContext?: string;
  knowledgeEntries?: LocalKnowledgeEntry[];
}

const DEFAULT_CHATBOT_CONFIG: Required<LocalChatbotConfig> = {
  assistantName: 'Ask Sanju',
  apiUrl: 'https://flaskragbot-1e1040a057f8.herokuapp.com/api/query',
  mode: 'hybrid',
  presetQuestions: [
    'Tell me about your experience',
    'What are your key skills?',
    'How can we collaborate?',
    'Tell me about yourself',
  ],
  systemContext:
    "Sanju Kumar is a Data Scientist & ML Engineer based in Naperville, IL. He holds a 4.0 GPA in his M.S. in Information Studies at Trine University and a B.Tech in Electronics & Communication Engineering from JNTU. Previously at Amazon (TCMT Support Analyst / Associate), he built the Defect Dispute Override (DDO) tool (reducing carrier cases by 70%) and a Python-SQL network balancing automation app (reducing processing time from 19 minutes to 5 seconds, a 99.56% improvement). He also worked as an IT Analyst at AppMinds Inc and completed an internship at DRDL-DRDO. Contact: sanju.k3r@gmail.com | 224-702-6736.",
  knowledgeEntries: [
    {
      id: 'kb-experience',
      topic: 'Work Experience & Amazon Impact',
      keywords: [
        'experience',
        'work',
        'amazon',
        'job',
        'career',
        'role',
        'appminds',
        'drdo',
        'drdl',
        'background',
        'history',
      ],
      answer:
        'At Amazon (May 2022 – Nov 2023), I worked as an Associate (Support Analyst) with the Transportation Carrier Management Team (TCMT), where I built a Python-SQL network balancing automation app that cut processing time from 19 minutes to 5 seconds (99.56% faster, 228x speedup), created a Chime SLA notification bot with 100% SLA compliance, and built the Defect Dispute Override (DDO) tool that reduced carrier-related defect cases by 70%. Prior to Amazon, I worked as an IT Analyst at AppMinds Inc (2019–2021) and interned at DRDL-DRDO (2017).',
    },
    {
      id: 'kb-skills',
      topic: 'Technical, ML & Cybersecurity Skills',
      keywords: [
        'skill',
        'skills',
        'tech',
        'stack',
        'python',
        'sql',
        'machine learning',
        'ml',
        'tableau',
        'cybersecurity',
        'security',
        'tools',
        'languages',
      ],
      answer:
        'My core stack centers on Python (95%), SQL & Databases (92%), Process Automation (90%), Data Analysis (88%), and Tableau (85%), alongside TensorFlow, PyTorch, Scikit-learn, NLP, and AWS/Azure. I also hold extensive training in Network & System Security, Compliance Frameworks, and Security Tools.',
    },
    {
      id: 'kb-projects',
      topic: 'Featured Engineering Projects',
      keywords: [
        'project',
        'projects',
        'built',
        'portfolio',
        'ddo',
        'defect',
        'network app',
        'ats',
        'resume',
        'linkedin',
        'early applicant',
      ],
      answer:
        'Key projects include: (1) Defect Dispute Override (DDO) Tool — real-time GUI & analytics workflow for Amazon carrier defect management; (2) Network App — Python & Advanced SQL automation that reduced network balancing from 19 minutes to 5 seconds; (3) ATS Score Checker — interactive NLP resume analyzer live at /ats; and (4) LinkedIn Early Applicant — automated Python & SMTP job notification pipeline.',
    },
    {
      id: 'kb-education',
      topic: 'Education & Academic Credentials',
      keywords: [
        'education',
        'degree',
        'university',
        'college',
        'masters',
        'trine',
        'gpa',
        'jntu',
        'bachelors',
        'study',
      ],
      answer:
        "I am completing my Master's in Information Studies (specializing in Data Science & Machine Learning) at Trine University with a 4.0/4.0 GPA (2024–Present). I earned my Bachelor's in Electronics & Communication Engineering from Jawaharlal Nehru Technological University (JNTU), where I trained over 1,000 undergraduates in PCB design and served as Technical Club Lead.",
    },
    {
      id: 'kb-certifications',
      topic: 'Certifications & Verifications',
      keywords: [
        'certification',
        'certifications',
        'certificate',
        'ibm',
        'google',
        'coursera',
        'credly',
        'verified',
        'badge',
      ],
      answer:
        'I hold 13+ verified certifications from IBM, Google, Coursera, and LinkedIn covering Cybersecurity Compliance, Network & OS Security, Foundations of Data Science, Python, TensorFlow Deep Learning, SQL for Data Analysis, and Tableau. Every credential can be verified directly via Credly or Coursera on the portfolio.',
    },
    {
      id: 'kb-contact',
      topic: 'Collaboration, Hiring & Contact Info',
      keywords: [
        'collaborate',
        'contact',
        'hire',
        'hiring',
        'email',
        'phone',
        'reach',
        'location',
        'recruiter',
        'resume',
        'yourself',
        'about',
        'who are you',
      ],
      answer:
        "I'm Sanju Kumar, a Data Scientist & ML Engineer based in Naperville, IL. I'm open to Data Science, Machine Learning, Analytics Engineering, and Process Automation roles as well as technical collaborations. You can reach me directly at sanju.k3r@gmail.com, call 224-702-6736, or use the Contact section on this page.",
    },
  ],
};

export function queryLocalKnowledgeBase(
  query: string,
  data: PortfolioData
): string {
  const cleanQuery = query.toLowerCase().trim();
  const words = cleanQuery
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const rawChatbot = (data as PortfolioData & { chatbot?: LocalChatbotConfig })
    .chatbot;
  const entries: LocalKnowledgeEntry[] =
    rawChatbot?.knowledgeEntries && rawChatbot.knowledgeEntries.length > 0
      ? rawChatbot.knowledgeEntries
      : DEFAULT_CHATBOT_CONFIG.knowledgeEntries;
  const systemContext =
    rawChatbot?.systemContext || DEFAULT_CHATBOT_CONFIG.systemContext;

  // 1. Check if the user is asking about a specific project in live data.projects
  for (const project of data.projects || []) {
    const titleLower = project.title.toLowerCase();
    if (
      cleanQuery.includes(titleLower) ||
      (titleLower.includes('defect dispute') && cleanQuery.includes('ddo')) ||
      (titleLower.includes('ats') && cleanQuery.includes('ats'))
    ) {
      const tagsText = (project.tags || []).join(', ');
      return `${project.title}: ${project.description}${
        tagsText ? ` (Technologies: ${tagsText})` : ''
      }.${
        project.demo
          ? ` You can explore the demo at ${project.demo}.`
          : ''
      }`;
    }
  }

  // 2. Score all knowledge base entries configured in the CMS
  let bestEntry: LocalKnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;
    const topicLower = (entry.topic || '').toLowerCase();

    if (topicLower && cleanQuery.includes(topicLower)) {
      score += 5;
    }

    for (const kw of entry.keywords || []) {
      const kwLower = kw.toLowerCase().trim();
      if (!kwLower) continue;
      if (cleanQuery.includes(kwLower)) {
        score += kwLower.includes(' ') ? 5 : 3;
      } else {
        for (const w of words) {
          if (kwLower === w || (w.length >= 4 && kwLower.includes(w))) {
            score += 2;
          }
        }
      }
    }

    for (const w of words) {
      if (w.length >= 4 && topicLower.includes(w)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  // 3. Supplement with live portfolio data when asking about skills, projects, certifications, or testimonials
  if (
    cleanQuery.includes('skill') ||
    cleanQuery.includes('stack') ||
    cleanQuery.includes('tech')
  ) {
    const topSkills = (data.skills || [])
      .slice(0, 8)
      .map((s) => `${s.name} (${s.level}%)`)
      .join(', ');
    if (bestEntry && bestScore > 0) {
      return `${bestEntry.answer}${
        topSkills ? `\n\nLive CMS Skills: ${topSkills}.` : ''
      }`;
    }
    if (topSkills) {
      return `Key skills include ${topSkills}.`;
    }
  }

  if (cleanQuery.includes('project') || cleanQuery.includes('portfolio')) {
    const projSummary = (data.projects || [])
      .map((p) => `${p.title} (${(p.tags || []).join(', ')})`)
      .join('; ');
    if (bestEntry && bestScore > 0) {
      return `${bestEntry.answer}${
        projSummary ? `\n\nCurrent Featured Projects: ${projSummary}.` : ''
      }`;
    }
    if (projSummary) {
      return `Featured projects on this portfolio: ${projSummary}.`;
    }
  }

  if (cleanQuery.includes('certif') || cleanQuery.includes('credly')) {
    const certCount = (data.certifications || []).length;
    const recentCerts = (data.certifications || [])
      .slice(0, 4)
      .map((c) => `${c.title} (${c.issuer})`)
      .join(', ');
    if (bestEntry && bestScore > 0) {
      return `${bestEntry.answer}${
        recentCerts
          ? `\n\nTotal listed certifications: ${certCount}, including ${recentCerts}.`
          : ''
      }`;
    }
  }

  if (
    cleanQuery.includes('recommend') ||
    cleanQuery.includes('testimonial') ||
    cleanQuery.includes('manager') ||
    cleanQuery.includes('review')
  ) {
    const recs = (data.testimonials || [])
      .slice(0, 3)
      .map((t) => `${t.author} (${t.position})`)
      .join(', ');
    if (recs) {
      return `Sanju has received LinkedIn recommendations from leaders including ${recs}, highlighting his Python automation, problem-solving, and the Defect Dispute Override (DDO) tool at Amazon.`;
    }
  }

  if (bestEntry && bestScore > 0) {
    return bestEntry.answer;
  }

  // 4. Fallback to systemContext + live portfolio overview
  const projectNames = (data.projects || []).map((p) => p.title).join(', ');
  return `${systemContext}${
    projectNames ? ` Featured projects include: ${projectNames}.` : ''
  }`;
}

const RoboticIcon: React.FC<{ className?: string }> = ({ className = 'w-11 h-11' }) => {
  const uid = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = svgRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rawX = e.clientX - centerX;
        const rawY = e.clientY - centerY;
        const dist = Math.hypot(rawX, rawY) || 1;
        const intensity = Math.min(1, dist / 160);

        setLook({
          dx: (rawX / dist) * intensity,
          dy: (rawY / dist) * intensity,
        });
      });
    };

    const handleMouseLeave = () => {
      setLook({ dx: 0, dy: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const { dx, dy } = look;

  // Pure native SVG vector 3D multi-plane parallax offsets (zero CSS 3D bitmap rasterization)
  const shadowShiftX = (dx * 1.4).toFixed(2);
  const backWallX = (-dx * 2.4).toFixed(2);
  const backWallY = (-dy * 1.9 + 1.6).toFixed(2);
  const frontShellX = (dx * 1.4).toFixed(2);
  const frontShellY = (dy * 1.1).toFixed(2);
  const visorX = (dx * 2.4).toFixed(2);
  const visorY = (dy * 1.8).toFixed(2);
  const eyeShiftX = (dx * 3.8).toFixed(2);
  const eyeShiftY = (dy * 2.6).toFixed(2);
  const antennaX = (dx * 2.8).toFixed(2);
  const antennaY = (dy * 1.4).toFixed(2);

  const shellGradId = `droid-shell-${uid}`;
  const backGradId = `droid-back-${uid}`;
  const shadowGradId = `droid-shadow-${uid}`;
  const visorClipId = `droid-visor-clip-${uid}`;

  return (
    <svg
      ref={svgRef}
      viewBox="2 0.5 36 35.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* 3D Sculpted White Front Shell Gradient */}
        <linearGradient
          id={shellGradId}
          x1={(10 - dx * 6).toFixed(1)}
          y1={(8 - dy * 6).toFixed(1)}
          x2="30"
          y2="31"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#eef0f5" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* 3D Extruded Back-Shell Metallic Bevel Gradient */}
        <linearGradient id={backGradId} x1="8" y1="10" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Native Vector Contact Shadow Gradient */}
        <radialGradient id={shadowGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="65%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <clipPath id={visorClipId}>
          <rect x="9.8" y="14.2" width="20.4" height="10.1" rx="3.5" />
        </clipPath>
      </defs>

      {/* Ground Contact Shadow Plane inside SVG */}
      <ellipse
        cx={20 + Number(shadowShiftX)}
        cy="33.5"
        rx="12.5"
        ry="2.2"
        fill={`url(#${shadowGradId})`}
      />

      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -1.1; 0 0"
          dur="3.6s"
          repeatCount="indefinite"
        />

        {/* Plane 1 (Deepest): 3D Extruded Back-Shell / Bevel Layer */}
        <g transform={`translate(${backWallX}, ${backWallY})`}>
          {/* Rear Ear Extrusions */}
          <rect x="4.0" y="15.8" width="3.6" height="8.4" rx="1.6" fill="#64748b" />
          <rect x="32.4" y="15.8" width="3.6" height="8.4" rx="1.6" fill="#64748b" />

          {/* Rear Head Chassis Extrusion */}
          <rect
            x="7.0"
            y="9.4"
            width="26.0"
            height="21.6"
            rx="6.8"
            fill={`url(#${backGradId})`}
            stroke="#7a8296"
            strokeWidth="0.6"
          />
        </g>

        {/* Plane 2 (Foreground Top): 3D Tilted Telemetry Antenna with #4cc38a Status LED */}
        <g transform={`translate(${antennaX}, ${antennaY})`}>
          <line
            x1="20"
            y1="4.2"
            x2="20"
            y2="9.8"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="3.8" r="2.5" fill="#4cc38a" stroke="#ffffff" strokeWidth="0.7">
            <animate
              attributeName="opacity"
              values="1;0.65;1"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="19.3" cy="3.1" r="0.75" fill="#ffffff" />
        </g>

        {/* Plane 3 (Mid-Front): 3D Sculpted White Front Shell */}
        <g transform={`translate(${frontShellX}, ${frontShellY})`}>
          {/* Front Side Transceiver Ears */}
          <rect x="4.6" y="16" width="3.2" height="8" rx="1.5" fill="#cbd5e1" />
          <rect x="32.2" y="16" width="3.2" height="8" rx="1.5" fill="#cbd5e1" />

          {/* Sculpted White Droid Head */}
          <rect
            x="7.5"
            y="9.5"
            width="25"
            height="21"
            rx="6.5"
            fill={`url(#${shellGradId})`}
            stroke="#ffffff"
            strokeWidth="0.85"
          />

          {/* Dynamic Specular Top Rim Highlight */}
          <path
            d="M11.5 11.2 H28.5"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.95"
          />

          {/* Subtle Brow Precision Seam */}
          <line
            x1="13.5"
            y1="12.6"
            x2="26.5"
            y2="12.6"
            stroke="#0b0d14"
            strokeOpacity="0.2"
            strokeWidth="0.9"
            strokeLinecap="round"
          />

          {/* Vocal Telemetry Bar */}
          <rect
            x="15.5"
            y="26.6"
            width="9"
            height="1.6"
            rx="0.8"
            fill="#0b0d14"
            opacity="0.45"
          >
            <animate
              attributeName="width"
              values="9;6;9"
              dur="2.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x"
              values="15.5;17;15.5"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </rect>
        </g>

        {/* Plane 4 (Deep Recessed Visor Cavity + Foreground 3D Eyes) */}
        <g transform={`translate(${visorX}, ${visorY})`}>
          {/* Outer Recessed Bezel Cavity */}
          <rect
            x="9.2"
            y="13.7"
            width="21.6"
            height="11.1"
            rx="4"
            fill="#07080d"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />

          {/* Inner Visor Screen */}
          <rect x="9.8" y="14.2" width="20.4" height="10.1" rx="3.5" fill="#0b0d14" />

          <g clipPath={`url(#${visorClipId})`}>
            {/* Subtle Diagonal Glass Reflection Slash */}
            <path
              d="M10.5 24.5 L16.5 14 H19.2 L13.2 24.5 Z"
              fill="#ffffff"
              opacity="0.06"
            />

            {/* Animated Optical Visor Scan Bar */}
            <rect
              x="12"
              y="15"
              width="2.5"
              height="8.4"
              rx="1"
              fill="#eef0f5"
              opacity="0.11"
            >
              <animate
                attributeName="x"
                values="10.8;26.2;10.8"
                dur="3.8s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Plane 5 (Closest Depth): 3D Cursor-Tracking Optical Eyes */}
            <g transform={`translate(${eyeShiftX}, ${eyeShiftY})`}>
              {/* Left Eye + 3D Specular Dot */}
              <g>
                <rect x="13.6" y="17.0" width="3.8" height="4.5" rx="1.5" fill="#eef0f5">
                  <animate
                    attributeName="height"
                    values="4.5;4.5;0.6;4.5;4.5"
                    keyTimes="0;0.46;0.5;0.54;1"
                    dur="4.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y"
                    values="17.0;17.0;19.0;17.0;17.0"
                    keyTimes="0;0.46;0.5;0.54;1"
                    dur="4.4s"
                    repeatCount="indefinite"
                  />
                </rect>
                <circle cx="14.8" cy="18.2" r="0.65" fill="#ffffff" />
              </g>

              {/* Right Eye + 3D Specular Dot */}
              <g>
                <rect x="22.6" y="17.0" width="3.8" height="4.5" rx="1.5" fill="#eef0f5">
                  <animate
                    attributeName="height"
                    values="4.5;4.5;0.6;4.5;4.5"
                    keyTimes="0;0.46;0.5;0.54;1"
                    dur="4.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y"
                    values="17.0;17.0;19.0;17.0;17.0"
                    keyTimes="0;0.46;0.5;0.54;1"
                    dur="4.4s"
                    repeatCount="indefinite"
                  />
                </rect>
                <circle cx="23.8" cy="18.2" r="0.65" fill="#ffffff" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

const ChatButton: React.FC = () => {
  const { data } = usePortfolio();
  const rawChatbot = (data as PortfolioData & { chatbot?: LocalChatbotConfig })
    .chatbot;

  const assistantName =
    rawChatbot?.assistantName?.trim() || DEFAULT_CHATBOT_CONFIG.assistantName;
  const apiUrl =
    rawChatbot?.apiUrl?.trim() || DEFAULT_CHATBOT_CONFIG.apiUrl;
  const mode = rawChatbot?.mode || DEFAULT_CHATBOT_CONFIG.mode;
  const presetMessages =
    rawChatbot?.presetQuestions && rawChatbot.presetQuestions.length > 0
      ? rawChatbot.presetQuestions
      : DEFAULT_CHATBOT_CONFIG.presetQuestions;

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean; isLoading?: boolean }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePresetMessage = (preset: string) => {
    setMessage(preset);
    handleSubmit(preset);
  };

  const handleSubmit = async (text: string | React.FormEvent) => {
    if (typeof text !== 'string') {
      text.preventDefault();
      text = message;
    }

    const cleanText = text.trim();
    if (!cleanText) return;

    setMessage('');
    setMessages((prev) => [...prev, { text: cleanText, isUser: true }]);

    if (mode === 'local_cms') {
      const answer = queryLocalKnowledgeBase(cleanText, data);
      setMessages((prev) => [...prev, { text: answer, isUser: false }]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { text: '', isUser: false, isLoading: true },
    ]);

    try {
      const response = await axios.post(
        apiUrl,
        { query: cleanText },
        {
          timeout: 6000,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const remoteAnswer =
        typeof response.data?.answer === 'string'
          ? response.data.answer.trim()
          : '';

      if (remoteAnswer) {
        setMessages((prev) => [
          ...prev.filter((m) => !m.isLoading),
          { text: remoteAnswer, isUser: false },
        ]);
      } else if (mode === 'hybrid') {
        const fallbackAnswer = queryLocalKnowledgeBase(cleanText, data);
        setMessages((prev) => [
          ...prev.filter((m) => !m.isLoading),
          { text: fallbackAnswer, isUser: false },
        ]);
      } else {
        setMessages((prev) => [
          ...prev.filter((m) => !m.isLoading),
          {
            text: "I'll get back to you soon.",
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      if (mode === 'hybrid') {
        const fallbackAnswer = queryLocalKnowledgeBase(cleanText, data);
        setMessages((prev) => [
          ...prev.filter((m) => !m.isLoading),
          { text: fallbackAnswer, isUser: false },
        ]);
      } else {
        console.error('API Error:', error);
        setMessages((prev) => [
          ...prev.filter((m) => !m.isLoading),
          {
            text: 'External API endpoint is currently unreachable. Switch mode to Hybrid or Local CMS in /admin, or try again later.',
            isUser: false,
          },
        ]);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 group">
          {/* Slide-out label pill on hover */}
          <span className="pointer-events-none px-3 py-1.5 rounded-[8px] bg-[#11141c]/90 backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] text-xs font-medium text-[#eef0f5] opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap">
            {assistantName}
          </span>

          {/* Free-Floating 3D Volumetric Telemetry Droid (No Outer Box, Native Vector Sharpness) */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label={assistantName}
            title={assistantName}
            className="relative bg-transparent border-0 shadow-none p-0 flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <RoboticIcon className="w-16 h-16 sm:w-[72px] sm:h-[72px]" />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-[#11141c]/80 backdrop-blur-xl rounded-[14px] border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] z-[100] overflow-hidden">
          <div className="px-4 py-3 bg-[#07080d]/85 backdrop-blur-xl border-b border-white/[0.10] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-[8px] bg-[#1a1e28]/80 border border-white/[0.12] flex items-center justify-center">
                <RoboticIcon className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#4cc38a] ring-2 ring-[#07080d]" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-[#eef0f5] leading-tight">
                  {assistantName}
                </h2>
                <span className="font-mono text-[10px] text-[#7a8296] block">
                  AI portfolio assistant
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-[#7a8296] hover:text-[#eef0f5] p-1 rounded-[6px] hover:bg-[#1a1e28]/70 transition-colors duration-150"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-[#11141c]/75 backdrop-blur-xl">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-[#a3a9b8] text-xs">
                  Select a prompt or ask a question about my work and experience.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {presetMessages.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetMessage(preset)}
                      className="flex items-center justify-between px-3 py-2 text-left text-xs text-[#eef0f5] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222734]/80 rounded-[8px] border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150"
                    >
                      <span>{preset}</span>
                      <span className="text-[#7a8296]">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!msg.isUser && (
                  <div className="w-6 h-6 rounded-[6px] bg-[#1a1e28]/80 border border-white/[0.10] flex items-center justify-center flex-shrink-0 mb-0.5">
                    <RoboticIcon className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-[8px] text-xs leading-relaxed whitespace-pre-line ${
                    msg.isUser
                      ? 'bg-[#eef0f5] text-[#0b0d14]'
                      : 'bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border border-white/[0.10]'
                  }`}
                >
                  {msg.isLoading ? (
                    <span className="font-mono text-[#7a8296]">Thinking...</span>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-white/[0.10] bg-[#07080d]/85 backdrop-blur-xl"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 h-9 bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] placeholder-[#7a8296] text-xs rounded-[8px] px-3 border border-white/[0.10] focus:outline-none focus:border-white/[0.24] transition-colors duration-150"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white flex items-center justify-center transition-colors duration-150 flex-shrink-0"
              >
                <SendHorizontal className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatButton;
