import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, Lightbulb } from "lucide-react";
import heroImage from "@/assets/sage-hero.jpg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Students collaborating on engineering projects" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient/90"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Connecting Young Engineers with 
            <span className="text-accent-light"> Inspiring Mentors</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            SAGE empowers elementary and middle school students to explore engineering 
            through mentorship with passionate high school students and industry leaders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => scrollToSection('mentors')}
              className="text-lg px-8 py-3"
            >
              Find a Mentor
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('seminars')}
              className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              View Seminars
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Users className="h-8 w-8 text-accent-light mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-foreground">150+</div>
              <div className="text-primary-foreground/80">Student Mentors</div>
            </div>
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Calendar className="h-8 w-8 text-accent-light mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-foreground">24</div>
              <div className="text-primary-foreground/80">Monthly Seminars</div>
            </div>
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Lightbulb className="h-8 w-8 text-accent-light mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-foreground">500+</div>
              <div className="text-primary-foreground/80">Young Engineers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;