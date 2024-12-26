import React, { useState, useEffect, useCallback } from 'react';

const MagicalNebulaCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isClicking, setIsClicking] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // Generate different types of particles
  const createParticle = useCallback((x, y, type = 'trail') => {
    const baseConfig = {
      id: Math.random(),
      x,
      y,
      life: 1,
      maxLife: 1,
    };

    switch (type) {
      case 'click':
        return {
          ...baseConfig,
          type,
          velocity: {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
          },
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          color: `hsla(${Math.random() * 60 + 200}, 80%, 60%, 0.8)`,
          life: 1,
          maxLife: 1,
          shape: Math.random() > 0.5 ? 'star' : 'circle'
        };

      case 'orbit':
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        return {
          ...baseConfig,
          type,
          angle,
          distance: Math.random() * 30 + 20,
          speed,
          size: Math.random() * 3 + 1,
          color: `hsla(${Math.random() * 60 + 200}, 80%, 60%, 0.6)`,
          life: Math.random() * 0.5 + 0.5,
          maxLife: 1
        };

      case 'sparkle':
        return {
          ...baseConfig,
          type,
          size: Math.random() * 3 + 1,
          color: `hsla(${Math.random() * 60 + 200}, 90%, 70%, 0.9)`,
          life: Math.random() * 0.3 + 0.2,
          maxLife: 0.5,
          blinkRate: Math.random() * 0.1
        };

      default: // trail
        return {
          ...baseConfig,
          type: 'trail',
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
          },
          size: Math.random() * 4 + 2,
          color: `hsla(${Math.random() * 60 + 200}, 80%, 60%, 0.6)`,
          life: Math.random() * 0.5 + 0.5,
          maxLife: 1
        };
    }
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const updateCursor = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      
      // Calculate movement speed
      const dx = newPosition.x - lastPosition.x;
      const dy = newPosition.y - lastPosition.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Add particles based on movement
      if (speed > 5) {
        const particlesToAdd = [];
        // Trail particles
        if (Math.random() < 0.3) {
          particlesToAdd.push(createParticle(e.clientX, e.clientY, 'trail'));
        }
        // Orbit particles
        if (Math.random() < 0.2) {
          particlesToAdd.push(createParticle(e.clientX, e.clientY, 'orbit'));
        }
        // Sparkle particles
        if (Math.random() < 0.1) {
          particlesToAdd.push(createParticle(e.clientX, e.clientY, 'sparkle'));
        }
        
        setParticles(prev => [...prev, ...particlesToAdd]);
      }

      setLastPosition(newPosition);

      // Check for clickable elements
      const target = e.target;
      const clickable = (
        target.onclick ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        getComputedStyle(target).cursor === 'pointer'
      );
      setIsPointer(clickable);
    };

    document.addEventListener('mousemove', updateCursor);
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.body.style.cursor = 'auto';
    };
  }, [createParticle, lastPosition]);

  // Handle click effects
  useEffect(() => {
    const handleMouseDown = (e) => {
      setIsClicking(true);
      // Create burst of particles on click
      const newParticles = Array.from({ length: 12 }, () => 
        createParticle(e.clientX, e.clientY, 'click')
      );
      setParticles(prev => [...prev, ...newParticles]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [createParticle]);

  // Animate particles
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setParticles(prevParticles => {
        return prevParticles
          .map(particle => {
            switch (particle.type) {
              case 'click':
                return {
                  ...particle,
                  x: particle.x + particle.velocity.x,
                  y: particle.y + particle.velocity.y,
                  life: particle.life - 0.02,
                  velocity: {
                    x: particle.velocity.x * 0.95,
                    y: particle.velocity.y * 0.95 + 0.1
                  },
                  rotation: particle.rotation + 5
                };

              case 'orbit':
                const newAngle = particle.angle + particle.speed / 30;
                return {
                  ...particle,
                  x: position.x + Math.cos(newAngle) * particle.distance,
                  y: position.y + Math.sin(newAngle) * particle.distance,
                  angle: newAngle,
                  life: particle.life - 0.01
                };

              case 'sparkle':
                return {
                  ...particle,
                  life: particle.life - 0.02,
                  opacity: Math.sin(Date.now() * particle.blinkRate)
                };

              default: // trail
                return {
                  ...particle,
                  x: particle.x + particle.velocity.x,
                  y: particle.y + particle.velocity.y,
                  life: particle.life - 0.02,
                  velocity: {
                    x: particle.velocity.x * 0.95,
                    y: particle.velocity.y * 0.95
                  }
                };
            }
          })
          .filter(particle => particle.life > 0);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [position]);

  const renderParticle = (particle) => {
    const baseStyle = {
      position: 'fixed',
      left: particle.x - particle.size / 2,
      top: particle.y - particle.size / 2,
      width: particle.size,
      height: particle.size,
      pointerEvents: 'none',
    };

    if (particle.type === 'click' && particle.shape === 'star') {
      return (
        <div
          key={particle.id}
          style={{
            ...baseStyle,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{
              width: '100%',
              height: '100%',
              fill: particle.color,
            }}
          >
            <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
          </svg>
        </div>
      );
    }

    return (
      <div
        key={particle.id}
        style={{
          ...baseStyle,
          backgroundColor: particle.color,
          borderRadius: '50%',
          opacity: particle.opacity !== undefined ? particle.opacity : particle.life / particle.maxLife,
          boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          transform: particle.rotation ? `rotate(${particle.rotation}deg)` : 'none',
        }}
      />
    );
  };

  return (
    <>
      {/* Main cursor ring */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: position.x - 12,
          top: position.y - 12,
          transition: 'transform 0.1s ease-out',
          transform: `scale(${isClicking ? 0.8 : 1}) ${isPointer ? 'scale(1.2)' : ''}`
        }}
      >
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-80 blur-sm" />
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-blue-300 to-purple-400" />
        </div>
      </div>

      {/* Inner cursor dot */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: position.x - 2,
          top: position.y - 2,
          transition: 'transform 0.15s ease-out',
          transform: `scale(${isClicking ? 1.5 : 1})`
        }}
      >
        <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Particles */}
      {particles.map(renderParticle)}

      {/* Glow effect */}
      <div
        className="fixed pointer-events-none z-40 opacity-30 blur-xl"
        style={{
          left: position.x - 50,
          top: position.y - 50,
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
          transform: isClicking ? 'scale(1.5)' : 'scale(1)',
          transition: 'transform 0.2s ease-out',
        }}
      />
    </>
  );
};

export default MagicalNebulaCursor;