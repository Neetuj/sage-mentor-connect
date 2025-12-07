import { useState, useEffect } from "react";
import samProfile from "@/assets/sam-profile.jpg";

const Hero = () => {
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [lettersVisible, setLettersVisible] = useState(false);

  useEffect(() => {
    // Trigger letter animation after mount
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
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" style={{ animationDuration: '4s' }} />
      
      <div className="text-center relative z-10">
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