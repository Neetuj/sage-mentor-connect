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
            {/* First note */}
            <rect x="50" y="45" width="3" height="30" fill="hsl(var(--primary))"/>
            <ellipse cx="51.5" cy="75" rx="8" ry="6" fill="hsl(var(--primary))" transform="rotate(-20 51.5 75)"/>
            
            {/* Second note */}
            <rect x="70" y="40" width="3" height="35" fill="hsl(var(--primary))"/>
            <ellipse cx="71.5" cy="75" rx="8" ry="6" fill="hsl(var(--primary))" transform="rotate(-20 71.5 75)"/>
            
            {/* Connecting beam */}
            <path d="M 50 45 L 70 40 L 70 43 L 50 48 Z" fill="hsl(var(--primary))"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
