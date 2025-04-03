"use client";

import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconDeviceGamepad2,
  IconFolder,
  IconListDetails,
} from "@tabler/icons-react";
import * as React from "react";

import { NavAdmin } from "@/components/nav-admin";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  user: {
    name: "Marijntje04",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Players",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Records",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Maps",
      url: "#",
      icon: IconFolder,
    },
  ],
  admin: [
    {
      name: "Server",
      url: "#",
      icon: IconDatabase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer"
            >
              <Link href="#">
                <IconDeviceGamepad2 className="!size-5" />
                <span className="text-base font-semibold">GoController</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavAdmin items={data.admin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
