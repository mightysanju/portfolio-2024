import React, { useState, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobRecord {
  job_ID?: string;
  job_title: string;
  company_name: string;
  location: string;
  Link: string;
  num_applicants: string;
  time_posted: string;
}

const LinkedinnApp: React.FC = () => {
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours}h`;
    const days = Math.round(minutes / 1440);
    if (days < 7) return `${days}d`;
    if (days < 14) return '1w';
    if (days < 30) return '2w';
    return '1mo';
  };

  const JobCard = ({ job }: { job: JobRecord }) => {
    const isEarlyApplicant = job.num_applicants
      ?.toLowerCase()
      .includes('be among the first 25 applicants');

    const handleApplyClick = () => {
      window.open(job.Link, '_blank', 'noopener,noreferrer');
    };

    return (
      <div className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] hover:border-white/[0.18] rounded-[14px] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-150">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-medium text-[#eef0f5] truncate">{job.job_title}</h3>
            <p className="text-sm text-[#a3a9b8] mt-0.5">{job.company_name}</p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7a8296] tabular-nums mt-1.5">
              <span>{job.location}</span>
              <span>·</span>
              <span>{job.time_posted}</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleApplyClick}
              className="w-full sm:w-auto h-9 px-4 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center justify-center gap-1.5 transition-colors duration-150"
            >
              <span>Apply on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#0b0d14]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.10] flex items-center justify-between">
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-[6px] border ${
              isEarlyApplicant
                ? 'bg-[#4cc38a]/10 text-[#4cc38a] border-[#4cc38a]/30'
                : 'bg-[#1a1e28]/70 text-[#a3a9b8] border-white/[0.10]'
            }`}
          >
            {job.num_applicants}
          </span>
        </div>
      </div>
    );
  };

  const [jobTitle, setJobTitle] = useState('Data Scientist');
  const [location, setLocation] = useState('Chicago');
  const [timeFilterMinutes, setTimeFilterMinutes] = useState(120);
  const [applicantFilter, setApplicantFilter] = useState('all');
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const jobTitleOptions = [
    'Java',
    'Data Analyst',
    'Data Scientist',
    'Network Engineer',
    'Data Engineer'
  ];
  const applicantFilterOptions = ['all', 'Be among the first 25 applicants'];

  const handleSearch = useCallback(async () => {
    if (!jobTitle.trim() || !location.trim()) {
      setError('Job title and location are required.');
      return;
    }

    setIsLoading(true);
    setJobs([]);
    setError(null);
    setMessage('');
    setHasSearched(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    const API_BASE_URL = 'https://linked-early-apply-966926647025.us-central1.run.app/search';
    const params = new URLSearchParams({
      job_title: jobTitle,
      location: location,
      time_filter_minutes: String(timeFilterMinutes),
      applicant_filter_text: applicantFilter
    });

    const queryString = params.toString().replace(/\+/g, '%20');
    const targetUrl = `${API_BASE_URL}?${queryString}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Service returned status ${response.status}.`);
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Empty response from job service.');
      }

      const data = JSON.parse(responseText);
      if (data.error) throw new Error(data.error);
      if (data.message) {
        setMessage(data.message);
        setJobs([]);
      } else {
        setJobs(data);
        if (data.length === 0) {
          setMessage('No jobs found matching your criteria.');
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setError('Live job endpoint unavailable or timed out. Showing sample telemetry records.');

      const mockJobs: JobRecord[] = [
        {
          job_ID: 'mock1',
          job_title: `${jobTitle || 'Data Scientist'} (Sample)`,
          company_name: 'Enterprise Analytics Corp',
          location,
          Link: 'https://www.linkedin.com/jobs/search/?keywords=Data%20Scientist',
          num_applicants: 'Be among the first 25 applicants',
          time_posted: '42 minutes ago'
        },
        {
          job_ID: 'mock2',
          job_title: 'Machine Learning Engineer (Sample)',
          company_name: 'Data Systems LLC',
          location,
          Link: 'https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning%20Engineer',
          num_applicants: '18 applicants',
          time_posted: '1 hour ago'
        },
        {
          job_ID: 'mock3',
          job_title: 'Analytics Engineer (Sample)',
          company_name: 'Cloud Logistics Inc',
          location,
          Link: 'https://www.linkedin.com/jobs/search/?keywords=Analytics%20Engineer',
          num_applicants: 'Be among the first 25 applicants',
          time_posted: '2 hours ago'
        }
      ];

      const filteredMockJobs =
        applicantFilter === 'all'
          ? mockJobs
          : mockJobs.filter((job) =>
              job.num_applicants.toLowerCase().includes('be among the first 25 applicants')
            );

      setJobs(filteredMockJobs);
    } finally {
      setIsLoading(false);
    }
  }, [jobTitle, location, timeFilterMinutes, applicantFilter]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Early Applicant Job Finder — Live Demo</title>
      </Helmet>

      <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#a3a9b8] hover:text-[#eef0f5] mb-8 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
            <span>Back to projects</span>
          </Link>

          <header className="mb-8">
            <p className="font-mono text-xs text-[#7a8296] tabular-nums mb-2">
              DEMO · LINKEDIN EARLY APPLICANT QUERY ENGINE
            </p>
            <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.025em] text-[#eef0f5] mb-2">
              Early applicant job finder
            </h1>
            <p className="text-[#a3a9b8] text-base">
              Query newly posted LinkedIn roles by recency window and applicant threshold.
            </p>
          </header>

          <div className="bg-[#11141c]/75 backdrop-blur-xl border border-white/[0.10] rounded-[14px] p-6 mb-8 space-y-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="job-title"
                  className="block text-xs font-mono text-[#a3a9b8] mb-2"
                >
                  ROLE TITLE
                </label>
                <input
                  id="job-title"
                  type="text"
                  list="job-titles"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Data Scientist"
                  className="w-full h-10 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-white/[0.24] rounded-[8px] px-3.5 text-sm text-[#eef0f5] placeholder-[#7a8296] outline-none transition-colors duration-150"
                />
                <datalist id="job-titles">
                  {jobTitleOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs font-mono text-[#a3a9b8] mb-2"
                >
                  LOCATION
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Chicago"
                  className="w-full h-10 bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] focus:border-white/[0.24] rounded-[8px] px-3.5 text-sm text-[#eef0f5] placeholder-[#7a8296] outline-none transition-colors duration-150"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#a3a9b8]">RECENCY WINDOW</span>
                <span className="text-[#eef0f5] tabular-nums">
                  {formatMinutes(timeFilterMinutes)}
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="10080"
                step="60"
                value={timeFilterMinutes}
                onChange={(e) => setTimeFilterMinutes(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-[#1a1e28] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#a3a9b8]">
                APPLICANT THRESHOLD
              </label>
              <div className="flex flex-wrap gap-2">
                {applicantFilterOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setApplicantFilter(opt)}
                    className={`h-9 px-3.5 text-xs font-mono rounded-[8px] border transition-colors duration-150 ${
                      applicantFilter === opt
                        ? 'bg-[#eef0f5] text-[#0b0d14] border-transparent font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                        : 'bg-[#1a1e28]/70 backdrop-blur-md text-[#a3a9b8] hover:text-[#eef0f5] border-white/[0.10]'
                    }`}
                  >
                    {opt === 'all' ? 'All postings' : 'First 25 applicants'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.10]">
              <p className="text-xs text-[#7a8296]">
                For scheduled daily SMTP alerts, contact{' '}
                <a
                  href="mailto:sanju.k3r@gmail.com"
                  className="text-[#eef0f5] hover:underline"
                >
                  sanju.k3r@gmail.com
                </a>
              </p>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full sm:w-auto h-10 px-5 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] hover:bg-white disabled:opacity-50 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] inline-flex items-center justify-center gap-2 transition-colors duration-150"
              >
                <Search className="w-4 h-4 text-[#0b0d14]" strokeWidth={1.5} />
                <span>{isLoading ? 'Querying...' : 'Run search'}</span>
              </button>
            </div>
          </div>

          <main className="space-y-4">
            {error && (
              <div className="text-xs font-mono text-[#a3a9b8] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] p-4 rounded-[10px]">
                {error}
              </div>
            )}
            {message && (
              <div className="text-xs font-mono text-[#a3a9b8] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] p-4 rounded-[10px]">
                {message}
              </div>
            )}

            {!isLoading && jobs.length > 0 && (
              <div className="space-y-3">
                {jobs.map((job, index) => (
                  <JobCard key={job.job_ID || index} job={job} />
                ))}
              </div>
            )}

            {!isLoading && jobs.length === 0 && !message && !error && (
              <div className="text-center text-sm text-[#7a8296] p-10 border border-white/[0.10] bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                {hasSearched
                  ? 'No jobs matched your criteria. Try widening the recency window.'
                  : 'Configure parameters above and run search to inspect postings.'}
              </div>
            )}
          </main>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default LinkedinnApp;
