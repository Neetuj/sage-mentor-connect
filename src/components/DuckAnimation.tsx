interface DuckAnimationProps {
  onComplete: () => void;
}

const MinimalistDuck = ({ size = 40, delay = "0s" }: { size?: number; delay?: string }) => (
  <div className="animate-duck-waddle" style={{ animationDelay: delay }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="25" rx="10" ry="8" className="fill-primary" />
      {/* Head */}
      <circle cx="20" cy="16" r="6" className="fill-primary" />
      {/* Beak */}
      <circle cx="26" cy="16" r="2" className="fill-accent" />
      {/* Eye */}
      <circle cx="22" cy="15" r="1" className="fill-background" />
    </svg>
  </div>
);

const DuckAnimation = ({ onComplete }: DuckAnimationProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none">
      <div className="relative">
        {/* Mother Duck */}
        <div className="absolute animate-duck-walk" style={{ animationDelay: '0s' }}>
          <MinimalistDuck size={50} delay="0s" />
        </div>
        {/* Baby Ducks - following behind */}
        <div className="absolute animate-duck-walk" style={{ animationDelay: '0.3s' }}>
          <MinimalistDuck size={30} delay="0.2s" />
        </div>
        <div className="absolute animate-duck-walk" style={{ animationDelay: '0.6s' }}>
          <MinimalistDuck size={30} delay="0.4s" />
        </div>
        <div className="absolute animate-duck-walk" style={{ animationDelay: '0.9s' }}>
          <MinimalistDuck size={30} delay="0.6s" />
        </div>
      </div>
    </div>
  );
};

export default DuckAnimation;
