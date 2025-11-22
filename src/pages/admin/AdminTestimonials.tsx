import { useState } from "react";
import TestimonialForm from "@/components/TestimonialForm";
import TestimonialManagement from "@/components/TestimonialManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTestimonials() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Testimonials</h2>
        <p className="text-muted-foreground">Manage testimonials and reviews from your community.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialForm 
            onTestimonialAdded={refreshData} 
            editingTestimonial={editingTestimonial}
            onCancelEdit={() => setEditingTestimonial(null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialManagement 
            onTestimonialDeleted={refreshData} 
            onEditTestimonial={setEditingTestimonial}
            key={refreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
}
