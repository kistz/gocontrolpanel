"use server";

import { saveRecord } from "@/actions/database/records";
import { Maps } from "@/lib/prisma/generated";
import { getKeyActiveMap, getRedisClient } from "@/lib/redis";

export async function onPlayerFinish(
  server: number,
  login: string,
  time: number,
) {
  const redis = await getRedisClient();
  const key = getKeyActiveMap(server);

  const activeMap = await redis.get(key);
  if (!activeMap) {
    throw new Error(`No active map found for server ${server}`);
  }

  const mapData: Maps = JSON.parse(activeMap);
  if (!mapData) {
    throw new Error(`Map data is invalid for server ${server}`);
  }

  await saveRecord({
    mapId: mapData.id,
    mapUid: mapData.uid,
    login,
    time,
  });
}
