import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TutorForm = ({ onTutorAdded }: { onTutorAdded: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    specialty: "",
    rating: 5.0,
    students: 0,
    bio: "",
    availability: true,
    profile_image_url: "",
        timezone: "",
  });

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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('tutors')
        .insert([{
          ...formData,
          skills
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tutor added successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        school: "",
        specialty: "",
        rating: 5.0,
        students: 0,
        bio: "",
        availability: true,
        profile_image_url: "",
        timezone: "",
      });
      setSkills([]);
      onTutorAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tutor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Tutor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
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
              <Label htmlFor="timezone">Location/Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                placeholder="e.g., EST - New York"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="students">Students Taught</Label>
              <Input
                id="students"
                type="number"
                min="0"
                value={formData.students}
                onChange={(e) => setFormData({...formData, students: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="availability">Available</Label>
              <Switch
                id="availability"
                checked={formData.availability}
                onCheckedChange={(checked) => setFormData({...formData, availability: checked})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profile_image_url">Profile Image URL (optional)</Label>
            <Input
              id="profile_image_url"
              value={formData.profile_image_url}
              onChange={(e) => setFormData({...formData, profile_image_url: e.target.value})}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              required
            />
          </div>

          <div>
            <Label>Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Tutor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TutorForm;