"use client";

import {
  IconDashboard,
  IconDeviceGamepad2,
  IconMap,
  IconServer,
  IconStopwatch,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavAdmin } from "@/components/shell/nav-admin";
import { NavMain } from "@/components/shell/nav-main";
import { NavUser } from "@/components/shell/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/routes";
import Link from "next/link";

const data = {
  user: {
    name: "Marijntje04",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: routes.dashboard,
      icon: IconDashboard,
    },
    {
      title: "Players",
      url: routes.players,
      icon: IconUsers,
    },
    {
      title: "Records",
      url: routes.records,
      icon: IconStopwatch,
    },
    {
      title: "Maps",
      url: routes.maps,
      icon: IconMap,
    },
  ],
  admin: [
    {
      name: "Server",
      url: routes.admin.server,
      icon: IconServer,
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
              <Link href="/">
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
