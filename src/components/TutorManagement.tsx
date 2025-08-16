import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Star, Users, Edit, X } from "lucide-react";
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
  timezone?: string;
}

interface TutorManagementProps {
  onTutorDeleted: () => void;
}

const TutorManagement = ({ onTutorDeleted }: TutorManagementProps) => {
  console.log('TutorManagement component rendering');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .order('name');

      if (error) throw error;
      // Filter out any tutors with empty names or specialties to prevent SelectItem errors
      const validTutors = (data || []).filter(tutor => 
        tutor.name && tutor.name.trim() !== '' && 
        tutor.specialty && tutor.specialty.trim() !== ''
      );
      setTutors(validTutors);
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

  const specialties = [
    "Mathematics", "Science", "English", "History", "Computer Science", 
    "Foreign Languages", "Art", "Music", "Test Prep", "College Counseling"
  ];

  const timezones = [
    "EST - New York", "EST - Florida", "EST - Georgia", "EST - North Carolina", "EST - Virginia",
    "CST - Texas", "CST - Illinois", "CST - Missouri", "CST - Louisiana", "CST - Minnesota",
    "MST - Colorado", "MST - Arizona", "MST - New Mexico", "MST - Utah", "MST - Montana",
    "PST - California", "PST - Washington", "PST - Oregon", "PST - Nevada",
    "AKST - Alaska", "HST - Hawaii"
  ];

  const startEdit = (tutor: Tutor) => {
    console.log('Starting edit for tutor:', tutor);
    setEditingTutor(tutor);
    setEditForm({
      name: tutor.name || "",
      school: tutor.school || "",
      specialty: tutor.specialty || "Mathematics", // Ensure non-empty default
      bio: tutor.bio || "",
      rating: tutor.rating || 5.0,
      students: tutor.students || 0,
      availability: tutor.availability !== false,
      profile_image_url: tutor.profile_image_url || "",
      timezone: tutor.timezone || "",
    });
    setEditSkills([...(tutor.skills || [])]);
  };

  const addEditSkill = () => {
    if (newSkill.trim() && !editSkills.includes(newSkill.trim())) {
      setEditSkills([...editSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeEditSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter(skill => skill !== skillToRemove));
  };

  const saveEdit = async () => {
    if (!editingTutor) return;
    
    setEditLoading(true);
    try {
      const { error } = await supabase
        .from('tutors')
        .update({
          ...editForm,
          skills: editSkills
        })
        .eq('id', editingTutor.id);

      if (error) throw error;

      toast.success("Tutor updated successfully");
      setEditingTutor(null);
      fetchTutors();
      onTutorDeleted(); // Refresh parent data
    } catch (error) {
      console.error('Error updating tutor:', error);
      toast.error("Failed to update tutor");
    } finally {
      setEditLoading(false);
    }
  };

  const deleteTutor = async (id: string, name: string) => {
    setDeleteLoading(id);
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
    } finally {
      setDeleteLoading(null);
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
                  <TableHead>Timezone</TableHead>
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
                    <TableCell>{tutor.timezone || "N/A"}</TableCell>
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
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(tutor)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Tutor: {tutor.name}</DialogTitle>
                            </DialogHeader>
                            {editingTutor && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editForm.name}
                                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-school">School</Label>
                                    <Input
                                      id="edit-school"
                                      value={editForm.school}
                                      onChange={(e) => setEditForm({...editForm, school: e.target.value})}
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-specialty">Specialty</Label>
                                    <Select value={editForm.specialty} onValueChange={(value) => setEditForm({...editForm, specialty: value})}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {specialties.map((specialty) => (
                                          <SelectItem key={specialty} value={specialty}>
                                            {specialty}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                          <div>
                            <Label htmlFor="edit-timezone">Location/Timezone</Label>
                            <Input
                              id="edit-timezone"
                              value={editForm.timezone}
                              onChange={(e) => setEditForm({...editForm, timezone: e.target.value})}
                              placeholder="e.g., EST - New York"
                            />
                          </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label htmlFor="edit-rating">Rating</Label>
                                    <Input
                                      id="edit-rating"
                                      type="number"
                                      min="1"
                                      max="5"
                                      step="0.1"
                                      value={editForm.rating}
                                      onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value)})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-students">Students</Label>
                                    <Input
                                      id="edit-students"
                                      type="number"
                                      min="0"
                                      value={editForm.students}
                                      onChange={(e) => setEditForm({...editForm, students: parseInt(e.target.value)})}
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor="edit-availability">Available</Label>
                                    <Switch
                                      id="edit-availability"
                                      checked={editForm.availability}
                                      onCheckedChange={(checked) => setEditForm({...editForm, availability: checked})}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="edit-image">Profile Image URL</Label>
                                  <Input
                                    id="edit-image"
                                    value={editForm.profile_image_url}
                                    onChange={(e) => setEditForm({...editForm, profile_image_url: e.target.value})}
                                    placeholder="https://..."
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="edit-bio">Bio</Label>
                                  <Textarea
                                    id="edit-bio"
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                  />
                                </div>

                                <div>
                                  <Label>Skills</Label>
                                  <div className="flex gap-2 mb-2">
                                    <Input
                                      value={newSkill}
                                      onChange={(e) => setNewSkill(e.target.value)}
                                      placeholder="Add a skill"
                                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditSkill())}
                                    />
                                    <Button type="button" onClick={addEditSkill}>Add</Button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {editSkills.map((skill) => (
                                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                        {skill}
                                        <X 
                                          className="h-3 w-3 cursor-pointer" 
                                          onClick={() => removeEditSkill(skill)}
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditingTutor(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={saveEdit} disabled={editLoading}>
                                    {editLoading ? "Saving..." : "Save Changes"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Tutor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete tutor "{tutor.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTutor(tutor.id, tutor.name)}
                                disabled={deleteLoading === tutor.id}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleteLoading === tutor.id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
  );
};

export default TutorManagement;