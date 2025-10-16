import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  message: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  priority: number;
}

interface NotificationFormProps {
  onNotificationAdded: () => void;
  editingNotification?: Notification | null;
  onCancelEdit: () => void;
}

const NotificationForm = ({ onNotificationAdded, editingNotification, onCancelEdit }: NotificationFormProps) => {
  const [message, setMessage] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingNotification) {
      setMessage(editingNotification.message);
      setCtaText(editingNotification.cta_text);
      setCtaLink(editingNotification.cta_link);
      setIsActive(editingNotification.is_active);
      setPriority(editingNotification.priority);
    }
  }, [editingNotification]);

  const resetForm = () => {
    setMessage("");
    setCtaText("");
    setCtaLink("");
    setIsActive(true);
    setPriority(0);
    onCancelEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingNotification) {
        const { error } = await supabase
          .from('notifications')
          .update({
            message,
            cta_text: ctaText,
            cta_link: ctaLink,
            is_active: isActive,
            priority,
          })
          .eq('id', editingNotification.id);

        if (error) throw error;
        toast.success("Notification updated successfully!");
      } else {
        const { error } = await supabase
          .from('notifications')
          .insert({
            message,
            cta_text: ctaText,
            cta_link: ctaLink,
            is_active: isActive,
            priority,
          });

        if (error) throw error;
        toast.success("Notification created successfully!");
      }

      resetForm();
      onNotificationAdded();
    } catch (error) {
      console.error('Error saving notification:', error);
      toast.error("Failed to save notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingNotification ? 'Edit Notification' : 'Add New Notification'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sign up for our next seminar!"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaText">Button Text</Label>
            <Input
              id="ctaText"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Register Now"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaLink">Button Link</Label>
            <Input
              id="ctaLink"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="#seminar-calendar"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority (higher = shown first)</Label>
            <Input
              id="priority"
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              min={0}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingNotification ? 'Update Notification' : 'Add Notification'}
            </Button>
            {editingNotification && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationForm;
