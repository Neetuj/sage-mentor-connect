import { useState } from "react";
import SeminarForm from "@/components/SeminarForm";
import SeminarManagement from "@/components/SeminarManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSeminars() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingSeminar, setEditingSeminar] = useState(null);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Seminar Management</h2>
        <p className="text-muted-foreground">Schedule and manage upcoming seminars and workshops.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingSeminar ? 'Edit Seminar' : 'Add New Seminar'}</CardTitle>
        </CardHeader>
        <CardContent>
          <SeminarForm 
            onSeminarAdded={refreshData} 
            editingSeminar={editingSeminar}
            onCancelEdit={() => setEditingSeminar(null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Seminars</CardTitle>
        </CardHeader>
        <CardContent>
          <SeminarManagement 
            onSeminarDeleted={refreshData} 
            onEditSeminar={setEditingSeminar}
            key={refreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
}
