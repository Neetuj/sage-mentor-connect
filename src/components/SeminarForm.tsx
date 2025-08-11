import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Seminar {
  id?: string;
  title: string;
  speaker: string;
  date: string | null;
  time: string;
  location: string;
  category: string;
  audience: string;
  description: string;
  capacity: number;
  registered: number;
  topic_image_url?: string;
  host_image_url?: string;
}

interface SeminarFormProps {
  onSeminarAdded: () => void;
  editingSeminar?: Seminar | null;
  onCancelEdit?: () => void;
}

const SeminarForm = ({ onSeminarAdded, editingSeminar, onCancelEdit }: SeminarFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    audience: "",
    registered: 0,
    capacity: 50,
    topic_image_url: "",
    host_image_url: "",
    is_date_tbd: false,
  });

  // Populate form when editing
  useEffect(() => {
    if (editingSeminar) {
      setFormData({
        title: editingSeminar.title,
        speaker: editingSeminar.speaker,
        description: editingSeminar.description,
        category: editingSeminar.category,
        date: editingSeminar.date || "",
        time: editingSeminar.time,
        location: editingSeminar.location,
        audience: editingSeminar.audience,
        registered: editingSeminar.registered,
        capacity: editingSeminar.capacity,
        topic_image_url: editingSeminar.topic_image_url || "",
        host_image_url: editingSeminar.host_image_url || "",
        is_date_tbd: !editingSeminar.date,
      });
    } else {
      setFormData({
        title: "",
        speaker: "",
        description: "",
        category: "",
        date: "",
        time: "",
        location: "",
        audience: "",
        registered: 0,
        capacity: 50,
        topic_image_url: "",
        host_image_url: "",
        is_date_tbd: false,
      });
    }
  }, [editingSeminar]);

  const categories = [
    "Engineering", "Computer Science", "Mathematics", "Science", 
    "Career Development", "Research", "Innovation", "Technology"
  ];

  const audiences = [
    "High School Students", "College Students", "All Ages", 
    "Parents", "Educators", "Industry Professionals"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        date: formData.is_date_tbd ? null : formData.date,
      };
      delete submitData.is_date_tbd;

      if (editingSeminar) {
        // Update existing seminar
        const { error } = await supabase
          .from('seminars')
          .update(submitData)
          .eq('id', editingSeminar.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Seminar updated successfully!",
        });

        onCancelEdit?.();
      } else {
        // Create new seminar
        const { error } = await supabase
          .from('seminars')
          .insert([submitData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Seminar added successfully!",
        });

        // Reset form
        setFormData({
          title: "",
          speaker: "",
          description: "",
          category: "",
          date: "",
          time: "",
          location: "",
          audience: "",
          registered: 0,
          capacity: 50,
          topic_image_url: "",
          host_image_url: "",
          is_date_tbd: false,
        });
      }
      
      onSeminarAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: editingSeminar ? "Failed to update seminar. Please try again." : "Failed to add seminar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingSeminar ? "Edit Seminar" : "Add New Seminar"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="speaker">Speaker</Label>
              <Input
                id="speaker"
                value={formData.speaker}
                onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={formData.audience} onValueChange={(value) => setFormData({...formData, audience: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="date">Date</Label>
                <input
                  type="checkbox"
                  id="is_date_tbd"
                  checked={formData.is_date_tbd}
                  onChange={(e) => setFormData({...formData, is_date_tbd: e.target.checked, date: e.target.checked ? "" : formData.date})}
                  className="rounded"
                />
                <Label htmlFor="is_date_tbd" className="text-sm">TBD</Label>
              </div>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required={!formData.is_date_tbd}
                disabled={formData.is_date_tbd}
                placeholder={formData.is_date_tbd ? "Date TBD" : ""}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                placeholder="e.g., 2:00 PM - 3:30 PM"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registered">Currently Registered</Label>
              <Input
                id="registered"
                type="number"
                min="0"
                value={formData.registered}
                onChange={(e) => setFormData({...formData, registered: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic_image_url">Topic Image URL (optional)</Label>
              <Input
                id="topic_image_url"
                value={formData.topic_image_url}
                onChange={(e) => setFormData({...formData, topic_image_url: e.target.value})}
                placeholder="https://example.com/topic-image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="host_image_url">Host Image URL (optional)</Label>
              <Input
                id="host_image_url"
                value={formData.host_image_url}
                onChange={(e) => setFormData({...formData, host_image_url: e.target.value})}
                placeholder="https://example.com/host-image.jpg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (editingSeminar ? "Updating..." : "Adding...") : (editingSeminar ? "Update Seminar" : "Add Seminar")}
            </Button>
            {editingSeminar && onCancelEdit && (
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

export default SeminarForm;