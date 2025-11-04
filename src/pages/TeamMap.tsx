import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Note: Replace with actual Mapbox token or store in Supabase secrets
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNXF5azJqYjBhY2Qya3EwZWM0Z202bGYifQ.example";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  latitude: number;
  longitude: number;
  bio: string | null;
  profile_image_url: string | null;
  email: string | null;
  school: string | null;
}

const TeamMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Lazy load mapbox-gl to avoid React duplicate instance issues
    import("mapbox-gl").then((mapboxModule) => {
      const mapboxgl = mapboxModule.default;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-95, 40], // Centered on US
        zoom: 3,
        pitch: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: false,
        }),
        "top-right"
      );
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !teamMembers.length) return;

    // Lazy load mapbox-gl for marker creation
    import("mapbox-gl").then((mapboxModule) => {
      const mapboxgl = mapboxModule.default;
      
      // Remove existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add markers for each team member
      teamMembers.forEach((member) => {
        const el = document.createElement("div");
        el.className = "team-marker";
        el.style.cssText = `
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          background-image: url('${member.profile_image_url || ""}');
          background-size: cover;
          background-position: center;
          transition: transform 0.2s;
        `;

        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
        });

        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([member.longitude, member.latitude])
          .addTo(map.current!);

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          className: "team-popup",
        }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; margin: 0 0 4px 0; color: hsl(var(--primary));">${member.name}</h3>
            <p style="margin: 0; font-size: 14px; color: hsl(var(--muted-foreground));">${member.role}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: hsl(var(--muted-foreground));">${member.location}</p>
          </div>
        `);

        marker.setPopup(popup);

        el.addEventListener("click", () => {
          setSelectedMember(member);
          map.current?.flyTo({
            center: [member.longitude, member.latitude],
            zoom: 8,
            duration: 1500,
          });
        });

        markersRef.current.push(marker);
      });
    });
  }, [teamMembers]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Our Team
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
                SAGE Team Around the World
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate students and professionals making SAGE possible from across the globe.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map Section */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden shadow-card">
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="h-[600px] flex items-center justify-center bg-muted/30">
                        <p className="text-muted-foreground">Loading map...</p>
                      </div>
                    ) : (
                      <div
                        ref={mapContainer}
                        className="h-[600px] w-full rounded-lg"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Selected Member Details */}
              <div className="lg:col-span-1">
                {selectedMember ? (
                  <Card className="shadow-card sticky top-24">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <Avatar className="w-24 h-24 mx-auto mb-4 shadow-lg">
                          <AvatarImage
                            src={selectedMember.profile_image_url || ""}
                            alt={selectedMember.name}
                          />
                          <AvatarFallback className="bg-hero-gradient text-2xl font-bold text-primary-foreground">
                            {selectedMember.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold text-primary mb-2">
                          {selectedMember.name}
                        </h3>
                        <p className="text-secondary font-medium mb-1">
                          {selectedMember.role}
                        </p>
                        {selectedMember.school && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {selectedMember.school}
                          </p>
                        )}
                        <Badge variant="outline">{selectedMember.location}</Badge>
                      </div>

                      {selectedMember.email && (
                        <div className="mt-4 pt-4 border-t">
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {selectedMember.email}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-card sticky top-24">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        Click on a team member marker to view their details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Team List */}
            {!isLoading && teamMembers.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                  All Team Members
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {teamMembers.map((member) => (
                    <Card
                      key={member.id}
                      className="shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedMember(member);
                        map.current?.flyTo({
                          center: [member.longitude, member.latitude],
                          zoom: 8,
                          duration: 1500,
                        });
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-3">
                          <AvatarImage
                            src={member.profile_image_url || ""}
                            alt={member.name}
                          />
                          <AvatarFallback className="bg-hero-gradient text-lg font-bold text-primary-foreground">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold text-sm mb-1">
                          {member.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {member.location}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeamMap;
