import * as React from "react";
import {
  NotebookText,
  PieChart,
  BookMarked,
  GraduationCap
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  main: [
    {
      name: "Dashboard",
      url: "/",
      icon: PieChart,
    },
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
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.main} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
