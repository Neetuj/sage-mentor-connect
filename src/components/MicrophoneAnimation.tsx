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
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* First music note */}
          <ellipse cx="35" cy="85" rx="12" ry="8" fill="#22c55e"/>
          <rect x="45" y="35" width="4" height="50" fill="#22c55e"/>
          <circle cx="47" cy="35" r="8" fill="#22c55e"/>
          
          {/* Second music note */}
          <ellipse cx="65" cy="90" rx="12" ry="8" fill="#22c55e"/>
          <rect x="75" y="25" width="4" height="65" fill="#22c55e"/>
          <circle cx="77" cy="25" r="10" fill="#22c55e"/>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
