import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TestimonialFormProps {
  onTestimonialAdded?: () => void;
  editingTestimonial?: any;
  onCancelEdit?: () => void;
}

const TestimonialForm = ({ onTestimonialAdded, editingTestimonial, onCancelEdit }: TestimonialFormProps) => {
  const [formData, setFormData] = useState({
    name: editingTestimonial?.name || "",
    role: editingTestimonial?.role || "",
    organization: editingTestimonial?.organization || "",
    content: editingTestimonial?.content || "",
    rating: editingTestimonial?.rating || 5,
    is_visible: editingTestimonial?.is_visible ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: formData.name,
            role: formData.role,
            organization: formData.organization || null,
            content: formData.content,
            rating: formData.rating,
            is_visible: formData.is_visible,
          })
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        toast.success("Testimonial updated successfully!");
        onCancelEdit?.();
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({
            name: formData.name,
            role: formData.role,
            organization: formData.organization || null,
            content: formData.content,
            rating: formData.rating,
            is_visible: formData.is_visible,
          });

        if (error) throw error;
        toast.success("Testimonial added successfully!");
        
        // Reset form
        setFormData({
          name: "",
          role: "",
          organization: "",
          content: "",
          rating: 5,
          is_visible: true,
        });
      }

      onTestimonialAdded?.();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error("Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Parent, Student, Teacher"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="School, company, or organization (optional)"
            />
          </div>

          <div>
            <Label htmlFor="content">Testimonial Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the testimonial content..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.content.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Select 
                value={formData.rating.toString()} 
                onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="visible">Visible</Label>
              <Switch
                id="visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingTestimonial ? "Update" : "Add"} Testimonial
            </Button>
            {editingTestimonial && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;