import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleItemFormProps {
  seminarId: string;
  editingItem?: any;
  onSaved: () => void;
  onCancel?: () => void;
}

const ScheduleItemForm = ({ seminarId, editingItem, onSaved, onCancel }: ScheduleItemFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    time_slot: "",
    event_title: "",
    event_description: "",
    speaker: "",
    display_order: 0,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        time_slot: editingItem.time_slot || "",
        event_title: editingItem.event_title || "",
        event_description: editingItem.event_description || "",
        speaker: editingItem.speaker || "",
        display_order: editingItem.display_order || 0,
      });
    } else {
      setFormData({ time_slot: "", event_title: "", event_description: "", speaker: "", display_order: 0 });
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time_slot || !formData.event_title) {
      toast({ title: "Error", description: "Time slot and event title are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        seminar_id: seminarId,
        time_slot: formData.time_slot,
        event_title: formData.event_title,
        event_description: formData.event_description || null,
        speaker: formData.speaker || null,
        display_order: formData.display_order,
      };

      if (editingItem) {
        const { error } = await supabase.from("seminar_schedule_items").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Schedule item updated." });
      } else {
        const { error } = await supabase.from("seminar_schedule_items").insert(payload);
        if (error) throw error;
        toast({ title: "Added", description: "Schedule item added." });
      }
      onSaved();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-card">
      <h3 className="font-semibold text-primary">{editingItem ? "Edit Schedule Item" : "Add Schedule Item"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="time_slot">Time Slot</Label>
          <Input id="time_slot" placeholder="e.g. 9:00 AM - 9:30 AM" value={formData.time_slot} onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="event_title">Event Title</Label>
          <Input id="event_title" placeholder="e.g. Opening Keynote" value={formData.event_title} onChange={(e) => setFormData({ ...formData, event_title: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="speaker">Speaker (optional)</Label>
          <Input id="speaker" placeholder="Speaker name" value={formData.speaker} onChange={(e) => setFormData({ ...formData, speaker: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div>
        <Label htmlFor="event_description">Description (optional)</Label>
        <Textarea id="event_description" placeholder="Brief description..." value={formData.event_description} onChange={(e) => setFormData({ ...formData, event_description: e.target.value })} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : editingItem ? "Update" : "Add Item"}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
};

export default ScheduleItemForm;
