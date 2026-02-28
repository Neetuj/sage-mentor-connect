import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleItemManagementProps {
  seminarId: string;
  refreshKey: number;
  onEdit: (item: any) => void;
}

const ScheduleItemManagement = ({ seminarId, refreshKey, onEdit }: ScheduleItemManagementProps) => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seminarId) fetchItems();
  }, [seminarId, refreshKey]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("seminar_schedule_items")
        .select("*")
        .eq("seminar_id", seminarId)
        .order("display_order")
        .order("time_slot");
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("seminar_schedule_items").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Schedule item removed." });
      fetchItems();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (!seminarId) return <p className="text-muted-foreground">Select a seminar to manage its schedule.</p>;
  if (loading) return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />;
  if (items.length === 0) return <p className="text-muted-foreground">No schedule items for this seminar.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Speaker</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.display_order}</TableCell>
            <TableCell className="whitespace-nowrap">{item.time_slot}</TableCell>
            <TableCell>
              <div className="font-medium">{item.event_title}</div>
              {item.event_description && <p className="text-xs text-muted-foreground">{item.event_description}</p>}
            </TableCell>
            <TableCell>{item.speaker || "—"}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScheduleItemManagement;
