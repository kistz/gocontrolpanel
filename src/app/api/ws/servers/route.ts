import { parseTokenFromRequest } from "@/lib/auth";
import { GbxClientManager, getGbxClientManager } from "@/lib/gbxclient";
import { ServerInfo } from "@/types/server";

export function GET() {
  const headers = new Headers();
  headers.set("Connection", "Upgrade");
  headers.set("Upgrade", "websocket");
  return new Response("Upgrade Required", { status: 426, headers });
}

export async function SOCKET(
  client: import("ws").WebSocket,
  req: import("node:http").IncomingMessage,
) {
  const token = await parseTokenFromRequest(req);

  if (!token) {
    client.close();
    return;
  }

  const servers = token?.groups?.flatMap((group) => group.servers) || [];

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
          filemanagerUrl: server.filemanagerUrl || undefined,
          isConnected: manager.getIsConnected(),
        },
      });
    }
  }

  client.send(
    JSON.stringify({
      type: "servers",
      data: serverManagers.map((sm) => sm.server),
    }),
  );

  const onConnect = (serverId: string) =>
    client.send(
      JSON.stringify({
        type: "connect",
        data: { serverId },
      }),
    );
  const onDisconnect = (serverId: string) =>
    client.send(
      JSON.stringify({
        type: "disconnect",
        data: { serverId },
      }),
    );

  for (const serverManager of serverManagers) {
    serverManager.manager.on("connect", onConnect);
    serverManager.manager.on("disconnect", onDisconnect);
  }

  const cleanup = () => {
    for (const { manager } of serverManagers) {
      manager.off("connect", onConnect);
      manager.off("disconnect", onDisconnect);
    }
  };

  return () => {
    cleanup();
    client.close();
  };
}
