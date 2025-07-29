import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SeminarCalendar = () => {
  const { toast } = useToast();
  const upcomingSeminars = [
    {
      id: 1,
      title: "SEMINAR NAME",
      speaker: "SPEAKER NAME",
      organization: "SPEAKER JOB",
      date: "MM/DD/YY",
      time: "X:XXPM - Y:YYPM",
      location: "VIRTUAL",
      type: "SEMINAR",
      description: "SEMINAR DESCRIPTION",
      audience: "AGE RANGE",
      capacity: "CAPACITY",
      registered: 32,
      category: "CATEGORY"
    },
    {
      id: 2,
      title: "Sustainable Engineering Solutions",
      speaker: "Prof. Marcus Johnson", 
      organization: "Stanford Environmental Engineering",
      date: "March 22, 2024",
      time: "1:00 PM - 2:30 PM",
      location: "Lincoln Community Center",
      type: "Seminar",
      description: "Explore how engineers are tackling climate change through innovative sustainable technologies.",
      audience: "Grades 5-8",
      capacity: "75 students",
      registered: 43,
      category: "Environmental"
    },
    {
      id: 3,
      title: "Video Game Design Workshop",
      speaker: "Elena Rodriguez",
      organization: "Unity Technologies",
      date: "March 29, 2024", 
      time: "3:00 PM - 4:30 PM",
      location: "Virtual Event",
      type: "Workshop",
      description: "Create your own simple video game and learn about the engineering behind game development.",
      audience: "Grades 4-8",
      capacity: "40 students",
      registered: 28,
      category: "Computer Science"
    },
    {
      id: 4,
      title: "Aerospace Engineering: Reaching for the Stars",
      speaker: "Captain James Wright",
      organization: "NASA",
      date: "April 5, 2024",
      time: "2:30 PM - 4:00 PM", 
      location: "Roosevelt High School Auditorium",
      type: "Presentation",
      description: "Discover how aerospace engineers design spacecraft and explore the challenges of space exploration.",
      audience: "Grades 6-8",
      capacity: "100 students",
      registered: 67,
      category: "Aerospace"
    },
    {
      id: 5,
      title: "Biomedical Engineering: Healing Through Technology",
      speaker: "Dr. Aisha Patel",
      organization: "Johns Hopkins Medical School",
      date: "April 12, 2024",
      time: "1:30 PM - 3:00 PM",
      location: "Virtual Event", 
      type: "Seminar",
      description: "Learn how engineers create medical devices and technologies that save lives every day.",
      audience: "Grades 5-8",
      capacity: "60 students",
      registered: 41,
      category: "Biomedical"
    },
    {
      id: 6,
      title: "Smart Cities and IoT",
      speaker: "Dr. David Kim",
      organization: "Google Research",
      date: "April 19, 2024",
      time: "2:00 PM - 3:30 PM",
      location: "Washington Community Library",
      type: "Workshop",
      description: "Explore how engineers are making cities smarter using sensors and connected technologies.",
      audience: "Grades 6-8", 
      capacity: "45 students",
      registered: 23,
      category: "Technology"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Robotics": "bg-primary/20 text-primary",
      "Environmental": "bg-secondary/20 text-secondary",
      "Computer Science": "bg-accent/20 text-accent",
      "Aerospace": "bg-primary/20 text-primary",
      "Biomedical": "bg-secondary/20 text-secondary",
      "Technology": "bg-accent/20 text-accent"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const handleRegister = (seminarTitle: string, registered: number, capacity: number) => {
    if (registered >= capacity) {
      toast({
        title: "Seminar Full",
        description: `${seminarTitle} is currently at capacity. You've been added to the waitlist.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful!",
        description: `You've been registered for "${seminarTitle}". Check your email for details.`,
      });
    }
  };

  const handleLearnMore = (seminarTitle: string) => {
    toast({
      title: "More Information",
      description: `Opening detailed information for "${seminarTitle}"...`,
    });
  };

  const handleViewCalendar = () => {
    toast({
      title: "Full Calendar",
      description: "Opening complete seminar calendar with all upcoming events...",
    });
  };
  const getRegistrationStatus = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return { status: "Almost Full", color: "destructive" };
    if (percentage >= 70) return { status: "Filling Up", color: "secondary" };
    return { status: "Available", color: "default" };
  };

  return (
    <section id="seminars" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Upcoming Events</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Engineering Seminars & Workshops
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join industry experts and academic leaders for inspiring talks and hands-on workshops 
            designed to spark your engineering curiosity.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {upcomingSeminars.map((seminar) => {
            const regStatus = getRegistrationStatus(seminar.registered, parseInt(seminar.capacity.split(' ')[0]));
            
            return (
              <Card key={seminar.id} className="shadow-card hover:shadow-card-hover transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(seminar.category)}>
                      {seminar.category}
                    </Badge>
                    <Badge variant={regStatus.color as any}>
                      {regStatus.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-primary mb-2">
                    {seminar.title}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{seminar.speaker}</p>
                    <p>{seminar.organization}</p>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {seminar.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{seminar.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{seminar.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{seminar.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{seminar.audience} • {seminar.registered}/{seminar.capacity.split(' ')[0]} registered</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1" 
                      variant="default"
                      onClick={() => handleRegister(seminar.title, seminar.registered, parseInt(seminar.capacity.split(' ')[0]))}
                    >
                      Register Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleLearnMore(seminar.title)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleViewCalendar}
          >
            <Calendar className="h-5 w-5 mr-2" />
            View Full Calendar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SeminarCalendar;