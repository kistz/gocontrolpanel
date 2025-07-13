import { auth } from "@/lib/auth";
import { GbxClientManager, getGbxClientManager } from "@/lib/gbxclient";
import { createSSEStream, SSEHeaders } from "@/lib/sse";
import { ServerInfo } from "@/types/api/server";

export async function GET(req: Request) {
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
    push(
      "servers",
      serverManagers.map((sm) => sm.server),
    );

    const onConnect = (serverId: string) => push("connect", { serverId });
    const onDisconnect = (serverId: string) => push("disconnect", { serverId });

    for (const serverManager of serverManagers) {
      serverManager.manager.on("connect", onConnect);
      serverManager.manager.on("disconnect", onDisconnect);
    }

    const cleanup = () => {
      console.log("🧹 Cleaning up SSE connections");
      for (const { manager } of serverManagers) {
        manager.off("connect", onConnect);
        manager.off("disconnect", onDisconnect);
      }
    };

    req.signal?.addEventListener("abort", () => {
      console.log("❌ Request aborted by client (e.g., refresh)");
      cleanup();
    });

    return cleanup;
  });

  console.log(
    "SSE stream created for servers",
    serverManagers.map((sm) => sm.server.name),
  );
  return new Response(stream, {
    headers: SSEHeaders,
  });
}
