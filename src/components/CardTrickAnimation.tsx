import { useEffect } from "react";

interface CardTrickAnimationProps {
  onComplete: () => void;
}

const CardTrickAnimation = ({ onComplete }: CardTrickAnimationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="w-24 h-32 bg-card border-2 border-primary rounded-lg shadow-card-hover flex flex-col items-center justify-center animate-card-trick">
        <div className="text-4xl font-bold text-primary">A</div>
        <div className="text-5xl text-primary">♠</div>
      </div>
    </div>
  );
};

export default CardTrickAnimation;