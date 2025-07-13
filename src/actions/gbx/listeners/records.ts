"use server";

import { saveRecord } from "@/actions/database/records";
import { Maps } from "@/lib/prisma/generated";
import { getKeyActiveMap, getRedisClient } from "@/lib/redis";

export async function onPlayerFinish(id: string, login: string, time: number) {
  const redis = await getRedisClient();
  const key = getKeyActiveMap(id);

  const activeMap = await redis.get(key);
  if (!activeMap) {
    throw new Error(`No active map found for server ${id}`);
  }

  const mapData: Maps = JSON.parse(activeMap);
  if (!mapData) {
    throw new Error(`Map data is invalid for server ${id}`);
  }

  await saveRecord({
    mapId: mapData.id,
    mapUid: mapData.uid,
    login,
    time,
  });
}
