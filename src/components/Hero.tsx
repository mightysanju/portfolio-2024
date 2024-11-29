import React from 'react';
import { Brain, Code2, Database, Cloud, Globe, Cpu, Download, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialScroll from './TestimonialScroll';

const SkillBubble = ({ Icon, delay, position }: { Icon: any, delay: number, position: string }) => (
  <div
    className={`absolute ${position} w-12 h-12 rounded-full bg-gray-800/40 backdrop-blur-sm
      border border-gray-700/50 flex items-center justify-center animate-float`}
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon className="w-6 h-6 text-purple-400" />
  </div>
);

const Hero = () => {
  const skillBubbles = [
    { Icon: Brain, position: '-right-20 top-0', delay: 0 },
    { Icon: Code2, position: '-right-32 top-1/4', delay: 1 },
    { Icon: Database, position: '-right-20 top-2/4', delay: 2 },
    { Icon: Cloud, position: '-right-32 top-3/4', delay: 3 },
    { Icon: Globe, position: '-left-32 top-1/4', delay: 1.5 },
    { Icon: Cpu, position: '-left-20 top-3/4', delay: 2.5 },
  ];

  const handleDownload = () => {
    const resumeUrl = 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:49be09f1-3984-4ed6-b488-ed3fdf5a4647';
    window.open(resumeUrl, '_blank');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-3xl animate-nebula">
          <div className="absolute inset-0" aria-hidden="true">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                }}
              >
                <div className="w-full h-full rounded-full bg-white/20 blur-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div className="w-full md:w-1/2 text-left space-y-6">
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                I'm Sanju
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text
                animate-gradient-x">
                Data Scientist & ML Engineer
              </h2>
              
              <p className="text-xl text-gray-300 max-w-xl mb-8
                hover:text-gray-100 transition-colors duration-300">
                Transforming complex data into actionable insights through innovative machine learning solutions
                and advanced analytics.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleDownload}
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white/90
                    transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none
                    overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20
                    hover:bg-white/20 hover:border-white/30 hover:text-white"
                >
                  <span className="relative flex items-center space-x-2">
                    <Download className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                    <span>Download Resume</span>
                  </span>
                  <div className="absolute inset-0 flex justify-center overflow-hidden rounded-2xl pointer-events-none">
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </button>

                <Link
                  to="/about"
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white/90
                    transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none
                    overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md 
                    border border-white/20 hover:border-white/30 hover:text-white"
                >
                  <span className="relative flex items-center space-x-2">
                    <User className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    <span>About Me</span>
                  </span>
                  <div className="absolute inset-0 flex justify-center overflow-hidden rounded-2xl pointer-events-none">
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-64 h-64">
              <div className="w-64 h-64 relative z-10 rounded-[6rem] overflow-hidden border-4 border-white/5 shadow-2xl
                animate-pulse-subtle hover:scale-105 transition-transform duration-300
                bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md" />
                <img
                  src="/favicon.png"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-[5.8rem] relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <TestimonialScroll />
      </div>
    </div>
  );
};

export default Hero;