import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageCircle, Users, Search, Award, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MentorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const { toast } = useToast();

  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      school: "Lincoln High School",
      grade: "12th Grade",
      specialty: "Computer Science",
      experience: "3 years",
      rating: 4.9,
      mentees: 8,
      bio: "Passionate about making coding accessible to younger students. Specializes in Python, web development, and game design.",
      skills: ["Python", "JavaScript", "Game Development", "Web Design"],
      availability: "Available"
    },
    {
      id: 2,
      name: "Marcus Thompson",
      school: "Roosevelt High School", 
      grade: "11th Grade",
      specialty: "Mechanical Engineering",
      experience: "2 years",
      rating: 4.8,
      mentees: 6,
      bio: "Loves building robots and mechanical devices. Helps students understand engineering through hands-on projects.",
      skills: ["Robotics", "3D Printing", "CAD Design", "Arduino"],
      availability: "Available"
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      school: "Washington High School",
      grade: "12th Grade", 
      specialty: "Environmental Engineering",
      experience: "2.5 years",
      rating: 5.0,
      mentees: 7,
      bio: "Dedicated to solving environmental challenges through engineering. Mentors students on sustainability projects.",
      skills: ["Sustainability", "Water Systems", "Solar Energy", "Environmental Science"],
      availability: "Limited"
    },
    {
      id: 4,
      name: "David Kim",
      school: "Jefferson High School",
      grade: "11th Grade",
      specialty: "Biomedical Engineering", 
      experience: "1.5 years",
      rating: 4.7,
      mentees: 4,
      bio: "Fascinated by the intersection of biology and technology. Helps students explore medical device design.",
      skills: ["Biology", "Medical Devices", "3D Modeling", "Research"],
      availability: "Available"
    },
    {
      id: 5,
      name: "Aisha Patel",
      school: "Lincoln High School",
      grade: "12th Grade",
      specialty: "Electrical Engineering",
      experience: "3 years", 
      rating: 4.9,
      mentees: 9,
      bio: "Expert in circuits and electronics. Makes complex electrical concepts fun and understandable for young minds.",
      skills: ["Circuit Design", "Electronics", "Sensors", "Microcontrollers"],
      availability: "Available"
    },
    {
      id: 6,
      name: "Jake Wilson",
      school: "Roosevelt High School",
      grade: "11th Grade",
      specialty: "Aerospace Engineering",
      experience: "2 years",
      rating: 4.8,
      mentees: 5,
      bio: "Dreams of space exploration and helps students build model rockets and understand flight principles.",
      skills: ["Rocketry", "Aerodynamics", "Physics", "Model Building"],
      availability: "Available"
    }
  ];

  const specialties = [...new Set(mentors.map(mentor => mentor.specialty))];

  const handleConnectMentor = (mentorName: string, available: boolean) => {
    if (available) {
      toast({
        title: "Connection Request Sent!",
        description: `Your request to connect with ${mentorName} has been sent. They'll respond within 24 hours.`,
      });
    } else {
      toast({
        title: "Mentor Currently Full",
        description: `${mentorName} is not taking new mentees right now. Try again later!`,
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (mentorName: string) => {
    toast({
      title: "Profile Details",
      description: `Opening detailed profile for ${mentorName}...`,
    });
  };
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = filterSpecialty === "all" || mentor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <section id="mentors" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Find Your Mentor</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Connect with Amazing Student Mentors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our high school mentors are passionate about sharing their knowledge and helping 
            younger students discover the excitement of engineering.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mentors by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
              {/* Header with availability indicator */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-hero-gradient rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{mentor.name}</h3>
                      <p className="text-xs text-muted-foreground">{mentor.school}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${mentor.availability === "Available" ? "bg-secondary" : "bg-muted"}`}></div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Quick stats bar */}
                <div className="flex items-center justify-between mb-3 p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-accent fill-current" />
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3 text-secondary" />
                    <span>{mentor.mentees}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>{mentor.experience}</span>
                  </div>
                </div>

                {/* Specialty badge */}
                <div className="mb-3">
                  <Badge variant="secondary" className="text-xs">{mentor.specialty}</Badge>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                  {mentor.bio}
                </p>

                {/* Skills tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mentor.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{mentor.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs" 
                    variant={mentor.availability === "Available" ? "default" : "outline"}
                    onClick={() => handleConnectMentor(mentor.name, mentor.availability === "Available")}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {mentor.availability === "Available" ? "Connect" : "Full"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => handleViewProfile(mentor.name)}
                  >
                    <Award className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No mentors found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MentorDirectory;