import React, { useEffect, useRef, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track target coordinates (where mouse is)
  const mousePos = useRef({ x: -200, y: -200 });
  // Track current coordinates (where glow is, for smooth lagging follow)
  const glowPos = useRef({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    
    const updatePosition = () => {
      // Linear interpolation (lerp) for smooth lagging effect
      // current = current + (target - current) * factor
      const easeFactor = 0.08;
      
      const dx = mousePos.current.x - glowPos.current.x;
      const dy = mousePos.current.y - glowPos.current.y;
      
      glowPos.current.x += dx * easeFactor;
      glowPos.current.y += dy * easeFactor;
      
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${glowPos.current.x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${glowPos.current.y}px`);
      }
      
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    
    updatePosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1, // behind text and interactive elements (which should have relative/z-index 2), but above background grid
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease',
        backgroundImage: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), var(--cursor-glow-1), var(--cursor-glow-2) 45%, transparent 80%)`,
      }}
    />
  );
};
