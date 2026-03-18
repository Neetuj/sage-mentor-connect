import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PartnerFormProps {
  partner?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const PartnerForm = ({ partner, onSuccess, onCancel }: PartnerFormProps) => {
  const [name, setName] = useState(partner?.name || "");
  const [websiteUrl, setWebsiteUrl] = useState(partner?.website_url || "");
  const [displayOrder, setDisplayOrder] = useState(partner?.display_order || 0);
  const [isVisible, setIsVisible] = useState(partner?.is_visible ?? true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let logoUrl = partner?.logo_url || "";

      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("partner-logos")
          .upload(fileName, logoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("partner-logos")
          .getPublicUrl(fileName);

        logoUrl = urlData.publicUrl;
      }

      if (!logoUrl) {
        toast.error("Please upload a logo");
        setUploading(false);
        return;
      }

      const partnerData = {
        name,
        logo_url: logoUrl,
        website_url: websiteUrl || null,
        display_order: displayOrder,
        is_visible: isVisible,
      };

      if (partner) {
        const { error } = await supabase
          .from("partners")
          .update(partnerData)
          .eq("id", partner.id);
        if (error) throw error;
        toast.success("Partner updated");
      } else {
        const { error } = await supabase.from("partners").insert(partnerData);
        if (error) throw error;
        toast.success("Partner added");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Partner Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="logo">Logo Image</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          required={!partner}
        />
        {partner?.logo_url && !logoFile && (
          <img src={partner.logo_url} alt="Current logo" className="mt-2 h-12 object-contain" />
        )}
      </div>

      <div>
        <Label htmlFor="website">Website URL (optional)</Label>
        <Input
          id="website"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={isVisible} onCheckedChange={setIsVisible} />
        <Label>Visible</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={uploading}>
          {uploading ? "Saving..." : partner ? "Update" : "Add Partner"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PartnerForm;
