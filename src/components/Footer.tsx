import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
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
              <img src="/lovable-uploads/55bfe8cb-0cef-4057-ae60-ce370c18903c.png" alt="SAGE Logo" className="h-10 w-10 opacity-70 hover:opacity-90 transition-opacity duration-300" />
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
            <h4 className="font-semibold mb-4">Contact & Social</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>sageoutreach3@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(214)-470-8192</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <a 
                  href="https://www.instagram.com/sage_engineers/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  @sage_engineers
                </a>
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
            <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
              <a 
                href="https://docs.google.com/document/d/1ot5m5bYhCruBP6ldak0XIlKynQit6yTCXqyqqnWwreM/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground transition-colors underline"
              >
                Privacy Policy
              </a>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart 
                  className="h-4 w-4 text-accent fill-current cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => navigate('/admin')}
                />
                <span>by student volunteers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;