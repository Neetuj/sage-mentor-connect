interface DuckAnimationProps {
  onComplete: () => void;
}

const DuckAnimation = ({ onComplete }: DuckAnimationProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none">
      <div className="flex items-end gap-1 animate-duck-walk">
        {/* Mother Duck */}
        <div className="text-6xl animate-duck-waddle" style={{ animationDelay: '0s' }}>
          🦆
        </div>
        {/* Baby Ducks */}
        <div className="text-4xl animate-duck-waddle" style={{ animationDelay: '0.15s' }}>
          🐥
        </div>
        <div className="text-4xl animate-duck-waddle" style={{ animationDelay: '0.3s' }}>
          🐥
        </div>
        <div className="text-4xl animate-duck-waddle" style={{ animationDelay: '0.45s' }}>
          🐥
        </div>
      </div>
    </div>
  );
};

export default DuckAnimation;
