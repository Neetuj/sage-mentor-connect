import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DuckAnimation from "./DuckAnimation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDucks, setShowDucks] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (showDucks) {
      const timer = setTimeout(() => setShowDucks(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showDucks]);

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
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/55bfe8cb-0cef-4057-ae60-ce370c18903c.png" 
              alt="SAGE Logo" 
              className="h-10 w-10 cursor-pointer hover:scale-110 transition-transform" 
              onClick={() => setShowProfileImage(true)}
            />
            <div>
              <h1 className="text-xl font-bold text-primary">SAGE</h1>
              <p 
                className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setShowDucks(true)}
              >
                Student Alliance for Growth in Engineering
              </p>
            </div>
          </div>

          {showDucks && <DuckAnimation onComplete={() => setShowDucks(false)} />}
          
          {showProfileImage && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-fade-in">
              <img 
                src="https://media.licdn.com/dms/image/v2/D4E03AQGRb6d8-Sywaw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731896562557?e=1762992000&v=beta&t=rRID3PEuPKoEDPDdo-UZM47xvCTeSwIpenHRVe5Rpzg" 
                alt="Profile" 
                className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl animate-[fade-in_0.5s_ease-out,fade-out_1s_ease-out_2s_forwards]"
              />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('tutors')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Tutors
            </button>
            <button 
              onClick={() => scrollToSection('seminars')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Seminars
            </button>
            <Button variant="default" onClick={() => scrollToSection('get-involved')}>
              Get Involved
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin')}
                  >
                    Admin
                  </Button>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name || user.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('tutors')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Tutors
              </button>
              <button 
                onClick={() => scrollToSection('seminars')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Seminars
              </button>
              <Button 
                variant="default" 
                className="w-full justify-start"
                onClick={() => scrollToSection('get-involved')}
              >
                Get Involved
              </Button>
              
              {user ? (
                <>
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/admin')}
                    >
                      Admin
                    </Button>
                  )}
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{profile?.full_name || user.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;