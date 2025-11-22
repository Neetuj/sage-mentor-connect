import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";

interface PastEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  summary: string;
  impact: string;
  attendees: number;
  speaker: string | null;
  event_image_url: string | null;
}

const PastEvents = () => {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('past_events')
        .select('*')
        .eq('is_visible', true)
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching past events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Past Events
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating our journey of impact and growth in the engineering community
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No past events to display yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {event.event_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.event_image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    {event.speaker && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>Speaker: {event.speaker}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} Attendees</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Event Summary</h4>
                    <p className="text-sm text-muted-foreground">{event.summary}</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <h4 className="font-semibold text-accent">Impact</h4>
                    </div>
                    <p className="text-sm">{event.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PastEvents;