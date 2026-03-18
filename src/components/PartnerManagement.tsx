import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import PartnerForm from "./PartnerForm";

const PartnerManagement = () => {
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Partner deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
    queryClient.invalidateQueries({ queryKey: ["partners"] });
  };

  if (showForm || editing) {
    return (
      <PartnerForm
        partner={editing}
        onSuccess={handleSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Partners ({partners.length})</h3>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Partner
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}

      <div className="grid gap-3">
        {partners.map((partner: any) => (
          <Card key={partner.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-10 w-20 object-contain"
                />
                <div>
                  <p className="font-medium">{partner.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={partner.is_visible ? "default" : "secondary"}>
                      {partner.is_visible ? "Visible" : "Hidden"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Order: {partner.display_order}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(partner)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(partner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PartnerManagement;
