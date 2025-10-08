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
          {/* Microphone capsule (top round part) */}
          <ellipse cx="100" cy="55" rx="22" ry="28" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Mesh pattern on capsule */}
          <line x1="85" y1="40" x2="115" y2="40" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <line x1="83" y1="48" x2="117" y2="48" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <line x1="82" y1="55" x2="118" y2="55" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <line x1="83" y1="62" x2="117" y2="62" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <line x1="85" y1="70" x2="115" y2="70" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          
          {/* Body cylinder */}
          <rect x="88" y="80" width="24" height="35" stroke="#22c55e" strokeWidth="3" fill="white"/>
          <ellipse cx="100" cy="80" rx="12" ry="4" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Volume/control ring */}
          <rect x="86" y="95" width="28" height="8" rx="2" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Connection base */}
          <ellipse cx="100" cy="115" rx="14" ry="5" stroke="#22c55e" strokeWidth="3" fill="white"/>
          <rect x="86" y="115" width="28" height="8" stroke="#22c55e" strokeWidth="3" fill="white"/>
          <ellipse cx="100" cy="123" rx="14" ry="5" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Stand arm */}
          <path d="M 100 123 L 100 135" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"/>
          <path d="M 100 135 L 75 155" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"/>
          
          {/* Stand base */}
          <ellipse cx="75" cy="155" rx="30" ry="10" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Sound waves - right side */}
          <path d="M 125 45 Q 138 48, 142 55" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
          <path d="M 128 52 Q 145 55, 150 62" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
          <path d="M 130 60 Q 150 62, 156 70" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3"/>
          
          {/* Sound waves - left side */}
          <path d="M 75 45 Q 62 48, 58 55" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
          <path d="M 72 52 Q 55 55, 50 62" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
          <path d="M 70 60 Q 50 62, 44 70" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3"/>
        </svg>
      </div>
    </div>
  );
};

export default MicrophoneAnimation;
