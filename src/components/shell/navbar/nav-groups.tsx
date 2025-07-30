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
import { generatePath, hasPermissionSync } from "@/lib/utils";
import { useNotifications } from "@/providers/notification-provider";
import { useServers } from "@/providers/servers-provider";
import { routePermissions, routes } from "@/routes";
import {
  IconActivity,
  IconAdjustmentsAlt,
  IconDeviceDesktop,
  IconDeviceGamepad,
  IconFileDescription,
  IconMap,
  IconServer,
  IconUsers,
} from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";

interface ServerNavGroup {
  name: string;
  servers: {
    id: string;
    name: string;
    isConnected: boolean;
    isActive: boolean;
    icon?: React.ElementType;
    items?: {
      name: string;
      url: string;
      icon?: React.ElementType;
      auth?: boolean;
    }[];
  }[];
}

export default function NavGroups() {
  const { data: session } = useSession();
  const { notifications } = useNotifications();

  const { servers, serverId, loading } = useServers();

  const groupsSidebarGroup: ServerNavGroup[] = useMemo(
    () =>
      session?.user.groups.map((group) => ({
        name: group.name,
        servers: servers
          .filter((server) => group.servers.some((s) => s.id === server.id))
          .map((server) => {
            const serverGroup = {
              id: server.id,
              name: server.name,
              isConnected: server.isConnected,
              icon: IconServer,
              isActive: serverId === server.id,
              items: [
                {
                  name: "Settings",
                  url: generatePath(routes.servers.settings, {
                    id: server.id,
                  }),
                  icon: IconAdjustmentsAlt,
                  auth: hasPermissionSync(
                    session,
                    routePermissions.servers.settings,
                    server.id,
                  ),
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
                  auth: hasPermissionSync(
                    session,
                    routePermissions.servers.maps,
                    server.id,
                  ),
                },
                {
                  name: "Players",
                  url: generatePath(routes.servers.players, {
                    id: server.id,
                  }),
                  icon: IconUsers,
                  auth: hasPermissionSync(
                    session,
                    routePermissions.servers.players,
                    server.id,
                  ),
                },
                {
                  name: "Live",
                  url: generatePath(routes.servers.live, {
                    id: server.id,
                  }),
                  icon: IconActivity,
                },
                {
                  name: "Interface",
                  url: generatePath(routes.servers.interface, {
                    id: server.id,
                  }),
                  icon: IconDeviceDesktop,
                  auth: hasPermissionSync(
                    session,
                    routePermissions.servers.interface,
                    server.id,
                  ),
                },
                // {
                //   name: "Dev",
                //   url: generatePath(routes.servers.dev, {
                //     uuid: server.uuid,
                //   }),
                //   icon: IconCode,
                // }
              ],
            };

            if (server.filemanagerUrl) {
              serverGroup.items.push({
                name: "Files",
                url: generatePath(routes.servers.files, {
                  id: server.id,
                }),
                icon: IconFileDescription,
                auth: hasPermissionSync(
                  session,
                  routePermissions.servers.files,
                  server.id,
                ),
              });
            }

            return serverGroup;
          })
          .filter((server): server is NonNullable<typeof server> => !!server),
      })) || [],
    [session, servers, serverId],
  );

  if (loading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden select-none">
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconServer />
                  <span>Loading...</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (groupsSidebarGroup.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden select-none">
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>No groups found</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return groupsSidebarGroup.map((group, index) => (
    <SidebarGroup
      className="group-data-[collapsible=icon]:hidden select-none"
      key={index}
    >
      {group.name && <SidebarGroupLabel>{group.name}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {group.servers.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconServer />
                  <span>No servers in this group</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            group.servers.map((server) =>
              server.items && server.items.length > 0 ? (
                <Collapsible
                  key={server.id}
                  asChild
                  defaultOpen={server.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {server.isConnected ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={server.name} asChild>
                            <div className="select-none cursor-pointer">
                              {server.icon && <server.icon />}
                              <span className="overflow-hidden text-ellipsis text-nowrap flex items-center">
                                {server.name}
                                {notifications.some(
                                  (n) => n.serverId === server.id && !n.read,
                                ) && (
                                  <span className="ml-2 h-3 w-3 text-center rounded-full bg-destructive text-[8px]">
                                    {
                                      notifications.filter(
                                        (n) =>
                                          n.serverId === server.id && !n.read,
                                      ).length
                                    }
                                  </span>
                                )}
                              </span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {server.items
                              .filter((i) => i.auth || i.auth === undefined)
                              .map((item) => (
                                <SidebarMenuSubItem key={item.name}>
                                  <SidebarMenuSubButton asChild>
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
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className="text-foreground/50 pointer-events-none"
                      >
                        <div>
                          {server.icon && <server.icon />}
                          <span>{server.name}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={server.name}>
                  <SidebarMenuButton asChild>
                    <div>
                      {server.icon && <server.icon />}
                      <span>{server.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}
