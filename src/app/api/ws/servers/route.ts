import { auth } from "@/lib/auth";
import { GbxClientManager, getGbxClientManager } from "@/lib/gbxclient";
import { createSSEStream, SSEHeaders } from "@/lib/sse";
import { ServerInfo } from "@/types/api/server";

export async function GET() {
  const session = await auth();

  const servers =
    session?.user?.groups?.flatMap((group) => group.servers) || [];

  if (servers.length === 0) {
    return new Response("No servers found", { status: 404 });
  }

  const serverManagers: {
    manager: GbxClientManager;
    server: ServerInfo;
  }[] = [];

  for (const server of servers) {
    const manager = await getGbxClientManager(server.id);
    if (manager) {
      serverManagers.push({
        manager,
        server: {
          id: server.id,
          name: server.name,
          filemanagerUrl: server.filemanagerUrl,
          isConnected: manager.getIsConnected(),
        },
      });
    }
  }

  const stream = createSSEStream((push) => {
    const onConnect = (serverId: string) => push("connect", { serverId });
    const onDisconnect = (serverId: string) => push("disconnect", { serverId });

    for (const serverManager of serverManagers) {
      serverManager.manager.on("connect", onConnect);
      serverManager.manager.on("disconnect", onDisconnect);
    }

    push("servers", serverManagers.map((sm) => sm.server));

    return () => {
      console.log("Cleaning up SSE connections");

      for (const serverManager of serverManagers) {
        serverManager.manager.off("connect", onConnect);
        serverManager.manager.off("disconnect", onDisconnect);
      }
    };
  });

  console.log("SSE stream created for servers", serverManagers.map(sm => sm.server.name));
  return new Response(stream, {
    headers: SSEHeaders,
  });
}
