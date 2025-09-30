import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Lightbulb, Heart, Target } from "lucide-react";
import rohanProfile from "@/assets/rohan-profile.jpg";
import isabelProfile from "@/assets/isabel-profile.jpg";
import hannahProfile from "@/assets/hannah-profile.jpg";
import CardTrickAnimation from "./CardTrickAnimation";

const About = () => {
  const [showCardTrick, setShowCardTrick] = useState(false);
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
      role: "Cofounder & Vice President",
      school: "Coppell High School, TX", 
      expertise: "Aerospace Engineering",
      bio: "From Dallas, Texas, Rohan is interested in flight mechanics, rocketry propulsion, and aerodynamics. He loves spending time mastering new card tricks, with a good book and his giant playlist, teaching taekwondo to toddlers, and making really good guacamole. "
    },
    {
      name: "Hannah Shin",
      role: "Cofounder, Marketing & Outreach Director",
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
              We founded SAGE as three high school students who met at an engineering exploration camp at the University of Michigan. 
              That experience sparked a shared passion for building, designing, and solving problems, but more than anything, 
              it made us feel empowered, inspired, and capable. We left wondering: <em>What if more students had access to opportunities like this?</em>
            </p>
            <p>
              SAGE was born from that question. What started as an idea is now a growing student-led nonprofit dedicated to 
              making engineering exploration more accessible, engaging, and personal. Through hands-on workshops, mentorship, 
              and conversations with professionals, we help students discover the excitement of engineering, and remind them 
              that age, background, or experience should never be a barrier to creating things that matter.
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
            <Card 
              key={index} 
              className={`shadow-card hover:shadow-card-hover transition-all duration-300 bg-card-gradient border-l-4 border-l-secondary ${
                founder.name === "Rohan Jain" ? "cursor-pointer hover:scale-105 hover:shadow-lg" : ""
              }`}
              onClick={() => {
                if (founder.name === "Rohan Jain") {
                  setShowCardTrick(true);
                }
              }}
            >
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 shadow-lg">
                    <AvatarImage 
                      src={founder.name === "Rohan Jain" ? rohanProfile : 
                           founder.name === "Isabel Conejo" ? isabelProfile :
                           founder.name === "Hannah Shin" ? hannahProfile : ""}
                      alt={`${founder.name} profile photo`} 
                    />
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
      
      {showCardTrick && (
        <CardTrickAnimation onComplete={() => setShowCardTrick(false)} />
      )}
    </section>
  );
};

export default About;