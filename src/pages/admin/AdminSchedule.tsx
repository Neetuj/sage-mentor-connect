import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import ScheduleItemForm from "@/components/ScheduleItemForm";
import ScheduleItemManagement from "@/components/ScheduleItemManagement";

const AdminSchedule = () => {
  const [seminars, setSeminars] = useState<any[]>([]);
  const [selectedSeminarId, setSelectedSeminarId] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchSeminars = async () => {
      const { data } = await supabase.from("seminars").select("id, title").order("date");
      setSeminars(data || []);
    };
    fetchSeminars();
  }, []);

  const handleSaved = () => {
    setEditingItem(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Schedule Management</h1>

      <div className="max-w-sm">
        <Label>Select Seminar</Label>
        <Select value={selectedSeminarId} onValueChange={(v) => { setSelectedSeminarId(v); setEditingItem(null); }}>
          <SelectTrigger><SelectValue placeholder="Choose a seminar..." /></SelectTrigger>
          <SelectContent>
            {seminars.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSeminarId && (
        <>
          <ScheduleItemForm
            seminarId={selectedSeminarId}
            editingItem={editingItem}
            onSaved={handleSaved}
            onCancel={editingItem ? () => setEditingItem(null) : undefined}
          />
          <ScheduleItemManagement
            seminarId={selectedSeminarId}
            refreshKey={refreshKey}
            onEdit={setEditingItem}
          />
        </>
      )}
    </div>
  );
};

export default AdminSchedule;
