import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PartnerManagement from "@/components/PartnerManagement";

const AdminPartners = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Partner Management</h1>
      <p className="text-muted-foreground">
        Upload partner logos to display in the scrolling banner on the homepage. Logos are automatically tinted to match the SAGE color scheme.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnerManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPartners;
