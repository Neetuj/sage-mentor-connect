import { useEffect } from "react";

interface CardTrickAnimationProps {
  onComplete: () => void;
}

const CardTrickAnimation = ({ onComplete }: CardTrickAnimationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const cards = [
    { id: 1, suit: '♠', value: 'A' },
    { id: 2, suit: '♥', value: 'K' },
    { id: 3, suit: '♣', value: 'Q' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
      <div className="flex gap-4 animate-scale-in">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="w-20 h-28 bg-card border border-primary/20 rounded-lg shadow-card-hover flex flex-col items-center justify-center transform transition-all duration-500 hover:scale-110"
            style={{
              animationDelay: `${index * 0.1}s`,
              transform: `rotate(${(index - 1) * 15}deg)`,
            }}
          >
            <div className="text-3xl font-bold text-primary">
              {card.value}
            </div>
            <div className="text-4xl text-primary">
              {card.suit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardTrickAnimation;