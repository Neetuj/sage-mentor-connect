import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, User, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

interface Submission {
  id: string;
  created_at: string;
  form_type: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  grade_level?: string;
  interests?: string;
  additional_info?: string;
  parent_email?: string;
}

const SubmissionManagement = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
    
    // Set up real-time subscription for submissions
    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions'
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Submission Deleted",
        description: `Submission from ${name} has been deleted successfully.`,
      });

      // Remove from local state
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const getFormTypeBadge = (formType: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      student: { variant: "default", label: "Student" },
      tutor: { variant: "secondary", label: "Tutor" },
      volunteer: { variant: "outline", label: "Volunteer" },
      seminar: { variant: "destructive", label: "Seminar" }
    };
    
    const config = variants[formType] || { variant: "outline", label: formType };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Form Submissions</h2>
          <p className="text-muted-foreground">Manage all form submissions</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {submissions.length} submissions
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No submissions found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-hero-gradient rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{submission.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getFormTypeBadge(submission.form_type)}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the submission from {submission.name}? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSubmission(submission.id, submission.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span>{submission.email}</span>
                  </div>
                  
                  {(submission.city || submission.state) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Location:</span>
                      <span>{[submission.city, submission.state].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                  
                  {submission.grade_level && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Grade:</span>
                      <span>{submission.grade_level}</span>
                    </div>
                  )}
                  
                  {submission.interests && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Interests:</span>
                      <span>{submission.interests}</span>
                    </div>
                  )}
                  
                  {submission.parent_email && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <span className="text-muted-foreground">Parent Email:</span>
                      <span>{submission.parent_email}</span>
                    </div>
                  )}
                </div>
                
                {submission.additional_info && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Additional Information:</p>
                    <p className="text-sm">{submission.additional_info}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionManagement;