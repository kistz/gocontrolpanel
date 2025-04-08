"use client";

import {
  IconAdjustmentsAlt,
  IconDashboard,
  IconDeviceGamepad2,
  IconMap,
  IconServer,
  IconStopwatch,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavUser } from "@/components/shell/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/routes";
import Navbar, { NavGroup } from "./navbar";

const navGroups: NavGroup[] = [
  {
    items: [
      {
        name: "Dashboard",
        url: routes.dashboard,
        icon: IconDashboard,
      },
      {
        name: "Players",
        url: routes.players,
        icon: IconUsers,
      },
      {
        name: "Records",
        url: routes.records,
        icon: IconStopwatch,
      },
      {
        name: "Maps",
        url: routes.maps,
        icon: IconMap,
      },
    ],
  },
  {
    name: "Admin",
    items: [
      {
        name: "Server",
        icon: IconServer,
        isActive: true,
        items: [
          {
            name: "Settings",
            url: routes.admin.server.settings,
            icon: IconAdjustmentsAlt,
          },
        ],
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <IconDeviceGamepad2 className="!size-5" />
              <span className="text-base font-semibold">GoController</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Navbar groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
