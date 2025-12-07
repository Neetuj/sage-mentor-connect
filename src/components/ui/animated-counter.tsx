import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter = ({ value, duration = 2000, className = '' }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState('0');
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    // Parse the target value - handle formats like "1000+", "50%", "4.9"
    const numericMatch = value.match(/^([\d,.]+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const numericPart = numericMatch[1].replace(/,/g, '');
    const suffix = value.slice(numericMatch[0].length);
    const targetNumber = parseFloat(numericPart);
    const hasDecimal = numericPart.includes('.');
    const decimalPlaces = hasDecimal ? numericPart.split('.')[1]?.length || 1 : 0;

    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = targetNumber * easeOut;
      
      if (hasDecimal) {
        setDisplayValue(currentValue.toFixed(decimalPlaces) + suffix);
      } else {
        setDisplayValue(Math.floor(currentValue).toLocaleString() + suffix);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
};

export default AnimatedCounter;
