import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleItem {
  id: string;
  time_slot: string;
  event_title: string;
  event_description: string | null;
  speaker: string | null;
  display_order: number;
}

interface ScheduleDialogProps {
  seminarId: string;
  seminarTitle: string;
  children: React.ReactNode;
}

const ScheduleDialog = ({ seminarId, seminarTitle, children }: ScheduleDialogProps) => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSchedule();
    }
  }, [open, seminarId]);

  const fetchSchedule = async () => {
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
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            {seminarTitle} — Schedule
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No schedule items yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Time</span>
                </TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="w-[140px]">Speaker</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-primary whitespace-nowrap">{item.time_slot}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.event_title}</div>
                    {item.event_description && (
                      <p className="text-xs text-muted-foreground mt-1">{item.event_description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.speaker || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
