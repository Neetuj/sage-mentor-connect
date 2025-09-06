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

const TutorAdminForm = ({ onTutorAdded }: { onTutorAdded: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    specialty: "",
    bio: "",
    profile_image_url: "",
    timezone: "UTC",
    rating: 5.0,
    students: 0,
    availability: true,
  });

  const specialties = [
    "Mathematics", "Science", "English", "History", "Computer Science", 
    "Physics", "Chemistry", "Biology", "Foreign Languages", "Art", 
    "Music", "Test Prep", "College Counseling", "Economics", "Psychology"
  ];

  const timezones = [
    "UTC", "EST", "CST", "MST", "PST", "GMT", "CET", "JST", "AEST"
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
      const tutorData = {
        ...formData,
        skills: skills,
      };

      const { error } = await supabase
        .from('tutors')
        .insert([tutorData]);

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
        bio: "",
        profile_image_url: "",
        timezone: "UTC",
        rating: 5.0,
        students: 0,
        availability: true,
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
              <Label htmlFor="name">Full Name</Label>
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
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell us about this tutor's background and experience..."
              required
            />
          </div>

          <div>
            <Label htmlFor="profile_image_url">Profile Image URL (optional)</Label>
            <Input
              id="profile_image_url"
              type="url"
              value={formData.profile_image_url}
              onChange={(e) => setFormData({...formData, profile_image_url: e.target.value})}
              placeholder="https://example.com/image.jpg"
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
              <Button type="button" onClick={addSkill} variant="outline">
                Add
              </Button>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Initial Rating</Label>
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
              <Label htmlFor="students">Initial Student Count</Label>
              <Input
                id="students"
                type="number"
                min="0"
                value={formData.students}
                onChange={(e) => setFormData({...formData, students: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="availability"
              checked={formData.availability}
              onCheckedChange={(checked) => setFormData({...formData, availability: checked})}
            />
            <Label htmlFor="availability">Available for new students</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding Tutor..." : "Add Tutor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TutorAdminForm;