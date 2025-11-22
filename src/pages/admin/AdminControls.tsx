import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export default function AdminControls() {
  const [isComingSoonHidden, setIsComingSoonHidden] = useState(false);

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'seminar_section_visible')
          .single();

        if (error) throw error;
        
        const isVisible = (data?.setting_value as any)?.visible ?? false;
        setIsComingSoonHidden(isVisible);
      } catch (error) {
        logger.error('Error loading site settings:', error);
        const savedState = localStorage.getItem('seminar-coming-soon-hidden');
        setIsComingSoonHidden(savedState === 'true');
      }
    };

    loadSiteSettings();
  }, []);

  const toggleComingSoon = async () => {
    const newState = !isComingSoonHidden;
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          setting_value: { visible: newState },
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'seminar_section_visible');

      if (error) throw error;

      setIsComingSoonHidden(newState);
      
      toast.success(newState ? "Seminar section is now visible to all users" : "Seminar section is now hidden for all users");
    } catch (error) {
      logger.error('Error updating site settings:', error);
      toast.error("Failed to update site settings");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Site Controls</h2>
        <p className="text-muted-foreground">Manage website visibility and features.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seminar Section Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">Seminar Section</h3>
              <p className="text-sm text-muted-foreground">
                {isComingSoonHidden ? "Currently visible to users" : "Currently showing 'Coming Soon' overlay"}
              </p>
            </div>
            <Button 
              variant={isComingSoonHidden ? "default" : "outline"}
              size="sm"
              onClick={toggleComingSoon}
              className="flex items-center gap-2"
            >
              {isComingSoonHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isComingSoonHidden ? "Hide Section" : "Show Section"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
