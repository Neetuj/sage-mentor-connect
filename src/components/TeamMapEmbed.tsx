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
  const markersRef = useRef<L.Marker[]>([]);

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      console.log('[TeamMapEmbed] Fetched team members:', data);
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
    }).addTo(map.current);

    tile.on('load', () => console.log('[TeamMapEmbed] Tiles loaded'));
    tile.on('tileerror', (e) => console.error('[TeamMapEmbed] Tile error', e));

    setTimeout(() => map.current?.invalidateSize(true), 100);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !teamMembers.length) {
      console.log('[TeamMapEmbed] Not adding markers:', { hasMap: !!map.current, memberCount: teamMembers.length });
      return;
    }

    console.log('[TeamMapEmbed] Adding markers for', teamMembers.length, 'members');

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    teamMembers.forEach((member) => {
      console.log(`[TeamMapEmbed] Creating marker for ${member.name} at [${member.latitude}, ${member.longitude}]`);

      const iconHtml = member.profile_image_url
        ? `<div style="width:50px;height:50px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);background-image:url(${member.profile_image_url});background-size:cover;background-position:center;cursor:pointer;transition:transform 0.2s;"></div>`
        : `<div style="width:50px;height:50px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);background:#4a7c59;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:20px;cursor:pointer;transition:transform 0.2s;">${member.name.charAt(0)}</div>`;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-team-marker",
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
      });

      const marker = L.marker([member.latitude, member.longitude], { icon: customIcon })
        .addTo(map.current!);

      // Detailed popup
      const popupContent = `
        <div style="padding: 12px; text-align: center; min-width: 200px;">
          ${member.profile_image_url ? `
            <img 
              src="${member.profile_image_url}" 
              alt="${member.name}"
              style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; border: 3px solid #4a7c59;"
            />
          ` : ''}
          <h3 style="margin: 8px 0; font-size: 1.1em; font-weight: bold; color: #4a7c59;">${member.name}</h3>
          <p style="margin: 4px 0; color: #6b8e7d; font-weight: 600;">${member.role}</p>
          ${member.school ? `<p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>School:</strong> ${member.school}</p>` : ''}
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Location:</strong> ${member.location}</p>
          ${member.email ? `<p style="margin: 8px 0 0 0; font-size: 0.9em;"><a href="mailto:${member.email}" style="color: #4a7c59; text-decoration: underline;">${member.email}</a></p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'team-member-popup'
      });

      // Hover tooltip
      marker.bindTooltip(`<strong>${member.name}</strong><br/>${member.role}`, {
        direction: 'top',
        offset: [0, -40],
        opacity: 0.9
      });

      // Add hover effect on marker
      marker.on('mouseover', function() {
        const el = this.getElement();
        if (el) {
          el.style.transform = 'scale(1.2)';
          el.style.zIndex = '1000';
        }
      });

      marker.on('mouseout', function() {
        const el = this.getElement();
        if (el) {
          el.style.transform = 'scale(1)';
          el.style.zIndex = '';
        }
      });

      marker.on('click', () => {
        console.log(`[TeamMapEmbed] Clicked on ${member.name}`);
        map.current!.flyTo([member.latitude, member.longitude], 8, { duration: 1 });
      });

      markersRef.current.push(marker);
    });

    console.log('[TeamMapEmbed] Total markers added:', markersRef.current.length);

    // If only one marker, center on it
    if (teamMembers.length === 1) {
      map.current.setView([teamMembers[0].latitude, teamMembers[0].longitude], 6);
    }
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
