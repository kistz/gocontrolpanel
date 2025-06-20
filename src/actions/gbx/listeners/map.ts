"use server";
import { getMapByUid } from "@/actions/database/maps";
import { getKeyActiveMap, getRedisClient } from "@/lib/redis";

export async function onBeginMap(serverUuid: string, uid: string) {
  const { data: map } = await getMapByUid(uid);
  if (!map) {
    throw new Error(`Map with UID ${uid} not found`);
  }

  const redis = await getRedisClient();
  const key = getKeyActiveMap(serverUuid);

  await redis.set(key, JSON.stringify(map));
}
