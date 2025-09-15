import React, { useEffect, useRef, useState } from 'react';
import BlogLayout from './BlogLayout';
import Stakeholder from './stakeholder';
import { Helmet, HelmetProvider } from 'react-helmet-async';

/**
 * PayPalButton
 * - containerId: unique DOM id where the button will be rendered
 * - planId: PayPal subscription plan id
 * - clientId: PayPal client id (if you prefer to swap)
 *
 * Notes:
 * - SDK is appended once. If it's already present, we render immediately.
 * - protect against SSR by checking `typeof window !== 'undefined' && document`.
 */
const PayPalButton = ({ containerId = 'paypal-button-container', planId = 'P-5C171323XC216760BNDDXMIY', clientId }) => {
  const sdkUrl = clientId
    ? `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`
    : `https://www.paypal.com/sdk/js?client-id=AaTJvFXMHqSxzTnmhoH-PMiem_RRZyCdF_0fMbdQkyAGAkLB2rgZVQODfHlDGO1T0UOOrbRZwlcUQLHS&vault=true&intent=subscription`;

  useEffect(() => {
    if (typeof window === 'undefined' || !document) return;

    let mounted = true;

    const renderButton = () => {
      if (!mounted) return;
      if (!window.paypal) return;
      try {
        window.paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'black',
            layout: 'horizontal',
            label: 'subscribe',
          },
          createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
          onApprove: (data) => {
            // handle success - you can replace alert with a nicer UI flow
            alert(`Subscription approved: ${data.subscriptionID}`);
          },
          onError: (err) => {
            // optional: surface errors for debugging
            // eslint-disable-next-line no-console
            console.error('PayPal Buttons error:', err);
          },
        }).render(`#${containerId}`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to render PayPal Buttons', e);
      }
    };

    // If SDK already loaded, render immediately.
    if (window.paypal) {
      renderButton();
      return () => {
        mounted = false;
      };
    }

    // Otherwise, add script and wait for load
    const scriptId = 'paypal-sdk-js';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = sdkUrl;
      script.async = true;
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.onload = () => {
        renderButton();
      };
      script.onerror = (e) => {
        // eslint-disable-next-line no-console
        console.error('PayPal SDK failed to load', e);
      };
      document.body.appendChild(script);
    } else {
      // If script exists but paypal object not yet there, attach onload if possible
      if (window.paypal) renderButton();
      else {
        script.addEventListener('load', renderButton);
      }
    }

    return () => {
      mounted = false;
      if (script) script.removeEventListener && script.removeEventListener('load', renderButton);
    };
  }, [containerId, planId, sdkUrl]);

  // container div is rendered by this React component; PayPal will mount into it
  return <div id={containerId} />;
};

// ------------------------
// Chart utilities + AnimatedLineChart
// ------------------------
function pointsToPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const crToBezier = (p0, p1, p2, p3) => {
    const bp1x = p1.x + (p2.x - p0.x) / 6;
    const bp1y = p1.y + (p2.y - p0.y) / 6;
    const bp2x = p2.x - (p3.x - p1.x) / 6;
    const bp2y = p2.y - (p3.y - p1.y) / 6;
    return `C ${bp1x} ${bp1y}, ${bp2x} ${bp2y}, ${p2.x} ${p2.y}`;
  };

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : points[points.length - 1];
    d += ' ' + crToBezier(p0, p1, p2, p3);
  }
  return d;
}

const AnimatedLineChart = ({ width = 800, height = 280, beforeData = [], afterData = [] }) => {
  const padding = 24;
  const beforePathRef = useRef(null);
  const afterPathRef = useRef(null);

  const allValues = [...beforeData, ...afterData];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  const makePoints = (data) => {
    if (!data || data.length === 0) return [];
    const step = (width - padding * 2) / (data.length - 1 || 1);
    return data.map((v, i) => {
      const x = padding + i * step;
      const y = padding + ((maxVal - v) / (maxVal - minVal || 1)) * (height - padding * 2);
      return { x, y };
    });
  };

  const beforePoints = makePoints(beforeData);
  const afterPoints = makePoints(afterData);
  const beforePath = pointsToPath(beforePoints);
  const afterPath = pointsToPath(afterPoints);

  useEffect(() => {
    const bPath = beforePathRef.current;
    const aPath = afterPathRef.current;
    if (!bPath || !aPath) return;

    const animate = (path, delay = 0, duration = 1400) => {
      const length = path.getTotalLength();
      path.style.transition = 'none';
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      // force layout
      // eslint-disable-next-line no-unused-expressions
      path.getBoundingClientRect();
      path.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
      setTimeout(() => {
        path.style.strokeDashoffset = '0';
      }, delay);
    };

    animate(bPath, 200, 1200);
    animate(aPath, 900, 1200);
  }, [beforePath, afterPath]);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-gray-900 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="gradBefore" x1="0" x2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="gradAfter" x1="0" x2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#374151" strokeWidth="1" />

        {/* before path */}
        <path ref={beforePathRef} d={beforePath} fill="none" stroke="url(#gradBefore)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#softGlow)', mixBlendMode: 'screen' }} />

        {/* after path */}
        <path ref={afterPathRef} d={afterPath} fill="none" stroke="url(#gradAfter)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#softGlow)', mixBlendMode: 'screen' }} />

        {/* markers */}
        {afterPoints.map((p, idx) => (
          <circle key={`a-${idx}`} cx={p.x} cy={p.y} r={3.2} fill="#10b981" opacity={0.9} />
        ))}
        {beforePoints.map((p, idx) => (
          <circle key={`b-${idx}`} cx={p.x} cy={p.y} r={2.6} fill="#3b82f6" opacity={0.9} />
        ))}
      </svg>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(90deg,#60a5fa,#3b82f6)' }} />
            <span>Before subscription</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(90deg,#34d399,#10b981)' }} />
            <span>After subscription</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">Data: hypothetical performance (shortlisting %) — animated draw</div>
      </div>
    </div>
  );
};

// ------------------------
// Main Component
// ------------------------
const Linkedinn = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);

  // sample data
  const beforeData = [6, 8, 7, 9, 8, 10, 9, 11];
  const afterData = [6, 10, 12, 18, 24, 30, 36, 42];

  // lazy video play
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined' || !videoRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVideoVisible(true);
        });
      },
      { threshold: 0.45 }
    );
    io.observe(videoRef.current);
    return () => io.disconnect();
  }, [videoRef]);

  // YOUR YOUTUBE ID
  const youtubeId = 'dQw4w9WgXcQ'; // replace as needed
  const ytSrc = videoVisible ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&playsinline=1&enablejsapi=1` : undefined;

  // three unique PayPal container ids
  const topPaypalId = 'paypal-top';
  const videoPaypalId = 'paypal-video';
  const bottomPaypalId = 'paypal-bottom';
  // optional: pass clientId if you want to override the built-in one
  const paypalClientId = undefined;

  return (
    <HelmetProvider>
      <Helmet>
        <title>LinkedIn Early Applicant Automation: Gain a Competitive Edge in Your Job Search</title>
        <meta name="description" content="Discover the LinkedIn Early Applicant Automation tool, a Python script that automates job searching, provides instant notifications, and helps you be one of the first to apply." />
        <meta name="keywords" content="LinkedIn automation, job search, Python script, web scraping, early applicant, Selenium, job notifications" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5301414262654683" crossOrigin="anonymous" />
      </Helmet>

      <BlogLayout title="LinkedIn Early Applicant Automation Tool" date="August 31, 2025" readTime="6 min read" tags={['Automation', 'Web Scraping', 'Python', 'Job Search']} image="https://i.imgur.com/hNa0ROb.jpeg" demoLink="/blog/LinkedInnAppDemo" githubLink="https://github.com/mightysanju/Linked-Inn-Be-an-Early-Applicant.git">
        {/* TOP: PayPal button (beside other buttons - you can wrap with container to align with other buttons in your layout) */}
        <div className="flex items-center gap-4 mb-6">
          {/* Add other existing buttons here if you want them beside */}
          <div>
            <h4 className="text-sm text-gray-300 mb-2">Support this project</h4>
            <PayPalButton containerId={topPaypalId} planId="P-5C171323XC216760BNDDXMIY" clientId={paypalClientId} />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Introduction</h2>
        <p className="text-gray-300 mb-6">
          In today's competitive job market, being one of the first to apply for a new role can significantly increase your chances of getting noticed. The "early applicant" advantage is a well-known strategy for success. To address this, I developed the LinkedIn Early Applicant Automation tool, a Python-based script designed to automate the process of finding new job listings and provide immediate notifications, ensuring users can act on opportunities the moment they arise.
        </p>

        {/* Chart */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Shortlisting Performance — Before vs After</h3>
          <AnimatedLineChart beforeData={beforeData} afterData={afterData} />
        </div>

        <h2 className="text-2xl font-semibold text-gray-200 mb-4">The Problem Statement</h2>
        <p className="text-gray-300 mb-6">
          Before this tool, the process of finding new job listings was manual and highly repetitive. Job seekers would have to spend hours each day refreshing LinkedIn, re-running the same searches, and sifting through results to find new postings...
        </p>

        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Solution: The Automation Tool</h2>
        <p className="text-gray-300 mb-6">The LinkedIn Early Applicant Automation is a Python script that leverages web scraping to monitor job listings based on user-defined criteria...</p>

        {/* Demo video + PayPal near video */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Demo Video</h3>
          <div ref={videoRef} className="w-full aspect-video rounded-lg overflow-hidden border border-gray-700 mb-4">
            {ytSrc ? (
              <iframe title="LinkedInn Demo" src={ytSrc} frameBorder="0" allow="autoplay; encrypted-media; fullscreen" allowFullScreen style={{ width: '100%', height: '100%' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">Scroll to load demo video</div>
            )}
          </div>

          <div>
            <h4 className="text-sm text-gray-300 mb-2">Subscribe for premium features</h4>
            <PayPalButton containerId={videoPaypalId} planId="P-5C171323XC216760BNDDXMIY" clientId={paypalClientId} />
          </div>
        </div>

        {/* ... rest of your content ... */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Impact and Results</h3>
          <p className="text-gray-300 mb-6">The successful deployment of this tool has yielded significant benefits:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><b>Drastically Increased Application Speed:</b> Enables users to consistently be within the first wave of applicants, often within an hour of a job being posted.</li>
            <li><b>Significant Time Savings:</b> Eliminates the need for hours of manual, repetitive searching, allowing the user to focus on tailoring applications and preparing for interviews.</li>
            <li><b>Never Miss an Opportunity:</b> The automated and constant monitoring ensures that no relevant job posting goes unnoticed.</li>
            <li><b>Enhanced Competitive Edge:</b> By applying early, users increase the probability of their application being reviewed by recruiters.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Conclusion</h2>
        <p className="text-gray-300 mb-6">The LinkedIn Early Applicant Automation is a powerful tool that transforms a passive job search into a proactive, automated hunt for opportunities. By leveraging modern Python libraries for web scraping and task scheduling, this script provides a significant advantage in a crowded job market.</p>

        {/* BOTTOM PayPal */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h4 className="text-sm text-gray-300 mb-2">Support / Subscribe</h4>
          <PayPalButton containerId={bottomPaypalId} planId="P-5C171323XC216760BNDDXMIY" clientId={paypalClientId} />
        </div>
      </BlogLayout>
    </HelmetProvider>
  );
};

export default Linkedinn;