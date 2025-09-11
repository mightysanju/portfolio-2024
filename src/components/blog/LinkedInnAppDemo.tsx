import React, { useState, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, Tag, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const LinkedinnApp = () => {
    // Helper function to format minutes into a readable string
    const formatMinutes = (minutes) => {
        if (minutes < 60) return `${minutes} minutes`;
        const hours = minutes / 60;
        if (hours < 24) return `${hours} hour(s)`;
        const days = Math.round(minutes / 1440);
        if (days < 7) return `Past ${days} day(s)`;
        if (days < 14) return `Past week`;
        if (days < 30) return `Past 2 weeks`;
        return `Past month`;
    };

    // --- Sub-components ---

    const LinearLoader = () => (
        <div className="w-full my-8 px-4">
            <div className="relative h-1.5 w-full bg-gray-700 overflow-hidden rounded-full">
                <div className="absolute h-1.5 w-1/2 bg-blue-500 animate-linear-loader rounded-full"></div>
            </div>
        </div>
    );


    const JobCard = ({ job }) => {
        const isEarlyApplicant = job.num_applicants?.toLowerCase().includes('be among the first 25 applicants');

        const applicantBadgeClasses = isEarlyApplicant
            ? 'bg-green-900/50 text-green-300 border border-green-700'
            : 'bg-blue-900/50 text-blue-300 border border-blue-700';

        const handleApplyClick = () => {
            window.open(job.Link, '_blank', 'noopener,noreferrer');
        };

        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-5 group transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-800/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{job.job_title}</h3>
                        <p className="text-gray-400">{job.company_name}</p>
                        <p className="text-gray-400 text-sm mt-1">{job.location}</p>
                         <p className="text-gray-500 text-xs mt-1">{job.time_posted}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-stretch gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleApplyClick}
                            className="text-center text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className={`text-sm inline-block px-3 py-1 rounded-full font-medium ${applicantBadgeClasses}`}>
                        {job.num_applicants}
                    </p>
                </div>
            </div>
        );
    };

    // --- Main App State and Logic ---

    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('Chicago');
    const [timeFilterMinutes, setTimeFilterMinutes] = useState(120); // Start at 2 hours
    const [applicantFilter, setApplicantFilter] = useState('all');
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const jobTitleOptions = ["Java", "Data Analyst", "Data Scientist", "Network Engineer", "Data Engineer"];
    const applicantFilterOptions = ["all", "Be among the first 25 applicants"];

    const handleSearch = useCallback(async () => {
        if (!jobTitle.trim() || !location.trim()) {
            setError("Job Title and Location are required.");
            return;
        }

        setIsLoading(true);
        setJobs([]);
        setError(null);
        setMessage('');
        setHasSearched(true);

        const controller = new AbortController();
        // Set timeout to 5 minutes
        const timeoutId = setTimeout(() => controller.abort(), 300000); 

        const API_BASE_URL = "https://linked-early-apply-966926647025.us-central1.run.app/search";

        const params = new URLSearchParams({
            job_title: jobTitle,
            location: location,
            time_filter_minutes: timeFilterMinutes,
            applicant_filter_text: applicantFilter
        });

        const queryString = params.toString().replace(/\+/g, '%20');
        const targetUrl = `${API_BASE_URL}?${queryString}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

        try {
            const response = await fetch(proxyUrl, {
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                // Throw an error to be caught by the catch block, which triggers the fallback
                throw new Error(`The job server is not responding (status: ${response.status}).`);
            }

            const responseText = await response.text();

            if (!responseText) {
                throw new Error("The proxy service returned an empty response from the job server.");
            }

            const data = JSON.parse(responseText);
            if (data.error) throw new Error(data.error);
            if (data.message) {
                setMessage(data.message);
                setJobs([]);
            } else {
                setJobs(data);
                 if (data.length === 0) {
                    setMessage("No jobs found matching your criteria.");
                }
            }
        } catch (err) {
            clearTimeout(timeoutId);
            
            // Gracefully handle different types of errors.
            if (err.name === 'AbortError') {
                console.log("API request timed out as expected. Falling back to mock data.");
                setError("The live job service took too long to respond (more than 5 minutes). Showing sample results instead.");
            } else if (err.message && err.message.includes('504')) {
                console.error("API Fetch Error (Gateway Timeout):", err);
                setError("The job server timed out (Gateway Timeout). This is a server-side issue. Showing sample results instead.");
            }
            else {
                console.error("API Fetch Error:", err);
                setError("The live job service is unavailable. Showing sample results instead.");
            }
            
            // --- MOCK DATA FALLBACK ON API FAILURE ---
            const mockJobs = [
                { job_ID: 'mock1', job_title: `Frontend Developer (Sample)`, company_name: 'Creative Solutions Inc.', location: location, Link: 'https://www.linkedin.com/jobs/search/?keywords=Frontend%20Developer', num_applicants: 'Be among the first 25 applicants', time_posted: '1 day ago' },
                { job_ID: 'mock2', job_title: `Backend Engineer (Sample)`, company_name: 'Data Systems LLC', location: location, Link: 'https://www.linkedin.com/jobs/search/?keywords=Backend%20Engineer', num_applicants: '52 applicants', time_posted: '4 hours ago' },
                { job_ID: 'mock3', job_title: `Full Stack Engineer (Sample)`, company_name: 'Innovate Tech', location: location, Link: 'https://www.linkedin.com/jobs/search/?keywords=Full%20Stack%20Engineer', num_applicants: '12 applicants', time_posted: '2 days ago' }
            ];
            
            const filteredMockJobs = applicantFilter === 'all'
                ? mockJobs
                : mockJobs.filter(job => job.num_applicants.toLowerCase().includes('be among the first 25 applicants'));

            setJobs(filteredMockJobs);

        } finally {
            setIsLoading(false);
        }
    }, [jobTitle, location, timeFilterMinutes, applicantFilter]);

    const handleSliderChange = (e) => {
        setTimeFilterMinutes(parseInt(e.target.value, 10));
    };

    const currentTimeLabel = formatMinutes(timeFilterMinutes);

    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Be An Early Applicant Job Finder</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
                <style>{`
                  body { 
                      font-family: 'Inter', sans-serif; 
                      background-color: #030712; 
                  }
                  .animate-fade-in {
                      animation: fadeIn 0.3s ease-out forwards;
                  }
                  @keyframes fadeIn {
                      from { opacity: 0; transform: scale(0.95); }
                      to { opacity: 1; transform: scale(1); }
                  }
                  @keyframes linear-loader {
                    0% { left: -50%; }
                    100% { left: 100%; }
                  }
                  .animate-linear-loader {
                      animation: linear-loader 1.5s linear infinite;
                  }
                `}</style>
            </Helmet>
            <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            
                <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group" >
                    <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                    </Link>
                    <header className="text-center mb-8">
                    
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                            Be An Early Applicant
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Find jobs and apply early on <b>Linked Inn</b> to get noticed.
                        </p>
                    </header>

                    <div className="text-center text-xs text-gray-500 mb-4 p-2 bg-gray-800/50 rounded-lg">
                        This app was created by SANJU and if you want to schedule everyday email notification reach out to me <a href="mailto:sanju.k3r@gmail.com" className="text-blue-400 hover:underline">sanju.k3r@gmail.com</a>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 shadow-2xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="job-title" className="block text-sm font-medium mb-2 text-gray-300">Job Title</label>
                                <input
                                    id="job-title" type="text" list="job-titles" value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Data Scientist"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                                <datalist id="job-titles">
                                    {jobTitleOptions.map(opt => <option key={opt} value={opt} />)}
                                </datalist>
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium mb-2 text-gray-300">Location</label>
                                <input
                                    id="location" type="text" value={location}
                                    onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Chicago"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                                Posted Within: <span className="font-bold text-blue-400">{currentTimeLabel}</span>
                            </label>
                            <input
                                type="range"
                                min="120"
                                max="10080"
                                step="60"
                                value={timeFilterMinutes}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">Applicant Count</label>
                            <div className="flex flex-wrap gap-3">
                                {applicantFilterOptions.map(opt => (
                                    <button
                                        key={opt} onClick={() => setApplicantFilter(opt)}
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${applicantFilter === opt
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-500 -mt-2">
                            Note: Live searches can take up to 5 minutes, as the external job service can be slow to respond.
                        </p>
                        <button
                            onClick={handleSearch} disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 text-lg shadow-md hover:shadow-lg"
                        >
                            {isLoading ? 'Searching...' : 'Find Jobs'}
                        </button>
                    </div>

                    <main>
                        {isLoading && <LinearLoader />}
                        {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg mb-4">{error}</div>}
                        {message && <div className="text-center text-yellow-300 bg-yellow-900/50 p-4 rounded-lg mb-4">{message}</div>}

                        {!isLoading && jobs.length > 0 && (
                            <div className="space-y-4">
                                {jobs.map((job, index) => (
                                    <JobCard key={job.job_ID || index} job={job} />
                                ))}
                            </div>
                        )}

                        {!isLoading && jobs.length === 0 && !message && !error && (
                            <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-700 rounded-lg">
                                {hasSearched ? (
                                    <p>No jobs found matching your criteria. Try expanding your search.</p>
                                ) : (
                                    <p>Your job search results will appear here.</p>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </HelmetProvider>
    );
};

export default LinkedinnApp;

