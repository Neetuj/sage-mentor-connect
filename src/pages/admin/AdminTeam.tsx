import { useState } from "react";
import TeamMemberForm from "@/components/TeamMemberForm";
import TeamMemberManagement from "@/components/TeamMemberManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTeam() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Team Map</h2>
        <p className="text-muted-foreground">Manage team members displayed on the global team map.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberForm 
            onMemberAdded={refreshData} 
            editingMember={editingTeamMember}
            onCancelEdit={() => setEditingTeamMember(null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberManagement 
            onMemberDeleted={refreshData} 
            onEditMember={setEditingTeamMember}
            key={refreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
}
