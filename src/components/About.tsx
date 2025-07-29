import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Heart, Target } from "lucide-react";

const About = () => {
  const founders = [
    {
      name: "Rohan Jain",
      role: "Co-Founder & President",
      school: "Lincoln High School",
      expertise: "Robotics & Computer Science",
      story: "Started SAGE after noticing the lack of early engineering exposure in elementary schools. Alex believes every child deserves to discover the wonder of engineering."
    },
    {
      name: "Maya Patel",
      role: "Co-Founder & VP of Mentorship",
      school: "Roosevelt High School", 
      expertise: "Biomedical Engineering",
      story: "Passionate about making STEM accessible to all students, especially those from underrepresented communities. Maya coordinates our mentor training programs."
    },
    {
      name: "Jordan Williams",
      role: "Co-Founder & Events Director",
      school: "Washington High School",
      expertise: "Environmental Engineering",
      story: "Organizes our industry seminars and connects students with professionals. Jordan envisions a future where every young person sees engineering as approachable and exciting."
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
              of young minds with inspiring mentors and industry professionals. Our mission is to spark the 
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
                To inspire and support the next generation of engineers through mentorship, 
                hands-on learning, and exposure to engineering possibilities.
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
                A world where every young person has access to engineering mentorship and 
                sees themselves as capable of solving tomorrow's biggest challenges.
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
                Inclusivity, curiosity, collaboration, and the belief that age is no barrier 
                to making a meaningful impact in engineering.
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
                  <div className="w-24 h-24 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{founder.name}</h3>
                  <p className="text-secondary font-medium mb-1">{founder.role}</p>
                  <p className="text-sm text-muted-foreground mb-3">{founder.school}</p>
                  <Badge variant="outline" className="mb-4">{founder.expertise}</Badge>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 relative">
                  <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-muted/30 rotate-45"></div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{founder.story}"
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