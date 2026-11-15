import React, { useEffect, useRef, useState } from 'react';
import BlogLayout from './BlogLayout';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface PayPalButtonProps {
  containerId?: string;
  planId?: string;
  clientId?: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  containerId = 'paypal-button-container',
  planId = 'P-5C171323XC216760BNDDXMIY',
  clientId
}) => {
  const sdkUrl = clientId
    ? `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`
    : `https://www.paypal.com/sdk/js?client-id=AaTJvFXMHqSxzTnmhoH-PMiem_RRZyCdF_0fMbdQkyAGAkLB2rgZVQODfHlDGO1T0UOOrbRZwlcUQLHS&vault=true&intent=subscription`;

  useEffect(() => {
    if (typeof window === 'undefined' || !document) return;

    let mounted = true;
    const w = window as any;

    const renderButton = () => {
      if (!mounted || !w.paypal) return;
      const container = document.getElementById(containerId);
      if (!container || container.childElementCount > 0) return;
      try {
        w.paypal
          .Buttons({
            style: {
              shape: 'rect',
              color: 'black',
              layout: 'horizontal',
              label: 'subscribe'
            },
            createSubscription: (_data: any, actions: any) =>
              actions.subscription.create({ plan_id: planId }),
            onApprove: (data: any) => {
              alert(`Subscription approved: ${data.subscriptionID}`);
            },
            onError: (err: any) => {
              console.error('PayPal Buttons error:', err);
            }
          })
          .render(`#${containerId}`);
      } catch (e) {
        console.error('Failed to render PayPal Buttons', e);
      }
    };

    if (w.paypal) {
      renderButton();
      return () => {
        mounted = false;
      };
    }

    const scriptId = 'paypal-sdk-js';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = sdkUrl;
      script.async = true;
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.onload = renderButton;
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', renderButton);
    }

    return () => {
      mounted = false;
      if (script) {
        script.removeEventListener('load', renderButton);
      }
    };
  }, [containerId, planId, sdkUrl]);

  return <div id={containerId} />;
};

interface Point {
  x: number;
  y: number;
}

function pointsToPath(points: Point[]) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const crToBezier = (p0: Point, p1: Point, p2: Point, p3: Point) => {
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

const AnimatedLineChart = ({
  width = 800,
  height = 240,
  beforeData = [] as number[],
  afterData = [] as number[]
}) => {
  const padding = 24;
  const allValues = [...beforeData, ...afterData];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  const makePoints = (data: number[]): Point[] => {
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

  return (
    <div className="w-full overflow-hidden rounded-[10px] bg-[#0b0d14] border border-white/[0.08] p-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(238, 240, 245, 0.08)"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="rgba(238, 240, 245, 0.08)"
          strokeWidth="1"
        />

        <path
          d={beforePath}
          fill="none"
          stroke="#7a8296"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <path
          d={afterPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {afterPoints.map((p, idx) => (
          <circle key={`a-${idx}`} cx={p.x} cy={p.y} r={3} fill="#3b82f6" />
        ))}
        {beforePoints.map((p, idx) => (
          <circle key={`b-${idx}`} cx={p.x} cy={p.y} r={2.5} fill="#7a8296" />
        ))}
      </svg>

      <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#a3a9b8]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#7a8296]" />
            <span>Manual baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#3b82f6]" />
            <span>Early applicant alert</span>
          </div>
        </div>
        <div className="text-[#7a8296] tabular-nums">SHORTLISTING RATE (%)</div>
      </div>
    </div>
  );
};

const Linkedinn: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);

  const beforeData = [6, 8, 7, 9, 8, 10, 9, 11];
  const afterData = [6, 10, 12, 18, 24, 30, 36, 42];

  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLDivElement | null>(null);

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
  }, []);

  const youtubeId = 'dQw4w9WgXcQ';
  const ytSrc = videoVisible
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&playsinline=1&enablejsapi=1`
    : undefined;

  return (
    <HelmetProvider>
      <Helmet>
        <title>LinkedIn Early Applicant Automation: Job Alert Pipeline</title>
        <meta
          name="description"
          content="A Python job monitoring and SMTP alert system that surfaces newly posted roles within minutes."
        />
      </Helmet>

      <BlogLayout
        title="LinkedIn Early Applicant Automation"
        date="August 31, 2025"
        readTime="6 min read"
        tags={['Automation', 'Web Scraping', 'Python', 'SMTP']}
        image="https://i.imgur.com/hNa0ROb.jpeg"
        demoLink="/blog/LinkedInnAppDemo"
        githubLink="https://github.com/mightysanju/Linked-Inn-Be-an-Early-Applicant.git"
      >
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h4 className="text-xs font-mono text-[#7a8296] mb-2">SUPPORT PROJECT</h4>
            <PayPalButton
              containerId="paypal-top"
              planId="P-5C171323XC216760BNDDXMIY"
            />
          </div>
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Introduction</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          Applying within the first wave of candidates materially improves recruiter review rates. I
          built the LinkedIn Early Applicant Automation pipeline in Python to poll newly published
          roles matching target filters and dispatch immediate SMTP notifications.
        </p>

        <div className="mb-6">
          <h3 className="text-base font-medium text-[#eef0f5] mb-3">
            Shortlisting rate — baseline vs. automated alerts
          </h3>
          <AnimatedLineChart beforeData={beforeData} afterData={afterData} />
        </div>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">Problem statement</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          Manually refreshing job boards across multiple titles and locations is repetitive and
          high-latency. By the time a candidate sees a role hours later, hundreds of applications
          are already queued.
        </p>

        <h2 className="text-xl font-medium text-[#eef0f5] mb-3">System overview</h2>
        <p className="text-[#a3a9b8] text-base leading-relaxed mb-6">
          The service runs scheduled queries with configurable recency windows (e.g., past 2 hours)
          and applicant-count thresholds (&quot;Be among the first 25 applicants&quot;), deduplicates
          seen job IDs, and delivers structured alerts.
        </p>

        <div className="mb-6">
          <h3 className="text-base font-medium text-[#eef0f5] mb-3">Walkthrough video</h3>
          <div
            ref={videoRef}
            className="w-full aspect-video rounded-[10px] overflow-hidden border border-white/[0.08] bg-[#0b0d14] mb-4"
          >
            {ytSrc ? (
              <iframe
                title="LinkedIn Early Applicant Demo"
                src={ytSrc}
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#7a8296]">
                Scroll to load video stream
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1a1e28] border border-white/[0.08] rounded-[10px] p-6 mb-6">
          <h3 className="text-base font-medium text-[#eef0f5] mb-3">Operational impact</h3>
          <ul className="list-disc list-inside text-[#a3a9b8] text-sm space-y-2 leading-relaxed">
            <li>
              <span className="text-[#eef0f5] font-medium">Sub-hour detection:</span> Surfaces new
              postings while applicant volume is still under 25.
            </li>
            <li>
              <span className="text-[#eef0f5] font-medium">Zero manual polling:</span> Replaces
              repetitive browser searches with scheduled background checks.
            </li>
            <li>
              <span className="text-[#eef0f5] font-medium">Targeted filtering:</span> Filters by
              role keyword, location, and exact recency in minutes.
            </li>
          </ul>
        </div>
      </BlogLayout>
    </HelmetProvider>
  );
};

export default Linkedinn;
