import { parseTokenFromRequest } from "@/lib/auth";
import { getGbxClientManager } from "@/lib/gbxclient";
import { parse } from "node:url";

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
  const { pathname } = parse(req.url || "", true);
  const parts = pathname?.split("/") || [];
  const id = parts[parts.length - 1];

  if (!id) {
    client.close();
    return;
  }

  const token = await parseTokenFromRequest(req);
  if (!token) {
    client.close();
    return;
  }

  const serverId = token.groups
    ?.flatMap((group) => group.servers)
    .find((server) => server.id === id)?.id;

  if (!serverId) {
    client.close();
    return;
  }

  const manager = await getGbxClientManager(serverId);

  client.send(
    JSON.stringify({
      type: "activeMap",
      data: manager.getActiveMap(),
    }),
  );

  const onEndMap = (mapUid: string) =>
    client.send(
      JSON.stringify({
        type: "endMap",
        data: { mapUid },
      }),
    );
  const onStartMap = (mapUid: string) =>
    client.send(
      JSON.stringify({
        type: "startMap",
        data: { mapUid },
      }),
    );

  manager.on("endMap", onEndMap);
  manager.on("startMap", onStartMap);

  const cleanup = () => {
    manager.off("endMap", onEndMap);
    manager.off("startMap", onStartMap);
  }

  return () => {
    cleanup();
    client.close();
  };
}
