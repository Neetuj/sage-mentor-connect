import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const PartnerScroll = () => {
  const { data: partners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_visible", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  if (partners.length === 0) return null;

  // Split partners into two rows
  const mid = Math.ceil(partners.length / 2);
  const row1 = partners.slice(0, mid);
  const row2 = partners.slice(mid);

  // Double each row for seamless infinite scroll
  const scrollRow1 = [...row1, ...row1];
  const scrollRow2 = [...row2, ...row2];

  const renderLogo = (partner: typeof partners[0], index: number) => (
    <a
      key={`${partner.id}-${index}`}
      href={partner.website_url || "#"}
      target={partner.website_url ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="flex-shrink-0 flex items-center justify-center h-16 w-40 opacity-60 hover:opacity-100 transition-all duration-500"
      title={partner.name}
    >
      <img
        src={partner.logo_url}
        alt={`${partner.name} logo`}
        className="max-h-full max-w-full object-contain"
        style={{
          filter: "sepia(100%) hue-rotate(70deg) saturate(60%) brightness(80%)",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLImageElement).style.filter = "none";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLImageElement).style.filter =
            "sepia(100%) hue-rotate(70deg) saturate(60%) brightness(80%)";
        }}
      />
    </a>
  );

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          Our Partners
        </Badge>
        <h3 className="text-2xl sm:text-3xl font-bold text-primary">
          Proudly Supported By
        </h3>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent z-10" />

        {/* Row 1 - scrolls left */}
        <div className="flex animate-scroll-x gap-12 py-4">
          {scrollRow1.map((partner, index) => renderLogo(partner, index))}
        </div>

        {/* Row 2 - scrolls right (reverse) */}
        <div className="flex animate-scroll-x-reverse gap-12 py-4">
          {scrollRow2.map((partner, index) => renderLogo(partner, index))}
        </div>
      </div>
    </div>
  );
};

export default PartnerScroll;
