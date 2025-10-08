import { useEffect, useState } from 'react';

interface MicrophoneAnimationProps {
  onComplete: () => void;
  cardIndex: number;
}

const MicrophoneAnimation = ({ onComplete, cardIndex }: MicrophoneAnimationProps) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    let rafId: number | null = null;

    const updatePosition = () => {
      const cardElement = document.getElementById(`founder-card-${cardIndex}`);
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        setPosition({
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left + rect.width / 2}px`,
        });
      }
    };
    
    const loop = () => {
      updatePosition();
      rafId = requestAnimationFrame(loop);
    };

    // Start continuous centering while overlay is visible
    updatePosition();
    rafId = requestAnimationFrame(loop);

    // Also recenter on resize/scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const timer = setTimeout(() => onComplete(), 1800);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      clearTimeout(timer);
    };
  }, [onComplete, cardIndex]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onComplete}
    >
      <div 
        className="animate-card-trick absolute"
        style={{ 
          top: position.top, 
          left: position.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* White background */}
          <rect x="20" y="20" width="80" height="80" rx="8" fill="white" stroke="hsl(var(--primary))" strokeWidth="3"/>
          
          {/* Music notes */}
          <g>
            {/* First note - stem on right, oval on left */}
            <rect x="48" y="45" width="3" height="30" fill="hsl(var(--primary))"/>
            <ellipse cx="43" cy="74" rx="7" ry="5" fill="hsl(var(--primary))" transform="rotate(-20 43 74)"/>
            
            {/* Second note - stem on right, oval on left */}
            <rect x="68" y="40" width="3" height="35" fill="hsl(var(--primary))"/>
            <ellipse cx="63" cy="74" rx="7" ry="5" fill="hsl(var(--primary))" transform="rotate(-20 63 74)"/>
            
            {/* Connecting beam */}
            <path d="M 48 45 L 68 40 L 68 43 L 48 48 Z" fill="hsl(var(--primary))"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
