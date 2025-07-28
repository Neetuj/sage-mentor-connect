import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, GraduationCap, Heart, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const GetInvolved = () => {
  const [formType, setFormType] = useState("student");
  const { toast } = useToast();

  const opportunities = [
    {
      icon: UserPlus,
      title: "Become a Mentee",
      description: "Elementary and middle school students can join our program to connect with inspiring high school mentors.",
      requirements: "Grades 3-8 • Curiosity about engineering • Weekly commitment",
      action: "Apply as Student"
    },
    {
      icon: GraduationCap, 
      title: "Become a Mentor",
      description: "High school students with engineering passion can guide younger students and share their knowledge.",
      requirements: "Grades 9-12 • Engineering interest • 2-3 hours per week",
      action: "Apply as Mentor"
    },
    {
      icon: Heart,
      title: "Volunteer & Support",
      description: "Parents, teachers, and community members can help with events, coordination, and program support.",
      requirements: "Background check • Flexible schedule • Passion for education",
      action: "Volunteer"
    }
  ];

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: `Your ${formType} application has been received. We'll contact you within 3-5 business days.`,
    });
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
            Whether you're a student looking for mentorship, a high schooler ready to mentor, 
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
                  onClick={() => setFormType(opportunity.action.toLowerCase().includes('student') ? 'student' : 
                                           opportunity.action.toLowerCase().includes('mentor') ? 'mentor' : 'volunteer')}
                >
                  {opportunity.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {formType === 'student' ? 'Student Application' : 
                   formType === 'mentor' ? 'Mentor Application' : 'Volunteer Registration'}
                </h3>
                <p className="text-muted-foreground">
                  Fill out this form to get started with SAGE
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmitApplication}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="Enter your email address" />
                </div>

                {formType !== 'volunteer' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">School</label>
                        <Input placeholder="Enter your school name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Grade Level</label>
                        <Select>
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
                        {formType === 'student' ? 'Engineering Interests' : 'Engineering Specialty'}
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your area of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer">Computer Science</SelectItem>
                          <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                          <SelectItem value="electrical">Electrical Engineering</SelectItem>
                          <SelectItem value="environmental">Environmental Engineering</SelectItem>
                          <SelectItem value="biomedical">Biomedical Engineering</SelectItem>
                          <SelectItem value="aerospace">Aerospace Engineering</SelectItem>
                          <SelectItem value="other">Other/General Interest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {formType === 'student' ? 'What interests you about engineering?' : 
                     formType === 'mentor' ? 'Why do you want to be a mentor?' : 'How would you like to help?'}
                  </label>
                  <Textarea 
                    placeholder="Tell us about yourself and your interests..."
                    rows={4}
                  />
                </div>

                {formType === 'student' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Parent/Guardian Email</label>
                    <Input type="email" placeholder="Parent or guardian email address" />
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg">
                  Submit Application
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
                  <span>info@sageengineering.org</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>(555) 123-SAGE</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Lincoln High School District</span>
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