"use server";

import { withAuth } from "@/lib/auth";
import config from "@/lib/config";
import { getGbxClient } from "@/lib/gbxclient";
import { JukeboxMap, Map, MapInfo } from "@/types/map";

let jukeboxes: {
  [key: number]: JukeboxMap[];
} = {};

export async function getJukebox(server: number): Promise<JukeboxMap[]> {
  if (!jukeboxes[server]) {
    jukeboxes[server] = [];
  }
  return jukeboxes[server];
}

export async function setJukebox(server: number, jukebox: JukeboxMap[]) {
  jukeboxes[server] = jukebox;
}

export async function clearJukebox(server: number) {
  jukeboxes[server] = [];
}

export async function addMapToJukebox(
  server: number,
  map: Map,
): Promise<JukeboxMap> {
  const session = await withAuth(["admin"]);

  if (!jukeboxes[server]) {
    jukeboxes[server] = [];
  }

  const newMap = {
    ...map,
    QueuedAt: new Date(),
    QueuedBy: session.user.login,
    QueuedByDisplayName: session.user.displayName,
  };

  jukeboxes[server].push(newMap);
  return newMap;
}

export async function removeMapFromJukebox(
  server: number,
  uid: string,
): Promise<void> {
  jukeboxes[server] = jukeboxes[server].filter((map) => map.uid !== uid);
}

async function onPodiumStart(server: number) {
  if (!jukeboxes[server]) {
    jukeboxes[server] = [];
    return;
  }

  if (jukeboxes[server].length === 0) {
    return;
  }

  const client = await getGbxClient(server);

  const nextMap = jukeboxes[server].shift();
  if (!nextMap) {
    return;
  }

  await client.call("ChooseNextMap", nextMap.fileName);
}

export async function setupCallbacks(): Promise<void> {
  config.SERVERS.forEach(async (server) => {
    jukeboxes[server.id] = [];

    const client = await getGbxClient(server.id);
    client.on("callback", (method, data) => {
      if (method !== "ManiaPlanet.ModeScriptCallbackArray") return;

      if (!data || data.length === 0) return;

      if (data[0] == "Maniaplanet.Podium_Start") {
        onPodiumStart(server.id);
      }
    });
  });
}

export async function getCurrentMapInfo(server: number): Promise<MapInfo> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const mapInfo = await client.call("GetCurrentMapInfo");

  if (!mapInfo) {
    throw new Error("Failed to get current map info");
  }

  return mapInfo;
}

export async function getCurrentMapIndex(server: number): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const mapIndex = await client.call("GetCurrentMapIndex");

  if (typeof mapIndex !== "number") {
    throw new Error("Failed to get current map index");
  }

  return mapIndex;
}

export async function jumpToMap(server: number, index: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("JumpToMapIndex", index);
}

export async function setNextMap(server: number, index: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("SetNextMapIndex", index);
}

export async function addMap(server: number, filename: string): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("AddMap", filename);
}

export async function addMapList(
  server: number,
  filenames: string[],
): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const res = await client.call("AddMapList", filenames);

  if (typeof res !== "number") {
    throw new Error("Failed to add map list");
  }

  return res;
}

export async function removeMap(
  server: number,
  filename: string,
): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("RemoveMap", filename);
}

export async function removeMapList(
  server: number,
  filenames: string[],
): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const res = await client.call("RemoveMapList", filenames);

  if (typeof res !== "number") {
    throw new Error("Failed to remove map list");
  }

  return res;
}

export async function insertMap(
  server: number,
  filename: string,
): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("InsertMap", filename);
}

export async function insertMapList(
  server: number,
  filenames: string[],
): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const res = await client.call("InsertMapList", filenames);

  if (typeof res !== "number") {
    throw new Error("Failed to insert map list");
  }

  return res;
}
