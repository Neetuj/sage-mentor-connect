import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log 404 without exposing sensitive path information
    console.warn("404 Error: Invalid route accessed");
    
    // Optional: Send to analytics/monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Analytics tracking would go here
      // analytics.track('404_error', { referrer: document.referrer });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary-light h-10 px-4 py-2"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
