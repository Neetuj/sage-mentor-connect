import { useState } from "react";
import TutorAdminForm from "@/components/TutorAdminForm";
import TutorManagement from "@/components/TutorManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTutors() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Tutor Management</h2>
        <p className="text-muted-foreground">Add and manage tutors in your directory.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Tutor</CardTitle>
        </CardHeader>
        <CardContent>
          <TutorAdminForm onTutorAdded={refreshData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Tutors</CardTitle>
        </CardHeader>
        <CardContent>
          <TutorManagement onTutorDeleted={refreshData} key={refreshTrigger} />
        </CardContent>
      </Card>
    </div>
  );
}
