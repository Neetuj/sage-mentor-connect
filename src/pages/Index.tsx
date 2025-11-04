import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TutorDirectory from "@/components/TutorDirectory";
import SeminarCalendar from "@/components/SeminarCalendar";
import GetInvolved from "@/components/GetInvolved";
import Footer from "@/components/Footer";
import NotificationPopup from "@/components/NotificationPopup";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

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
    <div className="min-h-screen">
      <Header />
      <NotificationPopup />
      <main>
        <Hero />
        <About />
        <TutorDirectory />
        <SeminarCalendar />
        <GetInvolved />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
