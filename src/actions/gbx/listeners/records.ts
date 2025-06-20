"use server";

import { saveRecord } from "@/actions/database/records";
import { Maps } from "@/lib/prisma/generated";
import { getKeyActiveMap, getRedisClient } from "@/lib/redis";

export async function onPlayerFinish(
  serverUuid: string,
  login: string,
  time: number,
) {
  const redis = await getRedisClient();
  const key = getKeyActiveMap(serverUuid);

  const activeMap = await redis.get(key);
  if (!activeMap) {
    throw new Error(`No active map found for server ${serverUuid}`);
  }

  const mapData: Maps = JSON.parse(activeMap);
  if (!mapData) {
    throw new Error(`Map data is invalid for server ${serverUuid}`);
  }

  await saveRecord({
    mapId: mapData.id,
    mapUid: mapData.uid,
    login,
    time,
  });
}
