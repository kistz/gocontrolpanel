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
import { disconnectGbxClient } from "@/lib/gbxclient";
import {
  generatePath,
  initGbxWebsocketClient,
  useCurrentServerUuid,
} from "@/lib/utils";
import { routes } from "@/routes";
import { Server } from "@/types/server";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ServerNavGroup {
  name: string;
  servers: {
    uuid: string;
    name: string;
    isConnected: boolean;
    isActive: boolean;
    icon?: React.ElementType;
    items?: {
      name: string;
      url: string;
      icon?: React.ElementType;
    }[];
  }[];
}

export default function NavGroups() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState(false);
  const [serverUuid, setServerUuid] = useState<string | null>(null);

  useEffect(() => {
    const uuid = useCurrentServerUuid(pathname);
    setServerUuid(uuid);
  }, [pathname]);

  useEffect(() => {
    for (const server of servers) {
      if (!servers.find((s) => s.uuid === server.uuid)?.isConnected) {
        (async () => await disconnectGbxClient(server.uuid))();
      }
    }

    for (const server of servers) {
      if (server.uuid === serverUuid && !server.isConnected) {
        toast.error(`Server ${server.name} is offline`);
        router.push("/");
      }
    }
  }, [servers]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        return;
      }

      if (!session.jwt) {
        setTimeout(() => toast.error("Can't connect to the server"));
        setLoading(false);
        return;
      }

      try {
        const socket = initGbxWebsocketClient(
          "/ws/servers",
          session.jwt as string,
          {
            serverUuid: session?.user.groups
              .map((group) => group.serverUuids)
              .flat(),
          },
        );

        socket.onmessage = async (event) => {
          const data: Server[] = JSON.parse(event.data);

          setHealthStatus(true);
          setServers(data);

          setLoading(false);
        };

        return () => {
          socket.close();
        };
      } catch {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const groupsSidebarGroup: ServerNavGroup[] =
    session?.user.groups.map((group) => ({
      name: group.name,
      servers: group.serverUuids
        .map((s) => {
          const server = servers.find((server) => server.uuid === s);
          if (!server) return undefined;

          return {
            uuid: server.uuid,
            name: server.name,
            isConnected: server.isConnected,
            icon: IconServer,
            isActive: serverUuid === server.uuid,
            items: [
              {
                name: "Settings",
                url: generatePath(routes.servers.settings, {
                  uuid: server.uuid,
                }),
                icon: IconAdjustmentsAlt,
              },
              {
                name: "Game",
                url: generatePath(routes.servers.game, {
                  uuid: server.uuid,
                }),
                icon: IconDeviceGamepad,
              },
              {
                name: "Maps",
                url: generatePath(routes.servers.maps, {
                  uuid: server.uuid,
                }),
                icon: IconMap,
              },
              {
                name: "Players",
                url: generatePath(routes.servers.players, {
                  uuid: server.uuid,
                }),
                icon: IconUsers,
              },
              {
                name: "Live",
                url: generatePath(routes.servers.live, {
                  uuid: server.uuid,
                }),
                icon: IconActivity,
              },
              ...(session?.user.admin && server.fmUrl
                ? [
                    {
                      name: "Files",
                      url: generatePath(routes.servers.files, {
                        uuid: server.uuid,
                      }),
                      icon: IconFileDescription,
                    },
                  ]
                : []),
              {
                name: "Interface",
                url: generatePath(routes.servers.interface, {
                  uuid: server.uuid,
                }),
                icon: IconDeviceDesktop,
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

  return groupsSidebarGroup.map((group) => (
    <SidebarGroup
      className="group-data-[collapsible=icon]:hidden select-none"
      key={group.name || "default"}
    >
      {group.name && <SidebarGroupLabel>{group.name}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2">
                  <IconServer />
                  <span>Loading...</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : healthStatus ? (
            group.servers.length === 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="flex items-center gap-2 text-foreground/50 pointer-events-none">
                    <IconServer />
                    <span>No servers selected</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 text-foreground/50 pointer-events-none">
                  <IconServer />
                  <span>Connector offline</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {group.servers.map((server) =>
            server.items && server.items.length > 0 ? (
              <Collapsible
                key={server.uuid}
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
                          {server.items.map((item) => (
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
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}
