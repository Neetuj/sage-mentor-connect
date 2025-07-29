import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Lightbulb, Heart, Target } from "lucide-react";

const About = () => {
  const founders = [
    {
      name: "Isabel Conejo",
      role: "Founder & President",
      school: "Bellevue High School, WA",
      expertise: "Mechanical & Industrial",
      bio: "Originally from Manhattan, New York, Isa was raised in Madrid, Spain from the age of ten. She is interested in machine design and manufacturing, 3D modeling and simulation and systems optimization. She enjoys singing, rock climbing and thinking every dog she meets is her new best friend."
    },
    {
      name: "Rohan Jain",
      role: "Vice President",
      school: "Coppell High School, TX", 
      expertise: "Aerospace Engineering",
      bio: "Rohan is from Dallas, Texas. He interested in flight mechanics, rocketry propulsion, and aerodynamics. He loves doing card tricks, taekwondo, and making really good guacamole. "
    },
    {
      name: "Hannah Shin",
      role: "Marketing & Social Media Outreach Director",
      school: "West Ranch High School, CA",
      expertise: "Biomedical Engineering",
      bio: "Hannah is located in Los Angeles, California and is passionate about biomedical engineering like tissue engineering, medical robotics and artificial intelligence in medicine. In her free time she enjoys reading, snowboarding and curating her 100 Spotify playlists. "
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Our Story</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            How SAGE Started
          </h2>
          <div className="max-w-4xl mx-auto text-lg text-muted-foreground leading-relaxed">
            <p className="mb-6">
              SAGE was born from a simple observation: young students are naturally curious about how things work, 
              but many never get the chance to explore engineering until it's too late. Three high school students 
              decided to change that.
            </p>
            <p>
              What started as a small after-school program has grown into a thriving community connecting hundreds 
              of young minds with inspiring tutors and industry professionals. Our mission is to spark the 
              engineering passion early and nurture it through meaningful relationships.
            </p>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                SAGE empowers students to explore engineering through engaging, student/professional-led learning experiences, both online and in person. 
                Our goal is to make engineering education and exploration more accessible, inclusive, and inspiring by fostering curiosity, tutoring, and creativity.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                SAGE envisions a future where all students, regardless of background or resources, see themselves as capable engineers and problem solvers.
                We aim to build a world where tutoring, exploration, and access to engineering opportunities are the norm, empowering young minds to shape and solve the challenges our world might face.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Our Values</h3>
              <p className="text-muted-foreground">
                At SAGE, we believe that engineering exploration should be open to everyone. 
                We value inclusivity, curiosity, and collaboration, creating spaces where students feel encouraged to ask questions, explore ideas, and support each other. 

              </p>
            </CardContent>
          </Card>
        </div>

        {/* Founders */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Meet the Founders</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            The Students Behind SAGE
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three passionate high school students who saw a gap and decided to fill it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {founders.map((founder, index) => (
            <Card key={index} className="shadow-card hover:shadow-card-hover transition-all duration-300 bg-card-gradient border-l-4 border-l-secondary">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 shadow-lg">
                    <AvatarImage src="" alt={`${founder.name} profile photo`} />
                    <AvatarFallback className="bg-hero-gradient text-2xl font-bold text-primary-foreground">
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-primary mb-2">{founder.name}</h3>
                  <p className="text-secondary font-medium mb-1">{founder.role}</p>
                  <p className="text-sm text-muted-foreground mb-3">{founder.school}</p>
                  <Badge variant="outline" className="mb-4">{founder.expertise}</Badge>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 relative">
                  <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-muted/30 rotate-45"></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {founder.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;