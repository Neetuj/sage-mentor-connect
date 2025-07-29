import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageCircle, Users, Search, Award, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeString, searchSchema } from "@/lib/security";
import { z } from "zod";

const TutorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [searchError, setSearchError] = useState("");
  const { toast } = useToast();

  const handleSearchChange = (value: string) => {
    const sanitizedValue = sanitizeString(value);
    try {
      searchSchema.parse({ query: sanitizedValue });
      setSearchTerm(sanitizedValue);
      setSearchError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setSearchError(error.issues[0]?.message || "Invalid search query");
      }
    }
  };

  const tutors = [
    {
      id: 1,
      name: "TUTOR NAME",
      school: "TUTOR SCHOOL",
      grade: "TUTOR GRADE",
      specialty: "TUTOR SPECIALTY",
      experience: "TUTOR EXPERIENCE",
      rating: 5.0,
      students: 8,
      bio: "TUTOR BIO",
      skills: ["SKILL", "SKILL", "SKILL", "SKILL"],
      availability: "Available"
    },
    {
      id: 2,
      name: "TUTOR NAME",
      school: "TUTOR SCHOOL",
      grade: "TUTOR GRADE",
      specialty: "TUTOR SPECIALTY",
      experience: "TUTOR EXPERIENCE",
      rating: 5.0,
      students: 8,
      bio: "TUTOR BIO",
      skills: ["SKILL", "SKILL", "SKILL", "SKILL"],
      availability: "Available"
    },
    {
      id: 3,
      name: "TUTOR NAME",
      school: "TUTOR SCHOOL",
      grade: "TUTOR GRADE",
      specialty: "TUTOR SPECIALTY",
      experience: "TUTOR EXPERIENCE",
      rating: 5.0,
      students: 8,
      bio: "TUTOR BIO",
      skills: ["SKILL", "SKILL", "SKILL", "SKILL"],
      availability: "Available"
    },
    {
      id: 4,
      name: "TUTOR NAME",
      school: "TUTOR SCHOOL",
      grade: "TUTOR GRADE",
      specialty: "TUTOR SPECIALTY",
      experience: "TUTOR EXPERIENCE",
      rating: 5.0,
      students: 8,
      bio: "TUTOR BIO",
      skills: ["SKILL", "SKILL", "SKILL", "SKILL"],
      availability: "Available"
    },
    {
      id: 5,
      name: "TUTOR NAME",
      school: "TUTOR SCHOOL",
      grade: "TUTOR GRADE",
      specialty: "TUTOR SPECIALTY",
      experience: "TUTOR EXPERIENCE",
      rating: 5.0,
      students: 8,
      bio: "TUTOR BIO",
      skills: ["SKILL", "SKILL", "SKILL", "SKILL"],
      availability: "Available"
    },
    {
      id: 6,
      name: "TUTOR NAME",
      school: "TUTOR SCHOOL",
      grade: "TUTOR GRADE",
      specialty: "TUTOR SPECIALTY",
      experience: "TUTOR EXPERIENCE",
      rating: 5.0,
      students: 8,
      bio: "TUTOR BIO",
      skills: ["SKILL", "SKILL", "SKILL", "SKILL"],
      availability: "Available"
    }
  ];

  const specialties = [...new Set(tutors.map(tutor => tutor.specialty))];

  const handleConnectTutor = (tutorName: string, available: boolean) => {
    if (available) {
      // Scroll to form and set tutor selection
      const formElement = document.querySelector('#tutoring-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
        // Trigger custom event to set selected tutor
        const event = new CustomEvent('selectTutor', { 
          detail: { tutorName, formType: 'student' } 
        });
        window.dispatchEvent(event);
      }
    } else {
      toast({
        title: "Tutor Currently Full",
        description: `${tutorName} is not taking new students right now. Try again later!`,
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (tutorName: string) => {
    toast({
      title: "Profile Details",
      description: `Opening detailed profile for ${tutorName}...`,
    });
  };
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = filterSpecialty === "all" || tutor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <section id="tutors" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Find Your Tutor</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Connect with Amazing Student Tutors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our high school tutors are passionate about sharing their knowledge and helping 
            younger students discover the excitement of engineering.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutors by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              maxLength={100}
            />
            {searchError && <p className="text-sm text-destructive mt-1">{searchError}</p>}
          </div>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tutors Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <Card key={tutor.id} className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
              {/* Header with availability indicator */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-hero-gradient rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{tutor.name}</h3>
                      <p className="text-xs text-muted-foreground">{tutor.school}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${tutor.availability === "Available" ? "bg-secondary" : "bg-muted"}`}></div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Quick stats bar */}
                <div className="flex items-center justify-between mb-3 p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-accent fill-current" />
                    <span className="font-medium">{tutor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3 text-secondary" />
                    <span>{tutor.students}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>{tutor.experience}</span>
                  </div>
                </div>

                {/* Specialty badge */}
                <div className="mb-3">
                  <Badge variant="secondary" className="text-xs">{tutor.specialty}</Badge>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                  {tutor.bio}
                </p>

                {/* Skills tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {tutor.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                        {skill}
                      </Badge>
                    ))}
                    {tutor.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{tutor.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs" 
                    variant={tutor.availability === "Available" ? "default" : "outline"}
                    onClick={() => handleConnectTutor(tutor.name, tutor.availability === "Available")}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {tutor.availability === "Available" ? "Connect" : "Full"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => handleViewProfile(tutor.name)}
                  >
                    <Award className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No tutors found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TutorDirectory;