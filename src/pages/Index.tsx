import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TutorDirectory from "@/components/TutorDirectory";
import SeminarCalendar from "@/components/SeminarCalendar";
import GetInvolved from "@/components/GetInvolved";
import Footer from "@/components/Footer";
import NotificationPopup from "@/components/NotificationPopup";
import ParallaxShapes from "@/components/ParallaxShapes";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen relative">
      {/* Global parallax floating shapes */}
      <ParallaxShapes />
      
      <Header />
      <NotificationPopup />
      <main className="relative z-10">
        <Hero />
        <About />
        <TutorDirectory />
        <SeminarCalendar />
        
        {/* Past Events CTA Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/past-events')}
            className="gap-2 text-lg px-8 py-6 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <History className="h-5 w-5" />
            View Our Past Events & Impact
          </Button>
        </div>
        
        <GetInvolved />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
