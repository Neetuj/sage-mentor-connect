import { useEffect, useState } from 'react';

interface BobaTeaAnimationProps {
  onComplete: () => void;
  cardIndex: number;
}

const BobaTeaAnimation = ({ onComplete, cardIndex }: BobaTeaAnimationProps) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    let rafId: number | null = null;

    const updatePosition = () => {
      const cardElement = document.getElementById(`founder-card-${cardIndex}`);
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        setPosition({
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left + rect.width / 2}px`,
        });
      }
    };
    
    const loop = () => {
      updatePosition();
      rafId = requestAnimationFrame(loop);
    };

    // Start continuous centering while overlay is visible
    updatePosition();
    rafId = requestAnimationFrame(loop);

    // Also recenter on resize/scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const timer = setTimeout(() => onComplete(), 1800);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      clearTimeout(timer);
    };
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
        <svg width="120" height="120" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cup */}
          <path d="M 30 30 L 35 120 Q 35 130, 45 130 L 75 130 Q 85 130, 85 120 L 90 30 Z" 
                stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
          
          {/* Tea/liquid */}
          <path d="M 32 40 L 36 115 Q 36 123, 45 123 L 75 123 Q 84 123, 84 115 L 88 40 Z" 
                fill="hsl(var(--primary))" opacity="0.3"/>
          
          {/* Boba pearls */}
          <circle cx="45" cy="110" r="4" fill="hsl(var(--primary))"/>
          <circle cx="55" cy="115" r="4" fill="hsl(var(--primary))"/>
          <circle cx="65" cy="113" r="4" fill="hsl(var(--primary))"/>
          <circle cx="75" cy="108" r="4" fill="hsl(var(--primary))"/>
          <circle cx="50" cy="105" r="4" fill="hsl(var(--primary))"/>
          <circle cx="60" cy="108" r="4" fill="hsl(var(--primary))"/>
          <circle cx="70" cy="115" r="4" fill="hsl(var(--primary))"/>
          
          {/* Cup rim */}
          <ellipse cx="60" cy="30" rx="30" ry="8" stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
          
          {/* Straw */}
          <rect x="75" y="10" width="8" height="70" rx="4" stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
          
          {/* Lid */}
          <path d="M 28 30 L 30 25 Q 30 22, 33 22 L 87 22 Q 90 22, 90 25 L 92 30" 
                stroke="hsl(var(--primary))" strokeWidth="3" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default BobaTeaAnimation;
