import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface PastEventFormProps {
  onSuccess?: () => void;
  editData?: any;
}

const PastEventForm = ({ onSuccess, editData }: PastEventFormProps) => {
  const [formData, setFormData] = useState({
    title: editData?.title || "",
    date: editData?.date || "",
    location: editData?.location || "",
    category: editData?.category || "",
    speaker: editData?.speaker || "",
    summary: editData?.summary || "",
    impact: editData?.impact || "",
    attendees: editData?.attendees || 0,
    event_image_url: editData?.event_image_url || null,
    display_order: editData?.display_order || 0,
    is_visible: editData?.is_visible ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editData) {
        const { error } = await supabase
          .from('past_events')
          .update(formData)
          .eq('id', editData.id);

        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        const { error } = await supabase
          .from('past_events')
          .insert([formData]);

        if (error) throw error;
        toast.success('Event added successfully');
      }

      // Reset form
      setFormData({
        title: "",
        date: "",
        location: "",
        category: "",
        speaker: "",
        summary: "",
        impact: "",
        attendees: 0,
        event_image_url: null,
        display_order: 0,
        is_visible: true,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Robotics">Robotics</SelectItem>
              <SelectItem value="Environmental">Environmental</SelectItem>
              <SelectItem value="CS">Computer Science</SelectItem>
              <SelectItem value="Aerospace">Aerospace</SelectItem>
              <SelectItem value="Biomedical">Biomedical</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="speaker">Speaker (Optional)</Label>
          <Input
            id="speaker"
            value={formData.speaker}
            onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendees">Number of Attendees *</Label>
          <Input
            id="attendees"
            type="number"
            min="0"
            value={formData.attendees}
            onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
          />
        </div>

      </div>

      <ImageUpload
        bucket="event-images"
        value={formData.event_image_url}
        onChange={(url) => setFormData({ ...formData, event_image_url: url })}
        label="Event Image"
      />

      <div className="space-y-2">
        <Label htmlFor="summary">Event Summary * (Max 500 characters)</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          maxLength={500}
          rows={3}
          required
          placeholder="Describe what happened during the event..."
        />
        <p className="text-xs text-muted-foreground">{formData.summary.length}/500 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="impact">Impact Statement * (Max 500 characters)</Label>
        <Textarea
          id="impact"
          value={formData.impact}
          onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
          maxLength={500}
          rows={3}
          required
          placeholder="Describe the impact and outcomes of this event..."
        />
        <p className="text-xs text-muted-foreground">{formData.impact.length}/500 characters</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
        />
        <Label htmlFor="is_visible">Event is visible to public</Label>
      </div>

      <Button type="submit" className="w-full">
        {editData ? 'Update Event' : 'Add Event'}
      </Button>
    </form>
  );
};

export default PastEventForm;