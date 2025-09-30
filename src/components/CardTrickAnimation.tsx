import { useEffect, useState } from "react";

interface CardTrickAnimationProps {
  onComplete: () => void;
}

const CardTrickAnimation = ({ onComplete }: CardTrickAnimationProps) => {
  const [animationStep, setAnimationStep] = useState<'shuffle' | 'spread' | 'flip' | 'collect' | 'disappear'>('shuffle');

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Shuffle phase (0-1s)
    timers.push(setTimeout(() => setAnimationStep('spread'), 1000));
    
    // Spread phase (1-2s)
    timers.push(setTimeout(() => setAnimationStep('flip'), 2000));
    
    // Flip phase (2-3.5s)
    timers.push(setTimeout(() => setAnimationStep('collect'), 3500));
    
    // Collect phase (3.5-4.5s)
    timers.push(setTimeout(() => setAnimationStep('disappear'), 4500));
    
    // Complete and cleanup (4.5-5s)
    timers.push(setTimeout(() => onComplete(), 5000));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete]);

  const cards = [
    { id: 1, suit: '♠', value: 'A', color: 'text-foreground' },
    { id: 2, suit: '♥', value: 'K', color: 'text-destructive' },
    { id: 3, suit: '♣', value: 'Q', color: 'text-foreground' },
    { id: 4, suit: '♦', value: 'J', color: 'text-destructive' },
    { id: 5, suit: '♠', value: '10', color: 'text-foreground' },
  ];

  const getCardStyle = (index: number) => {
    const spreadPositions = [
      { x: '-120px', rotate: '-20deg' },
      { x: '-60px', rotate: '-10deg' },
      { x: '0px', rotate: '0deg' },
      { x: '60px', rotate: '10deg' },
      { x: '120px', rotate: '20deg' },
    ];

    return {
      '--spread-x': spreadPositions[index].x,
      '--spread-rotate': spreadPositions[index].rotate,
      animationDelay: `${index * 0.1}s`
    } as React.CSSProperties;
  };

  const getAnimationClass = () => {
    switch (animationStep) {
      case 'shuffle':
        return 'animate-card-shuffle';
      case 'spread':
        return 'animate-card-spread';
      case 'flip':
        return 'animate-card-flip';
      case 'collect':
        return 'animate-card-collect';
      case 'disappear':
        return 'animate-card-disappear';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-backdrop-appear bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg h-64 flex items-center justify-center perspective-1000">
        <div className="relative w-32 h-48 preserve-3d">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`absolute inset-0 w-32 h-48 rounded-lg shadow-card-hover transition-all duration-300 ${getAnimationClass()}`}
              style={getCardStyle(index)}
            >
              {/* Card Front */}
              <div className="absolute inset-0 bg-card border-2 border-primary/20 rounded-lg flex flex-col items-center justify-center backface-hidden">
                <div className={`text-5xl font-bold ${card.color}`}>
                  {card.value}
                </div>
                <div className={`text-6xl ${card.color}`}>
                  {card.suit}
                </div>
              </div>
              
              {/* Card Back */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg backface-hidden rotate-y-180 border-2 border-primary/40">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-40 border-2 border-primary-foreground/30 rounded m-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsl(var(--primary-foreground))_10px,hsl(var(--primary-foreground))_11px)] opacity-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardTrickAnimation;