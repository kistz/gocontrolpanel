"use server";
import { doServerAction, doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { Maps } from "@/lib/prisma/generated";
import { getKeyActiveMap, getKeyJukebox, getRedisClient } from "@/lib/redis";
import { JukeboxMap, MapInfo } from "@/types/map";
import { ServerError, ServerResponse } from "@/types/responses";
import { GbxClient } from "@evotm/gbxclient";
import { createMap } from "../database/gbx";
import { getMapByUid } from "../database/maps";

export async function getJukebox(
  serverUuid: string,
): Promise<ServerResponse<JukeboxMap[]>> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(serverUuid);
    const items = await redis.lrange(key, 0, -1);
    return items.map((item) => JSON.parse(item));
  });
}

export async function setJukebox(
  serverUuid: string,
  jukebox: JukeboxMap[],
): Promise<ServerResponse> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(serverUuid);
    await redis.del(key);
    if (jukebox.length > 0) {
      await redis.rpush(key, ...jukebox.map((map) => JSON.stringify(map)));
    }
  });
}

export async function clearJukebox(
  serverUuid: string,
): Promise<ServerResponse> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(serverUuid);
    await redis.del(key);
  });
}

export async function addMapToJukebox(
  serverUuid: string,
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

    const key = getKeyJukebox(serverUuid);
    await redis.rpush(key, JSON.stringify(newMap));

    return newMap;
  });
}

export async function removeMapFromJukebox(
  serverUuid: string,
  id: string,
): Promise<ServerResponse> {
  return doServerAction(async () => {
    const redis = await getRedisClient();
    const key = getKeyJukebox(serverUuid);
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

export async function onPodiumStart(serverUuid: string) {
  const redis = await getRedisClient();
  const key = getKeyJukebox(serverUuid);
  const items = await redis.lrange(key, 0, -1);

  if (items.length === 0) return;

  const nextRaw = items[0];
  const nextMap: JukeboxMap = JSON.parse(nextRaw);

  const client = await getGbxClient(serverUuid);
  await client.call("ChooseNextMap", nextMap.fileName);

  await redis.lpop(key);
}

export async function getCurrentMapInfo(
  serverUuid: string,
): Promise<ServerResponse<MapInfo>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    const mapInfo = await client.call("GetCurrentMapInfo");

    if (!mapInfo) {
      throw new ServerError("Failed to get current map info");
    }

    return mapInfo;
  });
}

export async function getCurrentMapIndex(
  serverUuid: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    const mapIndex = await client.call("GetCurrentMapIndex");

    if (typeof mapIndex !== "number") {
      throw new ServerError("Failed to get current map index");
    }

    return mapIndex;
  });
}

export async function jumpToMap(
  serverUuid: string,
  index: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("JumpToMapIndex", index);
  });
}

export async function setNextMap(
  serverUuid: string,
  index: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);

    await client.call("SetNextMapIndex", index);
  });
}

export async function addMap(
  serverUuid: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("AddMap", filename);
  });
}

export async function addMapList(
  serverUuid: string,
  filenames: string[],
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    const res = await client.call("AddMapList", filenames);

    if (typeof res !== "number") {
      throw new ServerError("Failed to add map list");
    }

    return res;
  });
}

export async function removeMap(
  serverUuid: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    const mapList = await client.call("GetMapList", 2, 0);
    if (mapList.length < 2) {
      throw new ServerError("Cannot remove the last map from the server");
    }
    await client.call("RemoveMap", filename);
  });
}

export async function removeMapList(
  serverUuid: string,
  filenames: string[],
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    const res = await client.call("RemoveMapList", filenames);

    if (typeof res !== "number") {
      throw new ServerError("Failed to remove map list");
    }

    return res;
  });
}

export async function insertMap(
  serverUuid: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("InsertMap", filename);
  });
}

export async function insertMapList(
  serverUuid: string,
  filenames: string[],
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    const res = await client.call("InsertMapList", filenames);

    if (typeof res !== "number") {
      throw new ServerError("Failed to insert map list");
    }

    return res;
  });
}

export async function syncMap(
  client: GbxClient,
  serverUuid: string,
): Promise<void> {
  const mapInfo: MapInfo = await client.call("GetCurrentMapInfo");

  if (!mapInfo) {
    throw new ServerError("Failed to get current map info");
  }

  let { data: map } = await getMapByUid(mapInfo.UId);
  if (!map) {
    const { data, error } = await createMap({
      name: mapInfo.Name,
      uid: mapInfo.UId,
      fileName: mapInfo.FileName,
      author: mapInfo.Author,
      authorNickname: mapInfo.AuthorNickname,
      authorTime: mapInfo.AuthorTime,
      goldTime: mapInfo.GoldTime,
      silverTime: mapInfo.SilverTime,
      bronzeTime: mapInfo.BronzeTime,
    });

    if (!data || error) {
      throw new ServerError(`Failed to create map: ${error}`);
    }

    map = data;
  }

  const redis = await getRedisClient();
  const key = getKeyActiveMap(serverUuid);

  await redis.set(key, JSON.stringify(map));
}
