import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
interface BobaTeaAnimationProps {
  onComplete: () => void;
  cardIndex: number;
}

const BobaTeaAnimation = ({ onComplete, cardIndex }: BobaTeaAnimationProps) => {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById(`founder-rect-${cardIndex}`) as HTMLElement | null;
    setHost(el);

    const timer = setTimeout(() => onComplete(), 1800);
    return () => clearTimeout(timer);
  }, [onComplete, cardIndex]);

  if (!host) return null;

  return createPortal(
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-card-trick z-10"
      onClick={onComplete}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cup - adjusted to fit 120x120 viewBox visually centered */}
        <path d="M 30 25 L 35 95 Q 35 102, 45 102 L 75 102 Q 85 102, 85 95 L 90 25 Z" 
              stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
        
        {/* Tea/liquid */}
        <path d="M 32 35 L 36 90 Q 36 98, 45 98 L 75 98 Q 84 98, 84 90 L 88 35 Z" 
              fill="hsl(var(--primary))" opacity="0.3"/>
        
        {/* Boba pearls */}
        <circle cx="45" cy="85" r="4" fill="hsl(var(--primary))"/>
        <circle cx="55" cy="90" r="4" fill="hsl(var(--primary))"/>
        <circle cx="65" cy="88" r="4" fill="hsl(var(--primary))"/>
        <circle cx="75" cy="83" r="4" fill="hsl(var(--primary))"/>
        <circle cx="50" cy="80" r="4" fill="hsl(var(--primary))"/>
        <circle cx="60" cy="83" r="4" fill="hsl(var(--primary))"/>
        <circle cx="70" cy="90" r="4" fill="hsl(var(--primary))"/>
        
        {/* Cup rim */}
        <ellipse cx="60" cy="25" rx="30" ry="8" stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
        
        {/* Straw */}
        <rect x="75" y="5" width="8" height="60" rx="4" stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
        
        {/* Lid */}
        <path d="M 28 25 L 30 20 Q 30 17, 33 17 L 87 17 Q 90 17, 90 20 L 92 25" 
              stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
      </svg>
    </div>,
    host
  );
};

export default BobaTeaAnimation;
