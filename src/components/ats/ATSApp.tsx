import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateATSScore } from './atsScoring';
import ScoreAnimations from './ScoreAnimations';

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

const ATSApp = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getThemeGradient = (score: number) => {
    if (score >= 95) return 'from-emerald-900 via-green-800 to-emerald-900';
    if (score >= 85) return 'from-yellow-900 via-amber-800 to-yellow-900';
    if (score >= 75) return 'from-blue-900 via-indigo-800 to-blue-900';
    return 'from-gray-900 via-gray-800 to-gray-900';
  };

  const getNebulaColor = (score: number) => {
    if (score >= 95) return 'rgba(16, 185, 129, 0.15)'; // Emerald
    if (score >= 85) return 'rgba(245, 158, 11, 0.15)'; // Amber
    if (score >= 75) return 'rgba(59, 130, 246, 0.15)'; // Blue
    return 'rgba(75, 85, 99, 0.15)'; // Gray
  };

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
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/msword' || droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
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
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      });

      const result = calculateATSScore(fileText, jobDescription);
      setResult(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-400';
    if (score >= 85) return 'text-yellow-400';
    if (score >= 75) return 'text-blue-400';
    return 'text-red-400';
  };

  const renderScoreBreakdown = () => {
    if (!result) return null;

    const categories = [
      { name: 'Keywords', score: result.componentScores.keywords },
      { name: 'Skills', score: result.componentScores.skills },
      { name: 'Experience', score: result.componentScores.experience },
      { name: 'Education', score: result.componentScores.education },
      { name: 'Achievements', score: result.componentScores.achievements },
      { name: 'Formatting', score: result.componentScores.formatting },
      { name: 'Soft Skills', score: result.componentScores.softSkills }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {categories.map((category) => (
          <div key={category.name} className="bg-gray-700/30 rounded-lg p-4">
            <div className="text-sm text-gray-300 mb-1">{category.name}</div>
            <div className={`text-lg font-semibold ${getScoreColor(category.score * 10)}`}>
              {Math.round(category.score * 10)}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${result ? getThemeGradient(result.score) : 'from-gray-900 via-gray-800 to-gray-900'} text-white transition-colors duration-700`}>
      {result && <ScoreAnimations score={result.score} />}
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0 animate-nebula"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${result ? getNebulaColor(result.score) : 'rgba(75, 85, 99, 0.15)'}, transparent 60%)`,
              filter: 'blur(40px)',
            }}
          />
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            ATS Score Checker
          </h1>
          <p className="text-gray-300">
            Optimize your resume for Applicant Tracking Systems
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${isDragging 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-600 hover:border-purple-400 hover:bg-gray-800/50'
                } ${file ? 'bg-gray-800/50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-4">
                {file ? (
                  <>
                    <FileText className="w-12 h-12 text-purple-400" />
                    <p className="text-gray-300">{file.name}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-300">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports PDF, DOC, DOCX
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 
                text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <button
              onClick={analyzeResume}
              disabled={!file || !jobDescription || isAnalyzing}
              className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2
                ${isAnalyzing || !file || !jobDescription
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                } transition-all duration-300`}
            >
              <Send className="w-5 h-5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}</span>
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-12 space-y-8 animate-fade-in">
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">ATS Compatibility Score</h2>
                <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}%
                </div>
              </div>
              
              {renderScoreBreakdown()}

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Matched Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matched.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Suggestions for Improvement</h2>
              <ul className="space-y-4">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-3 text-gray-300">
                    <span className="text-purple-400">•</span>
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