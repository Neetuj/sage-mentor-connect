import { useEffect } from 'react';

interface MicrophoneAnimationProps {
  onComplete: () => void;
}

const MicrophoneAnimation = ({ onComplete }: MicrophoneAnimationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onComplete}
    >
      <div className="animate-card-trick">
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* White background */}
          <rect x="30" y="30" width="80" height="80" rx="8" fill="white" stroke="hsl(var(--primary))" strokeWidth="3"/>
          
          {/* Simple music notes */}
          <g>
            {/* First note */}
            <ellipse cx="55" cy="85" rx="10" ry="7" fill="hsl(var(--primary))" transform="rotate(-25 55 85)"/>
            <rect x="64" y="50" width="3" height="35" fill="hsl(var(--primary))" rx="1.5"/>
            
            {/* Second note */}
            <ellipse cx="80" cy="88" rx="10" ry="7" fill="hsl(var(--primary))" transform="rotate(-25 80 88)"/>
            <rect x="89" y="45" width="3" height="43" fill="hsl(var(--primary))" rx="1.5"/>
            
            {/* Connecting beam */}
            <path d="M 67 50 L 92 45 L 92 52 L 67 57 Z" fill="hsl(var(--primary))"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
