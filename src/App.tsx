import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Projects, { DynamicBlogPage } from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatButton from './components/ChatButton';
import About from './components/About';
import Networkapp from './components/blog/Networkapp';
import DDO from './components/blog/DDO';
import Linkedinn from './components/blog/Linkedinn';
import LinkedinnApp from './components/blog/LinkedInnAppDemo';
import ATSScoreChecker from './components/blog/ATSScoreChecker';
import ATSApp from './components/ats/ATSApp';
import AdminPanel from './components/admin/AdminPanel';
import { PortfolioProvider } from './context/PortfolioContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HelmetProvider>
      <PortfolioProvider>
        <Helmet>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5301414262654683"
            crossOrigin="anonymous"
          ></script>
        </Helmet>

        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-[#0b0d14] text-[#eef0f5]">
                  <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

                  <main className="relative">
                    <section id="home" className="min-h-screen">
                      <Hero />
                    </section>

                    <section id="skills" className="py-24 border-t border-white/[0.08]">
                      <Skills />
                    </section>

                    <section id="certifications" className="py-24 border-t border-white/[0.08]">
                      <Certifications />
                    </section>

                    <section id="projects" className="py-24 border-t border-white/[0.08]">
                      <Projects />
                    </section>

                    <section id="contact" className="py-24 border-t border-white/[0.08]">
                      <Contact />
                    </section>
                  </main>

                  <Footer />
                  <ChatButton />
                </div>
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog/Networkapp" element={<Networkapp />} />
            <Route path="/blog/DDO" element={<DDO />} />
            <Route path="/blog/ats-score-checker" element={<ATSScoreChecker />} />
            <Route path="/ats" element={<ATSApp />} />
            <Route path="/blog/Linkedinn" element={<Linkedinn />} />
            <Route path="/blog/LinkedInnAppDemo" element={<LinkedinnApp />} />
            <Route path="/blog/:slug" element={<DynamicBlogPage />} />
          </Routes>
        </Router>
      </PortfolioProvider>
    </HelmetProvider>
  );
}

export default App;
