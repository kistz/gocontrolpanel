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
import { generatePath, useCurrentServerId } from "@/lib/utils";
import { routes } from "@/routes";
import { Server } from "@/types/server";
import {
  IconActivity,
  IconAdjustmentsAlt,
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
    id: number;
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

export default function NavServers() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState(false);
  const [serverId, setServerId] = useState<number | null>(null);

  useEffect(() => {
    const id = useCurrentServerId(pathname);
    setServerId(id);
  }, [pathname]);

  useEffect(() => {
    for (const server of servers) {
      if (!servers.find((s) => s.id === server.id)?.isConnected) {
        (async () => await disconnectGbxClient(server.id))();
      }
    }

    for (const server of servers) {
      if (server.id === serverId) {
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

      const url = process.env.NEXT_PUBLIC_CONNECTOR_URL;
      if (!url) {
        setTimeout(() => toast.error("Can't connect to the server"));
        setLoading(false);
        return;
      }

      if (!session.jwt) {
        setTimeout(() => toast.error("Can't connect to the server"));
        setLoading(false);
        return;
      }

      try {
        const socket = new WebSocket(`${url}/ws/servers?token=${session.jwt}`);

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

  const group: ServerNavGroup = {
    name: "Servers",
    servers: servers.map((server) => ({
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
        ...(session?.user.roles.includes("admin") && server.fmUrl
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
        // {
        //   name: "Dev",
        //   url: generatePath(routes.servers.dev, {
        //     id: server.id,
        //   }),
        //   icon: IconCode,
        // }
      ],
    })),
  };

  return (
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
                    <span>No servers found</span>
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
                key={server.id || server.name}
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
  );
}
