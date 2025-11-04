import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import TutorAdminForm from "@/components/TutorAdminForm";
import SeminarForm from "@/components/SeminarForm";
import TutorManagement from "@/components/TutorManagement";
import SeminarManagement from "@/components/SeminarManagement";
import SubmissionManagement from "@/components/SubmissionManagement";
import TestimonialForm from "@/components/TestimonialForm";
import TestimonialManagement from "@/components/TestimonialManagement";
import NotificationForm from "@/components/NotificationForm";
import NotificationManagement from "@/components/NotificationManagement";
import TeamMemberForm from "@/components/TeamMemberForm";
import TeamMemberManagement from "@/components/TeamMemberManagement";

const Admin = () => {
  logger.log('Admin component rendering');
  const [isComingSoonHidden, setIsComingSoonHidden] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingSeminar, setEditingSeminar] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingNotification, setEditingNotification] = useState(null);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const navigate = useNavigate();

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Load coming soon state from database
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
        // Fallback to localStorage for backward compatibility
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-primary">SAGE Admin Dashboard</h1>
        </div>

        {/* Site Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Site Controls</CardTitle>
            <p className="text-muted-foreground">
              Manage website visibility and features
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Seminar Section</h3>
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

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="submissions">Form Submissions</TabsTrigger>
            <TabsTrigger value="tutors">Manage Tutors</TabsTrigger>
            <TabsTrigger value="seminars">Manage Seminars</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="team">Team Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            <SubmissionManagement />
          </TabsContent>
          
          <TabsContent value="tutors">
            <div className="space-y-6">
              <TutorAdminForm onTutorAdded={refreshData} />
              <TutorManagement onTutorDeleted={refreshData} />
            </div>
          </TabsContent>
          
          <TabsContent value="seminars">
            <div className="space-y-6">
              <SeminarForm 
                onSeminarAdded={refreshData} 
                editingSeminar={editingSeminar}
                onCancelEdit={() => setEditingSeminar(null)}
              />
              <SeminarManagement 
                onSeminarDeleted={refreshData} 
                onEditSeminar={setEditingSeminar}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="testimonials">
            <div className="space-y-6">
              <TestimonialForm 
                onTestimonialAdded={refreshData} 
                editingTestimonial={editingTestimonial}
                onCancelEdit={() => setEditingTestimonial(null)}
              />
              <TestimonialManagement 
                onTestimonialDeleted={refreshData} 
                onEditTestimonial={setEditingTestimonial}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="space-y-6">
              <NotificationForm 
                onNotificationAdded={refreshData} 
                editingNotification={editingNotification}
                onCancelEdit={() => setEditingNotification(null)}
              />
              <NotificationManagement 
                onNotificationDeleted={refreshData} 
                onEditNotification={setEditingNotification}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="team">
            <div className="space-y-6">
              <TeamMemberForm 
                onMemberAdded={refreshData} 
                editingMember={editingTeamMember}
                onCancelEdit={() => setEditingTeamMember(null)}
              />
              <TeamMemberManagement 
                onMemberDeleted={refreshData} 
                onEditMember={setEditingTeamMember}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;