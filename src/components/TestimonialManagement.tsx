import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TestimonialManagementProps {
  onTestimonialDeleted?: () => void;
  onEditTestimonial?: (testimonial: any) => void;
}

const TestimonialManagement = ({ onTestimonialDeleted, onEditTestimonial }: TestimonialManagementProps) => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success("Testimonial deleted successfully!");
      onTestimonialDeleted?.();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error("Failed to delete testimonial");
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => 
        prev.map(t => 
          t.id === id ? { ...t, is_visible: !currentVisibility } : t
        )
      );

      toast.success(`Testimonial ${!currentVisibility ? 'shown' : 'hidden'} successfully!`);
    } catch (error) {
      console.error('Error toggling testimonial visibility:', error);
      toast.error("Failed to update testimonial visibility");
    }
  };

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
    return <div className="text-center py-8">Loading testimonials...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Testimonials ({testimonials.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No testimonials yet. Add your first testimonial above.
          </p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <Badge variant={testimonial.is_visible ? "default" : "secondary"}>
                        {testimonial.is_visible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {testimonial.role}
                      {testimonial.organization && ` • ${testimonial.organization}`}
                    </p>
                    <div className="flex items-center mb-2">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-sm">{testimonial.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleVisibility(testimonial.id, testimonial.is_visible)}
                    >
                      {testimonial.is_visible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditTestimonial?.(testimonial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this testimonial from {testimonial.name}? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(testimonial.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialManagement;