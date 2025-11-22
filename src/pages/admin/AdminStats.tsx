import { useState } from "react";
import StatForm from "@/components/StatForm";
import StatManagement from "@/components/StatManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStats() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingStat, setEditingStat] = useState(null);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Statistics</h2>
        <p className="text-muted-foreground">Manage the statistics displayed on your website.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingStat ? 'Edit Statistic' : 'Add New Statistic'}</CardTitle>
        </CardHeader>
        <CardContent>
          <StatForm 
            onStatAdded={refreshData} 
            editingStat={editingStat}
            onCancelEdit={() => setEditingStat(null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <StatManagement 
            onStatDeleted={refreshData} 
            onEditStat={setEditingStat}
            key={refreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
}
