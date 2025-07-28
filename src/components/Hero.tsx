const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black text-primary tracking-wider mb-8">
          SAGE
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