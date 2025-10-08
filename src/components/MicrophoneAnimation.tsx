import { useEffect, useState } from 'react';

interface MicrophoneAnimationProps {
  onComplete: () => void;
  cardIndex: number;
}

const MicrophoneAnimation = ({ onComplete, cardIndex }: MicrophoneAnimationProps) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    const cardElement = document.getElementById(`founder-card-${cardIndex}`);
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      setPosition({
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left + rect.width / 2}px`,
      });
    }
    
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete, cardIndex]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onComplete}
    >
      <div 
        className="animate-card-trick absolute -translate-x-1/2 -translate-y-1/2"
        style={{ top: position.top, left: position.left }}
      >
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* White background */}
          <rect x="30" y="30" width="80" height="80" rx="8" fill="white" stroke="hsl(var(--primary))" strokeWidth="3"/>
          
          {/* Simple music notes */}
          <g>
            {/* First note - positioned to connect perfectly */}
            <rect x="65" y="50" width="3" height="35" fill="hsl(var(--primary))" rx="1.5"/>
            <ellipse cx="56" cy="85" rx="10" ry="7" fill="hsl(var(--primary))" transform="rotate(-25 56 85)"/>
            
            {/* Second note */}
            <rect x="90" y="45" width="3" height="43" fill="hsl(var(--primary))" rx="1.5"/>
            <ellipse cx="81" cy="88" rx="10" ry="7" fill="hsl(var(--primary))" transform="rotate(-25 81 88)"/>
            
            {/* Connecting beam */}
            <path d="M 65 50 L 90 45 L 90 52 L 65 57 Z" fill="hsl(var(--primary))"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
