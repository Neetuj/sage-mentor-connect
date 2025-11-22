import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import AdminSubmissions from "./admin/AdminSubmissions";
import AdminTutors from "./admin/AdminTutors";
import AdminSeminars from "./admin/AdminSeminars";
import AdminPastEvents from "./admin/AdminPastEvents";
import AdminTestimonials from "./admin/AdminTestimonials";
import AdminStats from "./admin/AdminStats";
import AdminNotifications from "./admin/AdminNotifications";
import AdminTeam from "./admin/AdminTeam";
import AdminControls from "./admin/AdminControls";

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/controls" replace />} />
        <Route path="/controls" element={<AdminControls />} />
        <Route path="/submissions" element={<AdminSubmissions />} />
        <Route path="/tutors" element={<AdminTutors />} />
        <Route path="/seminars" element={<AdminSeminars />} />
        <Route path="/past-events" element={<AdminPastEvents />} />
        <Route path="/testimonials" element={<AdminTestimonials />} />
        <Route path="/stats" element={<AdminStats />} />
        <Route path="/notifications" element={<AdminNotifications />} />
        <Route path="/team" element={<AdminTeam />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;