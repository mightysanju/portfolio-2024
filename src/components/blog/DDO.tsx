import React, { useEffect } from 'react';
import BlogLayout from './BlogLayout';
import Stakeholder from './stakeholder';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const DDO: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stakeholders = [
    {
      name: 'Jake Porter',
      role: 'Global Logistics · Prepaid Transportation',
      company: 'Amazon',
      linkedinUrl: 'https://www.linkedin.com/in/jake-porter-20083b257/',
      imageUrl:
        'https://ui-avatars.com/api/?name=Jake+Porter&background=1a1e28&color=eef0f5&size=200',
      contribution: 'Project sponsor for the Defect Dispute Override (DDO) application.'
    },
    {
      name: 'Jayadev Addepalli',
      role: 'Supply Chain Manager',
      company: 'Amazon',
      linkedinUrl: 'https://www.linkedin.com/in/jdaddepalli/',
      imageUrl:
        'https://ui-avatars.com/api/?name=Jayadev+Addepalli&background=1a1e28&color=eef0f5&size=200',
      contribution: 'Project manager for the Defect Dispute Override (DDO) deployment.'
    }
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Defect Dispute Override (DDO): Logistics &amp; Supply Chain Automation</title>
        <meta
          name="description"
          content="Defect Dispute Override (DDO) is a Python desktop application built to streamline carrier performance evaluation and dispute dispositioning in supply chain operations."
        />
      </Helmet>

      <BlogLayout
        title="Defect Dispute Override Tool"
        date="March 10, 2023"
        readTime="8 min read"
        tags={['Data Science', 'Python', 'SQL', 'Analytics']}
        image="https://i.imgur.com/pqH8SRU.png"
        githubLink="https://github.com/mightysanju/DDO-Tool-Code-for-Public"
      >
        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Introduction</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          In logistics and supply chain operations, accurate carrier performance evaluation directly
          impacts network reliability and cost. Discrepancies in carrier defect rankings create
          financial friction and manual research overhead. I engineered the Defect Dispute Override
          (DDO) desktop application for Amazon&apos;s Carrier Management Team (TCMT) to automate
          defect research and dispositioning.
        </p>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Problem statement</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          Prior to DDO, resolving carrier appointment defect disputes required associates to
          manually query multiple tables and cross-check timestamps during live calls. That workflow
          was slow, repetitive, and susceptible to inconsistent dispositioning.
        </p>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Solution architecture</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-4">
          DDO is a Python desktop application built with Tkinter and backed by parameterized SQL
          pipelines. It retrieves appointment telemetry in real time and validates dispute criteria
          automatically:
        </p>
        <ul className="list-disc list-inside text-[#a3a9b8] text-sm space-y-2 mb-6 leading-relaxed">
          <li>
            <span className="text-[#eef0f5] font-medium">Structured operator GUI:</span> Single-pane
            interface for looking up carrier appointment records and defect codes.
          </li>
          <li>
            <span className="text-[#eef0f5] font-medium">Concurrent query execution:</span>{' '}
            Multithreading and multiprocessing keep the UI responsive during bulk SQL fetches.
          </li>
          <li>
            <span className="text-[#eef0f5] font-medium">Real-time validation:</span> Evaluates
            carrier performance logs immediately to surface root-cause indicators.
          </li>
          <li>
            <span className="text-[#eef0f5] font-medium">One-click disposition upload:</span>{' '}
            Standardizes override logging and eliminates manual transcription errors.
          </li>
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-5">
            <p className="font-mono text-xs text-[#7a8296] mb-1">RANKING DISCREPANCIES</p>
            <p className="font-mono text-2xl font-medium text-[#eef0f5] tabular-nums">-70%</p>
            <p className="text-xs text-[#a3a9b8] mt-1">
              Reduction in carrier ranking discrepancies across evaluated disputes
            </p>
          </div>
          <div className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-5">
            <p className="font-mono text-xs text-[#7a8296] mb-1">ROOT-CAUSE COVERAGE</p>
            <p className="font-mono text-2xl font-medium text-[#4cc38a] tabular-nums">100%</p>
            <p className="text-xs text-[#a3a9b8] mt-1">
              Automated root-cause classification across supported appointment defect types
            </p>
          </div>
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Technical implementation</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          Built in Python using Tkinter for the operator interface, concurrent worker pools for I/O
          bound SQL queries, and automated validation rules that reconcile carrier-submitted
          evidence against warehouse gate and appointment logs.
        </p>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Project stakeholders</h2>
        <div className="grid gap-4">
          {stakeholders.map((stakeholder, index) => (
            <Stakeholder key={index} {...stakeholder} />
          ))}
        </div>
      </BlogLayout>
    </HelmetProvider>
  );
};

export default DDO;
