"use server";
import { doServerAction, doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { Maps } from "@/lib/prisma/generated";
import { getKeyActiveMap, getKeyJukebox, getRedisClient } from "@/lib/redis";
import { JukeboxMap, MapInfo } from "@/types/map";
import { ServerError, ServerResponse } from "@/types/responses";
import { GbxClient } from "@evotm/gbxclient";
import { getMapByUid } from "../database/maps";

export async function getJukebox(
  server: number,
): Promise<ServerResponse<JukeboxMap[]>> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(server);
    const items = await redis.lrange(key, 0, -1);
    return items.map((item) => JSON.parse(item));
  });
}

export async function setJukebox(
  server: number,
  jukebox: JukeboxMap[],
): Promise<ServerResponse> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(server);
    await redis.del(key);
    if (jukebox.length > 0) {
      await redis.rpush(key, ...jukebox.map((map) => JSON.stringify(map)));
    }
  });
}

export async function clearJukebox(server: number): Promise<ServerResponse> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(server);
    await redis.del(key);
  });
}

export async function addMapToJukebox(
  server: number,
  map: Maps,
): Promise<ServerResponse<JukeboxMap>> {
  return doServerActionWithAuth(["admin"], async (session) => {
    const redis = await getRedisClient();
    const newMap: JukeboxMap = {
      ...map,
      QueuedAt: new Date(),
      QueuedBy: session.user.login,
      QueuedByDisplayName: session.user.displayName,
    };

    const key = getKeyJukebox(server);
    await redis.rpush(key, JSON.stringify(newMap));

    return newMap;
  });
}

export async function removeMapFromJukebox(
  server: number,
  id: string,
): Promise<ServerResponse> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(server);
    const items = await redis.lrange(key, 0, -1);

    const filtered = items.filter((item) => {
      const parsed = JSON.parse(item);
      return parsed.id !== id;
    });

    await redis.del(key);
    if (filtered.length > 0) {
      await redis.rpush(key, ...filtered);
    }
  });
}

export async function onPodiumStart(server: number) {
  const redis = await getRedisClient();
  const key = getKeyJukebox(server);
  const items = await redis.lrange(key, 0, -1);

  if (items.length === 0) return;

  const nextRaw = items[0];
  const nextMap: JukeboxMap = JSON.parse(nextRaw);

  const client = await getGbxClient(server);
  await client.call("ChooseNextMap", nextMap.fileName);

  await redis.lpop(key);
}

export async function getCurrentMapInfo(
  server: number,
): Promise<ServerResponse<MapInfo>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    const mapInfo = await client.call("GetCurrentMapInfo");

    if (!mapInfo) {
      throw new ServerError("Failed to get current map info");
    }

    return mapInfo;
  });
}

export async function getCurrentMapIndex(
  server: number,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    const mapIndex = await client.call("GetCurrentMapIndex");

    if (typeof mapIndex !== "number") {
      throw new ServerError("Failed to get current map index");
    }

    return mapIndex;
  });
}

export async function jumpToMap(
  server: number,
  index: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("JumpToMapIndex", index);
  });
}

export async function setNextMap(
  server: number,
  index: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);

    await client.call("SetNextMapIndex", index);
  });
}

export async function addMap(
  server: number,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("AddMap", filename);
  });
}

export async function addMapList(
  server: number,
  filenames: string[],
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    const res = await client.call("AddMapList", filenames);

    if (typeof res !== "number") {
      throw new ServerError("Failed to add map list");
    }

    return res;
  });
}

export async function removeMap(
  server: number,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("RemoveMap", filename);
  });
}

export async function removeMapList(
  server: number,
  filenames: string[],
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    const res = await client.call("RemoveMapList", filenames);

    if (typeof res !== "number") {
      throw new ServerError("Failed to remove map list");
    }

    return res;
  });
}

export async function insertMap(
  server: number,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("InsertMap", filename);
  });
}

export async function insertMapList(
  server: number,
  filenames: string[],
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    const res = await client.call("InsertMapList", filenames);

    if (typeof res !== "number") {
      throw new ServerError("Failed to insert map list");
    }

    return res;
  });
}

export async function syncMap(
  client: GbxClient,
  server: number,
): Promise<void> {
  const mapInfo = await client.call("GetCurrentMapInfo");

  if (!mapInfo) {
    throw new ServerError("Failed to get current map info");
  }

  const { data: map } = await getMapByUid(mapInfo.uid);
  if (!map) {
    throw new ServerError(`Map with UID ${mapInfo.uid} not found`);
  }

  const redis = await getRedisClient();
  const key = getKeyActiveMap(server);

  await redis.set(key, JSON.stringify(map));
}
