import { 
  Users, 
  GraduationCap, 
  Calendar, 
  History, 
  MessageSquare, 
  BarChart3, 
  Bell, 
  MapPin,
  FileText,
  Settings
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Site Controls", url: "/admin/controls", icon: Settings },
  { title: "Submissions", url: "/admin/submissions", icon: FileText },
  { title: "Tutors", url: "/admin/tutors", icon: Users },
  { title: "Seminars", url: "/admin/seminars", icon: Calendar },
  { title: "Past Events", url: "/admin/past-events", icon: History },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Statistics", url: "/admin/stats", icon: BarChart3 },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Team Map", url: "/admin/team", icon: MapPin },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            Admin Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.url)}
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
