import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Tutor {
  id: string;
  name: string;
  school: string;
  specialty: string;
  bio: string;
  skills: string[];
  rating: number;
  students: number;
  availability: boolean;
  profile_image_url?: string;
}

interface TutorManagementProps {
  onTutorDeleted: () => void;
}

const TutorManagement = ({ onTutorDeleted }: TutorManagementProps) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .order('name');

      if (error) throw error;
      setTutors(data || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      toast.error("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const deleteTutor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete tutor "${name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tutors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`Tutor "${name}" deleted successfully`);
      fetchTutors();
      onTutorDeleted();
    } catch (error) {
      console.error('Error deleting tutor:', error);
      toast.error("Failed to delete tutor");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Tutors</CardTitle>
        <p className="text-muted-foreground">
          Manage and delete existing tutors ({tutors.length} total)
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading tutors...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tutors found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell className="font-medium">{tutor.name}</TableCell>
                    <TableCell>{tutor.school}</TableCell>
                    <TableCell>{tutor.specialty}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tutor.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {tutor.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{tutor.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{tutor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{tutor.students}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tutor.availability ? "default" : "secondary"}>
                        {tutor.availability ? "Available" : "Busy"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTutor(tutor.id, tutor.name)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TutorManagement;