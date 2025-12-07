import { useState, useEffect } from "react";
import samProfile from "@/assets/sam-profile.jpg";
import { useParallax } from "@/hooks/useParallax";

const Hero = () => {
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [lettersVisible, setLettersVisible] = useState(false);
  const { scrollY, viewportHeight } = useParallax();

  // Calculate parallax values - more subtle effect
  const heroOpacity = Math.max(0.2, 1 - (scrollY / (viewportHeight * 1.2)));
  const heroScale = Math.max(0.9, 1 - (scrollY / (viewportHeight * 5)));
  const heroY = scrollY * 0.3;

  useEffect(() => {
    const timer = setTimeout(() => setLettersVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showProfileImage) {
      const timer = setTimeout(() => setShowProfileImage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showProfileImage]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const letters = ['S', 'A', 'G', 'E'];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Gradient orbs with parallax */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
        style={{ 
          left: '10%', 
          top: '20%',
          transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`,
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-secondary/10 to-transparent blur-3xl"
        style={{ 
          right: '15%', 
          bottom: '30%',
          transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.12}px)`,
        }}
      />
      <div 
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-accent/15 to-transparent blur-2xl"
        style={{ 
          left: '50%', 
          top: '60%',
          transform: `translate(-50%, ${scrollY * 0.2}px)`,
        }}
      />
      
      {/* Main content with parallax */}
      <div 
        className="text-center relative z-10"
        style={{
          opacity: heroOpacity,
          transform: `translateY(${heroY}px) scale(${heroScale})`,
        }}
      >
        <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-wider mb-8 text-primary flex justify-center perspective-1000">
          {letters.map((letter, index) => (
            <span
              key={letter}
              className={`inline-block transition-all duration-700 ease-out ${
                lettersVisible 
                  ? 'opacity-100 translate-y-0 rotate-0' 
                  : 'opacity-0 translate-y-8 -rotate-12'
              }`}
              style={{ 
                transitionDelay: `${index * 100 + 200}ms`,
                transformStyle: 'preserve-3d'
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <p 
          className={`text-lg sm:text-xl text-muted-foreground mb-8 max-w-md mx-auto cursor-pointer hover:text-primary transition-all duration-300 hover:scale-105 ${
            lettersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
          onClick={() => setShowProfileImage(true)}
        >
          Student Alliance for Growth in Engineering
        </p>
        <button 
          onClick={() => scrollToSection('about')}
          className={`text-primary hover:text-primary-light transition-all duration-300 text-sm tracking-wide group ${
            lettersVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          Learn More ↓
        </button>
      </div>

      {showProfileImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-[fade-out_0.5s_ease-out_2.5s_forwards]">
          <img 
            src={samProfile}
            alt="Sam Martin" 
            className="w-[300px] h-[300px] object-cover rounded-lg shadow-2xl animate-[scale-in_0.3s_ease-out,shrink-away_2s_ease-in_1s_forwards]"
          />
        </div>
      )}
    </section>
  );
};

export default Hero;