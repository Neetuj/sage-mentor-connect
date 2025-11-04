import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

export const TeamMapEmbed = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

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

    console.log('[TeamMapEmbed] Initializing Leaflet map');
    map.current = L.map(mapContainer.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([39.8283, -98.5795], 4);

    const tile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
      crossOrigin: true as any,
    }).addTo(map.current);

    tile.on('load', () => console.log('[TeamMapEmbed] Tiles loaded'));
    tile.on('tileerror', (e) => console.error('[TeamMapEmbed] Tile error', e));

    // Ensure proper sizing when first displayed
    setTimeout(() => map.current?.invalidateSize(true), 0);
    window.addEventListener('resize', () => map.current?.invalidateSize());

    return () => {
      map.current?.remove();
      window.removeEventListener('resize', () => map.current?.invalidateSize());
    };
  }, []);

  useEffect(() => {
    if (!map.current || !teamMembers.length) return;

    teamMembers.forEach((member) => {
      const iconHtml = member.profile_image_url
        ? `<div style="width:50px;height:50px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);background-image:url(${member.profile_image_url});background-size:cover;background-position:center;cursor:pointer;transition:transform 0.2s;" class="team-marker"></div>`
        : `<div style="width:50px;height:50px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);background:linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:20px;cursor:pointer;transition:transform 0.2s;" class="team-marker">${member.name.charAt(0)}</div>`;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [50, 50],
        iconAnchor: [25, 25],
      });

      const marker = L.marker([member.latitude, member.longitude], { icon: customIcon })
        .addTo(map.current!);

      const briefPopup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnClick: false,
        offset: [0, -25],
      }).setContent(`
        <div style="text-align: center; padding: 4px;">
          <strong style="color: hsl(var(--primary));">${member.name}</strong><br/>
          <span style="font-size: 0.9em; color: hsl(var(--muted-foreground));">${member.role}</span>
        </div>
      `);

      const detailedPopup = L.popup({
        maxWidth: 300,
        offset: [0, -25],
      }).setContent(`
        <div style="padding: 16px; text-align: center;">
          ${member.profile_image_url ? `
            <img 
              src="${member.profile_image_url}" 
              alt="${member.name}"
              style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 2px solid hsl(var(--primary));"
            />
          ` : ''}
          <h3 style="margin: 8px 0; font-size: 1.1em; font-weight: bold; color: hsl(var(--primary));">${member.name}</h3>
          <p style="margin: 4px 0; color: hsl(var(--secondary)); font-weight: 600;">${member.role}</p>
          ${member.school ? `<p style="margin: 4px 0; font-size: 0.9em; color: hsl(var(--muted-foreground));"><strong>School:</strong> ${member.school}</p>` : ''}
          <p style="margin: 4px 0; font-size: 0.9em; color: hsl(var(--muted-foreground));"><strong>Location:</strong> ${member.location}</p>
          ${member.email ? `<p style="margin: 4px 0; font-size: 0.9em;"><strong>Email:</strong> <a href="mailto:${member.email}" style="color: hsl(var(--primary)); text-decoration: underline;">${member.email}</a></p>` : ''}
        </div>
      `);

      marker.on('add', () => {
        const markerElement = marker.getElement();
        if (markerElement) {
          const markerDiv = markerElement.querySelector('.team-marker') as HTMLElement;
          if (markerDiv) {
            markerDiv.addEventListener('mouseenter', () => {
              markerDiv.style.transform = 'scale(1.2)';
              briefPopup.setLatLng([member.latitude, member.longitude]).openOn(map.current!);
            });

            markerDiv.addEventListener('mouseleave', () => {
              markerDiv.style.transform = 'scale(1)';
              map.current!.closePopup(briefPopup);
            });
          }
        }
      });

      marker.on('click', () => {
        map.current!.closePopup(briefPopup);
        detailedPopup.setLatLng([member.latitude, member.longitude]).openOn(map.current!);
        map.current!.flyTo([member.latitude, member.longitude], 6, { duration: 1.5 });
      });
    });
  }, [teamMembers]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-2">Our Team</Badge>
          <h2 className="text-3xl font-bold text-primary mb-2">SAGE Team Around the World</h2>
          <p className="text-muted-foreground">Click on a team member to learn more about them.</p>
        </div>
        <Card className="overflow-hidden shadow-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-[600px] flex items-center justify-center bg-muted/30">
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            ) : (
              <div ref={mapContainer} className="h-[600px] w-full" />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
