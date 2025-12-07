import { useState, useEffect, useCallback } from 'react';

interface ParallaxState {
  scrollY: number;
  scrollProgress: number; // 0-1 based on document height
  viewportHeight: number;
}

export const useParallax = () => {
  const [state, setState] = useState<ParallaxState>({
    scrollY: 0,
    scrollProgress: 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;
    
    setState({
      scrollY,
      scrollProgress,
      viewportHeight: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return state;
};

// Helper to calculate parallax offset
export const getParallaxOffset = (scrollY: number, speed: number = 0.5, offset: number = 0) => {
  return (scrollY * speed) + offset;
};

export default useParallax;
