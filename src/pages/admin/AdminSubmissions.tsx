import SubmissionManagement from "@/components/SubmissionManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSubmissions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Form Submissions</h2>
        <p className="text-muted-foreground">View and manage all form submissions from your website.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionManagement />
        </CardContent>
      </Card>
    </div>
  );
}
