import { useState } from "react";
import PastEventForm from "@/components/PastEventForm";
import PastEventManagement from "@/components/PastEventManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPastEvents() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Past Events</h2>
        <p className="text-muted-foreground">Document your organization's past events and their impact.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Past Event</CardTitle>
        </CardHeader>
        <CardContent>
          <PastEventForm onSuccess={refreshData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Past Events</CardTitle>
        </CardHeader>
        <CardContent>
          <PastEventManagement refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>
    </div>
  );
}
