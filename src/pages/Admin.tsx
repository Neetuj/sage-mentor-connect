import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TutorForm from "@/components/TutorForm";
import SeminarForm from "@/components/SeminarForm";
import TutorManagement from "@/components/TutorManagement";
import SeminarManagement from "@/components/SeminarManagement";

interface Submission {
  id: string;
  form_type: string;
  name: string;
  email: string;
  school: string | null;
  grade_level: string | null;
  interests: string | null;
  additional_info: string;
  parent_email: string | null;
  created_at: string;
}

const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComingSoonHidden, setIsComingSoonHidden] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
        console.error('Error loading site settings:', error);
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
      
      // Dispatch global event to update all components
      window.dispatchEvent(new CustomEvent('siteSettingsChanged', { 
        detail: { key: 'seminar_section_visible', visible: newState }
      }));
      
      toast.success(newState ? "Seminar section is now visible to all users" : "Seminar section is now hidden for all users");
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error("Failed to update site settings");
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      'Date',
      'Type',
      'Name',
      'Email',
      'School',
      'Grade',
      'Interests',
      'Additional Info',
      'Parent Email'
    ];

    const csvContent = [
      headers.join(','),
      ...submissions.map(sub => [
        new Date(sub.created_at).toLocaleDateString(),
        sub.form_type,
        sub.name,
        sub.email,
        sub.school || '',
        sub.grade_level || '',
        sub.interests || '',
        `"${sub.additional_info.replace(/"/g, '""')}"`,
        sub.parent_email || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sage-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Submissions exported to CSV");
  };

  const getFormTypeBadge = (type: string) => {
    const variants = {
      student: "default",
      tutor: "secondary", 
      volunteer: "outline"
    } as const;
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || "default"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submissions">Form Submissions</TabsTrigger>
            <TabsTrigger value="tutors">Manage Tutors</TabsTrigger>
            <TabsTrigger value="seminars">Manage Seminars</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Form Submissions</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Total submissions: {submissions.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchSubmissions}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={exportToCSV}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading submissions...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No submissions yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Interests</TableHead>
                          <TableHead>Parent Email</TableHead>
                          <TableHead>Additional Info</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-mono text-sm">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {getFormTypeBadge(submission.form_type)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {submission.name}
                            </TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{submission.school || '-'}</TableCell>
                            <TableCell>{submission.grade_level || '-'}</TableCell>
                            <TableCell>{submission.interests || '-'}</TableCell>
                            <TableCell>{submission.parent_email || '-'}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={submission.additional_info}>
                                {submission.additional_info}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tutors">
            <div className="space-y-6">
              <TutorForm onTutorAdded={refreshData} />
              <TutorManagement onTutorDeleted={refreshData} />
            </div>
          </TabsContent>
          
          <TabsContent value="seminars">
            <div className="space-y-6">
              <SeminarForm onSeminarAdded={refreshData} />
              <SeminarManagement onSeminarDeleted={refreshData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;