import { useEffect } from 'react';

interface BobaTeaAnimationProps {
  onComplete: () => void;
}

const BobaTeaAnimation = ({ onComplete }: BobaTeaAnimationProps) => {
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
        <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cup */}
          <path d="M 30 30 L 35 120 Q 35 130, 45 130 L 75 130 Q 85 130, 85 120 L 90 30 Z" 
                stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Tea/liquid */}
          <path d="M 32 40 L 36 115 Q 36 123, 45 123 L 75 123 Q 84 123, 84 115 L 88 40 Z" 
                fill="#22c55e" opacity="0.3"/>
          
          {/* Boba pearls */}
          <circle cx="45" cy="110" r="4" fill="#22c55e"/>
          <circle cx="55" cy="115" r="4" fill="#22c55e"/>
          <circle cx="65" cy="113" r="4" fill="#22c55e"/>
          <circle cx="75" cy="108" r="4" fill="#22c55e"/>
          <circle cx="50" cy="105" r="4" fill="#22c55e"/>
          <circle cx="60" cy="108" r="4" fill="#22c55e"/>
          <circle cx="70" cy="115" r="4" fill="#22c55e"/>
          
          {/* Cup rim */}
          <ellipse cx="60" cy="30" rx="30" ry="8" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Straw */}
          <rect x="75" y="10" width="8" height="70" rx="4" stroke="#22c55e" strokeWidth="3" fill="white"/>
          
          {/* Lid */}
          <path d="M 28 30 L 30 25 Q 30 22, 33 22 L 87 22 Q 90 22, 90 25 L 92 30" 
                stroke="#22c55e" strokeWidth="3" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default BobaTeaAnimation;
