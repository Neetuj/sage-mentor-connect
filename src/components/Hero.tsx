import { useState, useEffect } from "react";

const Hero = () => {
  const [showProfileImage, setShowProfileImage] = useState(false);

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
    <section id="home" className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-wider mb-8 text-primary">
          SAGE
        </h1>
        <p 
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md mx-auto cursor-pointer hover:text-primary transition-colors"
          onClick={() => setShowProfileImage(true)}
        >
          Student Alliance for Growth in Engineering
        </p>
        <button 
          onClick={() => scrollToSection('about')}
          className="text-primary hover:text-primary-light transition-colors text-sm tracking-wide"
        >
          Learn More ↓
        </button>
      </div>

      {showProfileImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-[fade-out_0.5s_ease-out_2.5s_forwards]">
          <img 
            src="https://media.licdn.com/dms/image/v2/D4E03AQGRb6d8-Sywaw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731896562557?e=1762992000&v=beta&t=rRID3PEuPKoEDPDdo-UZM47xvCTeSwIpenHRVe5Rpzg" 
            alt="Profile" 
            className="w-[300px] h-[300px] object-contain rounded-lg shadow-2xl animate-[scale-in_0.3s_ease-out,shrink-away_2s_ease-in_1s_forwards]"
          />
        </div>
      )}
    </section>
  );
};

export default Hero;