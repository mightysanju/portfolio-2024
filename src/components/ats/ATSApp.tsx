import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateATSScore } from './atsScoring';

interface ScoringResult {
  score: number;
  suggestions: string[];
  matched: string[];
  missing: string[];
  componentScores: {
    keywords: number;
    skills: number;
    experience: number;
    education: number;
    achievements: number;
    formatting: number;
    softSkills: number;
  };
}

const ATSApp: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === 'application/pdf' ||
        droppedFile.type === 'application/msword' ||
        droppedFile.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        droppedFile.type === 'text/plain')
    ) {
      setFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = async () => {
    if (!file || !jobDescription) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const fileText = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.readAsText(file);
      });

      const computed = calculateATSScore(fileText, jobDescription);
      setResult(computed);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 85) return 'text-[#4cc38a]';
    if (score >= 70) return 'text-[#eef0f5]';
    return 'text-[#a3a9b8]';
  };

  const renderScoreBreakdown = () => {
    if (!result) return null;

    const categories = [
      { id: 'MET-01', name: 'Keywords', score: result.componentScores.keywords },
      { id: 'MET-02', name: 'Skills', score: result.componentScores.skills },
      { id: 'MET-03', name: 'Experience', score: result.componentScores.experience },
      { id: 'MET-04', name: 'Education', score: result.componentScores.education },
      { id: 'MET-05', name: 'Achievements', score: result.componentScores.achievements },
      { id: 'MET-06', name: 'Formatting', score: result.componentScores.formatting },
      { id: 'MET-07', name: 'Soft skills', score: result.componentScores.softSkills },
    ];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {categories.map((category) => {
          const pct = Math.round(category.score * 10);
          return (
            <div
              key={category.id}
              className="bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-[8px] p-3.5"
            >
              <div className="font-mono tabular-nums text-[11px] text-[#7a8296] mb-1">
                {category.id}
              </div>
              <div className="text-xs text-[#a3a9b8] mb-1">{category.name}</div>
              <div
                className={`font-mono tabular-nums text-lg font-medium ${getScoreTextColor(
                  pct
                )}`}
              >
                {pct}%
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md hover:bg-[#222734]/80 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs font-medium text-[#eef0f5] transition-colors duration-150 mb-8"
        >
          <ArrowLeft className="w-4 h-4 text-[#7a8296]" strokeWidth={1.5} />
          <span>Back to portfolio</span>
        </Link>

        <div className="mb-10">
          <p className="font-mono text-xs text-[#7a8296] mb-2">
            SYS-03 / INTERACTIVE ANALYZER
          </p>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#eef0f5] mb-2">
            ATS compatibility analyzer
          </h1>
          <p className="text-sm sm:text-base text-[#a3a9b8] max-w-2xl">
            Evaluate resume keyword alignment, structural parsing, and role compatibility against a target job description.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-6 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#a3a9b8]">
                  1. Resume document
                </span>
                <span className="font-mono text-xs text-[#7a8296]">
                  PDF / DOC / DOCX / TXT
                </span>
              </div>

              <div
                className={`border border-dashed rounded-[10px] p-8 text-center cursor-pointer transition-colors duration-150 ${
                  isDragging
                    ? 'border-[#eef0f5] bg-[#1a1e28]/70'
                    : 'border-white/[0.14] hover:border-white/[0.28] bg-[#0b0d14]/70'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <div className="flex flex-col items-center space-y-3">
                  {file ? (
                    <>
                      <FileText
                        className="w-8 h-8 text-[#4cc38a]"
                        strokeWidth={1.5}
                      />
                      <p className="text-sm font-medium text-[#eef0f5]">
                        {file.name}
                      </p>
                      <p className="font-mono tabular-nums text-xs text-[#7a8296]">
                        {(file.size / 1024).toFixed(1)} KB · Click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload
                        className="w-8 h-8 text-[#7a8296]"
                        strokeWidth={1.5}
                      />
                      <p className="text-sm text-[#eef0f5]">
                        Drop resume file here or click to browse
                      </p>
                      <p className="text-xs text-[#7a8296]">
                        Processed locally in your browser
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.10] flex items-center justify-between text-xs text-[#7a8296]">
              <span>Status</span>
              <span className="font-mono">
                {file ? 'DOCUMENT_LOADED' : 'AWAITING_INPUT'}
              </span>
            </div>
          </div>

          <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-6 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="job-desc-input"
                  className="text-xs font-medium text-[#a3a9b8]"
                >
                  2. Target job description
                </label>
                <span className="font-mono tabular-nums text-xs text-[#7a8296]">
                  {jobDescription.trim()
                    ? `${jobDescription.trim().split(/\s+/).length} words`
                    : '0 words'}
                </span>
              </div>
              <textarea
                id="job-desc-input"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full h-44 p-3.5 rounded-[8px] bg-[#1a1e28]/70 backdrop-blur-md border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-sm text-[#eef0f5] placeholder-[#7a8296] focus:outline-none focus:border-white/[0.24] resize-none transition-colors duration-150"
              />
            </div>

            <button
              onClick={analyzeResume}
              disabled={!file || !jobDescription || isAnalyzing}
              className="w-full h-10 px-5 rounded-[8px] bg-[#eef0f5] text-[#0b0d14] text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 transition-colors duration-150"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
              <span>{isAnalyzing ? 'Evaluating...' : 'Run ATS evaluation'}</span>
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-6 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.10]">
                <div>
                  <span className="font-mono text-xs text-[#7a8296] block mb-1">
                    EVALUATION SUMMARY
                  </span>
                  <h2 className="text-lg font-medium text-[#eef0f5]">
                    Overall ATS compatibility score
                  </h2>
                </div>
                <div
                  className={`font-mono tabular-nums text-3xl font-medium ${getScoreTextColor(
                    result.score
                  )}`}
                >
                  {result.score}%
                </div>
              </div>

              {renderScoreBreakdown()}

              <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/[0.10]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2
                      className="w-4 h-4 text-[#4cc38a]"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-sm font-medium text-[#eef0f5]">
                      Matched keywords ({result.matched.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.length > 0 ? (
                      result.matched.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 rounded-[6px] bg-[#1a1e28]/70 backdrop-blur-md text-[#eef0f5] border border-white/[0.10] text-xs font-mono"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#7a8296]">
                        No direct keyword matches detected.
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle
                      className="w-4 h-4 text-[#7a8296]"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-sm font-medium text-[#eef0f5]">
                      Missing keywords ({result.missing.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.length > 0 ? (
                      result.missing.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 rounded-[6px] bg-[#0b0d14]/70 text-[#a3a9b8] border border-white/[0.10] text-xs font-mono"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#7a8296]">
                        All target keywords present.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#11141c]/75 backdrop-blur-xl rounded-[14px] p-6 border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <h2 className="text-base font-medium text-[#eef0f5] mb-4">
                Recommended adjustments
              </h2>
              <ul className="space-y-2.5">
                {result.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-[#a3a9b8]"
                  >
                    <span className="font-mono tabular-nums text-xs text-[#7a8296] mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSApp;
