import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  profile_image_url: string | null;
  email: string | null;
  school: string | null;
}

const TeamMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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
          // Open popup with full details on click
          const detailPopup = new mapboxgl.Popup({
            offset: 25,
            maxWidth: "300px",
            className: "team-detail-popup",
          }).setHTML(`
            <div style="padding: 16px;">
              <div style="text-align: center; margin-bottom: 12px;">
                ${member.profile_image_url ? `<img src="${member.profile_image_url}" alt="${member.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 12px;" />` : ''}
                <h3 style="font-weight: 600; margin: 0 0 6px 0; font-size: 18px; color: hsl(var(--primary));">${member.name}</h3>
                <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 500; color: hsl(var(--secondary));">${member.role}</p>
                ${member.school ? `<p style="margin: 0 0 8px 0; font-size: 13px; color: hsl(var(--muted-foreground));">${member.school}</p>` : ''}
                <span style="display: inline-block; padding: 4px 8px; background: hsl(var(--muted)); border-radius: 4px; font-size: 12px;">${member.location}</span>
              </div>
              ${member.email ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid hsl(var(--border)); text-align: center;"><a href="mailto:${member.email}" style="font-size: 13px; color: hsl(var(--primary)); text-decoration: underline;">${member.email}</a></div>` : ''}
            </div>
          `);
          
          marker.setPopup(detailPopup);
          detailPopup.addTo(map.current!);
          
          map.current?.flyTo({
            center: [member.longitude, member.latitude],
            zoom: 6,
            duration: 1000,
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
                Click on a team member to learn more about them.
              </p>
            </div>

            {/* Map Section */}
            <Card className="overflow-hidden shadow-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="h-[700px] flex items-center justify-center bg-muted/30">
                    <p className="text-muted-foreground">Loading map...</p>
                  </div>
                ) : (
                  <div
                    ref={mapContainer}
                    className="h-[700px] w-full rounded-lg"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeamMap;
