import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
interface CardTrickAnimationProps {
  onComplete: () => void;
  cardIndex: number;
}

const CardTrickAnimation = ({ onComplete, cardIndex }: CardTrickAnimationProps) => {
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
      <div className="w-24 h-32 bg-card border-2 border-primary rounded-lg shadow-card-hover flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-primary">A</div>
        <div className="text-5xl text-primary">♠</div>
      </div>
    </div>,
    host
  );
};

export default CardTrickAnimation;