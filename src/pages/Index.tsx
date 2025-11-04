import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TutorDirectory from "@/components/TutorDirectory";
import SeminarCalendar from "@/components/SeminarCalendar";
import GetInvolved from "@/components/GetInvolved";
import Footer from "@/components/Footer";
import NotificationPopup from "@/components/NotificationPopup";
import { TeamMapEmbed } from "@/components/TeamMapEmbed";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <NotificationPopup />
      <main>
        {/* Team Map under header */}
        <TeamMapEmbed />
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
