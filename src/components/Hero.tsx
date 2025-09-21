import { useState, useEffect } from 'react';

const Hero = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSageClick = () => {
    setClickCount(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Reset counter after 30 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [clickCount]);

  const getSageStyles = () => {
    let baseClasses = "text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-wider mb-8 cursor-pointer transition-all duration-300 select-none";
    
    if (isAnimating) {
      baseClasses += " animate-bounce-scale";
    }

    if (clickCount >= 20) {
      return `${baseClasses} text-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text animate-party-spin`;
    } else if (clickCount >= 15) {
      return `${baseClasses} text-accent animate-wiggle`;
    } else if (clickCount >= 10) {
      return `${baseClasses} text-secondary animate-pulse`;
    } else if (clickCount >= 5) {
      return `${baseClasses} text-primary pulse`;
    }
    
    return `${baseClasses} text-primary`;
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 
          className={getSageStyles()}
          onClick={handleSageClick}
          title="Click me!"
        >
          SAGE
          {clickCount >= 20 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute text-2xl animate-float-up`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Student Alliance for Growth in Engineering
        </p>
        <button 
          onClick={() => scrollToSection('about')}
          className="text-primary hover:text-primary-light transition-colors text-sm tracking-wide"
        >
          Learn More ↓
        </button>
      </div>
    </section>
  );
};

export default Hero;