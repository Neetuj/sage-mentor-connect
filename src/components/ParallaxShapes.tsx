import { useParallax } from '@/hooks/useParallax';

interface Shape {
  id: number;
  type: 'circle' | 'ring';
  size: number;
  x: number;
  y: number;
  pulseSpeed: number; // seconds for one pulse cycle
  opacity: number;
  delay: number; // animation delay in seconds
}

const shapes: Shape[] = [
  { id: 1, type: 'circle', size: 200, x: 5, y: 20, pulseSpeed: 8, opacity: 0.03, delay: 0 },
  { id: 2, type: 'ring', size: 120, x: 90, y: 15, pulseSpeed: 10, opacity: 0.04, delay: 2 },
  { id: 3, type: 'circle', size: 80, x: 85, y: 60, pulseSpeed: 7, opacity: 0.025, delay: 1 },
  { id: 4, type: 'ring', size: 160, x: 10, y: 70, pulseSpeed: 12, opacity: 0.03, delay: 3 },
  { id: 5, type: 'circle', size: 100, x: 50, y: 85, pulseSpeed: 9, opacity: 0.025, delay: 1.5 },
];

const ShapeComponent = ({ shape }: { shape: Shape }) => {
  const baseStyle = {
    position: 'absolute' as const,
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: shape.size,
    height: shape.size,
    opacity: shape.opacity,
    pointerEvents: 'none' as const,
    animation: `breathe ${shape.pulseSpeed}s ease-in-out infinite`,
    animationDelay: `${shape.delay}s`,
  };

  if (shape.type === 'circle') {
    return (
      <div
        style={baseStyle}
        className="rounded-full bg-primary"
      />
    );
  }

  if (shape.type === 'ring') {
    return (
      <div
        style={baseStyle}
        className="rounded-full border-2 border-primary"
      />
    );
  }

  return null;
};

const ParallaxShapes = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: var(--opacity-base); }
          50% { transform: scale(1.15); opacity: calc(var(--opacity-base) * 1.5); }
        }
      `}</style>
      {shapes.map((shape) => (
        <div key={shape.id} style={{ '--opacity-base': shape.opacity } as React.CSSProperties}>
          <ShapeComponent shape={shape} />
        </div>
      ))}
    </div>
  );
};

export default ParallaxShapes;
