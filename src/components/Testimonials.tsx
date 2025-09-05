import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  content: string;
  rating: number;
}

const Testimonials = () => {
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
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-pulse">Loading testimonials...</div>
          </div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2">
            What Our Community Says
          </h3>
          <p className="text-muted-foreground">
            Hear from students, parents, and educators who have experienced SAGE
          </p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="w-80 h-64 flex-shrink-0 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <blockquote className="text-sm text-foreground leading-relaxed mb-4 flex-1 overflow-hidden">
                    <div className="line-clamp-4 whitespace-normal">
                      "{testimonial.content}"
                    </div>
                  </blockquote>
                  
                  <div className="border-t pt-4 mt-auto">
                    <div className="font-medium text-primary truncate">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
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
      </div>
    </section>
  );
};

export default Testimonials;