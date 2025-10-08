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
          {/* Microphone head */}
          <circle cx="100" cy="70" r="25" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Handle */}
          <rect x="90" y="95" width="20" height="50" rx="3" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Base */}
          <rect x="85" y="145" width="30" height="8" rx="2" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Sound waves */}
          <path d="M 130 60 Q 145 65, 145 75" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M 70 60 Q 55 65, 55 75" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
