import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SeminarRegistration from "./SeminarRegistration";

const SeminarCalendar = () => {
  const { toast } = useToast();
  const [isComingSoonHidden, setIsComingSoonHidden] = useState(false);
  const [seminars, setSeminars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeminars();
    
    // Set up real-time subscription for seminars
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seminars'
        },
        () => {
          fetchSeminars(); // Refetch when seminars change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSeminars = async () => {
    try {
      const { data, error } = await supabase
        .from('seminars')
        .select('*')
        .order('date');

      if (error) throw error;
      setSeminars(data || []);
    } catch (error) {
      console.error('Error fetching seminars:', error);
      toast({
        title: "Error",
        description: "Failed to load seminars",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load hidden state from database on component mount
  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'seminar_section_visible')
          .single();

        if (error) throw error;
        
        const isVisible = (data?.setting_value as any)?.visible ?? false;
        setIsComingSoonHidden(isVisible);
      } catch (error) {
        console.error('Error loading site settings:', error);
        // Fallback to localStorage for backward compatibility
        const savedState = localStorage.getItem('seminar-coming-soon-hidden');
        setIsComingSoonHidden(savedState === 'true');
      }
    };

    loadSiteSettings();

    // Set up real-time subscription for site settings
    const settingsChannel = supabase
      .channel('site-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: 'setting_key=eq.seminar_section_visible'
        },
        (payload) => {
          const isVisible = (payload.new as any)?.setting_value?.visible ?? false;
          setIsComingSoonHidden(isVisible);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Robotics": "bg-primary/20 text-primary",
      "Environmental": "bg-secondary/20 text-secondary",
      "Computer Science": "bg-accent/20 text-accent",
      "Aerospace": "bg-primary/20 text-primary",
      "Biomedical": "bg-secondary/20 text-secondary",
      "Technology": "bg-accent/20 text-accent"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const handleRegister = (seminarTitle: string, registered: number, capacity: number) => {
    if (registered >= capacity) {
      toast({
        title: "Seminar Full",
        description: `${seminarTitle} is currently at capacity. You've been added to the waitlist.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful!",
        description: `You've been registered for "${seminarTitle}". Check your email for details.`,
      });
    }
  };

  
  const getRegistrationStatus = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return { status: "Almost Full", color: "destructive" };
    if (percentage >= 70) return { status: "Filling Up", color: "secondary" };
    return { status: "Available", color: "default" };
  };

  return (
    <section id="seminars" className="py-20 bg-muted/30 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Upcoming Events</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Engineering Seminars & Workshops
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join industry experts and academic leaders for inspiring talks and hands-on workshops 
            designed to spark your engineering curiosity.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading seminars...</p>
          </div>
        ) : (
          <div className={`grid ${seminars.length === 1 ? 'max-w-2xl mx-auto' : 'lg:grid-cols-2'} gap-6 ${isComingSoonHidden ? '' : 'blur-sm'}`}>
            {seminars.map((seminar) => {
              const regStatus = getRegistrationStatus(seminar.registered, seminar.capacity);
              
              return (
                 <Card key={seminar.id} data-seminar={seminar.title} className="shadow-card hover:shadow-card-hover transition-all duration-300">
                   <CardHeader className="pb-4">
                     <div className="flex items-start justify-between mb-2">
                       <Badge className={getCategoryColor(seminar.category)}>
                         {seminar.category}
                       </Badge>
                       <Badge variant={regStatus.color as any}>
                         {regStatus.status}
                       </Badge>
                     </div>
                     
                     {/* Topic and Host Images */}
                     <div className="flex gap-4 mb-4">
                       {seminar.topic_image_url && (
                         <div className="flex-1">
                           <img 
                             src={seminar.topic_image_url} 
                             alt={`${seminar.title} topic`}
                             className="w-full h-32 object-cover rounded-md"
                             onError={(e) => {
                               e.currentTarget.style.display = 'none';
                             }}
                           />
                         </div>
                       )}
                       {seminar.host_image_url && (
                         <div className="w-20">
                           <img 
                             src={seminar.host_image_url} 
                             alt={`${seminar.speaker} profile`}
                             className="w-20 h-20 object-cover rounded-full"
                             onError={(e) => {
                               e.currentTarget.style.display = 'none';
                             }}
                           />
                         </div>
                       )}
                     </div>
                     
                     <CardTitle className="text-xl text-primary mb-2">
                       {seminar.title}
                     </CardTitle>
                     <div className="text-sm text-muted-foreground">
                       <p className="font-medium">{seminar.speaker}</p>
                     </div>
                   </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {seminar.description}
                    </p>

                     <div className="space-y-3 mb-6">
                       <div className="flex items-center gap-2 text-sm">
                         <Calendar className="h-4 w-4 text-primary" />
                         <span>{seminar.date ? new Date(seminar.date).toLocaleDateString() : "Date TBD"}</span>
                       </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{seminar.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{seminar.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{seminar.audience} • {seminar.registered}/{seminar.capacity} registered</span>
                      </div>
                    </div>

                    <SeminarRegistration 
                      seminarTitle={seminar.title} 
                      seminarId={seminar.id}
                      registrationType={seminar.registration_type || "website"}
                      googleFormUrl={seminar.google_form_url}
                    >
                      <Button 
                        className="w-full" 
                        variant="default"
                      >
                        Register Now
                      </Button>
                    </SeminarRegistration>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && seminars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No seminars scheduled at the moment.
            </p>
          </div>
        )}

      </div>

      {/* Coming Soon Overlay - only show if not hidden */}
      {!isComingSoonHidden && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h3 className="text-4xl sm:text-5xl font-bold text-primary animate-pulse">
              COMING SOON
            </h3>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              We're preparing amazing seminars and workshops for you. Stay tuned!
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SeminarCalendar;
