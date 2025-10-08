import { useEffect } from 'react';

interface MicrophoneAnimationProps {
  onComplete: () => void;
}

const MicrophoneAnimation = ({ onComplete }: MicrophoneAnimationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onComplete}
    >
      <div className="animate-[spin_2s_ease-in-out]">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Microphone body */}
          <rect x="85" y="40" width="30" height="60" rx="15" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Microphone grille lines */}
          <line x1="90" y1="50" x2="110" y2="50" stroke="#22c55e" strokeWidth="2"/>
          <line x1="90" y1="60" x2="110" y2="60" stroke="#22c55e" strokeWidth="2"/>
          <line x1="90" y1="70" x2="110" y2="70" stroke="#22c55e" strokeWidth="2"/>
          <line x1="90" y1="80" x2="110" y2="80" stroke="#22c55e" strokeWidth="2"/>
          <line x1="90" y1="90" x2="110" y2="90" stroke="#22c55e" strokeWidth="2"/>
          
          {/* Microphone connector */}
          <rect x="95" y="100" width="10" height="15" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Microphone stand */}
          <path d="M 100 115 Q 90 130, 90 145 L 90 160" stroke="#22c55e" strokeWidth="3" fill="none"/>
          <path d="M 100 115 Q 110 130, 110 145 L 110 160" stroke="#22c55e" strokeWidth="3" fill="none"/>
          
          {/* Base */}
          <ellipse cx="100" cy="160" rx="25" ry="8" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Sound waves */}
          <path d="M 120 50 Q 135 60, 135 75" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M 125 55 Q 145 65, 145 75" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.4"/>
          <path d="M 80 50 Q 65 60, 65 75" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M 75 55 Q 55 65, 55 75" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
