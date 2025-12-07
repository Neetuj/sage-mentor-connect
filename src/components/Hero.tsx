import { useState, useEffect } from "react";
import samProfile from "@/assets/sam-profile.jpg";

const Hero = () => {
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple fade in on mount
    const timer = setTimeout(() => setIsVisible(true), 50);
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

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />
      
      {/* Main content */}
      <div 
        className={`text-center relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-wider mb-8 text-primary">
          SAGE
        </h1>
        <p 
          className={`text-lg sm:text-xl text-muted-foreground mb-8 max-w-md mx-auto cursor-pointer hover:text-primary transition-colors duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
          onClick={() => setShowProfileImage(true)}
        >
          Student Alliance for Growth in Engineering
        </p>
        <button 
          onClick={() => scrollToSection('about')}
          className={`text-primary hover:text-primary-light transition-colors duration-300 text-sm tracking-wide ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '400ms' }}
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