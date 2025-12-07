import { useParallax, getParallaxOffset } from '@/hooks/useParallax';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle' | 'ring';
  size: number;
  x: number; // percentage
  y: number; // percentage  
  speed: number;
  opacity: number;
  rotation?: number;
  delay?: number;
}

const shapes: Shape[] = [
  { id: 1, type: 'circle', size: 180, x: 8, y: 15, speed: 0.08, opacity: 0.04 },
  { id: 2, type: 'ring', size: 100, x: 88, y: 12, speed: 0.12, opacity: 0.06 },
  { id: 3, type: 'square', size: 50, x: 78, y: 55, speed: 0.06, opacity: 0.03, rotation: 45 },
  { id: 4, type: 'circle', size: 60, x: 15, y: 65, speed: 0.1, opacity: 0.04 },
  { id: 5, type: 'ring', size: 140, x: 92, y: 75, speed: 0.07, opacity: 0.03 },
  { id: 6, type: 'circle', size: 35, x: 45, y: 8, speed: 0.15, opacity: 0.05 },
];

const ShapeComponent = ({ shape, scrollY }: { shape: Shape; scrollY: number }) => {
  const yOffset = getParallaxOffset(scrollY, shape.speed);
  
  const baseStyle = {
    position: 'absolute' as const,
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: shape.size,
    height: shape.size,
    transform: `translateY(${-yOffset}px) rotate(${(shape.rotation || 0) + scrollY * 0.02}deg)`,
    opacity: shape.opacity,
    transition: 'transform 0.1s ease-out',
    pointerEvents: 'none' as const,
  };

  if (shape.type === 'circle') {
    return (
      <div
        style={baseStyle}
        className="rounded-full bg-gradient-to-br from-primary to-secondary"
      />
    );
  }

  if (shape.type === 'ring') {
    return (
      <div
        style={baseStyle}
        className="rounded-full border-4 border-primary"
      />
    );
  }

  if (shape.type === 'square') {
    return (
      <div
        style={baseStyle}
        className="bg-gradient-to-br from-secondary to-accent rounded-lg"
      />
    );
  }

  if (shape.type === 'triangle') {
    return (
      <div
        style={{
          ...baseStyle,
          width: 0,
          height: 0,
          borderLeft: `${shape.size / 2}px solid transparent`,
          borderRight: `${shape.size / 2}px solid transparent`,
          borderBottom: `${shape.size}px solid hsl(var(--primary))`,
          background: 'none',
        }}
      />
    );
  }

  return null;
};

const ParallaxShapes = () => {
  const { scrollY } = useParallax();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <ShapeComponent key={shape.id} shape={shape} scrollY={scrollY} />
      ))}
    </div>
  );
};

export default ParallaxShapes;
