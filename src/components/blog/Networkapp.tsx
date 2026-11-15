import React, { useEffect } from 'react';
import BlogLayout from './BlogLayout';
import PerformanceChart from './NetworkappGraph';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Networkapp: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Network App: Automating Network Balancing SIMs</title>
        <meta
          name="description"
          content="Network App automates SQL data retrieval, payload formatting, and fulfillment center notifications for network balancing SIM workflows."
        />
      </Helmet>
      <BlogLayout
        title="Network App"
        date="April 15, 2023"
        readTime="10 min read"
        tags={['Automation', 'Advanced SQL', 'Python']}
        image="https://i.imgur.com/VxGPpEB.png"
      >
        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Introduction</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          Network balancing operations require rapid coordination across fulfillment centers. The
          Network App automates SQL extraction, redirectable volume aggregation, and structured
          notification drafting—reducing average handling time per SIM by 94.36%.
        </p>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Problem statement</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          In daily operations, analysts spent substantial manual effort executing repetitive queries
          across multiple sources, collating vendor redirectable volume, and formatting approval
          requests for fulfillment centers. Manual assembly introduced latency and transcription
          errors.
        </p>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Solution architecture</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-4">
          We built the Network App in Python and SQL to execute end-to-end data retrieval and
          dispatch preparation in a single workflow:
        </p>
        <ul className="list-disc list-inside text-[#a3a9b8] text-sm space-y-2 mb-6 leading-relaxed">
          <li>
            <span className="text-[#eef0f5] font-medium">Automated SQL extraction:</span> Queries
            live operational tables and aggregates redirectable volume by lane.
          </li>
          <li>
            <span className="text-[#eef0f5] font-medium">Deterministic formatting:</span> Generates
            standardized approval payloads without manual copy-paste.
          </li>
          <li>
            <span className="text-[#eef0f5] font-medium">Rapid dispatch:</span> Routes formatted
            requests directly to target facility stakeholders.
          </li>
        </ul>

        <div className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-6 mb-6">
          <h3 className="text-base font-medium text-[#eef0f5] mb-4">Performance telemetry</h3>
          <PerformanceChart />
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Pilot study results</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-4">
          Across a 149-SIM pilot evaluation comparing manual processing against the Network App:
        </p>

        <div className="overflow-x-auto rounded-[10px] border border-white/[0.08] bg-[#0b0d14] mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#1a1e28] text-xs font-mono text-[#a3a9b8]">
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium">Manual (149 SIMs)</th>
                <th className="px-4 py-3 font-medium">Manual Avg</th>
                <th className="px-4 py-3 font-medium">Network App Total</th>
                <th className="px-4 py-3 font-medium">Network App Avg</th>
                <th className="px-4 py-3 font-medium">Speedup</th>
                <th className="px-4 py-3 font-medium">AHT Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08] text-xs font-mono tabular-nums text-[#eef0f5]">
              <tr>
                <td className="px-4 py-3 text-[#a3a9b8]">Duration</td>
                <td className="px-4 py-3 text-[#7a8296]">Minutes</td>
                <td className="px-4 py-3">708.30</td>
                <td className="px-4 py-3">4.75</td>
                <td className="px-4 py-3">39.97</td>
                <td className="px-4 py-3 text-[#3b82f6]">0.27</td>
                <td className="px-4 py-3 text-[#4cc38a]">17.72x</td>
                <td className="px-4 py-3 text-[#4cc38a]">94.36%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[#a3a9b8]">Duration</td>
                <td className="px-4 py-3 text-[#7a8296]">Seconds</td>
                <td className="px-4 py-3">42,498.0</td>
                <td className="px-4 py-3">285.22</td>
                <td className="px-4 py-3">2,398.2</td>
                <td className="px-4 py-3 text-[#3b82f6]">16.10</td>
                <td className="px-4 py-3 text-[#4cc38a]">17.72x</td>
                <td className="px-4 py-3 text-[#4cc38a]">94.36%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Roadmap</h2>
        <ol className="list-decimal list-inside text-[#a3a9b8] text-sm space-y-2 leading-relaxed">
          <li>
            <span className="text-[#eef0f5] font-medium">Automated facility alias resolution:</span>{' '}
            Direct lookup of origin and destination distribution lists.
          </li>
          <li>
            <span className="text-[#eef0f5] font-medium">Trailer tag status verification:</span>{' '}
            Pre-flight validation ensuring only eligible trailers are flagged for redirection.
          </li>
        </ol>
      </BlogLayout>
    </HelmetProvider>
  );
};

export default Networkapp;
