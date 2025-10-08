import { useEffect } from 'react';

interface BobaTeaAnimationProps {
  onComplete: () => void;
}

const BobaTeaAnimation = ({ onComplete }: BobaTeaAnimationProps) => {
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
          {/* Cup */}
          <path d="M 70 70 L 75 150 Q 75 160, 85 160 L 115 160 Q 125 160, 125 150 L 130 70 Z" 
                stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Tea/liquid */}
          <path d="M 72 80 L 76 145 Q 76 153, 85 153 L 115 153 Q 124 153, 124 145 L 128 80 Z" 
                fill="#22c55e" opacity="0.3"/>
          
          {/* Boba pearls */}
          <circle cx="85" cy="140" r="4" fill="#22c55e"/>
          <circle cx="95" cy="145" r="4" fill="#22c55e"/>
          <circle cx="105" cy="143" r="4" fill="#22c55e"/>
          <circle cx="115" cy="138" r="4" fill="#22c55e"/>
          <circle cx="90" cy="135" r="4" fill="#22c55e"/>
          <circle cx="100" cy="138" r="4" fill="#22c55e"/>
          <circle cx="110" cy="145" r="4" fill="#22c55e"/>
          
          {/* Cup rim */}
          <ellipse cx="100" cy="70" rx="30" ry="8" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Straw */}
          <rect x="115" y="30" width="8" height="90" rx="4" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Straw stripes */}
          <line x1="115" y1="40" x2="123" y2="40" stroke="#22c55e" strokeWidth="2"/>
          <line x1="115" y1="55" x2="123" y2="55" stroke="#22c55e" strokeWidth="2"/>
          <line x1="115" y1="70" x2="123" y2="70" stroke="#22c55e" strokeWidth="2"/>
          <line x1="115" y1="85" x2="123" y2="85" stroke="#22c55e" strokeWidth="2"/>
          
          {/* Lid */}
          <path d="M 68 70 L 70 65 Q 70 62, 73 62 L 127 62 Q 130 62, 130 65 L 132 70" 
                stroke="#22c55e" strokeWidth="3" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default BobaTeaAnimation;
