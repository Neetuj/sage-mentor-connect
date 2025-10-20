import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Calendar, Clock, MapPin, Users, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Seminar {
  id: string;
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
  registration_type: string;
  google_form_url?: string;
}

interface SeminarManagementProps {
  onSeminarDeleted: () => void;
  onEditSeminar: (seminar: Seminar) => void;
}

const SeminarManagement = ({ onSeminarDeleted, onEditSeminar }: SeminarManagementProps) => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSeminars = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seminars')
        .select('*')
        .order('date');

      if (error) throw error;
      setSeminars(data || []);
    } catch (error) {
      console.error('Error fetching seminars:', error);
      toast.error("Failed to load seminars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeminars();
  }, []);

  const deleteSeminar = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete seminar "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('seminars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`Seminar "${title}" deleted successfully`);
      fetchSeminars();
      onSeminarDeleted();
    } catch (error) {
      console.error('Error deleting seminar:', error);
      toast.error("Failed to delete seminar");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Robotics": "default",
      "Environmental": "secondary",
      "Computer Science": "outline",
      "Aerospace": "default",
      "Biomedical": "secondary",
      "Technology": "outline"
    };
    return colors[category as keyof typeof colors] || "outline";
  };

  const getRegistrationStatus = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return { status: "Almost Full", variant: "destructive" };
    if (percentage >= 70) return { status: "Filling Up", variant: "secondary" };
    return { status: "Available", variant: "default" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Seminars</CardTitle>
        <p className="text-muted-foreground">
          Manage and delete existing seminars ({seminars.length} total)
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading seminars...</p>
          </div>
        ) : seminars.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No seminars found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Speaker</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Registration Type</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seminars.map((seminar) => {
                  const regStatus = getRegistrationStatus(seminar.registered, seminar.capacity);
                  
                  return (
                    <TableRow key={seminar.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{seminar.title}</p>
                          <p className="text-sm text-muted-foreground">{seminar.audience}</p>
                        </div>
                      </TableCell>
                      <TableCell>{seminar.speaker}</TableCell>
                       <TableCell>
                         <div className="space-y-1">
                           <div className="flex items-center gap-1 text-sm">
                             <Calendar className="h-3 w-3" />
                             {seminar.date ? new Date(seminar.date + 'T00:00:00').toLocaleDateString() : "TBD"}
                           </div>
                           <div className="flex items-center gap-1 text-sm text-muted-foreground">
                             <Clock className="h-3 w-3" />
                             {seminar.time}
                           </div>
                         </div>
                       </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {seminar.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCategoryColor(seminar.category) as any}>
                          {seminar.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={seminar.registration_type === 'google_form' ? 'secondary' : 'default'}>
                            {seminar.registration_type === 'google_form' ? 'Google Form' : 'Website Form'}
                          </Badge>
                          {seminar.registration_type === 'google_form' && seminar.google_form_url && (
                            <a 
                              href={seminar.google_form_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline block truncate max-w-[150px]"
                            >
                              View Form
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-3 w-3" />
                            {seminar.registered}/{seminar.capacity}
                          </div>
                          <Badge variant={regStatus.variant as any} className="text-xs">
                            {regStatus.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditSeminar(seminar)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteSeminar(seminar.id, seminar.title)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeminarManagement;