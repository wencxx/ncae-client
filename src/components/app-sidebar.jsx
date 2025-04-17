import * as React from "react";
import {
  NotebookText,
  PieChart,
  BookMarked,
  GraduationCap,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/auth/auth-context";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  admin: [
    {
      name: "Strands",
      url: "/strands",
      icon: BookMarked,
    },
    {
      name: "Examinations",
      url: "/examinations",
      icon: NotebookText,
    },
    {
      name: "Users",
      url: "/users",
      icon: GraduationCap,
    },
  ],
  userLink: [
    {
      name: "Dashboard",
      url: "/",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { role } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {role && role === 'user' && <NavMain items={data.userLink} />}
        {role && role === 'admin' && <NavMain items={data.admin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
