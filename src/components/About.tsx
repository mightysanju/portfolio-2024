import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Shield,
  Award,
  Code2,
  Brain,
  Target,
  Users,
  Lightbulb,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const About: React.FC = () => {
  const education = [
    {
      id: 'EDU-01',
      degree: "Master's in Information Studies",
      school: 'Trine University',
      period: '2024 – Present',
      description: 'Specializing in Data Science and Machine Learning',
      courses: [
        'Advanced Machine Learning',
        'Deep Learning & Neural Networks',
        'Big Data Analytics',
        'Cybersecurity',
        'Cloud Computing',
      ],
      gpa: '4.0 / 4.0',
    },
    {
      id: 'EDU-02',
      degree: "Bachelor's in Electronics & Communication Engineering",
      school: 'Jawaharlal Nehru Technological University',
      period: '2014 – 2018',
      description: 'Focused on Electronics & Embedded Programming',
      courses: [
        'C Programming & Embedded C',
        'Electrical and Electronics Engineering',
        'VLSI Design',
        'Transmission Lines',
      ],
      achievements: [
        'Organized workshops and trained 1,000+ undergraduates in PCB design',
        'Member of Innovation Council',
        'Technical Club Lead',
      ],
    },
  ];

  const experience = [
    {
      id: 'EXP-01',
      role: 'Associate (Support Analyst)',
      company: 'Amazon',
      period: 'May 2022 – Nov 2023',
      location: 'Hyderabad, India',
      achievements: [
        'Developed a Python-SQL automation application reducing processing time from 19 minutes to 5 seconds (99.56% improvement)',
        'Created a notification bot achieving 100% SLA compliance through Amazon Chime integration',
        'Developed the Defect Dispute Override (DDO) tool reducing carrier-related cases by 70% with permanent issue resolution',
        'Assisted Program Manager with data mining for strategic planning and operational decision-making',
        'Maintained 100% accuracy while achieving a 228x increase in processing throughput',
      ],
      technologies: [
        'Python',
        'SQL',
        'Automation',
        'Data Mining',
        'Bot Development',
        'Process Optimization',
      ],
    },
    {
      id: 'EXP-02',
      role: 'IT Analyst',
      company: 'AppMinds Inc',
      period: 'Jun 2019 – Jun 2021',
      location: 'Hyderabad, India',
      achievements: [
        'Provided comprehensive IT support ensuring minimal system downtime',
        'Implemented structured troubleshooting procedures for employee technical issues',
        'Maintained system integrity and operational reliability',
        'Contributed to IT infrastructure optimization',
        'Delivered prompt resolution of technical incidents',
      ],
      technologies: [
        'IT Support',
        'System Administration',
        'Troubleshooting',
        'Technical Support',
        'Infrastructure Management',
      ],
    },
    {
      id: 'EXP-03',
      role: 'Student Intern',
      company: 'Defence Research and Development Laboratory (DRDL) – DRDO',
      period: 'Jun 2017 – Aug 2017',
      location: 'Hyderabad, India',
      achievements: [
        'Developed a Smart Attendance System under Technical Officer guidance',
        'Gained hands-on engineering experience in a defense research organization',
        'Completed end-to-end project implementation and testing',
        'Collaborated with cross-functional technical team members',
        'Followed strict defense research protocols and documentation standards',
      ],
      technologies: [
        'Project Management',
        'System Development',
        'Research Methodology',
        'Technical Documentation',
      ],
    },
  ];

  const skills = {
    technical: [
      'Python',
      'TensorFlow',
      'PyTorch',
      'Scikit-learn',
      'SQL',
      'AWS',
      'Azure',
      'Docker',
      'Kubernetes',
      'Git',
      'REST APIs',
      'Microservices',
    ],
    ml: [
      'Deep Learning',
      'NLP',
      'Computer Vision',
      'Reinforcement Learning',
      'Time Series Analysis',
      'Feature Engineering',
      'Model Optimization',
    ],
    soft: [
      'Leadership',
      'Problem Solving',
      'Communication',
      'Team Management',
      'Mentoring',
      'Project Planning',
    ],
  };

  const strengths = [
    {
      title: 'Analytical problem solving',
      description:
        'Rigorous engineering mindset with a track record of resolving high-volume operational bottlenecks.',
    },
    {
      title: 'Technical leadership',
      description:
        'Experience leading and mentoring peers while shipping self-serve internal tools.',
    },
    {
      title: 'Rapid systems adaptation',
      description:
        'Quick to evaluate, adopt, and integrate modern data and ML toolchains into production workflows.',
    },
    {
      title: 'Cross-functional communication',
      description:
        'Translates statistical findings and system trade-offs clearly for non-technical stakeholders.',
    },
    {
      title: 'Mathematical foundation',
      description:
        'Grounded in applied statistics, linear algebra, and quantitative optimization.',
    },
  ];

  const areasOfImprovement = [
    {
      area: 'Public speaking',
      plan: 'Participating in technical meetups and presenting architecture walkthroughs.',
    },
    {
      area: 'Work-life balance',
      plan: 'Maintaining structured time-blocking and sprint boundaries.',
    },
    {
      area: 'Pragmatic iteration',
      plan: 'Balancing deep optimization with incremental shipping milestones.',
    },
    {
      area: 'Systems-level abstraction',
      plan: 'Pairing low-level implementation detail with long-horizon product architecture.',
    },
  ];

  const interests = [
    'Artificial General Intelligence',
    'Quantum Computing',
    'Robotics',
    'Sustainable Technology',
    'Edge Computing',
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Sanju Kumar | Background &amp; Experience</title>
        <meta
          name="description"
          content="Sanju Kumar is a Data Scientist and ML Engineer with hands-on experience in Python, TensorFlow, PyTorch, SQL, and enterprise process automation."
        />
      </Helmet>

      <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222734]/80 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#eef0f5] transition-colors duration-150 mb-8"
            >
              <ArrowLeft className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
              <span>Back to portfolio</span>
            </Link>

            <p className="font-mono text-xs text-[#7a8296] mb-2">
              PROFILE / DOSSIER
            </p>
            <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#eef0f5] mb-2">
              Background &amp; engineering experience
            </h1>
            <p className="text-sm sm:text-base text-[#a3a9b8] max-w-2xl">
              Academic credentials, production systems shipped at Amazon, and core technical competencies.
            </p>
          </div>

          <div className="space-y-14">
            {/* Education Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <GraduationCap className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <h2 className="text-lg font-medium text-[#eef0f5]">Education</h2>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-6 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div>
                        <span className="font-mono tabular-nums text-xs text-[#7a8296] block mb-1">
                          {edu.id} · {edu.period}
                        </span>
                        <h3 className="text-base font-medium text-[#eef0f5]">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-[#a3a9b8]">{edu.school}</p>
                      </div>
                      {edu.gpa && (
                        <span className="font-mono tabular-nums text-xs text-[#4cc38a] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] px-2.5 py-1 rounded-[6px]">
                          GPA {edu.gpa}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#a3a9b8] mb-4">{edu.description}</p>

                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-[#7a8296] mb-2">
                        Key coursework
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.courses.map((course, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] border border-white/[0.10] text-xs"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    {edu.achievements && (
                      <div className="pt-4 border-t border-white/[0.10]">
                        <h4 className="text-xs font-medium text-[#7a8296] mb-2">
                          Highlights
                        </h4>
                        <ul className="space-y-1.5">
                          {edu.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#a3a9b8]"
                            >
                              <Award
                                className="w-4 h-4 text-[#7a8296] mt-0.5 flex-shrink-0"
                                strokeWidth={1.5}
                              />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Experience Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <Briefcase className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <h2 className="text-lg font-medium text-[#eef0f5]">Experience</h2>
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-6 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="font-mono tabular-nums text-xs text-[#7a8296] block mb-1">
                          {exp.id} · {exp.period}
                        </span>
                        <h3 className="text-base font-medium text-[#eef0f5]">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-[#a3a9b8]">{exp.company}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#7a8296] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] px-2.5 py-1 rounded-[6px]">
                        <Globe className="w-3.5 h-3.5 text-[#7a8296]" strokeWidth={1.5} />
                        {exp.location}
                      </span>
                    </div>

                    <div className="mb-5">
                      <h4 className="text-xs font-medium text-[#7a8296] mb-2.5">
                        Key outcomes
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-[#a3a9b8]"
                          >
                            <CheckCircle2
                              className="w-4 h-4 text-[#4cc38a] mt-0.5 flex-shrink-0"
                              strokeWidth={1.5}
                            />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/[0.10]">
                      <h4 className="text-xs font-medium text-[#7a8296] mb-2">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] border border-white/[0.10] text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <Code2 className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <h2 className="text-lg font-medium text-[#eef0f5]">Domain stack</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#eef0f5]">Technical</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.technical.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] border border-white/[0.10] text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#eef0f5]">
                      Machine learning
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.ml.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] border border-white/[0.10] text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#eef0f5]">Operations</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.soft.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] border border-white/[0.10] text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Strengths Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <Shield className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <h2 className="text-lg font-medium text-[#eef0f5]">Core strengths</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  >
                    <h3 className="text-sm font-medium text-[#eef0f5] mb-1.5">
                      {strength.title}
                    </h3>
                    <p className="text-sm text-[#a3a9b8] leading-relaxed">
                      {strength.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Areas of Improvement Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <Target className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <h2 className="text-lg font-medium text-[#eef0f5]">
                  Current focus &amp; growth areas
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {areasOfImprovement.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  >
                    <h3 className="text-sm font-medium text-[#eef0f5] mb-1.5">
                      {item.area}
                    </h3>
                    <p className="text-sm text-[#a3a9b8] leading-relaxed">
                      {item.plan}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Interests Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <Lightbulb className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <h2 className="text-lg font-medium text-[#eef0f5]">
                  Research interests
                </h2>
              </div>
              <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] text-xs font-medium border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default About;
