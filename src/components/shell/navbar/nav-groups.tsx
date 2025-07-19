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
import { generatePath, hasPermissionSync, useCurrentid } from "@/lib/utils";
import { routePermissions, routes } from "@/routes";
import { ServerInfo } from "@/types/server";
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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverId, setServerId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const uuid = useCurrentid(pathname);
    setServerId(uuid);
  }, [pathname]);

  useEffect(() => {
    for (const server of servers) {
      if (server.id === serverId && !server.isConnected) {
        toast.error(`Server ${server.name} is offline`);
        router.push("/");
      }
    }
  }, [servers]);

  useEffect(() => {
    if (!status) {
      return;
    }

    try {
      const ws = new WebSocket("/api/ws/servers");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "servers":
            const serversInfo: ServerInfo[] = data.data;
            setServers(serversInfo);
            setLoading(false);
            break;
          case "connect":
            const { serverId } = data.data;
            setServers((prev) =>
              prev.map((server) =>
                server.id === serverId
                  ? { ...server, isConnected: true }
                  : server,
              ),
            );
            break;
          case "disconnect":
            const { serverId: disconnectedServerId } = data.data;
            setServers((prev) =>
              prev.map((server) =>
                server.id === disconnectedServerId
                  ? { ...server, isConnected: false }
                  : server,
              ),
            );
            break;
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setLoading(false);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [status]);

  const groupsSidebarGroup: ServerNavGroup[] =
    session?.user.groups.map((group) => ({
      name: group.name,
      servers: servers
        .filter((server) => group.servers.some((s) => s.id === server.id))
        .map((server) => {
          return {
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
              ...(session?.user.admin && server.filemanagerUrl
                ? [
                    {
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
                    },
                  ]
                : []),
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
        })
        .filter((server): server is NonNullable<typeof server> => !!server),
    })) || [];

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

  return groupsSidebarGroup.map((group) => (
    <SidebarGroup
      className="group-data-[collapsible=icon]:hidden select-none"
      key={group.name || "default"}
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
                              <span className="overflow-hidden text-ellipsis text-nowrap">
                                {server.name}
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
