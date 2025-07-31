import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { applicationFormSchema, sanitizeString, checkRateLimit, SECURITY_ERROR_MESSAGES } from "@/lib/security";

interface SeminarRegistrationProps {
  seminarTitle: string;
  seminarId: string;
  children: React.ReactNode;
}

const SeminarRegistration = ({ seminarTitle, seminarId, children }: SeminarRegistrationProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    grade_level: "",
    interests: "",
    additional_info: "",
    parent_email: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Rate limiting check
      if (!checkRateLimit(`seminar_reg_${formData.email}`, 3, 300000)) { // 3 requests per 5 minutes
        toast.error(SECURITY_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        return;
      }

      // Validate and sanitize input
      const validationResult = applicationFormSchema.safeParse({
        name: formData.name,
        email: formData.email,
        school: formData.school,
        gradeLevel: formData.grade_level,
        interests: formData.interests,
        additionalInfo: formData.additional_info,
        parentEmail: formData.parent_email
      });

      if (!validationResult.success) {
        toast.error(SECURITY_ERROR_MESSAGES.INVALID_INPUT);
        return;
      }

      const sanitizedData = {
        name: sanitizeString(formData.name),
        email: sanitizeString(formData.email),
        school: formData.school ? sanitizeString(formData.school) : null,
        grade_level: formData.grade_level ? sanitizeString(formData.grade_level) : null,
        interests: formData.interests ? sanitizeString(formData.interests) : null,
        additional_info: formData.additional_info ? sanitizeString(formData.additional_info) : null,
        parent_email: formData.parent_email ? sanitizeString(formData.parent_email) : null
      };

      const { error } = await supabase
        .from('submissions')
        .insert({
          form_type: 'seminar',
          name: sanitizedData.name,
          email: sanitizedData.email,
          school: sanitizedData.school,
          grade_level: sanitizedData.grade_level,
          interests: sanitizedData.interests,
          additional_info: `Seminar Registration: ${seminarTitle}\n\n${sanitizedData.additional_info || ''}`,
          parent_email: sanitizedData.parent_email
        });

      if (error) throw error;

      // Update seminar registration count
      const { error: incrementError } = await (supabase.rpc as any)('increment_seminar_registration', { 
        seminar_id: seminarId 
      });
      
      if (incrementError) {
        console.warn('Failed to update registration count:', incrementError);
      }

      toast.success(`Successfully registered for "${seminarTitle}"!`);
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        school: "",
        grade_level: "",
        interests: "",
        additional_info: "",
        parent_email: ""
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error(SECURITY_ERROR_MESSAGES.SUBMISSION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {seminarTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="grade_level">Grade Level</Label>
              <Input
                id="grade_level"
                value={formData.grade_level}
                onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="interests">Interests/Areas of Focus</Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="e.g., Robotics, AI, Environmental Engineering"
            />
          </div>

          <div>
            <Label htmlFor="parent_email">Parent/Guardian Email (if under 18)</Label>
            <Input
              id="parent_email"
              type="email"
              value={formData.parent_email}
              onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="additional_info">Questions or Additional Information</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              placeholder="Any questions about the seminar or special accommodations needed..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Registering..." : "Register for Seminar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SeminarRegistration;