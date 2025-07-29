import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">SAGE</h3>
                <p className="text-xs text-primary-foreground/80">Student Alliance for Growth in Engineering</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Connecting young minds with engineering tutors and inspiring the next generation of problem solvers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <button 
                onClick={() => scrollToSection('home')}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('tutors')}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Find Tutors
              </button>
              <button 
                onClick={() => scrollToSection('seminars')}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Seminars
              </button>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>Student Tutoring</p>
              <p>Industry Seminars</p>
              <p>Hands-on Workshops</p>
              <p>Engineering Exposure</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>sageoutreach3@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(214)-470-8192</span>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-4"
              onClick={() => scrollToSection('get-involved')}
            >
              Get Involved
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/80">
              © 2024 SAGE - Student Alliance for Growth in Engineering. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-primary-foreground/80">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-accent fill-current" />
              <span>by student volunteers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;