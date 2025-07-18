import { parseTokenFromRequest } from "@/lib/auth";
import { getGbxClientManager } from "@/lib/gbxclient";
import { PlayerInfo } from "@/types/player";
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
      type: "playerList",
      data: manager.info.activePlayers,
    }),
  );

  const onPlayerConnect = (playerInfo: PlayerInfo) =>
    client.send(
      JSON.stringify({
        type: "playerConnect",
        data: playerInfo,
      }),
    );

  const onPlayerDisconnect = (login: string) =>
    client.send(
      JSON.stringify({
        type: "playerDisconnect",
        data: { login },
      }),
    );

  const onPlayerInfo = (playerInfo: PlayerInfo) =>
    client.send(
      JSON.stringify({
        type: "playerInfo",
        data: playerInfo,
      }),
    );

  const onPlayerList = (players: PlayerInfo[]) =>
    client.send(
      JSON.stringify({
        type: "playerList",
        data: players,
      }),
    );

  manager.on("playerConnect", onPlayerConnect);
  manager.on("playerDisconnect", onPlayerDisconnect);
  manager.on("playerInfo", onPlayerInfo);
  manager.on("playerList", onPlayerList);

  const cleanup = () => {
    manager.off("playerConnect", onPlayerConnect);
    manager.off("playerDisconnect", onPlayerDisconnect);
    manager.off("playerInfo", onPlayerInfo);
    manager.off("playerList", onPlayerList);
  };

  return () => {
    cleanup();
    client.close();
  };
}
