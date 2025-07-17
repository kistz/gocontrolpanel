import { parseTokenFromRequest } from "@/lib/auth";
import { getGbxClientManager } from "@/lib/gbxclient";
import { ActiveRound, LiveInfo } from "@/types/live";
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
      type: "beginMatch",
      data: { info: manager.info.liveInfo },
    }),
  );

  const onFinish = (round: ActiveRound) => {
    client.send(
      JSON.stringify({
        type: "finish",
        data: { round },
      }),
    );
  };

  const onPersonalBest = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "personalBest",
        data: { info },
      }),
    );
  };

  const onCheckpoint = (round: ActiveRound) => {
    client.send(
      JSON.stringify({
        type: "checkpoint",
        data: { round },
      }),
    );
  };

  const onBeginRound = (round: ActiveRound) => {
    client.send(
      JSON.stringify({
        type: "beginRound",
        data: { round },
      }),
    );
  };

  const onEndRound = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "endRound",
        data: { info },
      }),
    );
  };

  const onBeginMap = (mapUid: string) => {
    client.send(
      JSON.stringify({
        type: "beginMap",
        data: { mapUid },
      }),
    );
  };

  const onEndMap = (mapUid: string) => {
    client.send(
      JSON.stringify({
        type: "endMap",
        data: { mapUid },
      }),
    );
  };

  const onBeginMatch = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "beginMatch",
        data: { info },
      }),
    );
  };

  const onGiveUp = (round: ActiveRound) => {
    client.send(
      JSON.stringify({
        type: "giveUp",
        data: { round },
      }),
    );
  };

  const onWarmUpStart = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "warmUpStart",
        data: { info },
      }),
    );
  };

  const onWarmUpEnd = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "warmUpEnd",
        data: { info },
      }),
    );
  };

  const onWarmUpStartRound = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "warmUpStartRound",
        data: { info },
      }),
    );
  };

  const onPlayerInfoChanged = (round: ActiveRound) => {
    client.send(
      JSON.stringify({
        type: "playerInfoChanged",
        data: { round },
      }),
    );
  };

  const onPlayerConnect = (live: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "playerConnect",
        data: { live },
      }),
    );
  };

  const onPlayerDisconnect = (round: ActiveRound) => {
    client.send(
      JSON.stringify({
        type: "playerDisconnect",
        data: { round },
      }),
    );
  };

  const onUpdatedSettings = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "updatedSettings",
        data: { info },
      }),
    );
  };

  const onElimination = (info: LiveInfo) => {
    client.send(
      JSON.stringify({
        type: "elimination",
        data: { info },
      }),
    );
  };

  manager.on("finish", onFinish);
  manager.on("personalBest", onPersonalBest);
  manager.on("checkpoint", onCheckpoint);
  manager.on("beginRound", onBeginRound);
  manager.on("endRound", onEndRound);
  manager.on("beginMap", onBeginMap);
  manager.on("endMap", onEndMap);
  manager.on("beginMatch", onBeginMatch);
  manager.on("giveUp", onGiveUp);
  manager.on("warmUpStart", onWarmUpStart);
  manager.on("warmUpEnd", onWarmUpEnd);
  manager.on("warmUpStartRound", onWarmUpStartRound);
  manager.on("playerInfoChanged", onPlayerInfoChanged);
  manager.on("playerConnectInfo", onPlayerConnect);
  manager.on("playerDisconnectInfo", onPlayerDisconnect);
  manager.on("updatedSettings", onUpdatedSettings);
  manager.on("elimination", onElimination);

  const cleanup = () => {
    manager.removeListener("finish", onFinish);
    manager.removeListener("personalBest", onPersonalBest);
    manager.removeListener("checkpoint", onCheckpoint);
    manager.removeListener("beginRound", onBeginRound);
    manager.removeListener("endRound", onEndRound);
    manager.removeListener("beginMap", onBeginMap);
    manager.removeListener("endMap", onEndMap);
    manager.removeListener("beginMatch", onBeginMatch);
    manager.removeListener("giveUp", onGiveUp);
    manager.removeListener("warmUpStart", onWarmUpStart);
    manager.removeListener("warmUpEnd", onWarmUpEnd);
    manager.removeListener("warmUpStartRound", onWarmUpStartRound);
    manager.removeListener("playerInfoChanged", onPlayerInfoChanged);
    manager.removeListener("playerConnectInfo", onPlayerConnect);
    manager.removeListener("playerDisconnectInfo", onPlayerDisconnect);
    manager.removeListener("updatedSettings", onUpdatedSettings);
    manager.removeListener("elimination", onElimination);
  };

  return () => {
    cleanup();
    client.close();
  };
}
