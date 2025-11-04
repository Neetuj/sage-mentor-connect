import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Quote, GraduationCap, Award, TrendingUp, Heart, Clock, MapPin, Presentation, BookOpen, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const iconMap: Record<string, any> = {
  Users, GraduationCap, Award, TrendingUp, Heart, Clock, MapPin, Presentation, BookOpen, Target, Star, Quote
};

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
  const [stats, setStats] = useState<any[]>([]);
  const [featuredQuote, setFeaturedQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch testimonials
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

        if (testimonialsError) throw testimonialsError;
        setTestimonials(testimonialsData || []);

        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('site_stats')
          .select('*')
          .eq('is_visible', true)
          .order('display_order', { ascending: true });

        if (statsError) throw statsError;
        setStats(statsData || []);

        // Fetch featured quote
        const { data: quoteData, error: quoteError } = await supabase
          .from('featured_quotes')
          .select('*')
          .eq('is_visible', true)
          .eq('is_featured', true)
          .order('display_order', { ascending: true })
          .limit(1)
          .single();

        if (!quoteError && quoteData) {
          setFeaturedQuote(quoteData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (testimonials.length === 0 && stats.length === 0 && !featuredQuote) {
    return (
      <div className="py-8">
        <p className="text-center text-muted-foreground">No content yet. Check back soon!</p>
      </div>
    );
  }

  // Use featured quote or first testimonial
  const featured = featuredQuote || testimonials[0];
  const secondary = featuredQuote ? testimonials.slice(0, 2) : testimonials.slice(1, 3);
  const scrollable = featuredQuote ? testimonials.slice(2) : testimonials.slice(3);

  return (
    <div className="space-y-4">
      {/* Bento Grid - Stats + Featured */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Dynamic Stat Cards */}
        {stats.slice(0, 2).map((stat, index) => {
          const Icon = iconMap[stat.icon_name] || Users;
          const colors = [
            { bg: "from-secondary/10 to-secondary/5", icon: "bg-secondary/20", text: "text-secondary" },
            { bg: "from-primary/10 to-primary/5", icon: "bg-primary/20", text: "text-primary" },
          ];
          const colorScheme = colors[index] || colors[0];
          
          return (
            <Card key={stat.id} className={`md:col-span-3 shadow-card hover:shadow-card-hover transition-all duration-300 bg-gradient-to-br ${colorScheme.bg}`}>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className={`w-10 h-10 ${colorScheme.icon} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className={`h-5 w-5 ${colorScheme.text}`} />
                </div>
                <div className="text-4xl font-bold text-foreground mb-1">{stat.stat_value}</div>
                <p className="text-xs text-muted-foreground text-center">{stat.stat_label}</p>
              </CardContent>
            </Card>
          );
        })}

        {/* Featured Large Content (Quote or Testimonial) */}
        {featured && (
          <Card className="md:col-span-6 md:row-span-2 shadow-card hover:shadow-card-hover transition-all duration-300 bg-card-gradient">
            <CardContent className="p-6 h-full flex flex-col">
              <Quote className="h-6 w-6 text-primary/40 mb-3" />
              <blockquote className="text-base text-foreground leading-relaxed mb-4 flex-1">
                "{featuredQuote ? featured.quote_text : featured.content}"
              </blockquote>
              {!featuredQuote && (
                <div className="flex items-center mb-4">
                  {renderStars(featured.rating)}
                </div>
              )}
              <div className="border-t pt-3">
                <div className="font-semibold text-primary text-sm">
                  {featuredQuote ? featured.author_name : featured.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {featuredQuote ? featured.author_role : featured.role}
                  {(featuredQuote ? featured.author_organization : featured.organization) && 
                    ` • ${featuredQuote ? featured.author_organization : featured.organization}`}
                </div>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Two Medium Cards */}
        {secondary.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="md:col-span-3 shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <CardContent className="p-4 flex flex-col h-full">
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
          <div className="flex space-x-3 pb-3">
            {scrollable.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="w-64 h-48 flex-shrink-0 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <CardContent className="p-4 h-full flex flex-col">
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
