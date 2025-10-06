interface DuckAnimationProps {
  onComplete: () => void;
}

const MinimalistDuck = ({ size = 40, delay = "0s" }: { size?: number; delay?: string }) => (
  <div className="animate-duck-waddle" style={{ animationDelay: delay }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="25" rx="12" ry="10" className="fill-primary" />
      {/* Head */}
      <circle cx="20" cy="15" r="7" className="fill-primary" />
      {/* Beak */}
      <path d="M27 15 L32 15 L27 17 Z" className="fill-accent" />
      {/* Eye */}
      <circle cx="22" cy="14" r="1.5" className="fill-background" />
      {/* Wing */}
      <path d="M15 25 Q12 28 15 30" className="stroke-primary-foreground/30" strokeWidth="1.5" fill="none" />
    </svg>
  </div>
);

const DuckAnimation = ({ onComplete }: DuckAnimationProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none">
      <div className="flex items-end gap-2 animate-duck-walk">
        {/* Mother Duck */}
        <MinimalistDuck size={50} delay="0s" />
        {/* Baby Ducks */}
        <MinimalistDuck size={30} delay="0.2s" />
        <MinimalistDuck size={30} delay="0.4s" />
        <MinimalistDuck size={30} delay="0.6s" />
      </div>
    </div>
  );
};

export default DuckAnimation;
