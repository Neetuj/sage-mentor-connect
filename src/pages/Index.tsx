import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MentorDirectory from "@/components/MentorDirectory";
import SeminarCalendar from "@/components/SeminarCalendar";
import GetInvolved from "@/components/GetInvolved";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <MentorDirectory />
        <SeminarCalendar />
        <GetInvolved />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
