import {
  IconAdjustmentsAlt,
  IconDashboard,
  IconDeviceGamepad,
  IconDeviceGamepad2,
  IconMap,
  IconServer,
  IconStopwatch,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { getServers } from "@/actions/servers";
import { NavUser } from "@/components/shell/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { generatePath } from "@/lib/utils";
import { routes } from "@/routes";
import Navbar, { NavGroup } from "./navbar";

const servers = await getServers();

export const navGroups: NavGroup[] = [
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
    name: "Servers",
    items: servers.map((server) => ({
      id: server.id,
      name: server.name,
      icon: IconServer,
      items: [
        {
          name: "Settings",
          url: generatePath(routes.servers.settings, {
            id: server.id,
          }),
          icon: IconAdjustmentsAlt,
        },
        {
          name: "Game",
          url: generatePath(routes.servers.game, {
            id: server.id,
          }),
          icon: IconDeviceGamepad,
        },
        {
          name: "Maps",
          url: generatePath(routes.servers.maps, {
            id: server.id,
          }),
          icon: IconMap,
        },
      ],
    })),
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
