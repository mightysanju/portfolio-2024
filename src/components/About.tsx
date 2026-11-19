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
import { Helmet } from 'react-helmet-async';
import { usePortfolio } from '../context/PortfolioContext';

const About: React.FC = () => {
  const { data, resolveAssetUrl } = usePortfolio();
  const { aboutPage } = data;

  if (!aboutPage) return null;

  return (
    <>
      <Helmet>
        <title>{aboutPage.metaTitle}</title>
        <meta name="description" content={aboutPage.metaDescription} />
      </Helmet>

      <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222734]/80 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#eef0f5] transition-colors duration-150 mb-8"
            >
              <ArrowLeft className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
              <span>{aboutPage.backLabel}</span>
            </Link>

            {aboutPage.profileImage && (
              <div className="mb-6">
                <img
                  src={resolveAssetUrl(aboutPage.profileImage)}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border border-white/[0.10]"
                />
              </div>
            )}

            <p className="font-mono text-xs text-[#7a8296] mb-2">
              {aboutPage.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#eef0f5] mb-2">
              {aboutPage.title}
            </h1>
            <p className="text-sm sm:text-base text-[#a3a9b8] max-w-2xl">
              {aboutPage.subtitle}
            </p>
          </div>

          <div className="space-y-14">
            {/* Education Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <GraduationCap className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                <h2 className="text-lg font-medium text-[#eef0f5]">{aboutPage.sectionTitles.education}</h2>
              </div>
              <div className="space-y-4">
                {aboutPage.education.map((edu) => (
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
                <h2 className="text-lg font-medium text-[#eef0f5]">{aboutPage.sectionTitles.experience}</h2>
              </div>
              <div className="space-y-4">
                {aboutPage.experience.map((exp) => (
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
                <h2 className="text-lg font-medium text-[#eef0f5]">{aboutPage.sectionTitles.domainStack}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#eef0f5]">{aboutPage.sectionTitles.technicalLabel}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {aboutPage.skills.technical.map((skill, i) => (
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
                      {aboutPage.sectionTitles.mlLabel}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {aboutPage.skills.ml.map((skill, i) => (
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
                    <h3 className="text-sm font-medium text-[#eef0f5]">{aboutPage.sectionTitles.softLabel}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {aboutPage.skills.soft.map((skill, i) => (
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
                <h2 className="text-lg font-medium text-[#eef0f5]">{aboutPage.sectionTitles.strengths}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {aboutPage.strengths.map((strength, index) => (
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
                  {aboutPage.sectionTitles.improvements}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {aboutPage.areasOfImprovement.map((item, index) => (
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
                  {aboutPage.sectionTitles.interests}
                </h2>
              </div>
              <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-5 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="flex flex-wrap gap-2">
                  {aboutPage.interests.map((interest, index) => (
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
    </>
  );
};

export default About;