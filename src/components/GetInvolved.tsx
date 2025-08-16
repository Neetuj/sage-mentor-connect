import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, GraduationCap, Heart, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { applicationFormSchema, sanitizeString, checkRateLimit, SECURITY_ERROR_MESSAGES } from "@/lib/security";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const GetInvolved = () => {
  const [formType, setFormType] = useState("student");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    gradeLevel: "",
    interests: "",
    additionalInfo: "",
    parentEmail: "",
    selectedTutor: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tutors, setTutors] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch tutors for the dropdown
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data, error } = await supabase
          .from('tutors')
          .select('name')
          .order('name');

        if (error) throw error;
        setTutors(data || []);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, []);

  // Listen for tutor selection from TutorDirectory
  useEffect(() => {
    const handleTutorSelection = (event: CustomEvent) => {
      const { tutorName, formType: selectedFormType } = event.detail;
      setFormType(selectedFormType);
      setFormData(prev => ({ ...prev, selectedTutor: tutorName }));
    };

    window.addEventListener('selectTutor', handleTutorSelection as EventListener);
    return () => {
      window.removeEventListener('selectTutor', handleTutorSelection as EventListener);
    };
  }, []);

  const opportunities = [
    {
      icon: UserPlus,
      title: "Get Tutoring",
      description: "Elementary and middle school students can join our program to connect with inspiring high school tutors.",
      requirements: "Grades 3-8 • Curiosity about engineering • Weekly commitment",
      action: "Apply as Student"
    },
    {
      icon: GraduationCap, 
      title: "Become a Tutor",
      description: "High school students with engineering passion can guide younger students and share their knowledge.",
      requirements: "Grades 9-12 • Engineering interest • 1-2 hours per week",
      action: "Apply as Tutor"
    },
    {
      icon: Heart,
      title: "Volunteer & Support",
      description: "Parents, teachers, and community members can help with events, coordination, and program support.",
      requirements: "Background check • Flexible schedule • Passion for education",
      action: "Volunteer"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeString(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      const dataToValidate = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        school: formData.school,
        gradeLevel: formData.gradeLevel,
        interests: formData.interests,
        additionalInfo: formData.additionalInfo,
        ...(formType === 'student' && { parentEmail: formData.parentEmail })
      };
      
      applicationFormSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Rate limiting check
    if (!checkRateLimit(`application_${formType}`, 3, 300000)) { // 3 attempts per 5 minutes
      toast({
        title: "Error",
        description: SECURITY_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check your inputs and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('submissions')
        .insert({
          form_type: formType,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          school: formData.school || null,
          grade_level: formData.gradeLevel || null,
          interests: formData.interests || null,
          additional_info: formData.additionalInfo,
          parent_email: formData.parentEmail || null
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Application Submitted!",
        description: `Your ${formType} application has been received. We'll contact you within 3-5 business days.`,
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        school: "",
        gradeLevel: "",
        interests: "",
        additionalInfo: "",
        parentEmail: "",
        selectedTutor: ""
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="get-involved" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Join Our Community</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Get Involved with SAGE
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're a student looking for tutoring, a high schooler ready to tutor, 
            or a community member wanting to support engineering education, there's a place for you.
          </p>
        </div>

        {/* Opportunities */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {opportunities.map((opportunity, index) => (
            <Card key={index} className="shadow-card hover:shadow-card-hover transition-all duration-300 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-hero-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <opportunity.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {opportunity.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {opportunity.description}
                </p>
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-muted-foreground">
                    {opportunity.requirements}
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (opportunity.action.toLowerCase().includes('student')) {
                      setFormType('student');
                      // Scroll to form
                      setTimeout(() => {
                        const formElement = document.querySelector('#tutoring-form');
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    } else if (opportunity.action.toLowerCase().includes('tutor')) {
                      setFormType('tutor');
                    } else {
                      setFormType('volunteer');
                    }
                  }}
                >
                  {opportunity.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tutoring Request Form */}
        <div id="tutoring-form" className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {formType === 'student' ? 'Request Tutoring' : 
                   formType === 'tutor' ? 'Tutor Application' : 'Volunteer Registration'}
                </h3>
                <p className="text-muted-foreground">
                  {formType === 'student' ? 'Connect with a high school engineering tutor to accelerate your learning' :
                   'Fill out this form to get started with SAGE'}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmitApplication}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <Input 
                      placeholder="Enter your first name" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      maxLength={25}
                      required
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input 
                      placeholder="Enter your last name" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      maxLength={25}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    maxLength={100}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                {formType !== 'volunteer' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">School *</label>
                        <Input 
                          placeholder="Enter your school name" 
                          value={formData.school}
                          onChange={(e) => handleInputChange('school', e.target.value)}
                          maxLength={100}
                          required
                        />
                        {errors.school && <p className="text-sm text-destructive mt-1">{errors.school}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Grade Level *</label>
                        <Select value={formData.gradeLevel} onValueChange={(value) => handleInputChange('gradeLevel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {formType === 'student' ? (
                              <>
                                <SelectItem value="3">3rd Grade</SelectItem>
                                <SelectItem value="4">4th Grade</SelectItem>
                                <SelectItem value="5">5th Grade</SelectItem>
                                <SelectItem value="6">6th Grade</SelectItem>
                                <SelectItem value="7">7th Grade</SelectItem>
                                <SelectItem value="8">8th Grade</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="9">9th Grade</SelectItem>
                                <SelectItem value="10">10th Grade</SelectItem>
                                <SelectItem value="11">11th Grade</SelectItem>
                                <SelectItem value="12">12th Grade</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {formType === 'student' ? 'Which subject would you like tutoring in? *' : 'Subject Area of Interest *'}
                      </label>
                      <Select value={formData.interests} onValueChange={(value) => handleInputChange('interests', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={formType === 'student' ? "Select tutoring subject" : "Select your area of interest"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="math">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="english">English/Language Arts</SelectItem>
                          <SelectItem value="reading">Reading & Comprehension</SelectItem>
                          <SelectItem value="writing">Writing & Grammar</SelectItem>
                          <SelectItem value="social-studies">Social Studies</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="computer">Computer Science/Programming</SelectItem>
                          <SelectItem value="engineering">Engineering Projects</SelectItem>
                          <SelectItem value="robotics">Robotics & Technology</SelectItem>
                          <SelectItem value="art">Art & Creative Projects</SelectItem>
                          <SelectItem value="test-prep">Test Preparation</SelectItem>
                          <SelectItem value="homework">General Homework Help</SelectItem>
                          <SelectItem value="other">Other/Multiple Subjects</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {formType === 'student' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Tutor (Optional)</label>
                    <Select value={formData.selectedTutor} onValueChange={(value) => handleInputChange('selectedTutor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a specific tutor or leave blank for any available tutor" />
                      </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Available Tutor</SelectItem>
                          {tutors
                            .filter(tutor => tutor.name && tutor.name.trim() !== '')
                            .map((tutor) => (
                            <SelectItem key={tutor.name} value={tutor.name}>
                              {tutor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {formType === 'student' ? 'What would you like help with? *' : 
                     formType === 'tutor' ? 'Why do you want to be a tutor? *' : 'How would you like to help? *'}
                  </label>
                  <Textarea 
                    placeholder={formType === 'student' ? 
                      "Tell us about specific topics, projects, or skills you'd like tutoring help with..." : 
                      "Tell us about yourself and your interests..."}
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    maxLength={1000}
                    required
                  />
                  {errors.additionalInfo && <p className="text-sm text-destructive mt-1">{errors.additionalInfo}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{formData.additionalInfo.length}/1000 characters</p>
                </div>

                {formType === 'student' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Parent/Guardian Email *</label>
                    <Input 
                      type="email" 
                      placeholder="Parent or guardian email address" 
                      value={formData.parentEmail}
                      onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                      maxLength={100}
                      required
                    />
                    {errors.parentEmail && <p className="text-sm text-destructive mt-1">{errors.parentEmail}</p>}
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : 
                   formType === 'student' ? "Request Tutoring" : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-md mx-auto shadow-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Questions? Get in Touch
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>sageoutreach3@gmail.com</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>(214)-470-8192</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;