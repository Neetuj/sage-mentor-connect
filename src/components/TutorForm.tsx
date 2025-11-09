import { useState, useEffect } from "react";
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
  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [tutors, setTutors] = useState<any[]>([]);
  const [selectedTutorSkills, setSelectedTutorSkills] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    grade: "",
    city: "",
    state: "",
    subject: "",
    availability: "",
    additional_info: "",
  });

  // Fetch tutors for the dropdown
  useEffect(() => {
    fetchTutors();
  }, []);

  // Listen for tutor selection from directory
  useEffect(() => {
    const handleTutorSelection = (event: CustomEvent) => {
      const { tutorName, formType } = event.detail;
      if (formType === 'student') {
        setSelectedTutor(tutorName);
        const tutor = tutors.find(t => t.name === tutorName);
        if (tutor) {
          setSelectedTutorSkills(tutor.skills || []);
        }
      }
    };

    window.addEventListener('selectTutor', handleTutorSelection as EventListener);
    return () => {
      window.removeEventListener('selectTutor', handleTutorSelection as EventListener);
    };
  }, [tutors]);

  const fetchTutors = async () => {
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .eq('availability', true)
        .order('name');

      if (error) throw error;
      setTutors(data || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };

  const grades = [
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", 
    "11th Grade", "12th Grade", "College", "Other"
  ];

  const defaultSubjects = [
    "Mathematics", "Science", "English", "History", "Computer Science", 
    "Foreign Languages", "Art", "Music", "Test Prep", "College Counseling"
  ];

  const availabilityOptions = [
    "Weekdays after 3pm", "Weekday evenings", "Weekend mornings", 
    "Weekend afternoons", "Flexible", "Other"
  ];

  const handleTutorSelection = (tutorName: string) => {
    setSelectedTutor(tutorName);
    if (tutorName === "no-preference") {
      setSelectedTutor("");
      setSelectedTutorSkills([]);
      return;
    }
    const tutor = tutors.find(t => t.name === tutorName);
    if (tutor) {
      setSelectedTutorSkills(tutor.skills || []);
    } else {
      setSelectedTutorSkills([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submissionData = {
        ...formData,
        form_type: 'tutoring_request',
        additional_info: `${formData.additional_info}${selectedTutor ? `\nRequested Tutor: ${selectedTutor}` : ''}`
      };

      const { error } = await supabase
        .from('submissions')
        .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tutoring request submitted successfully! We'll be in touch soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        school: "",
        grade: "",
        city: "",
        state: "",
        subject: "",
        availability: "",
        additional_info: "",
      });
      setSelectedTutor("");
      setSelectedTutorSkills([]);
      onTutorAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card id="tutoring-form">
      <CardHeader>
        <CardTitle>Request Tutoring</CardTitle>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                required
              />
            </div>
          </div>

          {selectedTutor && (
            <div>
              <Label>Selected Tutor</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedTutor}</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedTutor("");
                    setSelectedTutorSkills([]);
                  }}
                  className="mt-2"
                >
                  Change Tutor
                </Button>
              </div>
            </div>
          )}

          {!selectedTutor && (
            <div>
              <Label htmlFor="tutor">Preferred Tutor (optional)</Label>
              <Select value={selectedTutor} onValueChange={handleTutorSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tutor (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-preference">No preference</SelectItem>
                  {tutors
                    .filter(tutor => tutor.name && tutor.name.trim() !== '')
                    .map((tutor) => (
                    <SelectItem key={tutor.id} value={tutor.name}>
                      {tutor.name} - {tutor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="subject">Which subject do you want tutoring in?</Label>
            <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {selectedTutorSkills.length > 0 ? (
                  <>
                    {selectedTutorSkills
                      .filter(skill => skill && skill.trim() !== '')
                      .map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                ) : (
                  defaultSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="availability">When are you available for tutoring?</Label>
            <Select value={formData.availability} onValueChange={(value) => setFormData({...formData, availability: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="additional_info">Additional Information (optional)</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
              placeholder="Tell us more about what you'd like help with..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Tutoring Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TutorForm;