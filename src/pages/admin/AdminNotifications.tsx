import { useState } from "react";
import NotificationForm from "@/components/NotificationForm";
import NotificationManagement from "@/components/NotificationManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNotifications() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingNotification, setEditingNotification] = useState(null);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Notifications</h2>
        <p className="text-muted-foreground">Manage popup notifications for your website visitors.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingNotification ? 'Edit Notification' : 'Add New Notification'}</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationForm 
            onNotificationAdded={refreshData} 
            editingNotification={editingNotification}
            onCancelEdit={() => setEditingNotification(null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationManagement 
            onNotificationDeleted={refreshData} 
            onEditNotification={setEditingNotification}
            key={refreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
}
