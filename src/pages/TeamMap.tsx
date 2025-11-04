import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const TeamMap = () => {
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
      console.log('[TeamMap] Fetched team members:', data);
      return data as TeamMember[];
    },
  });

  useEffect(() => {
    if (!mapContainer.current) {
      console.error('[TeamMap] Map container ref not found');
      return;
    }
    
    if (map.current) {
      console.log('[TeamMap] Map already exists');
      return;
    }

    console.log('[TeamMap] Initializing Leaflet map');
    
    try {
      const mapInstance = L.map(mapContainer.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        preferCanvas: true,
      }).setView([39.8283, -98.5795], 4);

      const tile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      });

      tile.on('load', () => console.log('[TeamMap] Tiles loaded successfully'));
      tile.on('tileerror', (e) => console.error('[TeamMap] Tile loading error:', e));
      
      tile.addTo(mapInstance);
      
      // Set map.current AFTER tiles are added
      map.current = mapInstance;

      setTimeout(() => {
        if (mapInstance) {
          mapInstance.invalidateSize(true);
          console.log('[TeamMap] Map size invalidated and ready');
        }
      }, 300);
    } catch (error) {
      console.error('[TeamMap] Error initializing map:', error);
    }

    return () => {
      console.log('[TeamMap] Cleaning up map');
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.warn('[TeamMap] Error removing map:', e);
        }
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !teamMembers.length) {
      console.log('[TeamMap] Not adding markers:', { hasMap: !!map.current, memberCount: teamMembers.length });
      return;
    }

    console.log('[TeamMap] Adding markers for', teamMembers.length, 'members');

    // Clear existing markers
    markersRef.current.forEach(m => {
      try {
        m.remove();
      } catch (e) {
        console.warn('[TeamMap] Error removing marker:', e);
      }
    });
    markersRef.current = [];

    teamMembers.forEach((member) => {
      console.log(`[TeamMap] Creating marker for ${member.name} at [${member.latitude}, ${member.longitude}]`);

      // Create a simple map pin icon
      const iconHtml = `
        <div class="marker-container" style="position: relative; width: 35px; height: 50px;">
          <svg width="35" height="50" viewBox="0 0 35 50" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
            <path d="M17.5 0C7.84 0 0 7.84 0 17.5c0 13.16 17.5 32.5 17.5 32.5S35 30.66 35 17.5C35 7.84 27.16 0 17.5 0z" fill="#4a7c59"/>
            <circle cx="17.5" cy="16" r="10" fill="white"/>
            <text x="17.5" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#4a7c59">${member.name.charAt(0)}</text>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-team-marker",
        iconSize: [35, 50],
        iconAnchor: [17.5, 50],
        popupAnchor: [0, -50],
      });

      const marker = L.marker([member.latitude, member.longitude], { 
        icon: customIcon,
        interactive: true,
        keyboard: true
      }).addTo(map.current!);

      // Detailed popup
      const popupContent = `
        <div style="padding: 12px; text-align: center; min-width: 200px;">
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
          const container = el.querySelector('.marker-container') as HTMLElement;
          if (container) {
            container.style.transform = 'scale(1.15)';
            container.style.transition = 'transform 0.2s ease';
          }
          el.style.zIndex = '1000';
        }
      });

      marker.on('mouseout', function() {
        const el = this.getElement();
        if (el) {
          const container = el.querySelector('.marker-container') as HTMLElement;
          if (container) {
            container.style.transform = 'scale(1)';
          }
          el.style.zIndex = '600';
        }
      });

      marker.on('click', () => {
        console.log(`[TeamMap] Clicked on ${member.name}`);
        map.current!.flyTo([member.latitude, member.longitude], 8, { duration: 1 });
      });

      markersRef.current.push(marker);
      
      // Force marker to persist
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.style.willChange = 'transform';
        markerElement.style.zIndex = '600';
      }
    });

    console.log('[TeamMap] Total markers added:', markersRef.current.length);

    // If only one marker, center on it with slight delay
    if (teamMembers.length === 1) {
      setTimeout(() => {
        if (map.current) {
          map.current.setView([teamMembers[0].latitude, teamMembers[0].longitude], 6);
          console.log('[TeamMap] Centered on single marker');
        }
      }, 300);
    }
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
