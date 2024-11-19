import React, { useEffect, useState } from 'react';

interface ScoreAnimationsProps {
  score: number;
}

const ScoreAnimations: React.FC<ScoreAnimationsProps> = ({ score }) => {
  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  useEffect(() => {
    if (score >= 90) {
      // Create fireworks for excellent scores
      const fireworks = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        style: {
          '--x': `${Math.random() * 100}vw`,
          '--initialY': '100vh',
          '--finalY': `${20 + Math.random() * 60}vh`,
          '--size': `${0.5 + Math.random() * 2}vmin`,
          left: '0',
          top: '0',
          background: `hsl(${Math.random() * 360}, 100%, 50%)`,
        } as React.CSSProperties,
      }));
      setParticles(fireworks);
    } else if (score >= 80) {
      // Create confetti for good scores
      const confetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        style: {
          '--x': `${-50 + Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          top: '-20px',
          width: '10px',
          height: '10px',
          background: `hsl(${Math.random() * 360}, 100%, 50%)`,
          borderRadius: Math.random() > 0.5 ? '50%' : '0',
          transform: `rotate(${Math.random() * 360}deg)`,
        } as React.CSSProperties,
      }));
      setParticles(confetti);
    }
  }, [score]);

  if (score < 80) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={particle.style}
          className={score >= 90 ? 'firework' : 'confetti'}
        />
      ))}
    </div>
  );
};

export default ScoreAnimations;