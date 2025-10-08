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
          {/* Music notes */}
          <g>
            {/* First note */}
            <ellipse cx="40" cy="95" rx="14" ry="10" fill="hsl(var(--primary))" transform="rotate(-20 40 95)"/>
            <rect x="52" y="45" width="5" height="50" fill="hsl(var(--primary))" rx="2.5"/>
            
            {/* Second note */}
            <ellipse cx="75" cy="100" rx="14" ry="10" fill="hsl(var(--primary))" transform="rotate(-20 75 100)"/>
            <rect x="87" y="35" width="5" height="65" fill="hsl(var(--primary))" rx="2.5"/>
            
            {/* Connecting beam */}
            <path d="M 57 45 L 92 35 L 92 45 L 57 55 Z" fill="hsl(var(--primary))"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
