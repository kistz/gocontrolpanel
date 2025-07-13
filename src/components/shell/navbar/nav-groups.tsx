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
import { generatePath, useCurrentid } from "@/lib/utils";
import { routes } from "@/routes";
import { ServerInfo } from "@/types/api/server";
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
    id: string;
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
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState(false);
  const [id, setid] = useState<string | null>(null);

  useEffect(() => {
    const uuid = useCurrentid(pathname);
    setid(uuid);
  }, [pathname]);

  useEffect(() => {
    for (const server of servers) {
      if (server.id === id && !server.isConnected) {
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

      try {
        const eventSource = new EventSource("/api/ws/servers");

        eventSource.onmessage = (event) => {
          console.log(event);
        };

        return () => {
          eventSource.close();
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
      servers: servers
        .map((server) => {
          return {
            id: server.id,
            name: server.name,
            isConnected: server.isConnected,
            icon: IconServer,
            isActive: id === server.id,
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
              {
                name: "Players",
                url: generatePath(routes.servers.players, {
                  id: server.id,
                }),
                icon: IconUsers,
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
                    },
                  ]
                : []),
              {
                name: "Interface",
                url: generatePath(routes.servers.interface, {
                  id: server.id,
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
