import { saveRecord } from "@/actions/database/records";
import { Maps } from "@/lib/prisma/generated";
import { getKeyActiveMap, getRedisClient } from "@/lib/redis";
import { Waypoint } from "@/types/gbx/waypoint";
import "server-only";

export async function onPlayerFinish(serverId: string, waypoint: Waypoint) {
  const redis = await getRedisClient();
  const key = getKeyActiveMap(serverId);

  const activeMap = await redis.get(key);
  if (!activeMap) {
    throw new Error(`No active map found for server ${serverId}`);
  }

  const mapData: Maps = JSON.parse(activeMap);
  if (!mapData) {
    throw new Error(`Map data is invalid for server ${serverId}`);
  }

  await saveRecord({
    mapId: mapData.id,
    mapUid: mapData.uid,
    login: waypoint.login,
    time: waypoint.racetime,
    checkpoints: waypoint.curracecheckpoints || [],
    round: null,
    matchId: null,
  });
}
