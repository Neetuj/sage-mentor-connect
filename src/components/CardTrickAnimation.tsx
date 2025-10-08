import { useEffect, useState } from "react";

interface CardTrickAnimationProps {
  onComplete: () => void;
  cardIndex: number;
}

const CardTrickAnimation = ({ onComplete, cardIndex }: CardTrickAnimationProps) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div 
        className="w-24 h-32 bg-card border-2 border-primary rounded-lg shadow-card-hover flex flex-col items-center justify-center animate-card-trick absolute"
        style={{ 
          top: position.top, 
          left: position.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="text-4xl font-bold text-primary">A</div>
        <div className="text-5xl text-primary">♠</div>
      </div>
    </div>
  );
};

export default CardTrickAnimation;