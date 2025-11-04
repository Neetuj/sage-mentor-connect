import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StatFormProps {
  onStatAdded?: () => void;
  editingStat?: any;
  onCancelEdit?: () => void;
}

const StatForm = ({ onStatAdded, editingStat, onCancelEdit }: StatFormProps) => {
  const [statValue, setStatValue] = useState("");
  const [statLabel, setStatLabel] = useState("");
  const [iconName, setIconName] = useState("Users");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconOptions = [
    "Users", "GraduationCap", "Award", "TrendingUp", "Heart", 
    "Clock", "MapPin", "Presentation", "BookOpen", "Target"
  ];

  useEffect(() => {
    if (editingStat) {
      setStatValue(editingStat.stat_value || "");
      setStatLabel(editingStat.stat_label || "");
      setIconName(editingStat.icon_name || "Users");
      setDisplayOrder(editingStat.display_order?.toString() || "0");
      setIsVisible(editingStat.is_visible ?? true);
    }
  }, [editingStat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const statData = {
        stat_value: statValue,
        stat_label: statLabel,
        icon_name: iconName,
        display_order: parseInt(displayOrder),
        is_visible: isVisible,
      };

      if (editingStat) {
        const { error } = await supabase
          .from('site_stats')
          .update(statData)
          .eq('id', editingStat.id);

        if (error) throw error;
        toast.success("Statistic updated successfully!");
        onCancelEdit?.();
      } else {
        const { error } = await supabase
          .from('site_stats')
          .insert([statData]);

        if (error) throw error;
        toast.success("Statistic added successfully!");
      }

      // Reset form
      setStatValue("");
      setStatLabel("");
      setIconName("Users");
      setDisplayOrder("0");
      setIsVisible(true);

      onStatAdded?.();
    } catch (error: any) {
      console.error('Error saving statistic:', error);
      toast.error(error.message || "Failed to save statistic");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingStat ? "Edit Statistic" : "Add New Statistic"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stat-value">Value</Label>
              <Input
                id="stat-value"
                value={statValue}
                onChange={(e) => setStatValue(e.target.value)}
                placeholder="e.g., 500+"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stat-label">Label</Label>
              <Input
                id="stat-label"
                value={statLabel}
                onChange={(e) => setStatLabel(e.target.value)}
                placeholder="e.g., Students Impacted"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon-name">Icon</Label>
              <Select value={iconName} onValueChange={setIconName}>
                <SelectTrigger id="icon-name">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-order">Display Order</Label>
              <Input
                id="display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is-visible">Visible</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="is-visible"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                />
                <span className="text-sm text-muted-foreground">
                  {isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (editingStat ? "Update Statistic" : "Add Statistic")}
            </Button>
            {editingStat && onCancelEdit && (
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

export default StatForm;
