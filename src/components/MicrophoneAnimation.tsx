import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
interface MicrophoneAnimationProps {
  onComplete: () => void;
  cardIndex: number;
}

const MicrophoneAnimation = ({ onComplete, cardIndex }: MicrophoneAnimationProps) => {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById(`founder-rect-${cardIndex}`) as HTMLElement | null;
    setHost(el);

    const timer = setTimeout(() => onComplete(), 1800);
    return () => clearTimeout(timer);
  }, [onComplete, cardIndex]);

  if (!host) return null;

  return createPortal(
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-card-trick z-10"
      onClick={onComplete}
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
    </div>,
    host
  );
};

export default MicrophoneAnimation;
