"use server";

import { withAuth } from "@/lib/auth";
import config from "@/lib/config";
import { getGbxClient } from "@/lib/gbxclient";
import redis from "@/lib/redis";
import { JukeboxMap, Map, MapInfo } from "@/types/map";

const getKey = (server: number) => `jukebox:${server}`;

export async function getJukebox(server: number): Promise<JukeboxMap[]> {
  const key = getKey(server);
  const items = await redis.lrange(key, 0, -1);
  return items.map((item) => JSON.parse(item));
}

export async function setJukebox(server: number, jukebox: JukeboxMap[]) {
  const key = getKey(server);
  await redis.del(key);
  if (jukebox.length > 0) {
    await redis.rpush(key, ...jukebox.map((map) => JSON.stringify(map)));
  }
}

export async function clearJukebox(server: number) {
  const key = getKey(server);
  await redis.del(key);
}

export async function addMapToJukebox(
  server: number,
  map: Map,
): Promise<JukeboxMap> {
  const session = await withAuth(["admin"]);

  const newMap: JukeboxMap = {
    ...map,
    id: new Date().toISOString(),
    QueuedAt: new Date(),
    QueuedBy: session.user.login,
    QueuedByDisplayName: session.user.displayName,
  };

  const key = getKey(server);
  await redis.rpush(key, JSON.stringify(newMap));

  return newMap;
}

export async function removeMapFromJukebox(
  server: number,
  id: string,
): Promise<void> {
  const key = getKey(server);
  const items = await redis.lrange(key, 0, -1);

  const filtered = items.filter((item) => {
    const parsed = JSON.parse(item);
    return parsed.id !== id;
  });

  await redis.del(key);
  if (filtered.length > 0) {
    await redis.rpush(key, ...filtered);
  }
}

async function onPodiumStart(server: number) {
  const key = getKey(server);
  const items = await redis.lrange(key, 0, -1);

  if (items.length === 0) return;

  const nextRaw = items[0];
  const nextMap: JukeboxMap = JSON.parse(nextRaw);

  const client = await getGbxClient(server);
  await client.call("ChooseNextMap", nextMap.fileName);

  await redis.lpop(key);
}

export async function setupCallbacks(): Promise<void> {
  for (const server of config.SERVERS) {
    const key = getKey(server.id);
    await redis.del(key);

    const client = await getGbxClient(server.id);
    client.on("callback", (method, data) => {
      if (method !== "ManiaPlanet.ModeScriptCallbackArray") return;
      if (!data || data.length === 0) return;

      if (data[0] === "Maniaplanet.Podium_Start") {
        onPodiumStart(server.id);
      }
    });
  }
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
