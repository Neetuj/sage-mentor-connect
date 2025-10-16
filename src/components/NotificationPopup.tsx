import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  message: string;
  cta_text: string;
  cta_link: string;
  priority: number;
}

const NotificationPopup = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchActiveNotification();

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchActiveNotification = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching notification:', error);
        }
        return;
      }

      setNotification(data);
    } catch (error) {
      console.error('Error fetching notification:', error);
    }
  };

  const handleCtaClick = () => {
    if (notification) {
      const link = notification.cta_link;
      if (link.startsWith('#')) {
        const element = document.querySelector(link);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (link.startsWith('/')) {
        window.location.href = link;
      } else {
        window.open(link, '_blank');
      }
      setIsVisible(false);
    }
  };

  if (!notification || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] sm:w-auto animate-fade-in">
      <div className="bg-card border border-border rounded-lg shadow-2xl p-5 flex items-start gap-3">
        <div className="flex-1">
          <p className="text-base text-foreground mb-4 leading-relaxed">{notification.message}</p>
          <Button 
            onClick={handleCtaClick}
            className="w-full"
          >
            {notification.cta_text}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-8 w-8 shrink-0 hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationPopup;
