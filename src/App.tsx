import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
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
      
    <Helmet>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5301414262654683" crossorigin="anonymous"></script>
    </Helmet>
    
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            
            <Navbar activeSection={activeSection} onNavigate={scrollToSection} />
            
            <main className="relative">
              <section id="home" className="min-h-screen">
                <Hero />
              </section>

              <section id="skills" className="min-h-screen py-20">
                <Skills />
              </section>

              <section id="certifications" className="min-h-screen py-20">
                <Certifications />
              </section>

              <section id="projects" className="min-h-screen py-20">
                <Projects />
              </section>

              <section id="contact" className="min-h-screen py-20">
                <Contact />
              </section>
            </main>

            <Footer />
            <ChatButton />
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/blog/Networkapp" element={<Networkapp />} />
        <Route path="/blog/DDO" element={<DDO />} />
        <Route path="/blog/ats-score-checker" element={<ATSScoreChecker />} />
        <Route path="/ats" element={<ATSApp />} />
        <Route path="/blog/Linkedinn" element={<Linkedinn />} />
        <Route path="/blog/LinkedInnAppDemo" element={<LinkedinnApp />} />
      </Routes>
    </Router>
    </HelmetProvider>
  );
}

export default App;