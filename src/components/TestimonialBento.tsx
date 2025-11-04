import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  content: string;
  rating: number;
}

const TestimonialBento = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "0.0";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse">Loading testimonials...</div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="py-8">
        <p className="text-center text-muted-foreground">No testimonials yet. Check back soon!</p>
      </div>
    );
  }

  // Split testimonials for layout
  const featured = testimonials[0];
  const secondary = testimonials.slice(1, 3);
  const scrollable = testimonials.slice(3);

  return (
    <div className="space-y-6">
      {/* Bento Grid - Stats + Featured */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Stat Card 1 - Average Rating */}
        <Card className="md:col-span-3 shadow-card hover:shadow-card-hover transition-all duration-300 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
            </div>
            <div className="text-5xl font-bold text-foreground mb-2">{averageRating}</div>
            <div className="flex gap-1 mb-2">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
            <p className="text-sm text-muted-foreground text-center">Average Rating</p>
          </CardContent>
        </Card>

        {/* Featured Large Testimonial */}
        <Card className="md:col-span-6 md:row-span-2 shadow-card hover:shadow-card-hover transition-all duration-300 bg-card-gradient">
          <CardContent className="p-8 h-full flex flex-col">
            <Quote className="h-8 w-8 text-primary/40 mb-4" />
            <blockquote className="text-lg text-foreground leading-relaxed mb-6 flex-1">
              "{featured.content}"
            </blockquote>
            <div className="flex items-center mb-4">
              {renderStars(featured.rating)}
            </div>
            <div className="border-t pt-4">
              <div className="font-semibold text-primary">{featured.name}</div>
              <div className="text-sm text-muted-foreground">
                {featured.role}
                {featured.organization && ` • ${featured.organization}`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat Card 2 - Total Testimonials */}
        <Card className="md:col-span-3 shadow-card hover:shadow-card-hover transition-all duration-300 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-5xl font-bold text-foreground mb-2">{testimonials.length}</div>
            <p className="text-sm text-muted-foreground text-center">Community Members</p>
          </CardContent>
        </Card>

        {/* Two Medium Cards */}
        {secondary.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="md:col-span-3 shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <blockquote className="text-sm text-foreground leading-relaxed mb-4 flex-1 line-clamp-4">
                "{testimonial.content}"
              </blockquote>
              <div className="border-t pt-3 mt-auto">
                <div className="font-medium text-primary text-sm truncate">
                  {testimonial.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {testimonial.role}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scrollable Testimonials Row */}
      {scrollable.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {scrollable.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="w-72 h-56 flex-shrink-0 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  <blockquote className="text-sm text-foreground leading-relaxed mb-4 flex-1 overflow-hidden">
                    <div className="line-clamp-3 whitespace-normal">
                      "{testimonial.content}"
                    </div>
                  </blockquote>
                  <div className="border-t pt-3 mt-auto">
                    <div className="font-medium text-primary text-sm truncate">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {testimonial.role}
                      {testimonial.organization && ` • ${testimonial.organization}`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

export default TestimonialBento;
