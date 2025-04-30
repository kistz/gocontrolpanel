"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import config from "@/lib/config";
import { generatePath } from "@/lib/utils";
import { routes } from "@/routes";
import { Server } from "@/types/config";
import {
  IconAdjustmentsAlt,
  IconDeviceGamepad,
  IconMap,
  IconServer,
} from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavGroup } from ".";

export default function NavServers() {
  const [servers, setServers] = useState<Server[]>([]);

  const group: NavGroup = {
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
  };

  return (
    <SidebarGroup
      className="group-data-[collapsible=icon]:hidden"
      key={group.name || "default"}
    >
      {group.name && <SidebarGroupLabel>{group.name}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {group.items.map((item) =>
            item.items && item.items.length > 0 ? (
              <Collapsible
                key={item.id || item.name}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.name} asChild>
                      {item.url ? (
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span className="overflow-hidden text-ellipsis text-nowrap">
                            {item.name}
                          </span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </Link>
                      ) : (
                        <div>
                          {item.icon && <item.icon />}
                          <span className="overflow-hidden text-ellipsis text-nowrap">
                            {item.name}
                          </span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton asChild>
                            {subItem.url ? (
                              <Link href={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.name}</span>
                              </Link>
                            ) : (
                              <div>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.name}</span>
                              </div>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  {item.url ? (
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <div>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
