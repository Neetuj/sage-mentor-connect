import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';
}

export const AnimatedSection = ({ 
  children, 
  className, 
  delay = 0,
  animation = 'fade-up' 
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useIntersectionObserver();

  const animationClasses = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-in': 'opacity-0',
    'scale-in': 'scale-95 opacity-0',
    'slide-left': '-translate-x-8 opacity-0',
    'slide-right': 'translate-x-8 opacity-0',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : animationClasses[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface StaggeredChildrenProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: 'fade-up' | 'fade-in' | 'scale-in';
}

export const StaggeredChildren = ({ 
  children, 
  className,
  staggerDelay = 100,
  animation = 'fade-up'
}: StaggeredChildrenProps) => {
  const { ref, isVisible } = useIntersectionObserver();

  const animationClasses = {
    'fade-up': 'translate-y-6 opacity-0',
    'fade-in': 'opacity-0',
    'scale-in': 'scale-95 opacity-0',
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all duration-500 ease-out',
            isVisible ? 'translate-y-0 scale-100 opacity-100' : animationClasses[animation]
          )}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default AnimatedSection;
