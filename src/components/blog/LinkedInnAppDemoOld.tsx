import React, { useState, useEffect, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const LinkedinnApp = () => {
  // State management for form inputs, API data, and UI status
  const [jobTitleSelect, setJobTitleSelect] = useState('Network Engineer');
  const [jobTitleManual, setJobTitleManual] = useState('');
  const [location, setLocation] = useState('Chicago');
  const [timeSlider, setTimeSlider] = useState(24);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // To control visibility of the results section

  const resultsRef = useRef(null);
  const filterOptions = ["All", "Be among the first 25 applicants"];

  // Scroll to results when search is complete
  useEffect(() => {
    if (hasSearched && !isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading, hasSearched]);

  // Helper function to format the slider output text
  const formatHours = (hours) => {
    const h = parseInt(hours, 10);
    if (h < 24) return `Last ${h} hours`;
    const days = Math.round(h / 24);
    if (days === 1) return 'Last 24 hours';
    if (days === 7) return 'Last 1 week';
    if (days === 14) return 'Last 2 weeks';
    return `Last ${days} days`;
  };

  // Main function to handle form submission and API call
  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Reset state for a new search
    setIsLoading(true);
    setHasSearched(true);
    setJobs([]);
    setError(null);

    const jobTitle = jobTitleSelect === 'manual' ? jobTitleManual : jobTitleSelect;
    const timeInMinutes = parseInt(timeSlider, 10) * 60;
    
    try {
      const baseUrl = 'https://linked-early-apply-966926647025.us-central1.run.app/search';
      const params = new URLSearchParams({
        job_title: jobTitle,
        location: location,
        time_filter_minutes: timeInMinutes.toString(),
      });

      if (activeFilter === "Be among the first 25 applicants") {
        params.append('applicant_filter_text', '25');
      }
      
      const targetApiUrl = `${baseUrl}?${params.toString().replace(/\+/g, '%20')}`;
      const proxyUrl = 'https://corsproxy.io/?';
      const requestUrl = proxyUrl + encodeURIComponent(targetApiUrl);
      
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const fetchedJobs = Array.isArray(responseData) ? responseData : responseData.jobs || [];
      setJobs(fetchedJobs);

    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Job Search Interface</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          body {
              font-family: 'Inter', sans-serif;
              background-color: #0a0e1a;
              color: #e0e0e0;
          }
          .ai-glow {
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 5px rgba(59, 130, 246, 0.3);
          }
          input, select {
              background-color: #1e293b;
              border-color: #3b82f6;
          }
          input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none; appearance: none;
              width: 20px; height: 20px;
              background: #3b82f6; cursor: pointer;
              border-radius: 50%; margin-top: -6px;
              box-shadow: 0 0 10px #3b82f6;
          }
          input[type=range]::-moz-range-thumb {
              width: 20px; height: 20px;
              background: #3b82f6; cursor: pointer;
              border-radius: 50%; box-shadow: 0 0 10px #3b82f6;
          }
          .loader {
              width: 50px; height: 50px;
              border-radius: 50%;
              border: 5px solid rgba(59, 130, 246, 0.2);
              border-top-color: #3b82f6;
              animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .results-bubble {
              display: inline-flex; align-items: center; justify-content: center;
              width: 32px; height: 32px;
              border-radius: 50%; background-color: #3b82f6;
              color: white; font-weight: bold; font-size: 0.875rem;
              margin-left: 0.75rem; transform: scale(0);
              transition: transform 0.3s ease-out;
          }
          .results-bubble.show { transform: scale(1); }
          .filter-bubble {
              padding: 0.5rem 1rem; border-radius: 9999px;
              font-size: 0.875rem; font-weight: 500; cursor: pointer;
              transition: all 0.2s ease-in-out; border: 1px solid #3b82f6;
              background-color: transparent; color: #93c5fd;
          }
          .filter-bubble:hover { background-color: rgba(59, 130, 246, 0.2); }
          .filter-bubble.active { background-color: #3b82f6; color: white; }
        `}</style>
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Job Search</h1>
          <p className="text-gray-400 mt-3 text-lg">Find your next career opportunity.</p>
        </header>

        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-blue-500/30 ai-glow">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="jobTitleSelect" className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
              <select id="jobTitleSelect" name="jobTitleSelect" value={jobTitleSelect} onChange={(e) => setJobTitleSelect(e.target.value)} className="w-full p-3 bg-gray-900 border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-white">
                <option>Network Engineer</option>
                <option>Data Analyst</option>
                <option>Java Developer</option>
                <option>Business Analyst</option>
                <option>Data Scientist</option>
                <option value="manual">Other (Enter Manually)</option>
              </select>
              {jobTitleSelect === 'manual' && (
                <input type="text" id="jobTitleManual" name="jobTitleManual" value={jobTitleManual} onChange={(e) => setJobTitleManual(e.target.value)} className="w-full p-3 bg-gray-900 border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition mt-2 text-white" placeholder="Enter job title manually" />
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input type="text" id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 bg-gray-900 border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-white" placeholder="e.g., San Francisco" />
            </div>

            <div>
              <label htmlFor="timeSlider" className="block text-sm font-medium text-gray-300 mb-2">Job Post Freshness</label>
              <input type="range" id="timeSlider" name="timeSlider" min="2" max="336" value={timeSlider} onChange={(e) => setTimeSlider(e.target.value)} step="1" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
              <div className="text-center text-sm text-gray-400 mt-2">{formatHours(timeSlider)}</div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Applicant Filters</label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <button key={option} type="button" onClick={() => setActiveFilter(option)} className={`filter-bubble ${activeFilter === option ? 'active' : ''}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 text-center mt-4">
              <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-12 rounded-lg hover:from-blue-500 hover:to-cyan-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </form>
        </div>

        {hasSearched && (
          <div ref={resultsRef} className="max-w-6xl mx-auto mt-12">
            <div className="text-center mb-6 flex items-center justify-center">
              <h2 className="text-2xl font-bold">Search Results</h2>
              {!isLoading && <div className={`results-bubble show`}>{jobs.length}</div>}
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-16"><div className="loader"></div></div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-blue-500/30">
                {error && (
                  <div className="text-center py-12 text-red-400"><p className="text-lg">An error occurred: {error}</p></div>
                )}
                {!error && jobs.length === 0 && (
                  <div className="text-center py-12 text-gray-500"><p className="text-lg">No jobs found matching your criteria.</p></div>
                )}
                {!error && jobs.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-900/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Job Title</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Posted</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Applicants</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Link</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                        {jobs.map((job, index) => {
                           const applicantText = job.num_applicants || 'N/A';
                           const isEarly = applicantText.includes("Be among");
                           const applicantSpanClass = `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isEarly ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`;
                           return(
                            <tr key={job.Link || index} className="hover:bg-gray-700/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{job.job_title || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{job.company_name || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.time_posted || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap"><span className={applicantSpanClass}>{applicantText}</span></td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><a href={job.Link || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">View Job</a></td>
                            </tr>
                           );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default LinkedinnApp;